import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
