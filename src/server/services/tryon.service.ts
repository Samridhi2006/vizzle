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
import { ApiError } from "@/server/errors";
import { TryonMode } from "@/types";

function extractOutputUrl(output: string | string[] | undefined): string {
  if (!output) return "";
  if (Array.isArray(output)) {
    return output[0] ?? "";
  }
  return output;
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

  try {
    const start = await startVirtualTryOn({
      human_img: input.userPhotoUrl,
      garm_img: product.imageUrl,
      garment_type: input.garmentType ?? "auto_detect",
      use_vision: input.useVision ?? true,
      params: input.params ?? {},
    });

    const done = await waitVirtualTryOn(start.id, 360000);
    const outputUrl = extractOutputUrl(done.output);
    if (!outputUrl) throw new ApiError(502, "ML service did not return output");

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

    return {
      prediction_id: start.id,
      output_url: outputUrl,
      model_used: done.model_used ?? "idm-vton",
    };
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
    const outputUrl = extractOutputUrl(done.output);
    if (!outputUrl) throw new ApiError(502, "ML service did not return output");

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
    const outputUrl = extractOutputUrl(done.output);
    if (!outputUrl) throw new ApiError(502, "ML service did not return output");

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
