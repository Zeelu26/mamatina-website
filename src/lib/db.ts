import fs from "node:fs/promises";
import fssync from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import type { DB, Settings } from "./types";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

const DEFAULT_SETTINGS: Settings = {
  business: {
    name: "MaMaTina",
    tagline: "Gourmet Rice Pudding",
    phone: "+1 (201) 647-4223",
    email: "hello@mamatinaorp.com",
    address: "",
    hours: "Tuesday – Sunday · 10am – 7pm",
    socialInstagram: "https://instagram.com/mamatina",
    socialTiktok: "https://tiktok.com/@mamatina",
    socialFacebook: "",
  },
  hero: {
    headline: "Gourmet Rice Pudding,\nCrafted with Love",
    subheading:
      "All organic. Small batch. Made by hand the way our grandmother taught us — slow simmered, never rushed, never compromised.",
    primaryButtonText: "View Flavors",
    primaryButtonLink: "#flavors",
    secondaryButtonText: "Order Now",
    secondaryButtonLink: "#contact",
    shuffleEnabled: true,
    shuffleSeconds: 7,
  },
  about: {
    eyebrow: "Our Story",
    title: "A spoonful of tradition,\na taste of home.",
    paragraph:
      "MaMaTina was born in a small kitchen where time was measured in stirs of a wooden spoon. Every jar of our rice pudding is hand-crafted in small batches using only organic milk, single-origin vanilla, and arborio rice slow-simmered until silky. No shortcuts. No additives. Just the unhurried recipes passed down through three generations — finished with love, and a kiss of warm spice.",
    imageUrl: "/images/about.svg",
  },
  gallery: {
    shuffleEnabled: false,
    shuffleSeconds: 7,
  },
  announcement: {
    enabled: true,
    text: "Now accepting catering orders for the holiday season — limited slots available.",
  },
  seo: {
    title: "MaMaTina · Gourmet Rice Pudding · All Organic, All With Love",
    description:
      "MaMaTina is a luxury small-batch rice pudding atelier. Organic, hand-crafted desserts made the slow way, for people who care about every spoon.",
    socialImage: "",
    analyticsId: "",
    logoUrl: "",
    faviconUrl: "",
  },
  legal: {
    privacyPolicy:
      "We collect only the information needed to fulfill your order and respond to your inquiries. We never sell your data. For questions about your information, contact us at the email or phone above.",
    terms:
      "All orders are made to order. Please review allergen information before purchasing. By placing an order you agree to receive transactional emails related to your purchase.",
    cookieBannerText:
      "We use a small number of cookies to make this site work beautifully. By browsing, you accept their use.",
  },
  maintenanceMode: false,
  footer: {
    copyright: "© MaMaTina. Crafted with love.",
  },
};

function emptyDB(): DB {
  return {
    heroPhotos: [],
    galleryPhotos: [],
    products: [],
    reviews: [],
    messages: [],
    subscribers: [],
    settings: DEFAULT_SETTINGS,
    admins: [],
  };
}

async function ensureFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DB_FILE);
  } catch {
    const fresh = emptyDB();
    await seedDefaults(fresh);
    await fs.writeFile(DB_FILE, JSON.stringify(fresh, null, 2), "utf8");
  }
}

async function seedDefaults(db: DB): Promise<void> {
  // Default admin: admin@mamatina.com / mamatina2026
  const passwordHash = await bcrypt.hash("mamatina2026", 10);
  db.admins.push({
    id: uuid(),
    email: "admin@mamatina.com",
    passwordHash,
    createdAt: new Date().toISOString(),
  });

  const now = new Date().toISOString();

  for (let i = 1; i <= 4; i++) {
    db.heroPhotos.push({
      id: uuid(),
      url: `/images/hero-${i}.svg`,
      alt: "MaMaTina rice pudding",
      order: i,
    });
  }

  for (let i = 1; i <= 8; i++) {
    db.galleryPhotos.push({
      id: uuid(),
      url: `/images/gallery-${i}.svg`,
      alt: "Studio moment",
      order: i,
    });
  }

  db.products.push(
    {
      id: uuid(),
      name: "Classic Vanilla Bean",
      price: "$9",
      shortDescription:
        "Madagascar vanilla, organic milk, arborio rice — silky, slow simmered, simply perfect.",
      fullDescription:
        "Our signature. Single-origin Madagascar vanilla bean folded into organic whole milk and slow-simmered arborio. Finished with a whisper of cinnamon and a touch of raw cane sugar. Served chilled or gently warmed.",
      ingredients:
        "Organic whole milk, organic arborio rice, raw cane sugar, Madagascar vanilla bean, organic cinnamon, sea salt.",
      allergens: "Contains milk.",
      imageUrl: "/images/flavor-vanilla.svg",
      availability: "available",
      featured: true,
      order: 1,
      createdAt: now,
    },
    {
      id: uuid(),
      name: "Salted Caramel & Brown Butter",
      price: "$11",
      shortDescription:
        "Deep amber caramel, brown butter, flaked sea salt — a small love letter in a jar.",
      fullDescription:
        "Slow-cooked amber caramel folded with browned French butter and finished with hand-flaked sea salt. Rich, layered, and just sweet enough.",
      ingredients:
        "Organic whole milk, organic arborio rice, organic cane sugar, French butter, Madagascar vanilla, sea salt.",
      allergens: "Contains milk.",
      imageUrl: "/images/flavor-caramel.svg",
      availability: "available",
      featured: true,
      order: 2,
      createdAt: now,
    },
    {
      id: uuid(),
      name: "Pistachio & Rose",
      price: "$12",
      shortDescription:
        "Sicilian pistachios, a breath of rosewater — quietly elegant.",
      fullDescription:
        "Stone-ground Sicilian pistachios and a delicate touch of Damascus rosewater. Topped with crushed pistachio and edible rose petals.",
      ingredients:
        "Organic whole milk, organic arborio rice, Sicilian pistachios, rosewater, cane sugar, sea salt.",
      allergens: "Contains milk, tree nuts (pistachio).",
      imageUrl: "/images/flavor-pistachio.svg",
      availability: "available",
      featured: false,
      order: 3,
      createdAt: now,
    },
    {
      id: uuid(),
      name: "Dark Chocolate & Espresso",
      price: "$11",
      shortDescription:
        "70% single-origin chocolate, slow-pulled espresso, the warmth of vanilla.",
      fullDescription:
        "Single-origin 70% dark chocolate melted slowly into our base, finished with espresso pulled in small batches. Deep, grown-up, and made for late evenings.",
      ingredients:
        "Organic whole milk, organic arborio rice, 70% dark chocolate, espresso, cane sugar, vanilla, sea salt.",
      allergens: "Contains milk, soy (chocolate).",
      imageUrl: "/images/flavor-chocolate.svg",
      availability: "available",
      featured: true,
      order: 4,
      createdAt: now,
    },
    {
      id: uuid(),
      name: "Honey, Fig & Saffron",
      price: "$13",
      shortDescription:
        "Wildflower honey, slow-poached figs, threads of Persian saffron.",
      fullDescription:
        "A seasonal jewel. Wildflower honey, slow-poached black mission figs, and the gentle perfume of Persian saffron. A small batch each Sunday.",
      ingredients:
        "Organic whole milk, organic arborio rice, wildflower honey, black mission figs, saffron, sea salt.",
      allergens: "Contains milk.",
      imageUrl: "/images/flavor-honey-fig.svg",
      availability: "coming-soon",
      featured: false,
      order: 5,
      createdAt: now,
    },
    {
      id: uuid(),
      name: "Cardamom & Toasted Coconut",
      price: "$11",
      shortDescription:
        "Green cardamom, toasted coconut shavings, a faint warmth of clove.",
      fullDescription:
        "Inspired by long evenings and warm spice. Green cardamom and toasted coconut folded gently with a whisper of clove.",
      ingredients:
        "Organic whole milk, organic arborio rice, green cardamom, coconut, cane sugar, clove, sea salt.",
      allergens: "Contains milk, tree nuts (coconut).",
      imageUrl: "/images/flavor-cardamom-coconut.svg",
      availability: "sold-out",
      featured: false,
      order: 6,
      createdAt: now,
    },
  );

  db.reviews.push(
    {
      id: uuid(),
      customerName: "Sofia R.",
      rating: 5,
      text: "I have never tasted anything like this. The vanilla bean is the dessert I serve when I want guests to fall quiet. Truly extraordinary.",
      date: now,
      approved: true,
      featured: true,
    },
    {
      id: uuid(),
      customerName: "James K.",
      rating: 5,
      text: "Bought a six-pack as a gift for my mother. She called me crying. That is the review.",
      date: now,
      approved: true,
      featured: true,
    },
    {
      id: uuid(),
      customerName: "Amara D.",
      rating: 5,
      text: "Pistachio and rose tastes like the best dream you forgot you had. We order monthly now.",
      date: now,
      approved: true,
      featured: false,
    },
    {
      id: uuid(),
      customerName: "Daniel P.",
      rating: 5,
      text: "Catered a dinner for twelve. Every single guest asked where it came from. The chocolate espresso is a religious experience.",
      date: now,
      approved: true,
      featured: true,
    },
  );
}

let writeLock: Promise<void> = Promise.resolve();

export async function readDB(): Promise<DB> {
  await ensureFile();
  const raw = await fs.readFile(DB_FILE, "utf8");
  const parsed = JSON.parse(raw) as DB;
  parsed.settings = { ...DEFAULT_SETTINGS, ...parsed.settings };
  return parsed;
}

export async function writeDB(db: DB): Promise<void> {
  const run = async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const tmp = DB_FILE + ".tmp";
    await fs.writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
    await fs.rename(tmp, DB_FILE);
  };
  writeLock = writeLock.then(run, run);
  return writeLock;
}

export async function updateDB(mutator: (db: DB) => void | Promise<void>): Promise<DB> {
  const db = await readDB();
  await mutator(db);
  await writeDB(db);
  return db;
}

export function dbFileExistsSync(): boolean {
  return fssync.existsSync(DB_FILE);
}

export { DEFAULT_SETTINGS };
