import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Review } from "@/lib/types";
import { PageHead } from "../ui";
import ReviewsManager from "./ReviewsManager";

export const dynamic = "force-dynamic";

export default async function ReviewsAdminPage() {
  const { data: rows, error } = await supabaseAdmin
    .from("reviews")
    .select(
      "id, customer_name, rating, text, photo_url, date, approved, featured"
    )
    .order("date", { ascending: false });

  if (error) {
    console.error("Failed to load reviews:", error);
  }

  const reviews: Review[] = (rows ?? []).map((row) => ({
    id: row.id,
    customerName: row.customer_name,
    rating: row.rating,
    text: row.text,
    photoUrl: row.photo_url ?? undefined,
    date: row.date,
    approved: row.approved ?? false,
    featured: row.featured ?? false,
  }));

  return (
    <>
      <PageHead
        eyebrow="Voices"
        title="Customer Reviews"
        sub="Approve, edit, feature, or delete reviews. Customer-submitted reviews appear here until approved."
      />

      <ReviewsManager initial={reviews} />
    </>
  );
}