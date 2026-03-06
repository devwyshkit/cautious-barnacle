import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import ErrorReporter from "@/components/ErrorReporter";
import { Providers } from "@/components/Providers";
import { validateEnv, checkRecommendedEnv } from "@/lib/env";
import { cn } from "@/lib/utils";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

validateEnv();
checkRecommendedEnv();

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: "WyshKit | Hyperlocal Products & Personalisation",
  description: "Hyperlocal products with optional personalisation, delivered by local vendors in under 60 minutes.",
  keywords: ["hyperlocal", "personalization", "delivery", "local vendors", "wyshkit", "personalised products", "local vendor delivery", "hyperlocal products"],
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
    title: "WyshKit | Local Products. Optional Personalisation. Fast Delivery.",
    description: "Get local products with optional personalisation. See a preview before it's crafted. Fast delivery.",
  },
  twitter: {
    card: "summary_large_image",
    title: "WyshKit | Local Products. Optional Personalisation. Fast Delivery.",
    description: "Get local products with optional personalisation. See a preview before it's crafted. Fast delivery.",
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
      <html lang="en" style={{ colorScheme: 'light' }} className={cn("min-h-screen w-full selection:bg-[var(--primary-muted)] selection:text-[var(--primary)]", outfit.variable)} suppressHydrationWarning>
        <body className="font-sans antialiased min-h-[100dvh] w-full bg-[var(--background)]">
          <ErrorReporter />
          <Providers>
            {children}
          </Providers>
        </body>
      </html >
    );
  } catch (err: any) {
    return (
      <html lang="en" style={{ colorScheme: 'light' }}>
        <body>
          <div className="p-10 text-[var(--destructive)] bg-[var(--well-destructive)] min-h-screen font-mono">
            <h1 className="text-xl font-bold mb-4">Root Layout Error (Debug)</h1>
            <pre className="whitespace-pre-wrap text-xs bg-[var(--surface)] p-4 rounded border border-red-100 shadow-sm">
              {err.stack || err.message || String(err)}
            </pre>
          </div>
        </body>
      </html>
    );
  }
}
