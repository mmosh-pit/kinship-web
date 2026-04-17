/**
 * Domain allowlist for the Kinship app.
 *
 * Returns `true` when the current browser hostname belongs to a known
 * deployment environment (production, staging, Vercel preview, or local dev).
 * Third-party widgets that perform their own domain validation (e.g. the
 * Telegram Login Widget) should gate their loading on this check so they
 * don't flash "Invalid domain" on preview URLs where they can't be authorized.
 */
export function isAllowedHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  return (
    h === "localhost" ||
    h.endsWith(".kinship.systems") ||
    h === "kinship.systems" ||
    h.endsWith(".vercel.app")
  );
}
