import Link from "next/link";
import { readDB } from "@/lib/db";
import { PageHead, Card } from "./ui";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const db = await readDB();
  const unread = db.messages.filter((m) => !m.read).length;
  const pending = db.reviews.filter((r) => !r.approved).length;

  const stats = [
    { label: "Total Messages", value: db.messages.length, href: "/admin/dashboard/messages" },
    { label: "Unread", value: unread, href: "/admin/dashboard/messages" },
    { label: "Products", value: db.products.length, href: "/admin/dashboard/products" },
    { label: "Reviews · Pending", value: `${db.reviews.length} · ${pending}`, href: "/admin/dashboard/reviews" },
    { label: "Subscribers", value: db.subscribers.length, href: "/admin/dashboard/subscribers" },
    { label: "Gallery Photos", value: db.galleryPhotos.length, href: "/admin/dashboard/gallery" },
  ];

  const recentMessages = [...db.messages]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  return (
    <>
      <PageHead
        eyebrow="Welcome"
        title="Good day at MaMaTina."
        sub="A quiet overview of what's happening today. Choose a section on the left to make changes."
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 mb-12">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="luxe-card p-6 hover:-translate-y-0.5 transition group block"
          >
            <div className="text-[10px] uppercase tracking-widest-2 text-chocolate/55">
              {s.label}
            </div>
            <div className="font-display text-3xl text-chocolate mt-3 group-hover:text-gold-dark transition">
              {s.value}
            </div>
          </Link>
        ))}
      </div>

      <h2 className="font-display text-2xl text-chocolate mb-4">Recent messages</h2>
      <Card>
        {recentMessages.length === 0 ? (
          <div className="text-chocolate/55 italic text-sm">No messages yet.</div>
        ) : (
          <ul className="divide-y divide-beige/70">
            {recentMessages.map((m) => (
              <li key={m.id} className="py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm text-chocolate font-medium truncate">
                    {m.name}{" "}
                    <span className="text-chocolate/50 font-normal text-xs">
                      · {m.email}
                    </span>
                  </div>
                  <div className="text-xs text-chocolate/60 truncate mt-0.5">
                    {m.message}
                  </div>
                </div>
                <div className="text-[10px] uppercase tracking-widest-2 text-chocolate/50 shrink-0">
                  {new Date(m.createdAt).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6">
          <Link
            href="/admin/dashboard/messages"
            className="text-[11px] uppercase tracking-widest-2 text-gold-dark hover:text-chocolate"
          >
            View all messages →
          </Link>
        </div>
      </Card>
    </>
  );
}
