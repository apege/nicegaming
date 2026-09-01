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

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cleanId = id.trim();
    const withHash = cleanId.startsWith("#") ? cleanId : `#${cleanId}`;
    const withoutHash = cleanId.replace(/^#/, "");

    const rows = await sql`
      SELECT * FROM orders
      WHERE id::text = ${cleanId} 
         OR order_code = ${cleanId}
         OR order_code = ${withHash}
         OR order_code = ${withoutHash}
      LIMIT 1
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Order tidak ditemukan" },
        { status: 404, headers: NO_CACHE_HEADERS }
      );
    }

    return NextResponse.json(
      { success: true, data: rows[0] },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error("GET /api/orders/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch order" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cleanId = id.trim();
    const withHash = cleanId.startsWith("#") ? cleanId : `#${cleanId}`;
    const withoutHash = cleanId.replace(/^#/, "");

    const body = await req.json();
    const { order_status, payment_status, admin_notes, payment_proof_path } =
      body;

    const existing = await sql`
      SELECT * FROM orders
      WHERE id::text = ${cleanId} 
         OR order_code = ${cleanId}
         OR order_code = ${withHash}
         OR order_code = ${withoutHash}
      LIMIT 1
    `;

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: "Order tidak ditemukan" },
        { status: 404, headers: NO_CACHE_HEADERS }
      );
    }

    const current = existing[0];
    const newOrderStatus = order_status || current.order_status;
    const newPaymentStatus = payment_status || current.payment_status;
    const newAdminNotes =
      admin_notes !== undefined ? admin_notes : current.admin_notes;
    const newProof =
      payment_proof_path !== undefined
        ? payment_proof_path
        : current.payment_proof_path;

    const updated = await sql`
      UPDATE orders
      SET
        order_status = ${newOrderStatus},
        payment_status = ${newPaymentStatus},
        admin_notes = ${newAdminNotes},
        payment_proof_path = ${newProof},
        updated_at = now()
      WHERE id = ${current.id}
      RETURNING *
    `;

    return NextResponse.json(
      {
        success: true,
        message: "Order berhasil diperbarui",
        data: updated[0],
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error("PATCH /api/orders/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal memperbarui order" },
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
      DELETE FROM orders
      WHERE id::text = ${id} OR order_code = ${id}
    `;

    return NextResponse.json(
      {
        success: true,
        message: "Order berhasil dihapus",
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error("DELETE /api/orders/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal menghapus order" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
