import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { compareApiKey } from "@/lib/server/crypto";
import { ApiError } from "@/server/errors";

export interface ApiKeyStore {
  id: string;
  domain: string;
  userId: string;
}

export async function withApiKey(request: NextRequest): Promise<ApiKeyStore> {
  const rawApiKey = request.headers.get("x-api-key");
  if (!rawApiKey || !rawApiKey.startsWith("vzk_")) {
    throw new ApiError(401, "Missing or invalid API key");
  }

  const keyPrefix = rawApiKey.slice(0, 12);
  const candidates = await prisma.apiKey.findMany({
    where: {
      isActive: true,
      keyPrefix,
    },
    include: {
      store: true,
    },
    take: 20,
  });

  for (const key of candidates) {
    // bcrypt hash check against active candidates only.
    const isMatch = await compareApiKey(rawApiKey, key.keyHash);
    if (isMatch) {
      return {
        id: key.store.id,
        domain: key.store.domain,
        userId: key.store.userId,
      };
    }
  }

  throw new ApiError(401, "Invalid API key");
}
