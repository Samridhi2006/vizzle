import { prisma } from "@/lib/server/prisma";

export interface PricingConfig {
  creditCostImage: number;
  creditCostVideo: number;
  setupCostBasic: number;
  setupCostGold: number;
  setupCostPremium: number;
  currencySymbol: string;
}

const DEFAULTS: PricingConfig = {
  creditCostImage: 2.5,
  creditCostVideo: 5.0,
  setupCostBasic: 2000,
  setupCostGold: 5000,
  setupCostPremium: 15000,
  currencySymbol: "₹",
};

/**
 * Fetch live pricing config from database (falls back to default values).
 */
export async function getPricingConfig(): Promise<PricingConfig> {
  try {
    const settings = await prisma.platformSetting.findMany();
    const map = new Map(settings.map((s) => [s.key, s.value]));

    return {
      creditCostImage: Number(map.get("credit_cost_image") ?? DEFAULTS.creditCostImage),
      creditCostVideo: Number(map.get("credit_cost_video") ?? DEFAULTS.creditCostVideo),
      setupCostBasic: Number(map.get("setup_cost_basic") ?? DEFAULTS.setupCostBasic),
      setupCostGold: Number(map.get("setup_cost_gold") ?? DEFAULTS.setupCostGold),
      setupCostPremium: Number(map.get("setup_cost_premium") ?? DEFAULTS.setupCostPremium),
      currencySymbol: map.get("currency_symbol") ?? DEFAULTS.currencySymbol,
    };
  } catch {
    return DEFAULTS;
  }
}

/**
 * Update pricing config in database (Admin only).
 */
export async function updatePricingConfig(updates: Partial<PricingConfig>): Promise<PricingConfig> {
  const pairs: Array<{ key: string; value: string }> = [];

  if (updates.creditCostImage !== undefined) pairs.push({ key: "credit_cost_image", value: String(updates.creditCostImage) });
  if (updates.creditCostVideo !== undefined) pairs.push({ key: "credit_cost_video", value: String(updates.creditCostVideo) });
  if (updates.setupCostBasic !== undefined)  pairs.push({ key: "setup_cost_basic",  value: String(updates.setupCostBasic) });
  if (updates.setupCostGold !== undefined)   pairs.push({ key: "setup_cost_gold",   value: String(updates.setupCostGold) });
  if (updates.setupCostPremium !== undefined) pairs.push({ key: "setup_cost_premium", value: String(updates.setupCostPremium) });
  if (updates.currencySymbol !== undefined)  pairs.push({ key: "currency_symbol",   value: updates.currencySymbol });

  for (const pair of pairs) {
    await prisma.platformSetting.upsert({
      where: { key: pair.key },
      create: { key: pair.key, value: pair.value },
      update: { value: pair.value },
    });
  }

  return getPricingConfig();
}
