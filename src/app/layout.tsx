import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, Cormorant_Garamond } from "next/font/google";
import { readDB } from "@/lib/db";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  const db = await readDB();
  return {
    title: db.settings.seo.title,
    description: db.settings.seo.description,
    icons: db.settings.seo.faviconUrl ? [{ url: db.settings.seo.faviconUrl }] : undefined,
    openGraph: {
      title: db.settings.seo.title,
      description: db.settings.seo.description,
      images: db.settings.seo.socialImage ? [db.settings.seo.socialImage] : undefined,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#FAF7F2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
