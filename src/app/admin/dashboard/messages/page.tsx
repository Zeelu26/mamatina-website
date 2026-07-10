import { supabaseAdmin } from "@/lib/supabase/admin";
import type { ContactMessage } from "@/lib/types";
import { PageHead } from "../ui";
import MessagesView from "./MessagesView";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const { data: rows, error } = await supabaseAdmin
    .from("messages")
    .select(
      "id, name, email, phone, message, product_interest, quantity, event_date, file_url, read, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load messages:", error);
  }

  const messages: ContactMessage[] = (rows ?? []).map((row) => ({
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

  return (
    <>
      <PageHead
        eyebrow="Inbox"
        title="Contact Messages"
        sub="All inquiries from the contact form. Export to CSV for catering or events."
      />

      <MessagesView initial={messages} />
    </>
  );
}