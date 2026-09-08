import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { invalidateCache } from "@/lib/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
  "Pragma": "no-cache",
  "Expires": "0",
  "Surrogate-Control": "no-store",
};

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, admin_reply } = body;

    const existing = await sql`
      SELECT id, status, admin_reply FROM testimonials WHERE id::text = ${id} LIMIT 1
    `;

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: "Testimoni tidak ditemukan" },
        { status: 404, headers: NO_CACHE_HEADERS }
      );
    }

    const current = existing[0];
    const newStatus = status !== undefined ? status : current.status;
    const newReply =
      admin_reply !== undefined
        ? typeof admin_reply === "string"
          ? JSON.stringify({ message: admin_reply, date: "Baru saja" })
          : JSON.stringify(admin_reply)
        : current.admin_reply;

    const updated = await sql`
      UPDATE testimonials
      SET
        status = ${newStatus},
        admin_reply = ${newReply ? JSON.parse(newReply) : null},
        updated_at = now()
      WHERE id = ${current.id}
      RETURNING *
    `;

    invalidateCache("api:testimonials");

    return NextResponse.json(
      {
        success: true,
        message: "Testimoni berhasil diperbarui",
        data: updated[0],
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error("PATCH /api/testimonials/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal memperbarui testimoni" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await sql`
      DELETE FROM testimonials WHERE id::text = ${id}
    `;

    invalidateCache("api:testimonials");

    return NextResponse.json(
      {
        success: true,
        message: "Testimoni berhasil dihapus",
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error("DELETE /api/testimonials/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal menghapus testimoni" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
