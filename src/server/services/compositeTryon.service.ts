import sharp from "sharp";
import { removeBackgroundFromUrl, uploadImageBuffer } from "@/lib/server/cloudinary";
import { ApiError } from "@/server/errors";

/**
 * Native cutout+composite virtual try-on: removes the garment's background
 * (via Cloudinary's e_background_removal — see note below), isolates the
 * clothing region, and pastes it onto the person photo at a category-specific
 * anatomical placement box. No ML model call of our own — pure image
 * compositing, ported from the evaluation harness's vton_clients.py /
 * preprocessing/garment_extractor.py logic.
 *
 * Background removal runs on Cloudinary rather than in-process: an earlier
 * version used `@imgly/background-removal-node` directly here, but running
 * it in the same process as `sharp` reliably segfaults (native library
 * conflict between the two packages' compiled binaries) — confirmed by
 * reproducing it locally, not a theoretical risk. Cloudinary's transformation
 * avoids the conflict entirely since no ONNX runtime loads in our process.
 *
 * The RGB/alpha handling below is deliberately split into separate planes
 * (morphological close + binary threshold on alpha only, resize RGB and
 * alpha independently, Gaussian blur alpha only) to match the Python
 * original's `garment_extractor.py` / `vton_clients.py` exactly. An earlier
 * version blurred the merged RGBA buffer directly, which bleeds background
 * color into the visible edge (dark fringing) — a real, visible defect
 * fixed here, not just a style preference.
 */

type Bucket = "upper" | "lower" | "kurti" | "full";

const FULL_KEYWORDS = [
  "dress", "gown", "frock", "maxi", "midi", "jumpsuit", "overalls",
  "saree", "sari", "lehenga", "lehnga", "gharara", "anarkali",
  "salwar kameez", "salwar_kameez", "salwar suit", "suit set", "churidar suit",
];
const KURTI_KEYWORDS = ["kurti", "kurta", "sherwani", "choli"];
const LOWER_KEYWORDS = [
  "pants", "jeans", "trousers", "shorts", "skirt", "leggings",
  "bottom", "pant", "short", "dhoti", "palazzo", "churidar",
];
const TALL_UPPER_KEYWORDS = ["coat", "jacket", "blazer"];

function detectBucket(text: string): Bucket {
  const t = text.toLowerCase();
  if (KURTI_KEYWORDS.some((k) => t.includes(k))) return "kurti";
  if (FULL_KEYWORDS.some((k) => t.includes(k))) return "full";
  if (LOWER_KEYWORDS.some((k) => t.includes(k))) return "lower";
  return "upper";
}

// Fraction of the GARMENT source image's height to zero out (top, bottom) —
// strips the model's head/hair/legs so only the clothing region survives.
const EXTRACT_REGION: Record<Bucket, [number, number]> = {
  upper: [0.26, 0.72],
  lower: [0.44, 0.95],
  kurti: [0.22, 0.76],
  full: [0.20, 0.96],
};

// Anatomical placement box on the PERSON canvas, as fractions of its width/height.
const PLACEMENT: Record<Bucket, { y: number; h: number; w: number }> = {
  upper: { y: 0.27, h: 0.35, w: 0.48 },
  lower: { y: 0.58, h: 0.38, w: 0.42 },
  kurti: { y: 0.27, h: 0.48, w: 0.48 },
  full: { y: 0.26, h: 0.70, w: 0.54 },
};

const ALPHA_THRESHOLD = 30;
const BINARY_THRESHOLD = 50; // matches cv2.threshold(alpha, 50, 255, THRESH_BINARY)
// matches cv2.GaussianBlur(alpha, (5,5), 0) — OpenCV's auto-sigma for sigma=0
// is 0.3*((ksize-1)*0.5-1)+0.8, which for ksize=5 works out to 1.1.
const EDGE_BLUR_SIGMA = 1.1;

// Exact cv2.getStructuringElement(MORPH_ELLIPSE, (5,5)) footprint — NOT a
// full 5x5 square. OpenCV builds an ellipse per-row via
// dx_max = round(radius * sqrt(1 - (dy/radius)^2)), which for radius 2
// yields a plus-like shape (full width on the middle 3 rows, single center
// pixel on the top/bottom rows) rather than a square. Using a square here
// would over-dilate the mask's corners relative to the Python original.
const ELLIPSE_5X5_OFFSETS: ReadonlyArray<readonly [number, number]> = (() => {
  const halfWidthByRow = [0, 2, 2, 2, 0]; // dy = -2..2
  const offsets: [number, number][] = [];
  for (let i = 0; i < halfWidthByRow.length; i++) {
    const dy = i - 2;
    const halfWidth = halfWidthByRow[i];
    for (let dx = -halfWidth; dx <= halfWidth; dx++) offsets.push([dy, dx]);
  }
  return offsets;
})();

async function fetchImageBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new ApiError(400, `Failed to fetch image: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

/** Max-filter (dilate) over a single-channel plane with the 5x5 ellipse footprint. */
function dilate(plane: Uint8Array<ArrayBufferLike>, w: number, h: number): Uint8Array<ArrayBufferLike> {
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let max = 0;
      for (const [dy, dx] of ELLIPSE_5X5_OFFSETS) {
        const ny = y + dy, nx = x + dx;
        if (ny < 0 || ny >= h || nx < 0 || nx >= w) continue;
        const v = plane[ny * w + nx];
        if (v > max) max = v;
      }
      out[y * w + x] = max;
    }
  }
  return out;
}

/** Min-filter (erode) over a single-channel plane with the 5x5 ellipse footprint. */
function erode(plane: Uint8Array<ArrayBufferLike>, w: number, h: number): Uint8Array<ArrayBufferLike> {
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let min = 255;
      for (const [dy, dx] of ELLIPSE_5X5_OFFSETS) {
        const ny = y + dy, nx = x + dx;
        if (ny < 0 || ny >= h || nx < 0 || nx >= w) { min = 0; break; }
        const v = plane[ny * w + nx];
        if (v < min) min = v;
      }
      out[y * w + x] = min;
    }
  }
  return out;
}

/** Morphological close (dilate then erode) — fills small pinholes/gaps in the mask. */
function morphologicalClose(plane: Uint8Array<ArrayBufferLike>, w: number, h: number): Uint8Array<ArrayBufferLike> {
  return erode(dilate(plane, w, h), w, h);
}

export async function generateCompositeTryOn(input: {
  humanImgUrl: string;
  garmentImgUrl: string;
  garmentType?: string;
}): Promise<{ output_url: string; model_used: string; status: string }> {
  const hint = input.garmentType ?? "";
  const bucket = detectBucket(hint);
  const isTallUpper =
    bucket === "upper" && TALL_UPPER_KEYWORDS.some((k) => hint.toLowerCase().includes(k));

  // 1. Remove the garment photo's background (Cloudinary-side) and fetch the
  //    person photo in parallel.
  const [rawHumanBuf, cutoutBuf] = await Promise.all([
    fetchImageBuffer(input.humanImgUrl),
    removeBackgroundFromUrl(input.garmentImgUrl),
  ]);

  // Phone photos routinely carry an EXIF orientation tag (portrait shots shot
  // sideways, etc.) rather than physically-rotated pixels. sharp's metadata()
  // and composite() both operate on the RAW pixel buffer and ignore that tag,
  // so without normalizing here the garment box gets placed correctly against
  // the un-rotated buffer but the shopper's browser (which DOES honor EXIF)
  // renders the output rotated — the garment ends up sideways or upside-down
  // relative to the visible photo. .rotate() with no args auto-orients from
  // EXIF and bakes it into the pixels, then strips the tag.
  const [humanBuf, normalizedCutoutBuf] = await Promise.all([
    sharp(rawHumanBuf).rotate().toBuffer(),
    sharp(cutoutBuf).rotate().toBuffer(),
  ]);

  const { data, info } = await sharp(normalizedCutoutBuf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: gw, height: gh, channels } = info;

  // 2. Suppress non-garment rows (head/hem) on the alpha channel
  const [topFrac, bottomFrac] = EXTRACT_REGION[bucket];
  const suppressTopPx = Math.floor(gh * topFrac);
  const suppressBottomPx = Math.floor(gh * bottomFrac);
  for (let y = 0; y < gh; y++) {
    if (y < suppressTopPx || y >= suppressBottomPx) {
      const rowStart = y * gw * channels;
      for (let x = 0; x < gw; x++) {
        data[rowStart + x * channels + 3] = 0;
      }
    }
  }

  // 2b. Morphological close + binary threshold on the alpha plane — fills
  // small holes rembg/Cloudinary leave in the mask (fabric folds, shadows,
  // buttons) so the cutout is a solid garment instead of a speckled one.
  let alphaPlane: Uint8Array<ArrayBufferLike> = new Uint8Array(gw * gh);
  for (let i = 0; i < gw * gh; i++) alphaPlane[i] = data[i * channels + 3];
  alphaPlane = morphologicalClose(alphaPlane, gw, gh);
  for (let i = 0; i < gw * gh; i++) {
    const binary = alphaPlane[i] > BINARY_THRESHOLD ? 255 : 0;
    alphaPlane[i] = binary;
    data[i * channels + 3] = binary;
  }

  // 3. Bounding box of what's left, then crop to it
  let minX = gw, minY = gh, maxX = 0, maxY = 0;
  for (let y = suppressTopPx; y < suppressBottomPx; y++) {
    const rowStart = y * gw;
    for (let x = 0; x < gw; x++) {
      if (alphaPlane[rowStart + x] > ALPHA_THRESHOLD) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX <= minX || maxY <= minY) {
    throw new ApiError(422, "Could not isolate a garment region from the reference image.");
  }

  const { data: croppedData, info: croppedInfo } = await sharp(data, {
    raw: { width: gw, height: gh, channels },
  })
    .extract({ left: minX, top: minY, width: maxX - minX, height: maxY - minY })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const cw = croppedInfo.width, ch = croppedInfo.height;

  // 4. Resize the cropped garment into the target placement box — RGB and
  // alpha are resized and blurred SEPARATELY (matching the Python original)
  // so edge softening never bleeds background color into the garment edge.
  const humanMeta = await sharp(humanBuf).metadata();
  const pw = humanMeta.width!;
  const ph = humanMeta.height!;

  const place = PLACEMENT[bucket];
  const targetH = Math.floor(ph * (isTallUpper ? place.h + 0.05 : place.h));
  const targetW = Math.floor(pw * place.w);
  const targetY = Math.floor(ph * place.y);
  const targetX = Math.floor((pw - targetW) / 2);

  const rgbBuf = Buffer.alloc(cw * ch * 3);
  const alphaBuf = Buffer.alloc(cw * ch);
  for (let i = 0; i < cw * ch; i++) {
    rgbBuf[i * 3] = croppedData[i * channels];
    rgbBuf[i * 3 + 1] = croppedData[i * channels + 1];
    rgbBuf[i * 3 + 2] = croppedData[i * channels + 2];
    alphaBuf[i] = croppedData[i * channels + 3];
  }

  const [resizedRgb, resizedAlpha] = await Promise.all([
    sharp(rgbBuf, { raw: { width: cw, height: ch, channels: 3 } })
      .resize(targetW, targetH, { fit: "fill", kernel: "lanczos3" })
      .raw()
      .toBuffer({ resolveWithObject: true }),
    sharp(alphaBuf, { raw: { width: cw, height: ch, channels: 1 } })
      .resize(targetW, targetH, { fit: "fill", kernel: "lanczos3" })
      .blur(EDGE_BLUR_SIGMA) // Gaussian blur on the MASK only — matches cv2.GaussianBlur(alpha, (5,5), 0)
      // sharp silently upconverts a single-channel raw buffer to 3 channels
      // (R=G=B) somewhere in the resize/blur pipeline. Force it back to a
      // true single band, otherwise the byte stride below is wrong and the
      // output comes out as periodic diagonal striping — confirmed by
      // reproducing it locally, not a hypothetical.
      .toColourspace("b-w")
      .raw()
      .toBuffer({ resolveWithObject: true }),
  ]);

  // Defensive: read using the buffer's *actual* channel count rather than
  // assuming 1, in case a future sharp version changes this behavior again.
  const alphaChannels = resizedAlpha.info.channels;
  const finalRgba = Buffer.alloc(targetW * targetH * 4);
  for (let i = 0; i < targetW * targetH; i++) {
    finalRgba[i * 4] = resizedRgb.data[i * 3];
    finalRgba[i * 4 + 1] = resizedRgb.data[i * 3 + 1];
    finalRgba[i * 4 + 2] = resizedRgb.data[i * 3 + 2];
    finalRgba[i * 4 + 3] = resizedAlpha.data[i * alphaChannels];
  }
  const resizedGarment = await sharp(finalRgba, {
    raw: { width: targetW, height: targetH, channels: 4 },
  })
    .png()
    .toBuffer();

  // 5. Composite onto the person photo (placement box already stays below the
  //    face/head zone for every bucket, so no separate face-protection pass is needed)
  const outputBuf = await sharp(humanBuf)
    .composite([{ input: resizedGarment, top: targetY, left: targetX }])
    .jpeg({ quality: 92 })
    .toBuffer();

  // 6. Persist the result
  const { url } = await uploadImageBuffer(outputBuf, "vizzle/composite-tryon");

  return { output_url: url, model_used: "vizzle-composite-cutout", status: "succeeded" };
}
