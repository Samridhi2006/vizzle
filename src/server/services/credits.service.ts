import { prisma } from "@/lib/server/prisma";
import { ApiError } from "@/server/errors";
import { getPricingConfig } from "@/server/services/pricing.service";

const COST_IMAGE = Number(process.env.CREDIT_COST_IMAGE ?? "2.5");
const COST_VIDEO = Number(process.env.CREDIT_COST_VIDEO ?? "5.0");

export { COST_IMAGE, COST_VIDEO };

export async function getCostForType(type: "USAGE_IMAGE" | "USAGE_VIDEO"): Promise<number> {
  const config = await getPricingConfig();
  return type === "USAGE_VIDEO" ? config.creditCostVideo : config.creditCostImage;
}

export type CreditTxType = "PURCHASE" | "USAGE_IMAGE" | "USAGE_VIDEO" | "REFUND";

// ── Wallet helpers ────────────────────────────────────────────────────────────

/**
 * Get or create a CreditWallet for a store.
 * Safe to call concurrently — upsert with 0 balance if not found.
 */
export async function getOrCreateWallet(storeId: string) {
  return prisma.creditWallet.upsert({
    where:  { storeId },
    create: { storeId, balance: 0 },
    update: {},
  });
}

/**
 * Return the current credit balance for a store (INR units).
 */
export async function getBalance(storeId: string): Promise<number> {
  const wallet = await prisma.creditWallet.findUnique({ where: { storeId } });
  return wallet?.balance ?? 0;
}

// ── Debit / Credit ────────────────────────────────────────────────────────────

/**
 * Deduct `amount` INR from the store's wallet.
 * Throws ApiError(402) if balance is insufficient.
 * Uses a DB transaction to prevent race conditions.
 */
export async function deductCredit(
  storeId: string,
  amount: number,
  type: CreditTxType,
  description?: string
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const wallet = await tx.creditWallet.findUnique({ where: { storeId } });
    const current = wallet?.balance ?? 0;

    if (current < amount) {
      throw new ApiError(
        402,
        `Insufficient credits. Balance: ₹${current.toFixed(2)}, Required: ₹${amount.toFixed(2)}`
      );
    }

    await tx.creditWallet.upsert({
      where:  { storeId },
      create: { storeId, balance: -amount },
      update: { balance: { decrement: amount } },
    });

    await tx.creditTransaction.create({
      data: {
        storeId,
        type,
        amount: -amount,
        description: description ?? `API usage — ${type}`,
      },
    });
  });
}

/**
 * Add `amount` INR credits to the store's wallet.
 * Used after successful Razorpay payment or for refunds.
 */
export async function addCredit(
  storeId: string,
  amount: number,
  type: CreditTxType,
  opts?: {
    description?: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
  }
): Promise<number> {
  const [wallet] = await prisma.$transaction([
    prisma.creditWallet.upsert({
      where:  { storeId },
      create: { storeId, balance: amount },
      update: { balance: { increment: amount } },
    }),
    prisma.creditTransaction.create({
      data: {
        storeId,
        type,
        amount,
        description: opts?.description ?? `Credit ${type.toLowerCase()}`,
        razorpayOrderId:   opts?.razorpayOrderId   ?? null,
        razorpayPaymentId: opts?.razorpayPaymentId ?? null,
      },
    }),
  ]);

  return wallet.balance;
}

// ── Transaction history ───────────────────────────────────────────────────────

export async function getTransactions(storeId: string, limit = 50) {
  return prisma.creditTransaction.findMany({
    where:   { storeId },
    orderBy: { createdAt: "desc" },
    take:    limit,
  });
}

// ── Tier helper ───────────────────────────────────────────────────────────────

export async function getStoreTier(storeId: string) {
  return prisma.storeTier.findUnique({ where: { storeId } });
}
