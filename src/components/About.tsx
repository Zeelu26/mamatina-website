import type { Settings } from "@/lib/types";

export default function About({ about }: { about: Settings["about"] }) {
  return (
    <section id="about" className="relative py-28 md:py-40 bg-cream">
      <div className="container-luxe grid md:grid-cols-12 gap-12 md:gap-20 items-center">
        <div className="md:col-span-6 order-2 md:order-1">
          <div className="flex items-center gap-4 mb-6">
            <span className="gold-divider" />
            <span className="eyebrow">{about.eyebrow}</span>
          </div>
          <h2 className="font-display font-light text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-chocolate text-balance">
            {about.title.split("\n").map((l, i) => (
              <span key={i} className="block">
                {l}
              </span>
            ))}
          </h2>
          <div className="mt-6 h-px w-full bg-gradient-to-r from-gold/40 to-transparent" />
          <p className="mt-7 text-chocolate/75 leading-loose font-light max-w-xl text-[15px] md:text-base">
            {about.paragraph}
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
            <Stat label="Small Batch" value="100%" />
            <Stat label="Organic" value="Certified" />
            <Stat label="Generations" value="Three" />
          </div>
        </div>

        <div className="md:col-span-6 order-1 md:order-2">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_40px_100px_-40px_rgba(61,40,23,0.4)]">
            {about.imageUrl ? (
              <img
                src={about.imageUrl}
                alt="MaMaTina kitchen"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 placeholder-art" />
            )}
            <div className="absolute inset-0 grain" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-cream/90">
              <div className="font-serif italic text-base md:text-lg">
                Made the slow way.
              </div>
              <div className="text-[10px] uppercase tracking-widest-2 opacity-80">
                Est. by hand
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-2xl md:text-3xl text-chocolate">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-widest-2 text-chocolate/55">
        {label}
      </div>
    </div>
  );
}
