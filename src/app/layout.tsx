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
    "The dating app where friends lock real dates. Discover, vouch, Deal Room in 3 minutes.",
  applicationName: "POVI",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/povi-mark.svg" }],
  },
  openGraph: {
    title: "POVI — Proof of Vibe",
    description:
      "Dates planned by friends. Not dry chat. Bachelor + Shark co-op matchmaking.",
    siteName: "POVI",
    images: [{ url: "/povi-mark.svg" }],
  },
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
