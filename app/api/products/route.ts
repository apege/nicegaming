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

const CACHE_KEY_PRODUCTS = "api:products:public";
const CACHE_KEY_ORDER_STATS = "api:products:order_stats";

export async function GET() {
  try {
    // Check in-memory cache first (0ms latency, 0 Neon compute/network cost)
    const cached = getCached<any[]>(CACHE_KEY_PRODUCTS);
    if (cached) {
      return NextResponse.json(
        { success: true, data: cached },
        { headers: PUBLIC_CACHE_HEADERS }
      );
    }

    // Check cached popular stats (cached for 10 minutes to avoid expensive full-table COUNT scans)
    let orderStats = getCached<any[]>(CACHE_KEY_ORDER_STATS);

    const queries: Promise<any>[] = [
      sql`SELECT id, name, robux, price, is_active FROM products ORDER BY robux ASC`,
      sql`SELECT promo_active, promo_robux_amount FROM store_settings ORDER BY updated_at DESC, id DESC LIMIT 1`,
    ];

    if (!orderStats) {
      queries.push(
        sql`SELECT robux, COUNT(*)::int as count FROM orders WHERE payment_status = 'paid' OR order_status = 'completed' GROUP BY robux ORDER BY count DESC LIMIT 5`
      );
    }

    const results = await Promise.all(queries);
    const products = results[0];
    const settingsRows = results[1];
    if (!orderStats && results[2]) {
      orderStats = results[2];
      setCached(CACHE_KEY_ORDER_STATS, orderStats, 600); // 10 minutes cache
    }

    const settings = settingsRows[0] || null;
    const isPromoActive = settings ? Boolean(settings.promo_active) : false;
    const promoRobuxAmount = settings ? Number(settings.promo_robux_amount) : 0;

    // 1. Find most ordered package for "POPULER" badge
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
    if (mostPopularRobux === null) {
      const candidates = products.filter(
        (p: any) => Number(p.robux) <= 10000 && (!isPromoActive || Number(p.robux) !== promoRobuxAmount)
      );
      mostPopularRobux = candidates.length > 0 ? Number(candidates[0].robux) : 240;
    }

    const enhancedProducts = products.map((p: any) => {
      const robuxNum = Number(p.robux);
      let badge: string | null = null;

      if (isPromoActive && robuxNum === promoRobuxAmount) {
        badge = "PROMO";
      } else if (robuxNum > 10000) {
        badge = "SULTAN";
      } else if (robuxNum === mostPopularRobux) {
        badge = "POPULER";
      }

      return {
        ...p,
        badge,
      };
    });

    // Cache products in memory for 60 seconds
    setCached(CACHE_KEY_PRODUCTS, enhancedProducts, 60);

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
      RETURNING id, name, robux, price, is_active
    `;

    // Invalidate product cache
    invalidateCache("api:products");

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
