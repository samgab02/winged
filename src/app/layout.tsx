import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Syne } from "next/font/google";
import { AppearanceProvider } from "@/components/theme/appearance-provider";
import { QaHost } from "@/components/qa/qa-host";
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
  title: "Winged — Friends plan it. You show up.",
  description:
    "Dating with a live Deal Room: Wings negotiate venue and time in three minutes. Pro Wings, escrow, and Proof of Stay — not endless chat.",
  applicationName: "Winged",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/brand/winged-mark.svg" }],
  },
  openGraph: {
    title: "Winged — Friends plan it. You show up.",
    description:
      "Deal Room locks. Pro Wings with escrow. Bachelor + Wing shells — planned dates, not endless chat.",
    siteName: "Winged",
    images: [{ url: "/brand/winged-lockup-v2.png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Winged",
  },
};

export const viewport: Viewport = {
  themeColor: "#FBF7F4",
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
        <AppearanceProvider>
          <QaHost>{children}</QaHost>
        </AppearanceProvider>
      </body>
    </html>
  );
}
