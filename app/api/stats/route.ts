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
    const orders = await sql`
      SELECT id, robux, price, payment_method, order_status
      FROM orders
    `;

    const completed = orders.filter((o) => o.order_status === "completed");
    const totalRevenue = completed.reduce((sum, o) => sum + Number(o.price), 0);
    const totalRobuxSold = completed.reduce((sum, o) => sum + Number(o.robux), 0);

    const websiteRevenue = completed
      .filter((o) => o.payment_method?.toLowerCase() === "website")
      .reduce((sum, o) => sum + Number(o.price), 0);

    const whatsappRevenue = completed
      .filter((o) => o.payment_method?.toLowerCase() === "whatsapp")
      .reduce((sum, o) => sum + Number(o.price), 0);

    const counts = {
      total: orders.length,
      pending: orders.filter((o) => o.order_status === "pending").length,
      processing: orders.filter((o) => o.order_status === "processing").length,
      completed: completed.length,
      cancelled: orders.filter((o) => o.order_status === "cancelled").length,
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
