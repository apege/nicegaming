import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const PUBLIC_CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=30, stale-while-revalidate=300",
  "CDN-Cache-Control": "public, s-maxage=30, stale-while-revalidate=300",
  "Vercel-CDN-Cache-Control": "public, s-maxage=30, stale-while-revalidate=300",
};

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
  "Pragma": "no-cache",
  "Expires": "0",
  "Surrogate-Control": "no-store",
};

export async function GET() {
  try {
    const [products, settingsRows, orderStats] = await Promise.all([
      sql`SELECT * FROM products ORDER BY robux ASC`,
      sql`SELECT promo_active, promo_robux_amount FROM store_settings ORDER BY updated_at DESC, id DESC LIMIT 1`,
      sql`SELECT robux, COUNT(*)::int as count FROM orders WHERE payment_status = 'paid' OR order_status = 'completed' GROUP BY robux ORDER BY count DESC`,
    ]);

    const settings = settingsRows[0] || null;
    const isPromoActive = settings ? Boolean(settings.promo_active) : false;
    const promoRobuxAmount = settings ? Number(settings.promo_robux_amount) : 0;

    // 1. Find most ordered package for "POPULER" badge (excluding promo and sultan)
    let mostPopularRobux: number | null = null;
    if (orderStats && orderStats.length > 0) {
      for (const stat of orderStats) {
        const r = Number(stat.robux);
        if (r <= 10000 && (!isPromoActive || r !== promoRobuxAmount)) {
          mostPopularRobux = r;
          break;
        }
      }
    }
    // Default popular fallback if no paid orders yet: 240 Robux or 800 Robux
    if (mostPopularRobux === null) {
      const candidates = products.filter((p) => Number(p.robux) <= 10000 && (!isPromoActive || Number(p.robux) !== promoRobuxAmount));
      mostPopularRobux = candidates.length > 0 ? Number(candidates[0].robux) : 240;
    }

    const enhancedProducts = products.map((p) => {
      const robuxNum = Number(p.robux);
      let badge: string | null = null;

      // Rule 1: PROMO -> Aktif di Pengaturan Toko
      if (isPromoActive && robuxNum === promoRobuxAmount) {
        badge = "PROMO";
      }
      // Rule 2: SULTAN -> Nominal di atas 10.000 Robux
      else if (robuxNum > 10000) {
        badge = "SULTAN";
      }
      // Rule 3: POPULER -> Paket paling banyak di-order
      else if (robuxNum === mostPopularRobux) {
        badge = "POPULER";
      }

      return {
        ...p,
        badge,
      };
    });

    return NextResponse.json(
      { success: true, data: enhancedProducts },
      { headers: PUBLIC_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch products" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, robux, price, is_active = true } = body;

    if (!robux || !price) {
      return NextResponse.json(
        { success: false, error: "Nominal Robux dan Harga wajib diisi!" },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const productName = name || `${Number(robux).toLocaleString("id-ID")} Robux`;

    const newProduct = await sql`
      INSERT INTO products (name, robux, price, is_active)
      VALUES (${productName}, ${Number(robux)}, ${Number(price)}, ${Boolean(is_active)})
      RETURNING *
    `;

    return NextResponse.json(
      {
        success: true,
        message: "Produk berhasil ditambahkan",
        data: newProduct[0],
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal menambah produk" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
