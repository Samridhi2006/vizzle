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

  // Initialize One-Time Setup Tier as UNPAID (Store owner must choose and pay for a setup plan)
  await prisma.storeTier.upsert({
    where: { storeId: store.id },
    create: {
      storeId: store.id,
      tier: "UNPAID",
      requestsPerHour: 0,
      requestsPerDay: 0,
    },
    update: {},
  });

  // Initialize Credit Wallet with 0 balance (Store must complete One-Time Setup & Top-Up)
  await prisma.creditWallet.upsert({
    where: { storeId: store.id },
    create: { storeId: store.id, balance: 0 },
    update: {},
  });

  return {
    store_id: store.id,
    api_key: rawApiKey,
  };
}

export async function createDemoStore(input: {
  userId: string;
  storeName: string;
  domain: string;
  tier: string;
  requestsPerHour: number;
  requestsPerDay: number;
  initialCredits: number;
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

  // Activate store tier with rate limits
  await prisma.storeTier.upsert({
    where: { storeId: store.id },
    create: {
      storeId: store.id,
      tier: input.tier || "BASIC",
      requestsPerHour: input.requestsPerHour,
      requestsPerDay: input.requestsPerDay,
      activatedAt: new Date(),
    },
    update: {
      tier: input.tier || "BASIC",
      requestsPerHour: input.requestsPerHour,
      requestsPerDay: input.requestsPerDay,
      activatedAt: new Date(),
    },
  });

  // Grant initial credits
  await prisma.creditWallet.upsert({
    where: { storeId: store.id },
    create: { storeId: store.id, balance: input.initialCredits },
    update: { balance: input.initialCredits },
  });

  if (input.initialCredits > 0) {
    await prisma.creditTransaction.create({
      data: {
        storeId: store.id,
        type: "PURCHASE",
        amount: input.initialCredits,
        description: `Admin Demo Store Grant (₹${input.initialCredits})`,
      },
    }).catch(() => {});
  }

  return {
    store_id: store.id,
    store_name: store.storeName,
    domain: store.domain,
    api_key: rawApiKey,
    tier: input.tier || "BASIC",
    requests_per_hour: input.requestsPerHour,
    requests_per_day: input.requestsPerDay,
    credits: input.initialCredits,
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

export async function getStoreById(userId: string, storeId: string) {
  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) throw new ApiError(404, "Store not found");
  if (store.userId !== userId) throw new ApiError(403, "Forbidden");
  return store;
}

export async function updateStoreById(input: {
  userId: string;
  storeId: string;
  storeName: string;
  domain: string;
}) {
  await getStoreById(input.userId, input.storeId);

  const store = await prisma.store.update({
    where: { id: input.storeId },
    data: {
      storeName: input.storeName.trim(),
      domain: normalizeDomain(input.domain),
    },
    include: {
      products: { select: { id: true } },
      apiKeys: {
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  return {
    store_id: store.id,
    store_name: store.storeName,
    domain: store.domain,
    created_at: store.createdAt.toISOString(),
    active_key_prefix: store.apiKeys[0]?.keyPrefix ?? "vzk_",
    product_count: store.products.length,
  };
}

export async function deleteStoreById(userId: string, storeId: string) {
  await getStoreById(userId, storeId);
  await prisma.store.delete({ where: { id: storeId } });
}
