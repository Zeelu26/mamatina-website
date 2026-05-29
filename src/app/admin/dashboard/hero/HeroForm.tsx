"use client";

import { useState } from "react";
import { Card, Field, Toggle, SaveBar } from "../ui";
import type { Settings } from "@/lib/types";

export default function HeroForm({ hero }: { hero: Settings["hero"] }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const form = new FormData(e.currentTarget);
    const payload: Settings["hero"] = {
      headline: String(form.get("headline") || ""),
      subheading: String(form.get("subheading") || ""),
      primaryButtonText: String(form.get("primaryButtonText") || ""),
      primaryButtonLink: String(form.get("primaryButtonLink") || ""),
      secondaryButtonText: String(form.get("secondaryButtonText") || ""),
      secondaryButtonLink: String(form.get("secondaryButtonLink") || ""),
      shuffleEnabled: form.get("shuffleEnabled") === "true",
      shuffleSeconds: Number(form.get("shuffleSeconds") || 7),
    };
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hero: payload }),
    });
    if (res.ok) setMsg("Saved.");
    else setMsg("Save failed.");
    setBusy(false);
  }

  return (
    <Card>
      <form onSubmit={onSubmit} className="grid gap-6">
        <Field
          label="Headline"
          name="headline"
          defaultValue={hero.headline}
          textarea
          rows={3}
          hint="Use a new line to split across multiple display lines."
        />
        <Field
          label="Subheading"
          name="subheading"
          defaultValue={hero.subheading}
          textarea
          rows={3}
        />
        <div className="grid md:grid-cols-2 gap-6">
          <Field
            label="Primary Button Text"
            name="primaryButtonText"
            defaultValue={hero.primaryButtonText}
          />
          <Field
            label="Primary Button Link"
            name="primaryButtonLink"
            defaultValue={hero.primaryButtonLink}
            placeholder="#flavors"
          />
          <Field
            label="Secondary Button Text"
            name="secondaryButtonText"
            defaultValue={hero.secondaryButtonText}
          />
          <Field
            label="Secondary Button Link"
            name="secondaryButtonLink"
            defaultValue={hero.secondaryButtonLink}
            placeholder="#contact"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-6 pt-2">
          <Toggle
            label="Auto-shuffle hero photos"
            name="shuffleEnabled"
            defaultChecked={hero.shuffleEnabled}
            hint="Photos cross-fade automatically."
          />
          <Field
            label="Shuffle interval (seconds)"
            name="shuffleSeconds"
            defaultValue={hero.shuffleSeconds}
            type="number"
          />
        </div>
        <SaveBar busy={busy} msg={msg} />
      </form>
    </Card>
  );
}
