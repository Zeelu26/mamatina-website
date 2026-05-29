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
  const headers = ["Email", "Subscribed At"];
  const rows = [...db.subscribers]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((s) => [s.email, new Date(s.createdAt).toLocaleString()].map(csvEscape).join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="subscribers-${Date.now()}.csv"`,
    },
  });
}
