"use client";

import { useState } from "react";
import { Card, Field, ImagePicker, SaveBar, Toggle } from "../ui";
import type { Settings } from "@/lib/types";

export default function SettingsForm({
  seo,
  legal,
  maintenanceMode,
}: {
  seo: Settings["seo"];
  legal: Settings["legal"];
  maintenanceMode: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = new FormData(e.currentTarget);
    const payload: Partial<Settings> = {
      seo: {
        title: String(form.get("seoTitle") || ""),
        description: String(form.get("seoDesc") || ""),
        socialImage: String(form.get("socialImage") || ""),
        analyticsId: String(form.get("analyticsId") || ""),
        logoUrl: String(form.get("logoUrl") || ""),
        faviconUrl: String(form.get("faviconUrl") || ""),
      },
      legal: {
        privacyPolicy: String(form.get("privacy") || ""),
        terms: String(form.get("terms") || ""),
        cookieBannerText: String(form.get("cookie") || ""),
      },
      maintenanceMode: form.get("maintenance") === "true",
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
        <h2 className="font-display text-xl text-chocolate mb-5">SEO</h2>
        <div className="grid gap-6">
          <Field label="SEO title" name="seoTitle" defaultValue={seo.title} />
          <Field label="Meta description" name="seoDesc" defaultValue={seo.description} textarea rows={3} />
          <div className="grid md:grid-cols-2 gap-6">
            <ImagePicker name="socialImage" current={seo.socialImage} label="Social Preview Image" />
            <Field label="Google Analytics ID" name="analyticsId" defaultValue={seo.analyticsId} placeholder="G-XXXXXX" />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-xl text-chocolate mb-5">Branding Assets</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <ImagePicker name="logoUrl" current={seo.logoUrl} label="Logo" />
          <ImagePicker name="faviconUrl" current={seo.faviconUrl} label="Favicon" hint="Use a small square image." />
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-xl text-chocolate mb-5">Legal</h2>
        <div className="grid gap-6">
          <Field label="Privacy policy" name="privacy" defaultValue={legal.privacyPolicy} textarea rows={6} />
          <Field label="Terms & conditions" name="terms" defaultValue={legal.terms} textarea rows={6} />
          <Field label="Cookie banner text" name="cookie" defaultValue={legal.cookieBannerText} textarea rows={2} />
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-xl text-chocolate mb-5">Mode</h2>
        <Toggle
          label="Maintenance mode"
          name="maintenance"
          defaultChecked={maintenanceMode}
          hint="When enabled, visitors see a 'be right back' page. Admin remains accessible."
        />
      </Card>

      <SaveBar busy={busy} msg={msg} />
    </form>
  );
}
