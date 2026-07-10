const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL in .env.local");
}

if (!serviceRoleKey) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in .env.local");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const dbPath = path.join(process.cwd(), "data", "db.json");

if (!fs.existsSync(dbPath)) {
  throw new Error(`Could not find database file at: ${dbPath}`);
}

const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));

async function upsert(table, rows, options = {}) {
  if (!Array.isArray(rows) || rows.length === 0) {
    console.log(`Skipped ${table}: no rows`);
    return;
  }

  const { error } = await supabase
    .from(table)
    .upsert(rows, options);

  if (error) {
    throw new Error(`${table}: ${error.message}`);
  }

  console.log(`Imported ${rows.length} rows into ${table}`);
}

async function migrateProducts() {
  const rows = (db.products ?? []).map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    short_description: product.shortDescription,
    full_description: product.fullDescription,
    ingredients: product.ingredients,
    allergens: product.allergens,
    image_url: product.imageUrl,
    availability: product.availability,
    featured: product.featured,
    sort_order: product.order,
    created_at: product.createdAt,
  }));

  await upsert("products", rows, {
    onConflict: "id",
  });
}

async function migrateHeroPhotos() {
  const rows = (db.heroPhotos ?? []).map((photo) => ({
    id: photo.id,
    url: photo.url,
    alt: photo.alt,
    sort_order: photo.order,
  }));

  await upsert("hero_photos", rows, {
    onConflict: "id",
  });
}

async function migrateGalleryPhotos() {
  const rows = (db.galleryPhotos ?? []).map((photo) => ({
    id: photo.id,
    url: photo.url,
    alt: photo.alt,
    sort_order: photo.order,
  }));

  await upsert("gallery_photos", rows, {
    onConflict: "id",
  });
}

async function migrateReviews() {
  const rows = (db.reviews ?? []).map((review) => ({
    id: review.id,
    customer_name: review.customerName,
    rating: review.rating,
    text: review.text,
    photo_url: review.photoUrl ?? null,
    date: review.date,
    approved: review.approved,
    featured: review.featured,
  }));

  await upsert("reviews", rows, {
    onConflict: "id",
  });
}

async function migrateMessages() {
  const rows = (db.messages ?? []).map((message) => ({
    id: message.id,
    name: message.name,
    email: message.email,
    phone: message.phone,
    message: message.message,
    product_interest: message.productInterest ?? null,
    quantity: message.quantity ?? null,
    event_date: message.eventDate ?? null,
    file_url: message.fileUrl ?? null,
    read: message.read,
    created_at: message.createdAt,
  }));

  await upsert("messages", rows, {
    onConflict: "id",
  });
}

async function migrateSubscribers() {
  const rows = (db.subscribers ?? []).map((subscriber) => ({
    id: subscriber.id,
    email: subscriber.email.toLowerCase(),
    created_at: subscriber.createdAt,
  }));

  await upsert("subscribers", rows, {
    onConflict: "id",
  });
}

async function migrateAdmins() {
  const rows = (db.admins ?? []).map((admin) => ({
    id: admin.id,
    email: admin.email.toLowerCase(),
    password_hash: admin.passwordHash,
    created_at: admin.createdAt,
  }));

  await upsert("admins", rows, {
    onConflict: "id",
  });
}

async function migrateSettings() {
  const { error } = await supabase
    .from("settings")
    .upsert(
      {
        id: "site",
        data: db.settings,
      },
      {
        onConflict: "id",
      }
    );

  if (error) {
    throw new Error(`settings: ${error.message}`);
  }

  console.log("Settings imported");
}

async function main() {
  console.log("Starting Supabase migration...");

  await migrateProducts();
  await migrateHeroPhotos();
  await migrateGalleryPhotos();
  await migrateReviews();
  await migrateMessages();
  await migrateSubscribers();
  await migrateAdmins();
  await migrateSettings();

  console.log("Migration complete");
}

main().catch((error) => {
  console.error("Migration failed:");
  console.error(error);
  process.exit(1);
});