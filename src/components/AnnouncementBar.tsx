"use client";

import { useEffect, useRef, useState } from "react";

export default function AnnouncementBar({ text }: { text: string }) {
  const [closed, setClosed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Publish the bar's real height as a CSS variable so the fixed header
  // can sit directly beneath it (works even when the text wraps).
  useEffect(() => {
    const root = document.documentElement;
    const el = ref.current;
    if (closed || !el) {
      root.style.setProperty("--ann-h", "0px");
      return;
    }
    const setH = () => root.style.setProperty("--ann-h", `${el.offsetHeight}px`);
    setH();
    const ro = new ResizeObserver(setH);
    ro.observe(el);
    window.addEventListener("resize", setH);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setH);
      root.style.setProperty("--ann-h", "0px");
    };
  }, [closed]);

  if (closed) return null;

  return (
    <div
      ref={ref}
      className="fixed top-0 inset-x-0 z-50 bg-chocolate text-cream text-[11px] md:text-xs tracking-widest-2 uppercase"
    >
      <div className="container-luxe relative py-2.5 flex items-center justify-center text-center">
        <span className="opacity-90 px-8">{text}</span>
        <button
          type="button"
          aria-label="Dismiss announcement"
          onClick={() => setClosed(true)}
          className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-full text-cream/70 hover:text-cream hover:bg-cream/10 transition text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}
