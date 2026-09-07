import sharp from "sharp";
import { removeBackground } from "@imgly/background-removal-node";
import { uploadImageBuffer } from "@/lib/server/cloudinary";
import { ApiError } from "@/server/errors";

/**
 * Native cutout+composite virtual try-on: removes the garment's background,
 * isolates the clothing region, and pastes it onto the person photo at a
 * category-specific anatomical placement box. No external ML model call —
 * pure image compositing, ported from the evaluation harness's
 * vton_clients.py / preprocessing/garment_extractor.py logic.
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

async function fetchImageBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new ApiError(400, `Failed to fetch image: ${url}`);
  return Buffer.from(await res.arrayBuffer());
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

  const [humanBuf, garmentBuf] = await Promise.all([
    fetchImageBuffer(input.humanImgUrl),
    fetchImageBuffer(input.garmentImgUrl),
  ]);

  // 1. Remove the garment photo's background (rembg-equivalent for Node)
  const cutoutBlob = await removeBackground(garmentBuf);
  const cutoutBuf = Buffer.from(await cutoutBlob.arrayBuffer());

  const { data, info } = await sharp(cutoutBuf)
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

  // 3. Bounding box of what's left, then crop to it
  let minX = gw, minY = gh, maxX = 0, maxY = 0;
  for (let y = suppressTopPx; y < suppressBottomPx; y++) {
    const rowStart = y * gw * channels;
    for (let x = 0; x < gw; x++) {
      if (data[rowStart + x * channels + 3] > ALPHA_THRESHOLD) {
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

  const croppedBuf = await sharp(data, { raw: { width: gw, height: gh, channels } })
    .extract({ left: minX, top: minY, width: maxX - minX, height: maxY - minY })
    .png()
    .toBuffer();

  // 4. Resize the cropped garment into the target placement box
  const humanMeta = await sharp(humanBuf).metadata();
  const pw = humanMeta.width!;
  const ph = humanMeta.height!;

  const place = PLACEMENT[bucket];
  const targetH = Math.floor(ph * (isTallUpper ? place.h + 0.05 : place.h));
  const targetW = Math.floor(pw * place.w);
  const targetY = Math.floor(ph * place.y);
  const targetX = Math.floor((pw - targetW) / 2);

  const resizedGarment = await sharp(croppedBuf)
    .resize(targetW, targetH, { fit: "fill", kernel: "lanczos3" })
    .blur(0.5)
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
