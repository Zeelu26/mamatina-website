"use client";

import { useEffect, useMemo, useState } from "react";
import type { HeroPhoto, Settings } from "@/lib/types";

export default function Hero({
  hero,
  photos,
}: {
  hero: Settings["hero"];
  photos: HeroPhoto[];
}) {
  const ordered = useMemo(
    () => [...photos].sort((a, b) => a.order - b.order),
    [photos],
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!hero.shuffleEnabled || ordered.length < 2) return;
    const ms = Math.max(2, hero.shuffleSeconds) * 1000;
    const id = setInterval(() => setIndex((i) => (i + 1) % ordered.length), ms);
    return () => clearInterval(id);
  }, [hero.shuffleEnabled, hero.shuffleSeconds, ordered.length]);

  const headlineLines = hero.headline.split("\n");

  return (
    <section className="relative min-h-[100svh] flex items-end overflow-hidden bg-cream pt-28 md:pt-32">
      <div className="absolute inset-0">
        {ordered.length === 0 ? (
          <div className="absolute inset-0 placeholder-art" />
        ) : (
          ordered.map((p, i) => (
            <div
              key={p.id}
              className={`absolute inset-0 transition-opacity duration-[1800ms] ease-out ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url(${p.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              aria-hidden={i !== index}
            />
          ))
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/55 to-cream/10" />
        <div className="absolute inset-0 grain" />
      </div>

      <div className="container-luxe relative z-10 pb-20 md:pb-28">
        <div className="max-w-3xl">
          <div className="flex items-center gap-4 mb-8">
            <span className="gold-divider" />
            <span className="eyebrow">All Organic · Hand Crafted</span>
          </div>

          <h1 className="font-display font-light text-5xl sm:text-6xl md:text-7xl lg:text-[88px] leading-[1.02] tracking-tight text-chocolate text-balance">
            {headlineLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p className="mt-7 max-w-xl text-base md:text-lg text-chocolate/75 font-light leading-relaxed">
            {hero.subheading}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            {hero.primaryButtonText && (
              <a href={hero.primaryButtonLink || "#flavors"} className="btn-primary">
                {hero.primaryButtonText}
              </a>
            )}
            {hero.secondaryButtonText && (
              <a href={hero.secondaryButtonLink || "#contact"} className="btn-secondary">
                {hero.secondaryButtonText}
              </a>
            )}
          </div>

          {ordered.length > 1 && (
            <div className="mt-14 flex items-center gap-2">
              {ordered.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setIndex(i)}
                  aria-label={`Show photo ${i + 1}`}
                  className={`h-[3px] transition-all duration-500 ${
                    i === index ? "w-10 bg-chocolate" : "w-5 bg-chocolate/25"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-chocolate/50">
        <span className="text-[10px] uppercase tracking-widest-2">Scroll</span>
        <div className="h-10 w-px bg-chocolate/30 animate-pulse" />
      </div>
    </section>
  );
}
