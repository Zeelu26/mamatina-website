import { readDB } from "@/lib/db";
import { PageHead } from "../ui";
import ProductsManager from "./ProductsManager";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const db = await readDB();
  return (
    <>
      <PageHead
        eyebrow="Menu"
        title="Products & Flavors"
        sub="Add, edit, reorder, mark featured, or change availability for each flavor on the menu."
      />
      <ProductsManager initial={db.products} />
    </>
  );
}
