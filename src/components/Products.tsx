"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";

function availabilityLabel(a: Product["availability"]) {
  switch (a) {
    case "sold-out":
      return { text: "Sold Out", cls: "bg-chocolate/80 text-cream" };
    case "coming-soon":
      return { text: "Coming Soon", cls: "bg-gold text-soft-black" };
    default:
      return { text: "Available", cls: "bg-cream text-chocolate border border-chocolate/15" };
  }
}

export default function Products({ products }: { products: Product[] }) {
  const sorted = [...products].sort((a, b) => a.order - b.order);
  const [active, setActive] = useState<Product | null>(null);

  return (
    <section id="flavors" className="relative py-28 md:py-36 bg-sand">
      <div className="container-luxe">
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-6">
            <span className="gold-divider" />
            <span className="eyebrow">The Menu</span>
            <span className="gold-divider" />
          </div>
          <h2 className="font-display font-light text-4xl md:text-5xl lg:text-6xl text-chocolate text-balance max-w-3xl">
            Six flavors. All organic.
            <span className="italic font-light"> All worth slowing down for.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {sorted.map((p) => {
            const a = availabilityLabel(p.availability);
            return (
              <article
                key={p.id}
                className="luxe-card overflow-hidden group hover:-translate-y-1 hover:shadow-[0_50px_100px_-50px_rgba(61,40,23,0.5)]"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 placeholder-art" />
                  )}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {p.featured && (
                      <span className="bg-gold text-soft-black text-[10px] uppercase tracking-widest-2 px-3 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                    <span
                      className={`text-[10px] uppercase tracking-widest-2 px-3 py-1 rounded-full ${a.cls}`}
                    >
                      {a.text}
                    </span>
                  </div>
                </div>
                <div className="p-7 md:p-8">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-2xl md:text-[28px] text-chocolate leading-tight">
                      {p.name}
                    </h3>
                    <div className="font-serif text-lg text-gold-dark">{p.price}</div>
                  </div>
                  <p className="mt-3 text-chocolate/70 text-[14px] leading-relaxed font-light">
                    {p.shortDescription}
                  </p>
                  <button
                    onClick={() => setActive(p)}
                    className="mt-6 text-[11px] uppercase tracking-widest-2 text-chocolate/70 hover:text-gold-dark transition-colors inline-flex items-center gap-2"
                  >
                    Details
                    <span aria-hidden>→</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {active && <ProductModal product={active} onClose={() => setActive(null)} />}
    </section>
  );
}

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-soft-black/60 backdrop-blur-sm" />
      <div
        className="relative max-w-3xl w-full bg-cream rounded-3xl overflow-hidden grid md:grid-cols-2 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[4/5] md:aspect-auto">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 placeholder-art" />
          )}
        </div>
        <div className="p-8 md:p-10 overflow-y-auto max-h-[80vh]">
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-cream/90 hover:bg-cream text-chocolate flex items-center justify-center text-xl"
          >
            ×
          </button>
          <div className="eyebrow">Flavor</div>
          <h3 className="font-display text-3xl md:text-4xl text-chocolate mt-2">
            {product.name}
          </h3>
          <div className="mt-2 text-gold-dark font-serif">{product.price}</div>
          <p className="mt-5 text-chocolate/80 leading-relaxed font-light">
            {product.fullDescription}
          </p>
          <div className="mt-7">
            <div className="text-[10px] uppercase tracking-widest-2 text-chocolate/60 mb-2">
              Ingredients
            </div>
            <p className="text-sm text-chocolate/75 font-light leading-relaxed">
              {product.ingredients}
            </p>
          </div>
          <div className="mt-6">
            <div className="text-[10px] uppercase tracking-widest-2 text-chocolate/60 mb-2">
              Allergens
            </div>
            <p className="text-sm text-chocolate/75 font-light">{product.allergens}</p>
          </div>
          <a
            href={`#contact`}
            onClick={onClose}
            className="btn-primary mt-8"
          >
            Inquire
          </a>
        </div>
      </div>
    </div>
  );
}
