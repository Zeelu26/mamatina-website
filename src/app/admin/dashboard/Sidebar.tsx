"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const SECTIONS = [
  {
    label: "Overview",
    items: [{ href: "/admin/dashboard", label: "Dashboard" }],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/dashboard/hero", label: "Hero" },
      { href: "/admin/dashboard/about", label: "About" },
      { href: "/admin/dashboard/products", label: "Products" },
      { href: "/admin/dashboard/gallery", label: "Gallery" },
      { href: "/admin/dashboard/reviews", label: "Reviews" },
    ],
  },
  {
    label: "Communication",
    items: [
      { href: "/admin/dashboard/messages", label: "Messages" },
      { href: "/admin/dashboard/subscribers", label: "Subscribers" },
    ],
  },
  {
    label: "Configuration",
    items: [
      { href: "/admin/dashboard/business", label: "Business" },
      { href: "/admin/dashboard/settings", label: "Site Settings" },
    ],
  },
];

export default function Sidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <>
      <button
        aria-label="Toggle menu"
        onClick={() => setOpen((v) => !v)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-chocolate text-cream h-11 w-11 rounded-full flex items-center justify-center shadow-xl"
      >
        ☰
      </button>

      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-soft-black text-cream z-40 flex flex-col transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="px-7 pt-8 pb-7 border-b border-cream/10">
          <Link href="/" className="font-display text-2xl text-cream">
            MaMaTina
          </Link>
          <div className="eyebrow !text-gold mt-1">Admin</div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6">
          {SECTIONS.map((sec) => (
            <div key={sec.label} className="mb-7 px-4">
              <div className="px-3 text-[10px] uppercase tracking-widest-2 text-cream/40 mb-2">
                {sec.label}
              </div>
              <ul className="space-y-1">
                {sec.items.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`block px-3 py-2 rounded-lg text-sm transition ${
                          active
                            ? "bg-gold/15 text-gold"
                            : "text-cream/75 hover:bg-cream/5 hover:text-cream"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="px-6 py-6 border-t border-cream/10">
          <div className="text-[10px] uppercase tracking-widest-2 text-cream/40 mb-1">
            Signed in
          </div>
          <div className="text-cream text-sm truncate mb-4">{email}</div>
          <button
            onClick={logout}
            className="text-xs uppercase tracking-widest-2 text-cream/60 hover:text-gold"
          >
            Sign out →
          </button>
        </div>
      </aside>

      {open && (
        <button
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/40 z-30"
        />
      )}
    </>
  );
}
