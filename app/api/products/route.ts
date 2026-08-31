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
    const rows = await sql`
      SELECT * FROM products
      ORDER BY robux ASC
    `;
    return NextResponse.json(
      { success: true, data: rows },
      { headers: NO_CACHE_HEADERS }
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
