import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  createSessionToken,
  validateAdminCredentials,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, error: "Password admin wajib diisi!" },
        { status: 400 }
      );
    }

    const isValid = validateAdminCredentials(username, password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Username atau Password Admin salah!" },
        { status: 401 }
      );
    }

    const token = createSessionToken(username || "admin_nicegaming");
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Login admin berhasil!",
    });
  } catch (error: any) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal memproses login" },
      { status: 500 }
    );
  }
}
