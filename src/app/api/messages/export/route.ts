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
    .from("messages")
    .select(
      "name, email, phone, message, product_interest, quantity, event_date, read, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to export messages:", error);

    return new Response("Failed to export messages", {
      status: 500,
    });
  }

  const headers = [
    "Date",
    "Name",
    "Email",
    "Phone",
    "Flavor",
    "Quantity",
    "Event Date",
    "Read",
    "Message",
  ];

  const csvRows = (rows ?? []).map((message) =>
    [
      new Date(message.created_at).toLocaleString(),
      message.name,
      message.email,
      message.phone,
      message.product_interest ?? "",
      message.quantity ?? "",
      message.event_date ?? "",
      message.read ? "yes" : "no",
      message.message,
    ]
      .map(csvEscape)
      .join(",")
  );

  const csv = [headers.join(","), ...csvRows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="messages-${Date.now()}.csv"`,
    },
  });
}