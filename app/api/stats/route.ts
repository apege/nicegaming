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
    // Highly optimized single-row SQL aggregation to reduce Neon network transfer and compute to minimum
    const rows = await sql`
      SELECT
        COUNT(*)::int AS total_orders,
        COUNT(*) FILTER (WHERE order_status = 'pending')::int AS pending_count,
        COUNT(*) FILTER (WHERE order_status = 'processing')::int AS processing_count,
        COUNT(*) FILTER (WHERE order_status = 'completed')::int AS completed_count,
        COUNT(*) FILTER (WHERE order_status = 'cancelled')::int AS cancelled_count,
        COALESCE(SUM(price) FILTER (WHERE order_status = 'completed'), 0)::numeric AS total_revenue,
        COALESCE(SUM(robux) FILTER (WHERE order_status = 'completed'), 0)::numeric AS total_robux_sold,
        COALESCE(SUM(price) FILTER (WHERE order_status = 'completed' AND LOWER(payment_method) = 'website'), 0)::numeric AS website_revenue,
        COALESCE(SUM(price) FILTER (WHERE order_status = 'completed' AND LOWER(payment_method) = 'whatsapp'), 0)::numeric AS whatsapp_revenue
      FROM orders
    `;

    const stat = rows[0] || {};

    const totalRevenue = Number(stat.total_revenue) || 0;
    const totalRobuxSold = Number(stat.total_robux_sold) || 0;
    const websiteRevenue = Number(stat.website_revenue) || 0;
    const whatsappRevenue = Number(stat.whatsapp_revenue) || 0;

    const counts = {
      total: Number(stat.total_orders) || 0,
      pending: Number(stat.pending_count) || 0,
      processing: Number(stat.processing_count) || 0,
      completed: Number(stat.completed_count) || 0,
      cancelled: Number(stat.cancelled_count) || 0,
    };

    return NextResponse.json(
      {
        success: true,
        data: {
          totalRevenue,
          totalRobuxSold,
          websiteRevenue,
          whatsappRevenue,
          counts,
        },
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch stats" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
