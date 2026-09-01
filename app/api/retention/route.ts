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

// GET /api/retention -> Checks expiring proofs & purges proofs older than 90 days
export async function GET() {
  try {
    // 1. Auto-purge payment proofs older than 90 days (keeps order details, sets payment_proof_path to NULL)
    const purgeResult = await sql`
      UPDATE orders
      SET
        payment_proof_path = NULL,
        updated_at = now()
      WHERE
        created_at <= (NOW() - INTERVAL '90 days')
        AND payment_proof_path IS NOT NULL
      RETURNING id, order_code
    `;

    // 2. Count total active proofs in database
    const totalWithProof = await sql`
      SELECT COUNT(*)::int AS count
      FROM orders
      WHERE payment_proof_path IS NOT NULL
    `;

    // 3. Find proofs expiring soon (Day 83 to Day 90 -> 7 days remaining before deletion)
    const expiringSoonRows = await sql`
      SELECT id, order_code, roblox_username, robux, price, created_at,
             EXTRACT(DAY FROM (created_at + INTERVAL '90 days' - NOW()))::int AS days_remaining
      FROM orders
      WHERE
        created_at <= (NOW() - INTERVAL '83 days')
        AND payment_proof_path IS NOT NULL
      ORDER BY created_at ASC
    `;

    return NextResponse.json(
      {
        success: true,
        purgedCount: purgeResult.length,
        totalActiveProofs: totalWithProof[0]?.count || 0,
        expiringCount: expiringSoonRows.length,
        expiringOrders: expiringSoonRows,
        policyDays: 90,
        warningDays: 7,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error("GET /api/retention error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal memproses retensi bukti transfer" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
