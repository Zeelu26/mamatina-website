import { supabaseAdmin } from "@/lib/supabase/admin";
import type {
  GalleryPhoto,
  HeroPhoto,
  Product,
  Review,
  Settings,
} from "@/lib/types";

import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Products from "@/components/Products";
import Gallery from "@/components/Gallery";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

const fallbackSettings: Settings = {
  business: {
    name: "MaMaTina",
    tagline: "Gourmet Rice Pudding",
    phone: "+1 (201) 647-4223",
    email: "hello@mamatinaorp.com",
    address: "",
    hours: "Tuesday – Sunday · 10am – 7pm",
    socialInstagram: "https://instagram.com/mamatina",
    socialTiktok: "https://tiktok.com/@mamatina",
    socialFacebook: "",
  },

  hero: {
    headline: "Gourmet Rice Pudding,\nCrafted with Love",
    subheading:
      "All organic. Small batch. Made by hand the way our grandmother taught us — slow simmered, never rushed, never compromised.",
    primaryButtonText: "View Flavors",
    primaryButtonLink: "#flavors",
    secondaryButtonText: "Order Now",
    secondaryButtonLink: "#contact",
    shuffleEnabled: true,
    shuffleSeconds: 7,
  },

  about: {
    eyebrow: "Our Story",
    title: "A spoonful of tradition,\na taste of home.",
    paragraph:
      "MaMaTina was born in a small kitchen where time was measured in stirs of a wooden spoon. Every jar is handcrafted in small batches with care.",
    imageUrl: "/images/about.svg",
  },

  gallery: {
    shuffleEnabled: false,
    shuffleSeconds: 7,
  },

  announcement: {
    enabled: false,
    text: "",
  },

  seo: {
    title: "MaMaTina · Gourmet Rice Pudding",
    description:
      "Organic, handcrafted gourmet rice pudding made in small batches.",
    socialImage: "",
    analyticsId: "",
    logoUrl: "",
    faviconUrl: "",
  },

  legal: {
    privacyPolicy:
      "We collect only the information needed to respond to inquiries and fulfill orders.",
    terms:
      "All orders are made to order. Please review allergen information before purchasing.",
    cookieBannerText:
      "We use a small number of cookies to make this site work.",
  },

  maintenanceMode: false,

  footer: {
    copyright: "© MaMaTina. Crafted with love.",
  },
};

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id ?? ""),
    name: String(row.name ?? ""),
    price: String(row.price ?? ""),
    shortDescription: String(row.short_description ?? ""),
    fullDescription: String(row.full_description ?? ""),
    ingredients: String(row.ingredients ?? ""),
    allergens: String(row.allergens ?? ""),
    imageUrl: String(row.image_url ?? ""),
    availability:
      row.availability === "sold-out" ||
      row.availability === "coming-soon"
        ? row.availability
        : "available",
    featured: Boolean(row.featured),
    order: Number(row.sort_order ?? 0),
    createdAt: String(row.created_at ?? ""),
  };
}

function mapHeroPhoto(row: Record<string, unknown>): HeroPhoto {
  return {
    id: String(row.id ?? ""),
    url: String(row.url ?? ""),
    alt: String(row.alt ?? ""),
    order: Number(row.sort_order ?? 0),
  };
}

function mapGalleryPhoto(row: Record<string, unknown>): GalleryPhoto {
  return {
    id: String(row.id ?? ""),
    url: String(row.url ?? ""),
    alt: String(row.alt ?? ""),
    order: Number(row.sort_order ?? 0),
  };
}

function mapReview(row: Record<string, unknown>): Review {
  return {
    id: String(row.id ?? ""),
    customerName: String(row.customer_name ?? ""),
    rating: Number(row.rating ?? 5),
    text: String(row.text ?? ""),
    photoUrl:
      typeof row.photo_url === "string" && row.photo_url
        ? row.photo_url
        : undefined,
    date: String(row.date ?? ""),
    approved: Boolean(row.approved),
    featured: Boolean(row.featured),
  };
}

function mergeSettings(value: unknown): Settings {
  if (!value || typeof value !== "object") {
    return fallbackSettings;
  }

  const incoming = value as Partial<Settings>;

  return {
    ...fallbackSettings,
    ...incoming,

    business: {
      ...fallbackSettings.business,
      ...(incoming.business ?? {}),
    },

    hero: {
      ...fallbackSettings.hero,
      ...(incoming.hero ?? {}),
    },

    about: {
      ...fallbackSettings.about,
      ...(incoming.about ?? {}),
    },

    gallery: {
      ...fallbackSettings.gallery,
      ...(incoming.gallery ?? {}),
    },

    announcement: {
      ...fallbackSettings.announcement,
      ...(incoming.announcement ?? {}),
    },

    seo: {
      ...fallbackSettings.seo,
      ...(incoming.seo ?? {}),
    },

    legal: {
      ...fallbackSettings.legal,
      ...(incoming.legal ?? {}),
    },

    footer: {
      ...fallbackSettings.footer,
      ...(incoming.footer ?? {}),
    },
  };
}

export default async function Home() {
  const [
    productsResult,
    heroPhotosResult,
    galleryPhotosResult,
    reviewsResult,
    settingsResult,
  ] = await Promise.all([
    supabaseAdmin
      .from("products")
      .select(
        "id, name, price, short_description, full_description, ingredients, allergens, image_url, availability, featured, sort_order, created_at"
      )
      .order("sort_order", { ascending: true }),

    supabaseAdmin
      .from("hero_photos")
      .select("id, url, alt, sort_order")
      .order("sort_order", { ascending: true }),

    supabaseAdmin
      .from("gallery_photos")
      .select("id, url, alt, sort_order")
      .order("sort_order", { ascending: true }),

    supabaseAdmin
      .from("reviews")
      .select(
        "id, customer_name, rating, text, photo_url, date, approved, featured"
      )
      .eq("approved", true)
      .order("date", { ascending: false }),

    supabaseAdmin
      .from("settings")
      .select("data")
      .eq("id", "site")
      .maybeSingle(),
  ]);

  if (productsResult.error) {
    console.error("Homepage products query failed:", productsResult.error);
  }

  if (heroPhotosResult.error) {
    console.error("Homepage hero photos query failed:", heroPhotosResult.error);
  }

  if (galleryPhotosResult.error) {
    console.error(
      "Homepage gallery photos query failed:",
      galleryPhotosResult.error
    );
  }

  if (reviewsResult.error) {
    console.error("Homepage reviews query failed:", reviewsResult.error);
  }

  if (settingsResult.error) {
    console.error("Homepage settings query failed:", settingsResult.error);
  }

  const settings = mergeSettings(settingsResult.data?.data);

  const products = (productsResult.data ?? []).map(mapProduct);
  const heroPhotos = (heroPhotosResult.data ?? []).map(mapHeroPhoto);
  const galleryPhotos = (galleryPhotosResult.data ?? []).map(mapGalleryPhoto);
  const reviews = (reviewsResult.data ?? []).map(mapReview);

  if (settings.maintenanceMode) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="font-display text-5xl md:text-6xl text-chocolate">
            {settings.business.name}
          </div>

          <div className="mt-3 eyebrow">Be right back</div>

          <p className="mt-8 text-chocolate/70 font-light leading-relaxed">
            We&apos;re tending to the kitchen. Please return in a moment.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-cream">
      {settings.announcement.enabled &&
        settings.announcement.text.trim() && (
          <AnnouncementBar text={settings.announcement.text} />
        )}

      <Header brand={settings.business.name} />

      <Hero
        hero={settings.hero}
        photos={heroPhotos}
      />

      <About about={settings.about} />

      <Products products={products} />

      <Gallery
        photos={galleryPhotos}
        gallery={settings.gallery}
      />

      <Reviews reviews={reviews} />

      <Contact
        settings={settings}
        products={products}
      />

      <Newsletter />

      <Footer settings={settings} />
    </main>
  );
}