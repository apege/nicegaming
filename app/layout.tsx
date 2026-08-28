import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Orbitron } from "next/font/google";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NiceGaming - Top Up Game Aman, Cepat & Terpercaya",
  description: "Top up Roblox, Robux, dan game favoritmu dengan harga termurah, proses otomatis kilat 24 jam, dan garansi aman 100% di NiceGaming.",
  keywords: ["top up robux", "nicegaming", "top up game murah", "beli robux murah", "robux indonesia"],
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${jakartaSans.variable} ${orbitron.variable} dark scroll-smooth`}
    >
      <body className="min-h-screen bg-[#070714] text-gray-100 flex flex-col font-sans selection:bg-[#ff1b7a] selection:text-white">
        {children}
      </body>
    </html>
  );
}
