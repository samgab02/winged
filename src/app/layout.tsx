import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import { BottomNav } from "@/components/layout/bottom-nav";
import { TopBar } from "@/components/layout/top-bar";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "POVI — Proof of Vibe",
  description:
    "Co-op matchmaking with Sharks. Dual card feed, 3-minute Deal Rooms, escrowed Date Passes.",
  applicationName: "POVI",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "POVI",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0C10",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} min-h-dvh bg-obsidian font-sans text-foreground antialiased`}
      >
        <div className="mx-auto flex min-h-dvh max-w-lg flex-col pb-24">
          <TopBar />
          <main className="flex flex-1 flex-col">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
