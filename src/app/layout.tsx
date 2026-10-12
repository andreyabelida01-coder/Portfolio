import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/config/site";
import "./globals.css";

const chakra = localFont({
  src: [
    { path: "../fonts/chakra-petch-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/chakra-petch-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-chakra",
  display: "swap",
});

const instrument = localFont({
  src: "../fonts/instrument-sans-latin-wght-normal.woff2",
  weight: "400 700",
  variable: "--font-instrument",
  display: "swap",
});

const description =
  "Computer Engineering student building full-stack web apps and working with data: Next.js, Node.js, SQL, Python, PySpark, Excel and Google Sheets.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} · Portfolio`, template: `%s · ${site.shortName}` },
  description,
  openGraph: {
    title: `${site.name} · Portfolio`,
    description,
    type: "website",
    url: "/",
    siteName: site.shortName,
  },
  twitter: { card: "summary_large_image", title: `${site.name} · Portfolio`, description },
};

export const viewport: Viewport = {
  themeColor: "#f3f7fa",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${chakra.variable} ${instrument.variable}`}>
      <body>{children}</body>
    </html>
  );
}
