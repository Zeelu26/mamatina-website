import { supabaseAdmin } from "@/lib/supabase/admin";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Settings } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PrivacyPage() {
  const { data: settingsRow, error } = await supabaseAdmin
    .from("settings")
    .select("data")
    .eq("id", "site")
    .maybeSingle();

  if (error) {
    console.error("Failed to load privacy settings:", error);
  }

  const settings = settingsRow?.data as Settings | undefined;

  if (!settings) {
    return (
      <main className="bg-cream min-h-screen">
        <article className="container-luxe pt-40 pb-28 max-w-3xl">
          <div className="eyebrow">Privacy</div>
          <h1 className="mt-2 font-display font-light text-4xl md:text-5xl">
            Privacy Policy
          </h1>
          <div className="gold-line my-8" />
          <p className="text-chocolate/75 leading-loose font-light">
            Privacy policy information is currently unavailable.
          </p>
        </article>
      </main>
    );
  }

  return (
    <main className="bg-cream min-h-screen">
      <Header brand={settings.business.name} />

      <article className="container-luxe pt-40 pb-28 max-w-3xl">
        <div className="eyebrow">Privacy</div>

        <h1 className="mt-2 font-display font-light text-4xl md:text-5xl">
          Privacy Policy
        </h1>

        <div className="gold-line my-8" />

        <div className="whitespace-pre-line text-chocolate/75 leading-loose font-light">
          {settings.legal.privacyPolicy}
        </div>
      </article>

      <Footer settings={settings} />
    </main>
  );
}