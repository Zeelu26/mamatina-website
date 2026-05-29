import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public", "images");

await fs.mkdir(OUT, { recursive: true });

// ─────────────────────────────────────────────────────────────
// Pudding-bowl SVG generator
// ─────────────────────────────────────────────────────────────
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function bowl({
  w = 1200,
  h = 1500,
  bgFrom = "#F2E9D8",
  bgTo = "#D4C4A8",
  rimFrom = "#FFFEFB",
  rimTo = "#E8DCC4",
  puddingFrom = "#FFFCF4",
  puddingTo = "#EFE3CA",
  garnish = ["#A8893F", "#5A3E26"], // cinnamon-ish
  garnishCount = 22,
  seed = 7,
  showSpoon = false,
  caption = "",
}) {
  const cx = w / 2;
  const cy = h * 0.5;
  const bowlR = Math.min(w, h) * 0.34;
  const puddingR = bowlR * 0.85;
  const rand = rng(seed);

  const dots = [];
  for (let i = 0; i < garnishCount; i++) {
    const angle = rand() * Math.PI * 2;
    const radius = Math.sqrt(rand()) * puddingR * 0.85;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius * 0.92;
    const r = 2 + rand() * 4;
    const c = garnish[Math.floor(rand() * garnish.length)];
    const op = 0.55 + rand() * 0.4;
    dots.push(
      `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${c}" opacity="${op.toFixed(2)}"/>`,
    );
  }

  const linenStrokes = [];
  for (let i = 0; i < 14; i++) {
    const y = h * 0.78 + i * (h * 0.02);
    const op = 0.04 + rand() * 0.05;
    linenStrokes.push(
      `<line x1="0" y1="${y.toFixed(1)}" x2="${w}" y2="${(y + 2).toFixed(1)}" stroke="#3D2817" stroke-width="1" opacity="${op.toFixed(2)}"/>`,
    );
  }

  const spoon = showSpoon
    ? `
    <g opacity="0.75" transform="translate(${(cx + bowlR * 0.6).toFixed(1)} ${(cy - bowlR * 0.35).toFixed(1)}) rotate(35)">
      <ellipse cx="0" cy="0" rx="38" ry="22" fill="#C9A961" opacity="0.85"/>
      <ellipse cx="0" cy="0" rx="30" ry="16" fill="#A8893F" opacity="0.7"/>
      <rect x="-6" y="20" width="12" height="160" rx="6" fill="#C9A961" opacity="0.9"/>
    </g>`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <radialGradient id="bg" cx="50%" cy="38%" r="80%">
      <stop offset="0%" stop-color="${bgFrom}"/>
      <stop offset="100%" stop-color="${bgTo}"/>
    </radialGradient>
    <radialGradient id="rim" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="${rimFrom}"/>
      <stop offset="100%" stop-color="${rimTo}"/>
    </radialGradient>
    <radialGradient id="pudding" cx="50%" cy="42%" r="60%">
      <stop offset="0%" stop-color="${puddingFrom}"/>
      <stop offset="100%" stop-color="${puddingTo}"/>
    </radialGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2"/>
    </filter>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="${seed}"/>
      <feColorMatrix values="0 0 0 0 0.2  0 0 0 0 0.15  0 0 0 0 0.1  0 0 0 0.08 0"/>
      <feComposite in2="SourceGraphic" operator="in"/>
    </filter>
  </defs>

  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  ${linenStrokes.join("\n  ")}

  <!-- table shadow under bowl -->
  <ellipse cx="${cx}" cy="${(cy + bowlR * 0.95).toFixed(1)}" rx="${(bowlR * 1.05).toFixed(1)}" ry="${(bowlR * 0.18).toFixed(1)}" fill="#3D2817" opacity="0.12" filter="url(#soft)"/>

  <!-- bowl outer rim -->
  <circle cx="${cx}" cy="${cy}" r="${(bowlR + 12).toFixed(1)}" fill="#FAF7F2" opacity="0.55"/>
  <circle cx="${cx}" cy="${cy}" r="${bowlR}" fill="url(#rim)"/>
  <circle cx="${cx}" cy="${cy}" r="${bowlR}" fill="none" stroke="#A8893F" stroke-width="1.5" opacity="0.18"/>

  <!-- pudding surface -->
  <circle cx="${cx}" cy="${cy}" r="${puddingR}" fill="url(#pudding)"/>
  <!-- subtle highlight -->
  <ellipse cx="${(cx - puddingR * 0.25).toFixed(1)}" cy="${(cy - puddingR * 0.25).toFixed(1)}" rx="${(puddingR * 0.55).toFixed(1)}" ry="${(puddingR * 0.35).toFixed(1)}" fill="#FFFFFE" opacity="0.35"/>

  <!-- garnish -->
  ${dots.join("\n  ")}

  ${spoon}

  <!-- grain overlay -->
  <rect width="${w}" height="${h}" filter="url(#grain)" opacity="0.5"/>

  ${caption ? `<text x="${cx}" y="${h - 60}" text-anchor="middle" font-family="Georgia, serif" font-size="${(w * 0.018).toFixed(0)}" fill="#3D2817" opacity="0.45" font-style="italic">${caption}</text>` : ""}
</svg>`;
}

// ─────────────────────────────────────────────────────────────
// Flavor presets — palettes match each flavor's character
// ─────────────────────────────────────────────────────────────
const flavors = [
  {
    name: "vanilla",
    puddingFrom: "#FFFCF4", puddingTo: "#F0E5CC",
    garnish: ["#A8893F", "#7B5E2A", "#3D2817"], // vanilla flecks + cinnamon
    seed: 11,
  },
  {
    name: "caramel",
    puddingFrom: "#EFD4A0", puddingTo: "#C28E48",
    bgFrom: "#EDDAB8", bgTo: "#C9A961",
    garnish: ["#3D2817", "#5A3E26", "#FFFEFB"], // sea salt flakes
    seed: 22,
  },
  {
    name: "pistachio",
    puddingFrom: "#E8E0BD", puddingTo: "#B8B07A",
    bgFrom: "#E5DEC1", bgTo: "#B8B07A",
    garnish: ["#5A6B2F", "#7A8B3F", "#C49A6C"], // pistachio + rose
    seed: 33,
  },
  {
    name: "chocolate",
    puddingFrom: "#7A4B2A", puddingTo: "#3D2817",
    bgFrom: "#E8DCC4", bgTo: "#A8893F",
    rimFrom: "#F2E4C6", rimTo: "#C9A961",
    garnish: ["#FFFEFB", "#C9A961", "#5A3E26"], // espresso beans + cream
    seed: 44,
  },
  {
    name: "honey-fig",
    puddingFrom: "#F2D88C", puddingTo: "#C9A961",
    bgFrom: "#EDDAB0", bgTo: "#C49A6C",
    garnish: ["#5A2E1B", "#8B3A1F", "#C9A961"], // figs + saffron
    seed: 55,
  },
  {
    name: "cardamom-coconut",
    puddingFrom: "#FBF5E4", puddingTo: "#E0CFA8",
    garnish: ["#7A5C2E", "#3D2817", "#FFFEFB"], // toasted coconut + cardamom
    seed: 66,
  },
];

// Product images — 4:5 portrait
for (const f of flavors) {
  const svg = bowl({
    w: 1200, h: 1500,
    ...f,
    garnishCount: 32,
    showSpoon: false,
  });
  await fs.writeFile(path.join(OUT, `flavor-${f.name}.svg`), svg, "utf8");
}

// Hero images — wide landscape
const heroVariants = [
  { ...flavors[0], showSpoon: true, garnishCount: 40, w: 2400, h: 1600 },
  { ...flavors[3], showSpoon: false, garnishCount: 50, w: 2400, h: 1600 },
  { ...flavors[2], showSpoon: true, garnishCount: 36, w: 2400, h: 1600 },
  { ...flavors[1], showSpoon: false, garnishCount: 45, w: 2400, h: 1600 },
];
for (let i = 0; i < heroVariants.length; i++) {
  await fs.writeFile(
    path.join(OUT, `hero-${i + 1}.svg`),
    bowl(heroVariants[i]),
    "utf8",
  );
}

// Gallery images — mixed
const gallery = [
  { ...flavors[0], w: 1400, h: 1400, garnishCount: 40, showSpoon: false },
  { ...flavors[2], w: 1400, h: 1750, garnishCount: 32, showSpoon: true },
  { ...flavors[4], w: 1400, h: 1400, garnishCount: 36, showSpoon: false },
  { ...flavors[3], w: 1400, h: 1400, garnishCount: 45, showSpoon: false },
  { ...flavors[1], w: 1400, h: 1400, garnishCount: 40, showSpoon: true },
  { ...flavors[5], w: 1400, h: 1750, garnishCount: 38, showSpoon: false },
  { ...flavors[0], w: 1400, h: 1400, garnishCount: 30, showSpoon: true, seed: 99 },
  { ...flavors[2], w: 1400, h: 1400, garnishCount: 34, showSpoon: false, seed: 101 },
];
for (let i = 0; i < gallery.length; i++) {
  await fs.writeFile(
    path.join(OUT, `gallery-${i + 1}.svg`),
    bowl(gallery[i]),
    "utf8",
  );
}

// About image — portrait, vanilla with spoon
await fs.writeFile(
  path.join(OUT, "about.svg"),
  bowl({ ...flavors[0], w: 1400, h: 1750, garnishCount: 38, showSpoon: true, seed: 17 }),
  "utf8",
);

console.log("Wrote placeholders to public/images/");
