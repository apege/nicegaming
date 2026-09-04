import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const PUBLIC_CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
  "CDN-Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
  "Vercel-CDN-Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
};

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
  "Pragma": "no-cache",
  "Expires": "0",
  "Surrogate-Control": "no-store",
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";

    let rows;
    if (all) {
      rows = await sql`
        SELECT * FROM testimonials
        ORDER BY created_at DESC
      `;
    } else {
      rows = await sql`
        SELECT * FROM testimonials
        WHERE status = 'approved'
        ORDER BY created_at DESC
        LIMIT 20
      `;
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
      RETURNING *
    `;

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
