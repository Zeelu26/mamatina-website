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

function mapProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    shortDescription: row.short_description,
    fullDescription: row.full_description,
    ingredients: row.ingredients,
    allergens: row.allergens,
    imageUrl: row.image_url,
    availability: row.availability,
    featured: row.featured,
    order: row.sort_order,
    createdAt: row.created_at,
  };
}

function mapHeroPhoto(row: any): HeroPhoto {
  return {
    id: row.id,
    url: row.url,
    alt: row.alt,
    order: row.sort_order,
  };
}

function mapGalleryPhoto(row: any): GalleryPhoto {
  return {
    id: row.id,
    url: row.url,
    alt: row.alt,
    order: row.sort_order,
  };
}

function mapReview(row: any): Review {
  return {
    id: row.id,
    customerName: row.customer_name,
    rating: row.rating,
    text: row.text,
    date: row.date,
    approved: row.approved,
    featured: row.featured,
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
      .select("*")
      .order("sort_order", { ascending: true }),

    supabaseAdmin
      .from("hero_photos")
      .select("*")
      .order("sort_order", { ascending: true }),

    supabaseAdmin
      .from("gallery_photos")
      .select("*")
      .order("sort_order", { ascending: true }),

    supabaseAdmin
      .from("reviews")
      .select("*")
      .eq("approved", true)
      .order("date", { ascending: false }),

    supabaseAdmin
      .from("settings")
      .select("data")
      .eq("id", "site")
      .single(),
  ]);

  const firstError =
    productsResult.error ||
    heroPhotosResult.error ||
    galleryPhotosResult.error ||
    reviewsResult.error ||
    settingsResult.error;

  if (firstError) {
    console.error("Failed to load homepage data:", firstError);

    throw new Error("Failed to load website data");
  }

  const settings = settingsResult.data.data as Settings;

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
      {settings.announcement.enabled && (
        <AnnouncementBar text={settings.announcement.text} />
      )}

      <Header brand={settings.business.name} />
      <Hero hero={settings.hero} photos={heroPhotos} />
      <About about={settings.about} />
      <Products products={products} />
      <Gallery photos={galleryPhotos} gallery={settings.gallery} />
      <Reviews reviews={reviews} />
      <Contact settings={settings} products={products} />
      <Newsletter />
      <Footer settings={settings} />
    </main>
  );
}