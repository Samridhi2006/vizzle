export function parseAdminEmails(raw: string | undefined): string[] {
  if (!raw) return [];
  const trimmed = raw.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => String(item).trim().toLowerCase())
          .filter(Boolean);
      }
    } catch {
      // fallback to comma parsing below
    }
  }

  return trimmed
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string): boolean {
  const admins = parseAdminEmails(process.env.ADMIN_EMAILS);
  return admins.includes(email.trim().toLowerCase());
}
