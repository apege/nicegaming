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
      SELECT * FROM store_settings
      ORDER BY updated_at DESC, id DESC
      LIMIT 1
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        {
          success: true,
          data: {
            store_name: "NiceGaming",
            whatsapp_number: "6283863946967",
            promo_active: true,
            promo_robux_amount: 2200,
            promo_original_label: "55.000",
            promo_discount_price: 45000,
            promo_end_date: "2026-09-05T23:59:59Z",
            promo_subtitle: "⚡ Pengiriman Robux instan 1-5 menit via Gamepass 100% aman & legal!",
          },
        },
        { headers: NO_CACHE_HEADERS }
      );
    }

    return NextResponse.json(
      { success: true, data: rows[0] },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error("GET /api/store-settings error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch store settings" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      store_name,
      whatsapp_number,
      promo_active,
      promo_robux_amount,
      promo_original_label,
      promo_discount_price,
      promo_end_date,
      promo_subtitle,
      admin_note,
    } = body;

    const existing = await sql`
      SELECT * FROM store_settings
      ORDER BY updated_at DESC, id DESC
      LIMIT 1
    `;

    let result;
    if (existing.length === 0) {
      result = await sql`
        INSERT INTO store_settings (
          store_name, whatsapp_number, promo_active, promo_robux_amount,
          promo_original_label, promo_discount_price, promo_end_date,
          promo_subtitle, admin_note
        ) VALUES (
          ${store_name || "NiceGaming"},
          ${whatsapp_number || "6283863946967"},
          ${promo_active !== undefined ? Boolean(promo_active) : true},
          ${promo_robux_amount ? Number(promo_robux_amount) : 2200},
          ${promo_original_label || "55.000"},
          ${promo_discount_price ? Number(promo_discount_price) : 45000},
          ${promo_end_date ? new Date(promo_end_date).toISOString() : null},
          ${promo_subtitle || "⚡ Pengiriman Robux instan 1-5 menit via Gamepass 100% aman & legal!"},
          ${admin_note || null}
        )
        RETURNING *
      `;
    } else {
      const current = existing[0];
      const newStoreName = store_name !== undefined ? store_name : current.store_name;
      const newWhatsapp = whatsapp_number !== undefined ? whatsapp_number : current.whatsapp_number;
      const newPromoActive = promo_active !== undefined ? Boolean(promo_active) : current.promo_active;
      const newPromoRobux = promo_robux_amount !== undefined ? Number(promo_robux_amount) : current.promo_robux_amount;
      const newPromoLabel = promo_original_label !== undefined ? promo_original_label : current.promo_original_label;
      const newPromoPrice = promo_discount_price !== undefined ? Number(promo_discount_price) : current.promo_discount_price;
      const newPromoEnd = promo_end_date !== undefined ? (promo_end_date ? new Date(promo_end_date).toISOString() : null) : current.promo_end_date;
      const newPromoSub = promo_subtitle !== undefined ? promo_subtitle : current.promo_subtitle;
      const newAdminNote = admin_note !== undefined ? admin_note : current.admin_note;

      result = await sql`
        UPDATE store_settings
        SET
          store_name = ${newStoreName},
          whatsapp_number = ${newWhatsapp},
          promo_active = ${newPromoActive},
          promo_robux_amount = ${newPromoRobux},
          promo_original_label = ${newPromoLabel},
          promo_discount_price = ${newPromoPrice},
          promo_end_date = ${newPromoEnd},
          promo_subtitle = ${newPromoSub},
          admin_note = ${newAdminNote},
          updated_at = now()
        WHERE id = ${current.id}
        RETURNING *
      `;

      // Also clean any rogue duplicate rows if any existed
      await sql`DELETE FROM store_settings WHERE id != ${current.id}`;
    }

    return NextResponse.json(
      {
        success: true,
        message: "Pengaturan toko berhasil disimpan ke database!",
        data: result[0],
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error("POST /api/store-settings error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal menyimpan pengaturan toko" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
