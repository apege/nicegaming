import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
  "Pragma": "no-cache",
  "Expires": "0",
  "Surrogate-Control": "no-store",
};

export async function GET() {
  try {
    const rows = await sql`
      SELECT * FROM blacklists
      ORDER BY created_at DESC
    `;
    return NextResponse.json(
      { success: true, data: rows },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error("GET /api/blacklists error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch blacklists" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { roblox_username, reason, roblox_user_id, phone } = body;

    if (!roblox_username) {
      return NextResponse.json(
        { success: false, error: "Username Roblox wajib diisi!" },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const cleanUsername = roblox_username.replace(/^@/, "").trim();

    const existing = await sql`
      SELECT id FROM blacklists WHERE roblox_username ILIKE ${cleanUsername} LIMIT 1
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: `Akun @${cleanUsername} sudah ada dalam daftar blacklist!` },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const newBlacklist = await sql`
      INSERT INTO blacklists (roblox_username, reason, roblox_user_id, phone)
      VALUES (
        ${cleanUsername},
        ${reason || "Indikasi penipuan atau penyalahgunaan"},
        ${roblox_user_id || null},
        ${phone || null}
      )
      RETURNING *
    `;

    return NextResponse.json(
      {
        success: true,
        message: `Akun @${cleanUsername} berhasil diblacklist`,
        data: newBlacklist[0],
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error("POST /api/blacklists error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal menambah blacklist" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
