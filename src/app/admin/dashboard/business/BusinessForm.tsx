"use client";

import { useState } from "react";
import { Card, Field, Toggle, SaveBar } from "../ui";
import type { Settings } from "@/lib/types";

export default function BusinessForm({
  business,
  announcement,
  footer,
}: {
  business: Settings["business"];
  announcement: Settings["announcement"];
  footer: Settings["footer"];
}) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = new FormData(e.currentTarget);
    const payload: Partial<Settings> = {
      business: {
        name: String(form.get("name") || ""),
        tagline: String(form.get("tagline") || ""),
        phone: String(form.get("phone") || ""),
        email: String(form.get("email") || ""),
        address: String(form.get("address") || ""),
        hours: String(form.get("hours") || ""),
        socialInstagram: String(form.get("socialInstagram") || ""),
        socialTiktok: String(form.get("socialTiktok") || ""),
        socialFacebook: String(form.get("socialFacebook") || ""),
      },
      announcement: {
        enabled: form.get("annEnabled") === "true",
        text: String(form.get("annText") || ""),
      },
      footer: {
        copyright: String(form.get("copyright") || ""),
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
    <form onSubmit={onSubmit} className="grid gap-6">
      <Card>
        <h2 className="font-display text-xl text-chocolate mb-5">Brand</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Field label="Business name" name="name" defaultValue={business.name} required />
          <Field label="Tagline" name="tagline" defaultValue={business.tagline} />
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-xl text-chocolate mb-5">Contact</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Field label="Phone" name="phone" defaultValue={business.phone} />
          <Field label="Email" name="email" type="email" defaultValue={business.email} />
          <Field label="Address" name="address" defaultValue={business.address} />
          <Field label="Hours" name="hours" defaultValue={business.hours} />
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-xl text-chocolate mb-5">Social</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Field label="Instagram URL" name="socialInstagram" defaultValue={business.socialInstagram} />
          <Field label="TikTok URL" name="socialTiktok" defaultValue={business.socialTiktok} />
          <Field label="Facebook URL" name="socialFacebook" defaultValue={business.socialFacebook} />
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-xl text-chocolate mb-5">Announcement Bar</h2>
        <div className="grid md:grid-cols-3 gap-6 items-start">
          <Toggle label="Show announcement bar" name="annEnabled" defaultChecked={announcement.enabled} />
          <div className="md:col-span-2">
            <Field label="Announcement text" name="annText" defaultValue={announcement.text} textarea rows={2} />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-xl text-chocolate mb-5">Footer</h2>
        <Field label="Copyright text" name="copyright" defaultValue={footer.copyright} />
      </Card>

      <SaveBar busy={busy} msg={msg} />
    </form>
  );
}
