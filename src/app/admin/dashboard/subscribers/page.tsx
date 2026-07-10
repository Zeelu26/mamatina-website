import { supabaseAdmin } from "@/lib/supabase/admin";
import type { NewsletterSubscriber } from "@/lib/types";
import { PageHead, Card } from "../ui";

export const dynamic = "force-dynamic";

export default async function SubscribersPage() {
  const { data: rows, error } = await supabaseAdmin
    .from("subscribers")
    .select("id, email, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load subscribers:", error);
  }

  const subscribers: NewsletterSubscriber[] = (rows ?? []).map((row) => ({
    id: row.id,
    email: row.email,
    createdAt: row.created_at,
  }));

  return (
    <>
      <PageHead
        eyebrow="Audience"
        title="Newsletter Subscribers"
        sub={`${subscribers.length} ${
          subscribers.length === 1 ? "person is" : "people are"
        } on your list.`}
      />

      <div className="mb-6">
        <a
          href="/api/subscribers/export"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] uppercase tracking-widest-2 bg-chocolate hover:bg-soft-black text-cream transition"
        >
          Export CSV
        </a>
      </div>

      {subscribers.length === 0 ? (
        <Card>
          <div className="text-chocolate/55 italic text-sm">
            No subscribers yet.
          </div>
        </Card>
      ) : (
        <Card>
          <ul className="divide-y divide-beige/70">
            {subscribers.map((subscriber) => (
              <li
                key={subscriber.id}
                className="py-3 flex items-center justify-between gap-4 text-sm"
              >
                <span className="text-chocolate break-all">
                  {subscriber.email}
                </span>

                <span className="text-[10px] uppercase tracking-widest-2 text-chocolate/45 shrink-0">
                  {new Date(subscriber.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}