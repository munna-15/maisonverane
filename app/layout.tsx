import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CartProvider } from "@/components/cart/CartProvider";
import { FloatingAssistant } from "@/components/assistant/FloatingAssistant";
import { FloatingContact } from "@/components/contact/FloatingContact";

/* --------------------------------------------------------------------------
   Fonts
   Variables are consumed by --font-serif / --font-sans in globals.css.
   -------------------------------------------------------------------------- */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

/* --------------------------------------------------------------------------
   Site constants (placeholder brand: replace with your real name/domain)
   -------------------------------------------------------------------------- */
const SITE_NAME = "Maison Vérane";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_DESCRIPTION =
  "Contemporary women's fashion with an editorial point of view. Discover considered dresses, tailoring, knitwear, and accessories designed to be worn and loved for years.";

/* --------------------------------------------------------------------------
   Metadata
   -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Contemporary Women's Fashion`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  category: "fashion",
  keywords: [
    "women's fashion",
    "contemporary womenswear",
    "designer dresses",
    "women's tailoring",
    "knitwear",
    "occasion wear",
    "online fashion boutique",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Contemporary Women's Fashion`,
    description: SITE_DESCRIPTION,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Contemporary Women's Fashion`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#421C2A",
  colorScheme: "light",
};

/* --------------------------------------------------------------------------
   Root layout
   -------------------------------------------------------------------------- */
export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-burgundy focus:px-4 focus:py-2 focus:text-warm"
        >
          Skip to content
        </a>

        <CartProvider>
          <SiteHeader />

          <main id="main-content" className="flex-1 bg-warm text-ink">
            {children}
          </main>

          <SiteFooter />
          <FloatingContact/>
          <FloatingAssistant/>
        </CartProvider>
      </body>
    </html>
  );
}
