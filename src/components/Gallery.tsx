"use client";

import { useEffect, useMemo, useState } from "react";
import type { GalleryPhoto, Settings } from "@/lib/types";

export default function Gallery({
  photos,
  gallery,
}: {
  photos: GalleryPhoto[];
  gallery: Settings["gallery"];
}) {
  const ordered = useMemo(
    () => [...photos].sort((a, b) => a.order - b.order),
    [photos],
  );
  const [shuffleIndex, setShuffleIndex] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    if (!gallery.shuffleEnabled || ordered.length < 2) return;
    const ms = Math.max(2, gallery.shuffleSeconds) * 1000;
    const id = setInterval(
      () => setShuffleIndex((i) => (i + 1) % ordered.length),
      ms,
    );
    return () => clearInterval(id);
  }, [gallery.shuffleEnabled, gallery.shuffleSeconds, ordered.length]);

  return (
    <section id="gallery" className="relative py-28 md:py-36 bg-cream">
      <div className="container-luxe">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-4 mb-6">
            <span className="gold-divider" />
            <span className="eyebrow">Studio</span>
            <span className="gold-divider" />
          </div>
          <h2 className="font-display font-light text-4xl md:text-5xl lg:text-6xl text-chocolate text-balance max-w-3xl">
            Quiet moments from the kitchen.
          </h2>
        </div>

        {ordered.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`relative rounded-2xl overflow-hidden placeholder-art ${
                  i % 5 === 0 ? "aspect-[3/4] col-span-2 md:col-span-2" : "aspect-square"
                }`}
              />
            ))}
          </div>
        ) : gallery.shuffleEnabled ? (
          <div className="relative max-w-5xl mx-auto aspect-[16/10] rounded-3xl overflow-hidden shadow-[0_50px_120px_-50px_rgba(61,40,23,0.5)]">
            {ordered.map((p, i) => (
              <div
                key={p.id}
                className={`absolute inset-0 transition-opacity duration-[1600ms] ${
                  i === shuffleIndex ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  backgroundImage: `url(${p.url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            ))}
            {ordered[shuffleIndex]?.caption && (
              <div className="absolute bottom-6 left-6 right-6 text-cream font-serif italic">
                {ordered[shuffleIndex].caption}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[220px] gap-3 md:gap-5">
            {ordered.map((p, i) => {
              const big = i % 5 === 0;
              return (
                <button
                  key={p.id}
                  onClick={() => setLightbox(i)}
                  className={`group relative rounded-2xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-gold ${
                    big ? "row-span-2 col-span-2" : ""
                  }`}
                >
                  <img
                    src={p.url}
                    alt={p.alt || ""}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-soft-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {lightbox !== null && ordered[lightbox] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-soft-black/85 backdrop-blur-sm animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          <button
            aria-label="Close"
            className="absolute top-6 right-6 h-12 w-12 rounded-full bg-cream/15 hover:bg-cream/25 text-cream text-2xl"
            onClick={() => setLightbox(null)}
          >
            ×
          </button>
          <img
            src={ordered[lightbox].url}
            alt={ordered[lightbox].alt || ""}
            className="max-h-[85vh] max-w-[90vw] rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </section>
  );
}
