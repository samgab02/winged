import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Syne } from "next/font/google";
import { AppearanceProvider } from "@/components/theme/appearance-provider";
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
  title: "Winged — Dates with a wingman",
  description:
    "The dating app where friends vouch and lock real dates. Discover, wing, Deal Room in 3 minutes.",
  applicationName: "Winged",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/winged-mark.svg" }],
  },
  openGraph: {
    title: "Winged — Dates with a wingman",
    description:
      "Dates planned by friends. Not dry chat. Bachelor + Wing co-op matchmaking.",
    siteName: "Winged",
    images: [{ url: "/winged-mark.svg" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Winged",
  },
};

export const viewport: Viewport = {
  themeColor: "#F3F1EE",
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
    <html lang="en" data-appearance="neutral">
      <body
        className={`${jakarta.variable} ${syne.variable} min-h-dvh bg-canvas font-sans text-foreground antialiased`}
      >
        <AppearanceProvider>{children}</AppearanceProvider>
      </body>
    </html>
  );
}
