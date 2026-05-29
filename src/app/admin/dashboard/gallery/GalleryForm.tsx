"use client";

import { useState } from "react";
import { Card, Field, Toggle, SaveBar } from "../ui";
import type { Settings } from "@/lib/types";

export default function GalleryForm({ gallery }: { gallery: Settings["gallery"] }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      gallery: {
        shuffleEnabled: form.get("shuffleEnabled") === "true",
        shuffleSeconds: Number(form.get("shuffleSeconds") || 7),
      },
    };
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setMsg(res.ok ? "Saved." : "Save failed.");
    setBusy(false);
  }

  return (
    <Card>
      <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-6">
        <Toggle
          label="Auto-shuffle gallery"
          name="shuffleEnabled"
          defaultChecked={gallery.shuffleEnabled}
          hint="Show photos as a single cross-fading feature instead of a grid."
        />
        <Field
          label="Shuffle interval (seconds)"
          name="shuffleSeconds"
          type="number"
          defaultValue={gallery.shuffleSeconds}
        />
        <div className="md:col-span-2">
          <SaveBar busy={busy} msg={msg} />
        </div>
      </form>
    </Card>
  );
}
