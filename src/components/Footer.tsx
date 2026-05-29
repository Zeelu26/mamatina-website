import type { Settings } from "@/lib/types";

export default function Footer({ settings }: { settings: Settings }) {
  const { business, footer } = settings;
  return (
    <footer className="bg-soft-black text-cream/80 relative overflow-hidden">
      <div className="absolute inset-0 grain" aria-hidden />
      <div className="container-luxe py-20 md:py-24 relative">
        <div className="grid md:grid-cols-4 gap-12 md:gap-10">
          <div className="md:col-span-2">
            <div className="font-serif text-3xl md:text-4xl text-cream mb-4">
              {business.name}
            </div>
            <p className="text-cream/60 max-w-sm leading-relaxed font-light">
              {settings.business.tagline}. All organic, all with love. Hand-crafted
              in small batches, the slow way.
            </p>
          </div>
          <div>
            <h4 className="text-cream text-sm uppercase tracking-widest-2 mb-5">
              Visit
            </h4>
            <ul className="space-y-2 text-cream/60 text-sm font-light">
              {business.address && <li>{business.address}</li>}
              <li>{business.hours}</li>
            </ul>
          </div>
          <div>
            <h4 className="text-cream text-sm uppercase tracking-widest-2 mb-5">
              Contact
            </h4>
            <ul className="space-y-2 text-cream/60 text-sm font-light">
              <li>
                <a
                  href={`tel:${business.phone.replace(/\s/g, "")}`}
                  className="hover:text-gold transition-colors"
                >
                  {business.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${business.email}`}
                  className="hover:text-gold transition-colors"
                >
                  {business.email}
                </a>
              </li>
            </ul>
            <div className="flex gap-4 mt-6">
              {business.socialInstagram && (
                <a
                  href={business.socialInstagram}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cream/60 hover:text-gold text-xs uppercase tracking-widest-2"
                >
                  Instagram
                </a>
              )}
              {business.socialTiktok && (
                <a
                  href={business.socialTiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cream/60 hover:text-gold text-xs uppercase tracking-widest-2"
                >
                  TikTok
                </a>
              )}
              {business.socialFacebook && (
                <a
                  href={business.socialFacebook}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cream/60 hover:text-gold text-xs uppercase tracking-widest-2"
                >
                  Facebook
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-cream/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-cream/40">
          <div>{footer.copyright}</div>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="hover:text-gold transition-colors">
              Privacy
            </a>
            <a href="/terms" className="hover:text-gold transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
