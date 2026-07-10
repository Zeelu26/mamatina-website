import { requireAdmin } from "@/lib/api";
import { supabaseAdmin } from "@/lib/supabase/admin";

function csvEscape(value: unknown): string {
  const text = value == null ? "" : String(value);

  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

export async function GET() {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  const { data: rows, error } = await supabaseAdmin
    .from("subscribers")
    .select("email, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to export subscribers:", error);

    return new Response("Failed to export subscribers", {
      status: 500,
    });
  }

  const headers = ["Email", "Subscribed At"];

  const csvRows = (rows ?? []).map((subscriber) =>
    [
      subscriber.email,
      new Date(subscriber.created_at).toLocaleString(),
    ]
      .map(csvEscape)
      .join(",")
  );

  const csv = [headers.join(","), ...csvRows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="subscribers-${Date.now()}.csv"`,
    },
  });
}