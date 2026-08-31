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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await sql`
      DELETE FROM blacklists
      WHERE id::text = ${id} OR roblox_username ILIKE ${id}
    `;

    return NextResponse.json(
      {
        success: true,
        message: "Akun berhasil dikeluarkan dari blacklist",
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error("DELETE /api/blacklists/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal menghapus blacklist" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
