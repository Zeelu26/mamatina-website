import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { v4 as uuid } from "uuid";

const UPLOADS_DIR =
  process.env.UPLOADS_DIR || path.join(process.cwd(), "public", "uploads");

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export async function saveImage(file: File): Promise<{ url: string; filename: string }> {
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error("Only JPG, PNG, WebP, or AVIF images are allowed.");
  }
  const buf = Buffer.from(await file.arrayBuffer());

  if (buf.byteLength > 8 * 1024 * 1024) {
    throw new Error("Image must be 8 MB or smaller.");
  }

  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  const filename = `${uuid()}.webp`;
  const target = path.join(UPLOADS_DIR, filename);

  await sharp(buf)
    .rotate()
    .resize({ width: 2200, height: 2200, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(target);

  return { url: `/uploads/${filename}`, filename };
}

export async function deleteImage(url: string): Promise<void> {
  if (!url.startsWith("/uploads/")) return;
  const filename = path.basename(url);
  const target = path.join(UPLOADS_DIR, filename);
  try {
    await fs.unlink(target);
  } catch {
    // ignore missing
  }
}
