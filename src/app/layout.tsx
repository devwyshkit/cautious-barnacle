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
  description: "Last-minute personalised gifts, delivered in under 60 minutes by your local vendor.",
  keywords: ["hyperlocal", "personalization", "delivery", "local vendors", "wyshkit", "personalised gifts", "gift delivery"],
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
    title: "WyshKit | Personalised Gifts Delivered in 60 Minutes",
    description: "See a preview before we make it. Personalised gifts from local vendors, delivered fast.",
  },
  twitter: {
    card: "summary_large_image",
    title: "WyshKit | Personalised Gifts Delivered in 60 Minutes",
    description: "See a preview before we make it. Personalised gifts from local vendors, delivered fast.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: '#D91B24',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  try {
    return (
      <html lang="en" className={cn("min-h-screen w-full selection:bg-[var(--primary-muted)] selection:text-[var(--primary)]", inter.variable)}>
        <body className="font-sans antialiased min-h-screen w-full bg-[var(--background)]">
          <ErrorReporter />
          <Providers>
            {children}
          </Providers>
        </body>
      </html >
    );
  } catch (err: any) {
    return (
      <html lang="en">
        <body>
          <div className="p-10 text-[var(--destructive)] bg-[var(--well-destructive)] min-h-screen font-mono">
            <h1 className="text-xl font-bold mb-4">Root Layout Error (Debug)</h1>
            <pre className="whitespace-pre-wrap text-xs bg-white p-4 rounded border border-red-100 shadow-sm">
              {err.stack || err.message || String(err)}
            </pre>
          </div>
        </body>
      </html>
    );
  }
}
