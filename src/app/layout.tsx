import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Syne } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "POVI — Proof of Vibe",
  description:
    "Co-op dating with Sharks. Discover people, plan real dates in 3 minutes, show up IRL.",
  applicationName: "POVI",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "POVI",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFF8F4",
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
    <html lang="en">
      <body
        className={`${jakarta.variable} ${syne.variable} min-h-dvh bg-canvas font-sans text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
