import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const session = await getSession();
  const params = await searchParams;
  if (session) redirect(params.redirect || "/admin/dashboard");

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="font-display text-4xl text-chocolate">MaMaTina</div>
          <div className="eyebrow mt-2">Admin</div>
        </div>
        <div className="luxe-card p-8 md:p-10">
          <LoginForm redirectTo={params.redirect ?? "/admin/dashboard"} />
        </div>
        <p className="mt-8 text-center text-xs text-chocolate/40 uppercase tracking-widest-2">
          Restricted Access
        </p>
      </div>
    </main>
  );
}
