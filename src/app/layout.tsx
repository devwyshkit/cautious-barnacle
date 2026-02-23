import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import ErrorReporter from "@/components/ErrorReporter";
import { Providers } from "@/components/Providers";
import { validateEnv, checkRecommendedEnv } from "@/lib/env";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

validateEnv();
checkRecommendedEnv();

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: "WyshKit | Premium Hyperlocal Personalization",
  description: "The gold standard for hyperlocal gifts and items. Order from premium local partners with seamless, optional personalization.",
  keywords: ["hyperlocal", "marketplace", "personalization", "delivery", "local partners", "wyshkit"],
  authors: [{ name: "Wyshkit" }],
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Wyshkit",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Wyshkit",
    title: "Wyshkit | Hyperlocal Item Marketplace",
    description: "Hyperlocal item marketplace with optional personalization. Order from local partners.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wyshkit | Hyperlocal Item Marketplace",
    description: "Hyperlocal item marketplace with optional personalization. Order from local partners.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: '#C5A059',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("min-h-screen w-full selection:bg-rose-100 selection:text-rose-900", inter.variable)}>
      <body className="font-sans antialiased min-h-screen w-full bg-white">
        <ErrorReporter />
        <Providers>
          {children}
        </Providers>
      </body>
    </html >
  );
}
