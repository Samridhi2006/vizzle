import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "crypto";

export function generateApiKey(): string {
  return `vzk_${randomBytes(32).toString("hex")}`;
}

export function getApiKeyPrefix(rawApiKey: string): string {
  return rawApiKey.slice(0, 12);
}

export async function hashApiKey(rawApiKey: string): Promise<string> {
  return bcrypt.hash(rawApiKey, 12);
}

export async function compareApiKey(
  rawApiKey: string,
  hashedApiKey: string
): Promise<boolean> {
  return bcrypt.compare(rawApiKey, hashedApiKey);
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function hashUserIdentifier(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}
