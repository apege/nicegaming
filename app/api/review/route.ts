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

// GET /api/review?token=BLX... -> Verifies token validity
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token") || searchParams.get("order");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token review tidak ditemukan." },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const cleanToken = token.trim();

    // 1. Check order in database
    const orders = await sql`
      SELECT id, order_code, roblox_username, robux, price, order_status, created_at
      FROM orders
      WHERE order_code = ${cleanToken} OR order_code = ${`#${cleanToken}`} OR id::text = ${cleanToken}
      LIMIT 1
    `;

    if (orders.length === 0) {
      return NextResponse.json(
        { success: false, error: "Token atau kode pesanan tidak ditemukan di sistem kami." },
        { status: 404, headers: NO_CACHE_HEADERS }
      );
    }

    const order = orders[0];

    // 2. Must be completed order
    if (order.order_status !== "completed") {
      return NextResponse.json(
        {
          success: false,
          error: "Pesanan ini belum selesai diproses. Ulasan hanya dapat diberikan setelah transaksi selesai.",
          status: order.order_status,
        },
        { status: 403, headers: NO_CACHE_HEADERS }
      );
    }

    // 3. Check if already reviewed (1 order = 1 review)
    const existingReviews = await sql`
      SELECT id, name, message, rating, created_at
      FROM testimonials
      WHERE order_code = ${order.order_code}
      LIMIT 1
    `;

    const alreadyReviewed = existingReviews.length > 0;

    return NextResponse.json(
      {
        success: true,
        data: {
          order_code: order.order_code,
          roblox_username: order.roblox_username,
          robux: Number(order.robux),
          price: Number(order.price),
          already_reviewed: alreadyReviewed,
          review: alreadyReviewed ? existingReviews[0] : null,
        },
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error("GET /api/review error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal memverifikasi token review" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

// POST /api/review -> Submits verified review
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, rating = 5, message } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token review wajib disertakan!" },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    if (!message || message.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: "Mohon tulis ulasan pengalaman Anda minimal 3 karakter!" },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const cleanToken = token.trim();

    // Verify order exists and completed
    const orders = await sql`
      SELECT id, order_code, roblox_username, robux, price, order_status
      FROM orders
      WHERE order_code = ${cleanToken} OR order_code = ${`#${cleanToken}`} OR id::text = ${cleanToken}
      LIMIT 1
    `;

    if (orders.length === 0) {
      return NextResponse.json(
        { success: false, error: "Token pesanan tidak valid!" },
        { status: 404, headers: NO_CACHE_HEADERS }
      );
    }

    const order = orders[0];

    if (order.order_status !== "completed") {
      return NextResponse.json(
        { success: false, error: "Ulasan hanya bisa dikirimkan untuk pesanan yang telah selesai!" },
        { status: 403, headers: NO_CACHE_HEADERS }
      );
    }

    // Check if already reviewed
    const existing = await sql`
      SELECT id FROM testimonials
      WHERE order_code = ${order.order_code}
      LIMIT 1
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: "Token ini sudah pernah digunakan untuk mengirim ulasan. Terima kasih!" },
        { status: 409, headers: NO_CACHE_HEADERS }
      );
    }

    const starRating = Math.min(5, Math.max(1, Number(rating) || 5));

    // Insert approved testimonial
    const inserted = await sql`
      INSERT INTO testimonials (
        name,
        message,
        rating,
        status,
        order_code
      ) VALUES (
        ${order.roblox_username},
        ${message.trim()},
        ${starRating},
        'approved',
        ${order.order_code}
      )
      RETURNING *
    `;

    return NextResponse.json(
      {
        success: true,
        message: "Terima kasih banyak! Ulasan terverifikasi Anda telah berhasil dikirimkan.",
        data: inserted[0],
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error("POST /api/review error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal mengirim ulasan" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
