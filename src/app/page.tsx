import { readDB } from "@/lib/db";
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

export default async function Home() {
  const db = await readDB();

  if (db.settings.maintenanceMode) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="font-display text-5xl md:text-6xl text-chocolate">
            {db.settings.business.name}
          </div>
          <div className="mt-3 eyebrow">Be right back</div>
          <p className="mt-8 text-chocolate/70 font-light leading-relaxed">
            We're tending to the kitchen. Please return in a moment.
          </p>
        </div>
      </main>
    );
  }

  const visibleProducts = db.products;

  return (
    <main className="bg-cream">
      {db.settings.announcement.enabled && (
        <AnnouncementBar text={db.settings.announcement.text} />
      )}
      <Header brand={db.settings.business.name} />
      <Hero hero={db.settings.hero} photos={db.heroPhotos} />
      <About about={db.settings.about} />
      <Products products={visibleProducts} />
      <Gallery photos={db.galleryPhotos} gallery={db.settings.gallery} />
      <Reviews reviews={db.reviews} />
      <Contact settings={db.settings} products={visibleProducts} />
      <Newsletter />
      <Footer settings={db.settings} />
    </main>
  );
}
