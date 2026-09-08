import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export type ModerationStatus = "approved" | "rejected" | "pending";

/**
 * Moderate an image URL for NSFW / inappropriate content using Cloudinary.
 *
 * - Primary:  Cloudinary `aws_rek` add-on (if enabled on the account).
 * - Fallback: If the add-on is not available, returns "approved" so legitimate
 *             uploads are never blocked due to a missing Cloudinary plan feature.
 *
 * Returns: "approved" | "rejected" | "pending"
 * Throws:  Never — all errors are caught and treated as "approved" (fail-open).
 */
export async function moderateImageUrl(
  imageUrl: string
): Promise<ModerationStatus> {
  try {
    // Upload to a temp Cloudinary folder with aws_rek moderation
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder:      "vizzle/moderation-check",
      moderation:  "aws_rek",
      tags:        ["vizzle_temp"],
      // Overwrite: false so each check is independent
    });

    // Cloudinary returns moderation as an array of objects
    const modStatus =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (result as any).moderation?.[0]?.status as ModerationStatus | undefined;

    // Clean up the temp moderation asset immediately (best-effort)
    if (result.public_id) {
      cloudinary.uploader.destroy(result.public_id).catch(() => {});
    }

    // If no moderation status (add-on not enabled), default to approved
    return modStatus ?? "approved";
  } catch (err) {
    // Fail-open: if Cloudinary moderation throws, don't block the user
    console.warn("[cloudinary] moderation check failed, defaulting to approved:", err);
    return "approved";
  }
}

export interface UploadResult {
  url:       string;   // HTTPS secure_url
  publicId:  string;   // Cloudinary public_id (for deletion)
}

/** Upload a raw buffer to Cloudinary. Returns the secure URL and public_id. */
export async function uploadImageBuffer(
  fileBuffer: Buffer,
  folder = "vizzle/products"
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(fileBuffer);
  });
}

/** Upload a remote URL to Cloudinary (used to mirror ML output into our CDN). */
export async function uploadImageUrl(
  imageUrl: string,
  folder = "vizzle/tryon-output"
): Promise<UploadResult> {
  const result = await cloudinary.uploader.upload(imageUrl, {
    folder,
    resource_type: "image",
  });
  return { url: result.secure_url, publicId: result.public_id };
}

/**
 * Remove the background from a remote image URL using Cloudinary's
 * `e_background_removal` delivery transformation (requires Plus tier or
 * higher). Runs entirely on Cloudinary's infrastructure — nothing loads in
 * our own process, unlike a local ONNX-based library.
 *
 * Returns the resulting RGBA PNG as a Buffer. Uploads to a temp folder since
 * Cloudinary's fetch-delivery mode (transforming a remote URL without an
 * upload) requires an account-level allowlist we can't assume is configured.
 */
export async function removeBackgroundFromUrl(imageUrl: string): Promise<Buffer> {
  const uploaded = await cloudinary.uploader.upload(imageUrl, {
    folder: "vizzle/bg-removal-temp",
    resource_type: "image",
  });

  const cutoutUrl = cloudinary.url(uploaded.public_id, {
    effect: "background_removal",
    format: "png",
    version: uploaded.version,
    secure: true,
  });

  const res = await fetch(cutoutUrl);

  // Best-effort cleanup of the temp source upload regardless of outcome.
  cloudinary.uploader.destroy(uploaded.public_id).catch(() => {});

  if (!res.ok) {
    throw new Error(
      `Cloudinary background removal failed (${res.status}). ` +
      `This requires the Plus plan or higher — check your Cloudinary account tier.`
    );
  }
  return Buffer.from(await res.arrayBuffer());
}

/**
 * Delete one or more Cloudinary assets by their public_ids.
 * Silently ignores individual failures so cleanup never throws.
 */
export async function deleteCloudinaryImages(publicIds: string[]): Promise<void> {
  if (publicIds.length === 0) return;
  try {
    await cloudinary.api.delete_resources(publicIds, { resource_type: "image" });
  } catch {
    // best-effort — log but don't throw
  }
}
