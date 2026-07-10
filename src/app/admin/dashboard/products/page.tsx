import { supabaseAdmin } from "@/lib/supabase/admin";
import { PageHead } from "../ui";
import ProductsManager from "./ProductsManager";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const { data: products, error } = await supabaseAdmin
    .from("products")
    .select("*");

  if (error) {
    console.error("Failed to load products from Supabase:", error);
  }

  return (
    <>
      <PageHead
        eyebrow="Menu"
        title="Products & Flavors"
        sub="Add, edit, reorder, mark featured, or change availability for each flavor on the menu."
      />

      <ProductsManager initial={products ?? []} />
    </>
  );
}