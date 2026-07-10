import "./globals.css";
import type { Metadata, Viewport } from "next";
import {
  Playfair_Display,
  Inter,
  Cormorant_Garamond,
} from "next/font/google";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Settings } from "@/lib/types";

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

const DEFAULT_TITLE = "MaMaTina";
const DEFAULT_DESCRIPTION = "Welcome to MaMaTina.";

const fallbackMetadata: Metadata = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { data: settingsRow, error } = await supabaseAdmin
      .from("settings")
      .select("data")
      .eq("id", "site")
      .maybeSingle();

    if (error) {
      console.error("Failed to load metadata settings:", error);
      return fallbackMetadata;
    }

    const settings = settingsRow?.data as Settings | undefined;
    const seo = settings?.seo;

    if (!seo) {
      console.error("SEO settings are missing from Supabase.");
      return fallbackMetadata;
    }

    const title =
      typeof seo.title === "string" && seo.title.trim()
        ? seo.title
        : DEFAULT_TITLE;

    const description =
      typeof seo.description === "string" && seo.description.trim()
        ? seo.description
        : DEFAULT_DESCRIPTION;

    const faviconUrl =
      typeof seo.faviconUrl === "string" && seo.faviconUrl.trim()
        ? seo.faviconUrl
        : undefined;

    const socialImage =
      typeof seo.socialImage === "string" && seo.socialImage.trim()
        ? seo.socialImage
        : undefined;

    return {
      title,
      description,
      icons: faviconUrl
        ? {
            icon: [{ url: faviconUrl }],
          }
        : undefined,
      openGraph: {
        title,
        description,
        images: socialImage
          ? [
              {
                url: socialImage,
              },
            ]
          : undefined,
      },
    };
  } catch (error) {
    console.error("Unexpected metadata generation error:", error);
    return fallbackMetadata;
  }
}

export const viewport: Viewport = {
  themeColor: "#F8F5FB",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${inter.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}