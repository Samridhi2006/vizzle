import { prisma } from "@/lib/server/prisma";

export interface TierDefinition {
  name: string;
  requestsPerHour: number;
  requestsPerDay: number;
  priceLabel?: string;
}

// Built-in tiers — always present unless explicitly removed via deleteTierDefinition.
const DEFAULT_TIERS: Record<string, TierDefinition> = {
  UNPAID:     { name: "UNPAID",     requestsPerHour: 0,     requestsPerDay: 0,      priceLabel: "Free (unpaid)" },
  BASIC:      { name: "BASIC",      requestsPerHour: 100,   requestsPerDay: 1000,   priceLabel: "Basic" },
  GOLD:       { name: "GOLD",       requestsPerHour: 300,   requestsPerDay: 3000,   priceLabel: "Gold" },
  PREMIUM:    { name: "PREMIUM",    requestsPerHour: 1500,  requestsPerDay: 15000,  priceLabel: "Premium" },
  ENTERPRISE: { name: "ENTERPRISE", requestsPerHour: 10000, requestsPerDay: 100000, priceLabel: "Enterprise" },
};

const SETTING_KEY = "custom_tier_definitions";

interface TierStoreData {
  overrides: Record<string, TierDefinition>;
  removedDefaults: string[];
}

async function readStore(): Promise<TierStoreData> {
  const row = await prisma.platformSetting.findUnique({ where: { key: SETTING_KEY } });
  if (!row) return { overrides: {}, removedDefaults: [] };
  try {
    const parsed = JSON.parse(row.value);
    return {
      overrides: parsed.overrides ?? {},
      removedDefaults: parsed.removedDefaults ?? [],
    };
  } catch {
    return { overrides: {}, removedDefaults: [] };
  }
}

async function writeStore(data: TierStoreData): Promise<void> {
  await prisma.platformSetting.upsert({
    where: { key: SETTING_KEY },
    create: { key: SETTING_KEY, value: JSON.stringify(data) },
    update: { value: JSON.stringify(data) },
  });
}

/**
 * Merged tier list: built-in defaults, minus any removed, plus any custom overrides/additions.
 */
export async function getTierDefinitions(): Promise<Record<string, TierDefinition>> {
  const { overrides, removedDefaults } = await readStore();
  const merged: Record<string, TierDefinition> = { ...DEFAULT_TIERS };
  for (const name of removedDefaults) delete merged[name];
  return { ...merged, ...overrides };
}

export async function upsertTierDefinition(def: TierDefinition): Promise<Record<string, TierDefinition>> {
  const store = await readStore();
  store.overrides[def.name] = def;
  store.removedDefaults = store.removedDefaults.filter((n) => n !== def.name);
  await writeStore(store);
  return getTierDefinitions();
}

export async function deleteTierDefinition(name: string): Promise<Record<string, TierDefinition>> {
  const store = await readStore();
  delete store.overrides[name];
  if (DEFAULT_TIERS[name] && !store.removedDefaults.includes(name)) {
    store.removedDefaults.push(name);
  }
  await writeStore(store);
  return getTierDefinitions();
}
