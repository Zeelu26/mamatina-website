import { requireAdmin } from "@/lib/api";
import { readDB } from "@/lib/db";

function csvEscape(v: unknown): string {
  const s = v == null ? "" : String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const db = await readDB();
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
  const rows = [...db.messages]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((m) =>
      [
        new Date(m.createdAt).toLocaleString(),
        m.name,
        m.email,
        m.phone,
        m.productInterest || "",
        m.quantity || "",
        m.eventDate || "",
        m.read ? "yes" : "no",
        m.message,
      ]
        .map(csvEscape)
        .join(","),
    );
  const csv = [headers.join(","), ...rows].join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="messages-${Date.now()}.csv"`,
    },
  });
}
