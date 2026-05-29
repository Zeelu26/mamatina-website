"use client";

import { useState } from "react";

export default function AnnouncementBar({ text }: { text: string }) {
  const [closed, setClosed] = useState(false);
  if (closed) return null;
  return (
    <div className="bg-chocolate text-cream text-[11px] md:text-xs tracking-widest-2 uppercase">
      <div className="container-luxe relative py-2.5 flex items-center justify-center text-center">
        <span className="opacity-90">{text}</span>
        <button
          aria-label="Dismiss announcement"
          onClick={() => setClosed(true)}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-cream/70 hover:text-cream"
        >
          ×
        </button>
      </div>
    </div>
  );
}
