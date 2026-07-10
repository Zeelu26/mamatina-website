import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api";
import { saveImage } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "No image file was provided.",
        },
        {
          status: 400,
        },
      );
    }

    const image = await saveImage(file);

    return NextResponse.json(
      {
        ok: true,
        url: image.url,
        filename: image.filename,
        path: image.path,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Upload route failed:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Image upload failed.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      },
    );
  }
}