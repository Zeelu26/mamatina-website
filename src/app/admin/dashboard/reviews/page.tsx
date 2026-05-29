import { readDB } from "@/lib/db";
import { PageHead } from "../ui";
import ReviewsManager from "./ReviewsManager";

export const dynamic = "force-dynamic";

export default async function ReviewsAdminPage() {
  const db = await readDB();
  return (
    <>
      <PageHead
        eyebrow="Voices"
        title="Customer Reviews"
        sub="Approve, edit, feature, or delete reviews. Customer-submitted reviews appear here until approved."
      />
      <ReviewsManager initial={db.reviews} />
    </>
  );
}
