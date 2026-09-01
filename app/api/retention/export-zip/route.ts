import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import JSZip from "jszip";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const scope = searchParams.get("scope") || "expiring"; // "expiring" or "all"

    let rows;
    if (scope === "all") {
      rows = await sql`
        SELECT id, order_code, roblox_username, robux, price, payment_proof_path, created_at
        FROM orders
        WHERE payment_proof_path IS NOT NULL
        ORDER BY created_at DESC
      `;
    } else {
      // Expiring in 7 days (created between 83 days ago and 90 days ago)
      rows = await sql`
        SELECT id, order_code, roblox_username, robux, price, payment_proof_path, created_at
        FROM orders
        WHERE
          created_at <= (NOW() - INTERVAL '83 days')
          AND payment_proof_path IS NOT NULL
        ORDER BY created_at ASC
      `;
    }

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Tidak ada foto bukti transfer yang dapat diunduh untuk saat ini.",
        },
        { status: 404 }
      );
    }

    const zip = new JSZip();
    let indexLog = `=== ARSIP BUKTI TRANSFER PEMBAYARAN ===\n`;
    indexLog += `Waktu Unduh: ${new Date().toLocaleString("id-ID")}\n`;
    indexLog += `Tipe Arsip: ${scope === "all" ? "Semua Bukti Transfer Aktif" : "Bukti Transfer Akan Kedaluwarsa (Retensi 90 Hari)"}\n`;
    indexLog += `Jumlah File: ${rows.length} file\n\n`;
    indexLog += `DAFTAR TRANSAKSI:\n`;
    indexLog += `--------------------------------------------------------\n`;

    let fileCount = 0;

    for (const row of rows) {
      const dataUrl = row.payment_proof_path as string;
      if (!dataUrl) continue;

      let extension = "webp";
      let base64String = dataUrl;

      if (dataUrl.includes(",")) {
        const [meta, content] = dataUrl.split(",");
        base64String = content;
        if (meta.includes("image/png")) extension = "png";
        else if (meta.includes("image/jpeg") || meta.includes("image/jpg")) extension = "jpg";
        else if (meta.includes("image/webp")) extension = "webp";
      }

      try {
        const fileBuffer = Buffer.from(base64String, "base64");
        const cleanOrderCode = (row.order_code || `ORD-${row.id}`).replace(/[^a-zA-Z0-9_-]/g, "");
        const cleanUsername = (row.roblox_username || "User").replace(/[^a-zA-Z0-9_-]/g, "");
        const formattedDate = row.created_at
          ? new Date(row.created_at).toISOString().split("T")[0]
          : "unknown_date";

        const fileName = `Bukti_${cleanOrderCode}_${cleanUsername}_${formattedDate}.${extension}`;

        zip.file(fileName, fileBuffer);
        fileCount++;

        indexLog += `[${fileCount}] ${row.order_code} | @${row.roblox_username} | ${row.robux} Robux | Rp ${Number(row.price).toLocaleString("id-ID")} | Tgl: ${formattedDate} | File: ${fileName}\n`;
      } catch (err) {
        console.error(`Error processing proof for order ${row.id}:`, err);
      }
    }

    zip.file("ARSIP_INDEX.txt", indexLog);

    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    const currentDateStr = new Date().toISOString().split("T")[0];
    const zipFileName = `Arsip_Bukti_Transfer_${scope === "all" ? "Semua" : "Expiring_90Hari"}_${currentDateStr}.zip`;

    return new NextResponse(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${zipFileName}"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error: any) {
    console.error("GET /api/retention/export-zip error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal membuat file ZIP arsip bukti transfer" },
      { status: 500 }
    );
  }
}
