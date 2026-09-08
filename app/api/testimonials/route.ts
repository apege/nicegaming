import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getCached, setCached, invalidateCache } from "@/lib/cache";

export const dynamic = "force-dynamic";

const PUBLIC_CACHE_HEADERS = {
  "Cache-Control": "public, max-age=30, s-maxage=120, stale-while-revalidate=600",
  "CDN-Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
  "Cloudflare-CDN-Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
};

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
  "Pragma": "no-cache",
  "Expires": "0",
  "Surrogate-Control": "no-store",
};

const CACHE_KEY_TESTIMONIALS_PUBLIC = "api:testimonials:public";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";

    if (!all) {
      const cached = getCached<any[]>(CACHE_KEY_TESTIMONIALS_PUBLIC);
      if (cached) {
        return NextResponse.json(
          { success: true, data: cached },
          { headers: PUBLIC_CACHE_HEADERS }
        );
      }
    }

    let rows;
    if (all) {
      rows = await sql`
        SELECT id, name, message, rating, status, order_code, admin_reply, created_at
        FROM testimonials
        ORDER BY created_at DESC
        LIMIT 100
      `;
    } else {
      rows = await sql`
        SELECT id, name, message, rating, status, order_code, admin_reply, created_at
        FROM testimonials
        WHERE status = 'approved'
        ORDER BY created_at DESC
        LIMIT 15
      `;
      setCached(CACHE_KEY_TESTIMONIALS_PUBLIC, rows, 60); // 60s memory cache
    }

    return NextResponse.json(
      { success: true, data: rows },
      { headers: all ? NO_CACHE_HEADERS : PUBLIC_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error("GET /api/testimonials error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch testimonials" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, message, rating = 5, order_code } = body;

    if (!name || !message) {
      return NextResponse.json(
        { success: false, error: "Nama dan ulasan wajib diisi!" },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const newTestimonial = await sql`
      INSERT INTO testimonials (name, message, rating, status, order_code)
      VALUES (${name.trim()}, ${message.trim()}, ${Number(rating)}, 'approved', ${order_code || null})
      RETURNING id, name, message, rating, status, order_code, created_at
    `;

    // Invalidate testimonials cache
    invalidateCache("api:testimonials");

    return NextResponse.json(
      {
        success: true,
        message: "Ulasan berhasil disimpan!",
        data: newTestimonial[0],
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error("POST /api/testimonials error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal menyimpan ulasan" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
