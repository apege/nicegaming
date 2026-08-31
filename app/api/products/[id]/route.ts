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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, robux, price, is_active } = body;

    const existing = await sql`
      SELECT * FROM products WHERE id::text = ${id} LIMIT 1
    `;

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: "Produk tidak ditemukan" },
        { status: 404, headers: NO_CACHE_HEADERS }
      );
    }

    const current = existing[0];
    const newName = name !== undefined ? name : current.name;
    const newRobux = robux !== undefined ? Number(robux) : current.robux;
    const newPrice = price !== undefined ? Number(price) : current.price;
    const newActive = is_active !== undefined ? Boolean(is_active) : current.is_active;

    const updated = await sql`
      UPDATE products
      SET
        name = ${newName},
        robux = ${newRobux},
        price = ${newPrice},
        is_active = ${newActive},
        updated_at = now()
      WHERE id = ${current.id}
      RETURNING *
    `;

    return NextResponse.json(
      {
        success: true,
        message: "Produk berhasil diperbarui",
        data: updated[0],
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error("PATCH /api/products/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal memperbarui produk" },
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
      DELETE FROM products WHERE id::text = ${id}
    `;

    return NextResponse.json(
      {
        success: true,
        message: "Produk berhasil dihapus",
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal menghapus produk" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
