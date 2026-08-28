import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username")?.trim();

  if (!username) {
    return NextResponse.json(
      { success: false, message: "Username harus diisi." },
      { status: 400 }
    );
  }

  try {
    // 1. Search Roblox User by Username
    const userRes = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({
        usernames: [username],
        excludeBannedUsers: false,
      }),
      // Cache briefly to prevent rate limits
      next: { revalidate: 60 },
    });

    if (!userRes.ok) {
      return NextResponse.json(
        { success: false, message: "Gagal terhubung ke API Roblox." },
        { status: 502 }
      );
    }

    const userData = await userRes.json();

    if (!userData.data || userData.data.length === 0) {
      return NextResponse.json(
        { success: false, message: `Akun Roblox "${username}" tidak ditemukan.` },
        { status: 404 }
      );
    }

    const user = userData.data[0];
    const userId = user.id;

    // 2. Fetch Avatar Headshot Thumbnail
    const avatarRes = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        next: { revalidate: 60 },
      }
    );

    let avatarUrl = "";
    if (avatarRes.ok) {
      const avatarData = await avatarRes.json();
      if (avatarData.data && avatarData.data.length > 0) {
        avatarUrl = avatarData.data[0].imageUrl;
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        displayName: user.displayName || user.name,
        avatarUrl: avatarUrl || `https://tr.rbxcdn.com/placeholder`,
      },
    });
  } catch (error) {
    console.error("Roblox API Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server saat memeriksa user." },
      { status: 500 }
    );
  }
}
