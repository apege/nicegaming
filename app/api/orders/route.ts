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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let rows;
    if (status && status !== "all") {
      rows = await sql`
        SELECT
          id, order_code, roblox_username, customer_phone, robux, price,
          payment_method, payment_status, order_status, admin_notes,
          customer_notes, created_at, updated_at,
          (payment_proof_path IS NOT NULL AND payment_proof_path != '') AS has_proof_photo
        FROM orders
        WHERE order_status = ${status}
        ORDER BY created_at DESC
        LIMIT 200
      `;
    } else if (search) {
      const searchPattern = `%${search}%`;
      rows = await sql`
        SELECT
          id, order_code, roblox_username, customer_phone, robux, price,
          payment_method, payment_status, order_status, admin_notes,
          customer_notes, created_at, updated_at,
          (payment_proof_path IS NOT NULL AND payment_proof_path != '') AS has_proof_photo
        FROM orders
        WHERE roblox_username ILIKE ${searchPattern}
           OR order_code ILIKE ${searchPattern}
           OR customer_phone ILIKE ${searchPattern}
        ORDER BY created_at DESC
        LIMIT 100
      `;
    } else {
      rows = await sql`
        SELECT
          id, order_code, roblox_username, customer_phone, robux, price,
          payment_method, payment_status, order_status, admin_notes,
          customer_notes, created_at, updated_at,
          (payment_proof_path IS NOT NULL AND payment_proof_path != '') AS has_proof_photo
        FROM orders
        ORDER BY created_at DESC
        LIMIT 200
      `;
    }

    return NextResponse.json(
      { success: true, data: rows },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch orders" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      order_code: customOrderCode,
      roblox_username,
      customer_phone,
      robux,
      price,
      payment_method = "Website",
      product_id,
      roblox_user_id,
      customer_notes,
      payment_proof_path,
    } = body;

    if (!roblox_username || !customer_phone || !robux || !price) {
      return NextResponse.json(
        { success: false, error: "Semua kolom wajib diisi!" },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    // Check Blacklist
    const blacklistCheck = await sql`
      SELECT * FROM blacklists
      WHERE roblox_username ILIKE ${roblox_username.trim()}
         OR (phone IS NOT NULL AND phone = ${customer_phone.trim()})
      LIMIT 1
    `;

    if (blacklistCheck.length > 0) {
      return NextResponse.json(
        {
          success: false,
          isBlacklisted: true,
          error: `Akun @${roblox_username} atau nomor WhatsApp Anda telah diblokir. Alasan: ${blacklistCheck[0].reason || "Penyalahgunaan sistem"}`,
        },
        { status: 403, headers: NO_CACHE_HEADERS }
      );
    }

    // Generate unique order code if not provided
    const randomCode = Math.floor(10000000 + Math.random() * 90000000);
    const orderCode = customOrderCode || `#BLX${randomCode}`;

    const newOrder = await sql`
      INSERT INTO orders (
        order_code, product_id, roblox_username, customer_phone,
        robux, price, payment_method, payment_status, order_status,
        roblox_user_id, customer_notes, payment_proof_path, expires_at
      ) VALUES (
        ${orderCode},
        ${product_id ? Number(product_id) : null},
        ${roblox_username.trim()},
        ${customer_phone.trim()},
        ${Number(robux)},
        ${Number(price)},
        ${payment_method},
        'pending',
        'pending',
        ${roblox_user_id || null},
        ${customer_notes || null},
        ${payment_proof_path || null},
        now() + interval '2 hours'
      )
      RETURNING *
    `;

    return NextResponse.json(
      {
        success: true,
        message: "Order berhasil dibuat!",
        data: newOrder[0],
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal membuat pesanan" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
