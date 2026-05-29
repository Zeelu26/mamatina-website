"use client";

import { useState } from "react";
import { Card, Field, SaveBar, ImagePicker } from "../ui";
import type { Settings } from "@/lib/types";

export default function AboutForm({ about }: { about: Settings["about"] }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = new FormData(e.currentTarget);
    const payload: Settings["about"] = {
      eyebrow: String(form.get("eyebrow") || ""),
      title: String(form.get("title") || ""),
      paragraph: String(form.get("paragraph") || ""),
      imageUrl: String(form.get("imageUrl") || ""),
    };
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ about: payload }),
    });
    setMsg(res.ok ? "Saved." : "Save failed.");
    setBusy(false);
  }

  return (
    <Card>
      <form onSubmit={onSubmit} className="grid gap-6">
        <Field label="Eyebrow" name="eyebrow" defaultValue={about.eyebrow} />
        <Field
          label="Title"
          name="title"
          defaultValue={about.title}
          textarea
          rows={2}
          hint="Use a new line to split the title."
        />
        <Field
          label="Paragraph"
          name="paragraph"
          defaultValue={about.paragraph}
          textarea
          rows={6}
        />
        <ImagePicker name="imageUrl" current={about.imageUrl} label="About Image" />
        <SaveBar busy={busy} msg={msg} />
      </form>
    </Card>
  );
}
