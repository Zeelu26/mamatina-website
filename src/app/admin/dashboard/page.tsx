import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { ContactMessage } from "@/lib/types";
import { PageHead, Card } from "./ui";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [
    messagesResult,
    unreadResult,
    productsResult,
    reviewsResult,
    pendingReviewsResult,
    subscribersResult,
    galleryResult,
    recentMessagesResult,
  ] = await Promise.all([
    supabaseAdmin
      .from("messages")
      .select("*", { count: "exact", head: true }),

    supabaseAdmin
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("read", false),

    supabaseAdmin
      .from("products")
      .select("*", { count: "exact", head: true }),

    supabaseAdmin
      .from("reviews")
      .select("*", { count: "exact", head: true }),

    supabaseAdmin
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq("approved", false),

    supabaseAdmin
      .from("subscribers")
      .select("*", { count: "exact", head: true }),

    supabaseAdmin
      .from("gallery_photos")
      .select("*", { count: "exact", head: true }),

    supabaseAdmin
      .from("messages")
      .select(
        "id, name, email, phone, message, product_interest, quantity, event_date, file_url, read, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const resultsWithErrors = [
    ["messages", messagesResult.error],
    ["unread messages", unreadResult.error],
    ["products", productsResult.error],
    ["reviews", reviewsResult.error],
    ["pending reviews", pendingReviewsResult.error],
    ["subscribers", subscribersResult.error],
    ["gallery photos", galleryResult.error],
    ["recent messages", recentMessagesResult.error],
  ] as const;

  for (const [label, error] of resultsWithErrors) {
    if (error) {
      console.error(`Failed to load ${label}:`, error);
    }
  }

  const totalMessages = messagesResult.count ?? 0;
  const unreadMessages = unreadResult.count ?? 0;
  const totalProducts = productsResult.count ?? 0;
  const totalReviews = reviewsResult.count ?? 0;
  const pendingReviews = pendingReviewsResult.count ?? 0;
  const totalSubscribers = subscribersResult.count ?? 0;
  const totalGalleryPhotos = galleryResult.count ?? 0;

  const recentMessages: ContactMessage[] = (
    recentMessagesResult.data ?? []
  ).map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    productInterest: row.product_interest ?? undefined,
    quantity: row.quantity ?? undefined,
    eventDate: row.event_date ?? undefined,
    fileUrl: row.file_url ?? undefined,
    read: row.read ?? false,
    createdAt: row.created_at,
  }));

  const stats = [
    {
      label: "Total Messages",
      value: totalMessages,
      href: "/admin/dashboard/messages",
    },
    {
      label: "Unread",
      value: unreadMessages,
      href: "/admin/dashboard/messages",
    },
    {
      label: "Products",
      value: totalProducts,
      href: "/admin/dashboard/products",
    },
    {
      label: "Reviews · Pending",
      value: `${totalReviews} · ${pendingReviews}`,
      href: "/admin/dashboard/reviews",
    },
    {
      label: "Subscribers",
      value: totalSubscribers,
      href: "/admin/dashboard/subscribers",
    },
    {
      label: "Gallery Photos",
      value: totalGalleryPhotos,
      href: "/admin/dashboard/gallery",
    },
  ];

  return (
    <>
      <PageHead
        eyebrow="Welcome"
        title="Good day at MaMaTina."
        sub="A quiet overview of what's happening today. Choose a section on the left to make changes."
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 mb-12">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="luxe-card p-6 hover:-translate-y-0.5 transition group block"
          >
            <div className="text-[10px] uppercase tracking-widest-2 text-chocolate/55">
              {stat.label}
            </div>

            <div className="font-display text-3xl text-chocolate mt-3 group-hover:text-gold-dark transition">
              {stat.value}
            </div>
          </Link>
        ))}
      </div>

      <h2 className="font-display text-2xl text-chocolate mb-4">
        Recent messages
      </h2>

      <Card>
        {recentMessages.length === 0 ? (
          <div className="text-chocolate/55 italic text-sm">
            No messages yet.
          </div>
        ) : (
          <ul className="divide-y divide-beige/70">
            {recentMessages.map((message) => (
              <li
                key={message.id}
                className="py-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="text-sm text-chocolate font-medium truncate">
                    {message.name}{" "}
                    <span className="text-chocolate/50 font-normal text-xs">
                      · {message.email}
                    </span>
                  </div>

                  <div className="text-xs text-chocolate/60 truncate mt-0.5">
                    {message.message}
                  </div>
                </div>

                <div className="text-[10px] uppercase tracking-widest-2 text-chocolate/50 shrink-0">
                  {new Date(message.createdAt).toLocaleDateString()}
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