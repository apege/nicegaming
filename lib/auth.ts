import crypto from "crypto";
import { cookies } from "next/headers";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin_nicegaming";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "@Nicegaming2026";
const ADMIN_SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || "nicegaming_super_secret_admin_session_key_2026";

export const SESSION_COOKIE_NAME = "nicegaming_admin_session";

// Generate signed token: base64(username:timestamp:signature)
export function createSessionToken(username: string): string {
  const timestamp = Date.now();
  const data = `${username}:${timestamp}`;
  const hmac = crypto.createHmac("sha256", ADMIN_SESSION_SECRET);
  hmac.update(data);
  const signature = hmac.digest("hex");
  return Buffer.from(`${data}:${signature}`).toString("base64");
}

// Verify token integrity and check if expired (7 days maxAge)
export function verifySessionToken(token: string): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const parts = decoded.split(":");
    if (parts.length !== 3) return false;

    const [username, timestampStr, signature] = parts;
    const timestamp = parseInt(timestampStr, 10);

    // Expire after 7 days
    const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - timestamp > maxAgeMs) {
      return false;
    }

    const data = `${username}:${timestampStr}`;
    const hmac = crypto.createHmac("sha256", ADMIN_SESSION_SECRET);
    hmac.update(data);
    const expectedSignature = hmac.digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
  } catch (err) {
    return false;
  }
}

export function validateAdminCredentials(username?: string, password?: string): boolean {
  const cleanPassword = (password || "").trim();
  const cleanUsername = (username || "").trim();

  // Support login by password only or username + password
  const isPasswordMatch = cleanPassword === ADMIN_PASSWORD;
  const isUsernameMatch = !cleanUsername || cleanUsername === ADMIN_USERNAME;

  return isPasswordMatch && isUsernameMatch;
}
