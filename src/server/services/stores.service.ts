import { prisma } from "@/lib/server/prisma";
import {
  generateApiKey,
  getApiKeyPrefix,
  hashApiKey,
} from "@/lib/server/crypto";
import { ApiError } from "@/server/errors";

function normalizeDomain(input: string): string {
  const stripped = input.trim().toLowerCase().replace(/^https?:\/\//, "");
  return stripped.replace(/\/+$/, "");
}

export async function createStore(input: {
  userId: string;
  storeName: string;
  domain: string;
}) {
  const normalizedDomain = normalizeDomain(input.domain);
  const store = await prisma.store.create({
    data: {
      userId: input.userId,
      storeName: input.storeName.trim(),
      domain: normalizedDomain,
    },
  });

  const rawApiKey = generateApiKey();
  await prisma.apiKey.create({
    data: {
      storeId: store.id,
      keyHash: await hashApiKey(rawApiKey),
      keyPrefix: getApiKeyPrefix(rawApiKey),
      isActive: true,
    },
  });

  return {
    store_id: store.id,
    api_key: rawApiKey,
  };
}

export async function listStores(userId: string) {
  const stores = await prisma.store.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      products: {
        select: { id: true },
      },
      apiKeys: {
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  return stores.map((store) => ({
    store_id: store.id,
    store_name: store.storeName,
    domain: store.domain,
    created_at: store.createdAt.toISOString(),
    active_key_prefix: store.apiKeys[0]?.keyPrefix ?? "vzk_",
    product_count: store.products.length,
  }));
}

export async function rotateStoreApiKey(input: {
  userId: string;
  storeId: string;
}) {
  const store = await prisma.store.findUnique({
    where: { id: input.storeId },
  });
  if (!store) {
    throw new ApiError(404, "Store not found");
  }
  if (store.userId !== input.userId) {
    throw new ApiError(403, "Store does not belong to this user");
  }

  const rawApiKey = generateApiKey();
  await prisma.$transaction([
    prisma.apiKey.updateMany({
      where: { storeId: store.id, isActive: true },
      data: { isActive: false },
    }),
    prisma.apiKey.create({
      data: {
        storeId: store.id,
        keyHash: await hashApiKey(rawApiKey),
        keyPrefix: getApiKeyPrefix(rawApiKey),
        isActive: true,
      },
    }),
  ]);

  return {
    new_api_key: rawApiKey,
  };
}
