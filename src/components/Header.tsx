"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV = [
  { href: "#flavors", label: "Flavors" },
  { href: "#about", label: "About" },
  { href: "#gallery", label: "Gallery" },
  { href: "#reviews", label: "Reviews" },
  { href: "#contact", label: "Contact" },
];

export default function Header({ brand }: { brand: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-cream/85 backdrop-blur-md border-b border-beige/60 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container-luxe flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-2xl md:text-[28px] tracking-tight text-chocolate"
        >
          <span className="font-medium">{brand}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-xs uppercase tracking-widest-2 text-chocolate/75 hover:text-chocolate transition-colors"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a href="#contact" className="btn-primary !py-2.5 !px-5 !text-[11px]">
            Order
          </a>
        </div>

        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden h-10 w-10 flex flex-col items-center justify-center gap-1.5"
        >
          <span
            className={`block h-px w-6 bg-chocolate transition-transform ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-px w-6 bg-chocolate transition-opacity ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-px w-6 bg-chocolate transition-transform ${
              open ? "-translate-y-[5px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-500 ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="container-luxe py-6 flex flex-col gap-5 bg-cream/95 backdrop-blur border-t border-beige/60">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="text-sm uppercase tracking-widest-2 text-chocolate/80"
            >
              {n.label}
            </a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)} className="btn-primary self-start">
            Order
          </a>
        </div>
      </div>
    </header>
  );
}
