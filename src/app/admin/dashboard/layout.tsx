import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Sidebar from "./Sidebar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin");

  return (
    <div className="min-h-screen bg-cream flex">
      <Sidebar email={session.email} />
      <div className="flex-1 lg:pl-72">
        <div className="p-6 md:p-10 lg:p-14 max-w-6xl">{children}</div>
      </div>
    </div>
  );
}
