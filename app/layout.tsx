import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Cormorant_Garamond, Jost, Pinyon_Script } from "next/font/google";
import { wedding, coupleNames } from "@/content/wedding";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pinyon",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const description = `${wedding.date.display}, ${wedding.date.year} · ${wedding.date.city}. Join us as we begin forever.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${coupleNames} · ${wedding.date.short}`,
  description,
  openGraph: {
    title: `${coupleNames} are getting married`,
    description,
    type: "website",
  },
  twitter: { card: "summary_large_image", title: `${coupleNames} are getting married`, description },
  robots: wedding.allowIndexing ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#fcf2f2",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Runs before paint so returning guests never see the envelope flash. */
const introScript = `try{history.scrollRestoration="manual";if(sessionStorage.getItem("invitation-opened"))document.documentElement.dataset.opened="1"}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${pinyon.variable} ${jost.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <noscript>
          <style>{`.envelope-overlay{display:none!important}`}</style>
        </noscript>
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
