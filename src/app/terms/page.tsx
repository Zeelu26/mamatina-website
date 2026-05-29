import { readDB } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function TermsPage() {
  const db = await readDB();
  return (
    <main className="bg-cream min-h-screen">
      <Header brand={db.settings.business.name} />
      <article className="container-luxe pt-40 pb-28 max-w-3xl">
        <div className="eyebrow">Terms</div>
        <h1 className="mt-2 font-display font-light text-4xl md:text-5xl">
          Terms &amp; Conditions
        </h1>
        <div className="gold-line my-8" />
        <div className="whitespace-pre-line text-chocolate/75 leading-loose font-light">
          {db.settings.legal.terms}
        </div>
      </article>
      <Footer settings={db.settings} />
    </main>
  );
}
