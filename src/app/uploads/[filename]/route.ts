import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const UPLOADS_DIR =
  process.env.UPLOADS_DIR || path.join(process.cwd(), "public", "uploads");

const MIME: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".avif": "image/avif",
  ".gif": "image/gif",
};

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  const safe = path.basename(filename);
  if (safe !== filename || safe.startsWith(".")) {
    return new NextResponse("Not found", { status: 404 });
  }
  const target = path.join(UPLOADS_DIR, safe);
  try {
    const data = await fs.readFile(target);
    const ext = path.extname(safe).toLowerCase();
    return new NextResponse(data, {
      headers: {
        "Content-Type": MIME[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
