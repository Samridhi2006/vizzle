import { prisma } from "@/lib/server/prisma";
import { hashUserIdentifier } from "@/lib/server/crypto";
import {
  getLayeredStatus,
  getTryonStatus,
  getVideoStatus,
  startGenerateVideo,
  startLayeredTryOn,
  startVirtualTryOn,
  waitGenerateVideo,
  waitLayeredTryOn,
  waitVirtualTryOn,
} from "@/lib/server/ml-client";
import { resolveProductImageByStoreAndSku } from "@/server/services/products.service";
import { uploadImageUrl } from "@/lib/server/cloudinary";
import { ApiError } from "@/server/errors";
import { TryonMode } from "@/types";

const OUTPUT_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * True if `value` is an absolute http(s) URL rather than a merchant's own product id/SKU.
 */
function isImageUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Mirror an external ML output URL to our Cloudinary temp folder.
 * Returns our own stable URL. Tracks the asset for hourly cleanup.
 */
async function mirrorOutputToCloudinary(
  externalUrl: string,
  storeId: string
): Promise<string> {
  try {
    const { url, publicId } = await uploadImageUrl(
      externalUrl,
      `vizzle/tryon-output/${storeId}`
    );
    await prisma.tempAsset
      .create({
        data: {
          publicId,
          folder:    "tryon-output",
          storeId,
          expiresAt: new Date(Date.now() + OUTPUT_TTL_MS),
        },
      })
      .catch(() => {});
    return url;
  } catch {
    // If mirroring fails, fall back to the original external URL
    return externalUrl;
  }
}

/**
 * Extract the result image URL from the ML model's `output` field.
 * TransformResponse.output is Optional[Union[str, list]] per the official backend schema.
 *   - string  → single result image URL (common case)
 *   - list    → array of URLs, first element is the result
 *   - null    → not yet available (caller should have already waited)
 */
function extractOutputUrl(output: unknown): string {
  if (!output) return "";
  if (typeof output === "string") return output;
  if (Array.isArray(output)) return extractOutputUrl(output[0]);
  return "";
}

async function writeTryonLog(input: {
  storeId: string;
  mode: TryonMode;
  success: boolean;
  predictionId?: string;
  vizzleProductId?: string;
  outputUrl?: string;
  latencyMs?: number;
  userIdentifier?: string;
  errorCode?: string;
}) {
  await prisma.tryonLog
    .create({
      data: {
        storeId: input.storeId,
        mode: input.mode,
        success: input.success,
        predictionId: input.predictionId ?? null,
        vizzleProductId: input.vizzleProductId ?? null,
        outputUrl: input.outputUrl ?? null,
        latencyMs: input.latencyMs ?? null,
        userIdentifier: input.userIdentifier
          ? hashUserIdentifier(input.userIdentifier)
          : null,
        errorCode: input.errorCode ?? null,
      },
    })
    .catch(() => {});
}

/**
 * STEP 1 — Start a try-on prediction and return immediately.
 * Resolves the product, validates it belongs to the store, fires the ML job.
 * Returns prediction_id so the client can poll /status/{id}.
 */
export async function startImageTryOn(input: {
  storeId: string;
  productId: string;
  userPhotoUrl: string;
  garmentType?: string;
  useVision?: boolean;
  params?: Record<string, unknown>;
}) {
  const product = isImageUrl(input.productId)
    ? null
    : await resolveProductImageByStoreAndSku({
        storeId: input.storeId,
        productId: input.productId,
      });
  const garmentImageUrl = product ? product.imageUrl : input.productId;

  const mlPayload = {
    human_img: input.userPhotoUrl,
    garm_img: garmentImageUrl,
    garment_type: input.garmentType ?? "auto_detect",
    // Real product name/category (when known) — far more useful for garment
    // detection than the opaque uploaded garment image URL.
    garment_hint: product ? `${product.name} ${product.category ?? ""}`.trim() : undefined,
    gender_hint: product?.category ?? undefined,
    use_vision: input.useVision ?? true,
    // IDM-VTON defaults matching the reference app
    params: { category: "upper_body", crop: true, steps: 20, ...(input.params ?? {}) },
  };

  console.log("[tryon] starting ML:", JSON.stringify(mlPayload));
  const start = await startVirtualTryOn(mlPayload);
  console.log("[tryon] prediction started:", start.id, "status:", start.status);

  return {
    prediction_id: start.id,
    status: start.status,
  };
}

/**
 * Blocking try-on — resolves product, fires the ML job, waits up to 5 min,
 * and returns { prediction_id, output_url, model_used } in one shot.
 * Used by POST /api/v1/tryon (the widget-facing endpoint).
 */
export async function executeImageTryOn(input: {
  storeId: string;
  productId: string;
  userPhotoUrl: string;
  garmentType?: string;
  useVision?: boolean;
  params?: Record<string, unknown>;
  userIdentifier?: string;
}) {
  const startedAt = Date.now();
  const product = await resolveProductImageByStoreAndSku({
    storeId: input.storeId,
    productId: input.productId,
  });

  const mlPayload = {
    human_img: input.userPhotoUrl,
    garm_img: product.imageUrl,
    garment_type: input.garmentType ?? "auto_detect",
    garment_hint: `${product.name} ${product.category ?? ""}`.trim(),
    gender_hint: product.category ?? undefined,
    use_vision: input.useVision ?? true,
    params: { category: "upper_body", crop: true, steps: 20, ...(input.params ?? {}) },
  };

  try {
    console.log("[tryon] starting ML:", JSON.stringify(mlPayload));
    const start = await startVirtualTryOn(mlPayload);
    console.log("[tryon] prediction started:", start.id);

    const done = await waitVirtualTryOn(start.id, 300_000);
    console.log("[tryon] done:", done.status, "output:", done.output);

    if (done.status !== "succeeded") {
      throw new ApiError(
        502,
        `ML model returned status: ${done.status}${done.error ? ` — ${done.error}` : ""}`
      );
    }
    const outputUrl = extractOutputUrl(done.output);
    if (!outputUrl) throw new ApiError(502, "ML model succeeded but output is empty");

    writeTryonLog({
      storeId: input.storeId,
      mode: "image_id",
      success: true,
      predictionId: start.id,
      vizzleProductId: product.id,
      outputUrl,
      latencyMs: Date.now() - startedAt,
      userIdentifier: input.userIdentifier,
    });

    return { prediction_id: start.id, output_url: outputUrl, model_used: done.model_used ?? "idm-vton" };
  } catch (error) {
    writeTryonLog({
      storeId: input.storeId,
      mode: "image_id",
      success: false,
      vizzleProductId: product.id,
      latencyMs: Date.now() - startedAt,
      userIdentifier: input.userIdentifier,
      errorCode: "ML_ERROR",
    });
    throw error;
  }
}

/**
 * Check status of a try-on prediction.
 * Calls ML backend GET /api/virtual-try-on/status/{id} — instant, < 3 s.
 * Maps ML backend's `output` field → our `output_url` field.
 */
export async function checkImageTryOnStatus(predictionId: string, storeId: string) {
  let raw;
  try {
    raw = await getTryonStatus(predictionId);
  } catch (err) {
    // If ML backend is unreachable or timed out, return "processing" so client keeps polling
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[tryon] status poll FAILED:", predictionId, msg);
    return {
      status:     "processing",
      output_url: null,
      error:      `Status check failed: ${msg}`,
      model_used: null,
    };
  }

  console.log("[tryon] status poll:", predictionId, "→", raw.status,
    "output:", JSON.stringify(raw.output), "model:", raw.model_used);

  const status        = raw.status ?? "unknown";
  const mlOutputUrl   = extractOutputUrl(raw.output) || null;

  if (status === "failed" || status === "canceled") {
    writeTryonLog({ storeId, mode: "image_id", success: false, predictionId, errorCode: "ML_ERROR" });
    return { status, output_url: null, error: raw.error ?? null, model_used: raw.model_used ?? null };
  }

  if (status === "succeeded" && mlOutputUrl) {
    // Mirror ML output → Cloudinary so the client gets a stable, public URL
    // that never expires and has no CORS restrictions.
    const outputUrl = await mirrorOutputToCloudinary(mlOutputUrl, storeId);
    writeTryonLog({ storeId, mode: "image_id", success: true, predictionId, outputUrl });
    return { status, output_url: outputUrl, error: null, model_used: raw.model_used ?? null };
  }

  // still starting / processing
  return {
    status,
    output_url:  null,
    error:       raw.error ?? null,
    model_used:  raw.model_used ?? null,
  };
}

export async function executeVideoTryOn(input: {
  storeId: string;
  productId: string;
  userVideoUrl: string;
  garmentType?: string;
  params?: Record<string, unknown>;
  userIdentifier?: string;
}) {
  const startedAt = Date.now();
  const product = await resolveProductImageByStoreAndSku({
    storeId: input.storeId,
    productId: input.productId,
  });

  try {
    const start = await startVirtualTryOn({
      human_img: input.userVideoUrl,
      garm_img: product.imageUrl,
      garment_type: input.garmentType ?? "auto_detect",
      params: input.params ?? {},
    });

    const done = await waitVirtualTryOn(start.id, 360000);
    const rawOutputUrl = extractOutputUrl(done.output);
    if (!rawOutputUrl) throw new ApiError(502, "ML service did not return output");

    const outputUrl = await mirrorOutputToCloudinary(rawOutputUrl, input.storeId);

    writeTryonLog({
      storeId: input.storeId,
      mode: "video_id",
      success: true,
      predictionId: start.id,
      vizzleProductId: product.id,
      outputUrl,
      latencyMs: Date.now() - startedAt,
      userIdentifier: input.userIdentifier,
    });

    return {
      prediction_id: start.id,
      output_url: outputUrl,
      model_used: done.model_used ?? "idm-vton",
    };
  } catch (error) {
    writeTryonLog({
      storeId: input.storeId,
      mode: "video_id",
      success: false,
      vizzleProductId: product.id,
      latencyMs: Date.now() - startedAt,
      userIdentifier: input.userIdentifier,
      errorCode: "ML_ERROR",
    });
    throw error;
  }
}

export async function executeDirectTryOn(input: {
  storeId: string;
  userPhotoUrl: string;
  productImageUrl: string;
  garmentType?: string;
  params?: Record<string, unknown>;
  userIdentifier?: string;
}) {
  const startedAt = Date.now();
  try {
    const start = await startVirtualTryOn({
      human_img: input.userPhotoUrl,
      garm_img: input.productImageUrl,
      garment_type: input.garmentType ?? "auto_detect",
      params: input.params ?? {},
    });

    const done = await waitVirtualTryOn(start.id, 360000);
    const rawOutputUrl = extractOutputUrl(done.output);
    if (!rawOutputUrl) throw new ApiError(502, "ML service did not return output");

    const outputUrl = await mirrorOutputToCloudinary(rawOutputUrl, input.storeId);

    writeTryonLog({
      storeId: input.storeId,
      mode: "direct",
      success: true,
      predictionId: start.id,
      outputUrl,
      latencyMs: Date.now() - startedAt,
      userIdentifier: input.userIdentifier,
    });

    return {
      prediction_id: start.id,
      output_url: outputUrl,
      model_used: done.model_used ?? "idm-vton",
    };
  } catch (error) {
    writeTryonLog({
      storeId: input.storeId,
      mode: "direct",
      success: false,
      latencyMs: Date.now() - startedAt,
      userIdentifier: input.userIdentifier,
      errorCode: "ML_ERROR",
    });
    throw error;
  }
}

export async function executeLayeredTryOn(input: {
  storeId: string;
  resultImg: string;
  garmImg: string;
  garmentType: string;
  useVision?: boolean;
  params?: Record<string, unknown>;
  userIdentifier?: string;
}) {
  const startedAt = Date.now();
  try {
    const start = await startLayeredTryOn({
      result_img: input.resultImg,
      garm_img: input.garmImg,
      garment_type: input.garmentType,
      use_vision: input.useVision ?? false,
      params: input.params ?? {},
    });

    const done = await waitLayeredTryOn(start.id, 360000);
    const outputUrl = extractOutputUrl(done.output);
    if (!outputUrl) throw new ApiError(502, "ML service did not return output");

    writeTryonLog({
      storeId: input.storeId,
      mode: "layered",
      success: true,
      predictionId: start.id,
      outputUrl,
      latencyMs: Date.now() - startedAt,
      userIdentifier: input.userIdentifier,
    });

    return {
      prediction_id: start.id,
      output_url: outputUrl,
      model_used: done.model_used ?? "idm-vton",
    };
  } catch (error) {
    writeTryonLog({
      storeId: input.storeId,
      mode: "layered",
      success: false,
      latencyMs: Date.now() - startedAt,
      userIdentifier: input.userIdentifier,
      errorCode: "ML_ERROR",
    });
    throw error;
  }
}

export async function executeGenerateVideo(input: {
  storeId: string;
  imageUrl: string;
  motionType?: string;
  duration?: number;
  fps?: number;
  userIdentifier?: string;
}) {
  const startedAt = Date.now();
  try {
    const start = await startGenerateVideo({
      image_url: input.imageUrl,
      motion_type: input.motionType ?? "subtle_walk",
      duration: input.duration ?? 3,
      fps: input.fps ?? 24,
    });

    const done = await waitGenerateVideo(start.id, 660000);
    const outputUrl = extractOutputUrl(done.output);
    if (!outputUrl) throw new ApiError(502, "ML service did not return video");

    writeTryonLog({
      storeId: input.storeId,
      mode: "video_generate",
      success: true,
      predictionId: start.id,
      outputUrl,
      latencyMs: Date.now() - startedAt,
      userIdentifier: input.userIdentifier,
    });

    return {
      prediction_id: start.id,
      video_url: outputUrl,
      model_used: done.model_used ?? "video-gen",
    };
  } catch (error) {
    writeTryonLog({
      storeId: input.storeId,
      mode: "video_generate",
      success: false,
      latencyMs: Date.now() - startedAt,
      userIdentifier: input.userIdentifier,
      errorCode: "ML_ERROR",
    });
    throw error;
  }
}

export function getStatusByMode(mode: "tryon" | "layered" | "video", id: string) {
  if (mode === "layered") return getLayeredStatus(id);
  if (mode === "video") return getVideoStatus(id);
  return getTryonStatus(id);
}
