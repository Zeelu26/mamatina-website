import "server-only";
import sharp from "sharp";
import { v4 as uuid } from "uuid";
import { supabaseAdmin } from "@/lib/supabase/admin";

const BUCKET_NAME = "website-images";
const MAX_FILE_SIZE = 8 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export type SavedImage = {
  url: string;
  filename: string;
  path: string;
};

/**
 * Validates, optimizes, and uploads an image to Supabase Storage.
 */
export async function saveImage(file: File): Promise<SavedImage> {
  if (!(file instanceof File)) {
    throw new Error("A valid image file is required.");
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error(
      "Only JPG, PNG, WebP, or AVIF images are allowed.",
    );
  }

  if (file.size <= 0) {
    throw new Error("The uploaded image is empty.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Image must be 8 MB or smaller.");
  }

  const inputBuffer = Buffer.from(await file.arrayBuffer());

  let optimizedBuffer: Buffer;

  try {
    optimizedBuffer = await sharp(inputBuffer)
      .rotate()
      .resize({
        width: 2200,
        height: 2200,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({
        quality: 82,
      })
      .toBuffer();
  } catch (error) {
    console.error("Image processing failed:", error);
    throw new Error("The uploaded file could not be processed as an image.");
  }

  const filename = `${uuid()}.webp`;

  // Keeping uploads in a folder makes the bucket easier to organize.
  const storagePath = `uploads/${filename}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .upload(storagePath, optimizedBuffer, {
      contentType: "image/webp",
      cacheControl: "31536000",
      upsert: false,
    });

  if (uploadError) {
    console.error("Supabase image upload failed:", uploadError);

    throw new Error(
      `Image upload failed: ${uploadError.message}`,
    );
  }

  const { data } = supabaseAdmin.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storagePath);

  if (!data.publicUrl) {
    // Clean up the uploaded object if URL generation unexpectedly fails.
    await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .remove([storagePath]);

    throw new Error("Could not generate the uploaded image URL.");
  }

  return {
    url: data.publicUrl,
    filename,
    path: storagePath,
  };
}

/**
 * Deletes an image from Supabase Storage.
 *
 * This safely ignores old local image paths such as:
 * /uploads/example.webp
 * /images/hero-1.svg
 */
export async function deleteImage(url: string): Promise<void> {
  const storagePath = getStoragePathFromUrl(url);

  if (!storagePath) {
    return;
  }

  const { error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .remove([storagePath]);

  if (error) {
    console.error("Supabase image deletion failed:", {
      url,
      storagePath,
      error,
    });

    throw new Error(`Failed to delete image: ${error.message}`);
  }
}

/**
 * Converts a Supabase public URL into its object path.
 *
 * Example:
 * https://project.supabase.co/storage/v1/object/public/
 * website-images/uploads/file.webp
 *
 * becomes:
 * uploads/file.webp
 */
function getStoragePathFromUrl(url: string): string | null {
  if (!url || typeof url !== "string") {
    return null;
  }

  const marker = `/storage/v1/object/public/${BUCKET_NAME}/`;
  const markerIndex = url.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  const encodedPath = url.slice(markerIndex + marker.length);

  if (!encodedPath) {
    return null;
  }

  try {
    return decodeURIComponent(encodedPath);
  } catch {
    return encodedPath;
  }
}