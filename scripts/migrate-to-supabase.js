const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const dbPath = path.join(process.cwd(), "data", "db.json");
const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));

async function upsert(table, rows) {
  if (!rows || rows.length === 0) return;
  const { error } = await supabase.from(table).upsert(rows);
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`Imported ${rows.length} rows into ${table}`);
}

async function main() {
  await upsert("products", db.products.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    short_description: p.shortDescription,
    full_description: p.fullDescription,
    ingredients: p.ingredients,
    allergens: p.allergens,
    image_url: p.imageUrl,
    availability: p.availability,
    featured: p.featured,
    sort_order: p.order,
    created_at: p.createdAt
  })));

  await upsert("hero_photos", db.heroPhotos.map(p => ({
    id: p.id,
    url: p.url,
    alt: p.alt,
    sort_order: p.order
  })));

  await upsert("gallery_photos", db.galleryPhotos.map(p => ({
    id: p.id,
    url: p.url,
    alt: p.alt,
    sort_order: p.order
  })));

  await upsert("reviews", db.reviews.map(r => ({
    id: r.id,
    customer_name: r.customerName,
    rating: r.rating,
    text: r.text,
    date: r.date,
    approved: r.approved,
    featured: r.featured
  })));

  await supabase.from("settings").upsert({
    id: "site",
    data: db.settings
  });

  console.log("Settings imported");
  console.log("Migration complete");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});