import { readDB } from "@/lib/db";
import { PageHead, Card } from "../ui";

export const dynamic = "force-dynamic";

export default async function SubscribersPage() {
  const db = await readDB();
  const subs = [...db.subscribers].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <>
      <PageHead
        eyebrow="Audience"
        title="Newsletter Subscribers"
        sub={`${subs.length} ${subs.length === 1 ? "person is" : "people are"} on your list.`}
      />

      <div className="mb-6">
        <a
          href="/api/subscribers/export"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] uppercase tracking-widest-2 bg-chocolate hover:bg-soft-black text-cream transition"
        >
          Export CSV
        </a>
      </div>

      {subs.length === 0 ? (
        <Card>
          <div className="text-chocolate/55 italic text-sm">No subscribers yet.</div>
        </Card>
      ) : (
        <Card>
          <ul className="divide-y divide-beige/70">
            {subs.map((s) => (
              <li key={s.id} className="py-3 flex items-center justify-between text-sm">
                <span className="text-chocolate">{s.email}</span>
                <span className="text-[10px] uppercase tracking-widest-2 text-chocolate/45">
                  {new Date(s.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
