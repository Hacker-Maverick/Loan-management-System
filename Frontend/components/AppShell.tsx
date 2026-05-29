"use client";

import {
  Banknote,
  Bell,
  ClipboardCheck,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  User,
  WalletCards,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { canAccessDashboardModule, clearSession, getStoredUser } from "@/lib/auth";
import type { AuthUser } from "@/lib/types";

const borrowerLinks = [
  { href: "/borrower/profile", label: "Personal Details", icon: User },
  { href: "/borrower/upload", label: "Salary Slip", icon: FileText },
  { href: "/borrower/apply", label: "Loan Application", icon: Banknote },
  { href: "/borrower/loans", label: "My Loans", icon: CreditCard }
];

const dashboardLinks = [
  { href: "/dashboard/sales", label: "Sales", module: "sales", icon: LayoutDashboard },
  { href: "/dashboard/sanction", label: "Sanction", module: "sanction", icon: ClipboardCheck },
  { href: "/dashboard/disbursement", label: "Disbursement", module: "disbursement", icon: WalletCards },
  { href: "/dashboard/collection", label: "Collection", module: "collection", icon: ShieldCheck }
];

interface AppShellProps {
  children: React.ReactNode;
  section: "borrower" | "dashboard";
}

export function AppShell({ children, section }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const storedUser = getStoredUser();
    if (!storedUser) {
      router.replace("/auth/login");
      return;
    }

    if (section === "borrower" && storedUser.role !== "BORROWER" && storedUser.role !== "ADMIN") {
      router.replace("/dashboard/sales");
      return;
    }

    if (section === "dashboard" && storedUser.role === "BORROWER") {
      router.replace("/borrower/profile");
      return;
    }

    setUser(storedUser);
  }, [router, section]);

  const links = useMemo(() => {
    if (!user) return [];
    if (section === "borrower") return borrowerLinks;
    return dashboardLinks.filter((link) => canAccessDashboardModule(user.role, link.module));
  }, [section, user]);

  const logout = () => {
    clearSession();
    router.replace("/auth/login");
  };

  if (!user) {
    return <div className="grid min-h-screen place-items-center text-sm text-slate-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center border-b border-line bg-white/95 px-4 backdrop-blur md:left-60">
        <button
          className="mr-3 rounded-md border border-line p-2 md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
        >
          <Menu size={18} />
        </button>
        <div className="hidden min-w-0 flex-1 md:block">
          <input
            className="h-9 w-full max-w-sm rounded-full border border-line bg-slate-50 px-4 text-sm outline-none"
            placeholder={section === "borrower" ? "Search applications..." : "Search borrowers or loans..."}
          />
        </div>
        <div className="ml-auto flex items-center gap-3 text-sm">
          <Bell size={17} />
          <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 sm:inline">
            {user.role}
          </span>
          <button onClick={logout} className="flex items-center gap-1 font-semibold text-slate-700">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 border-r border-slate-800 bg-panel text-white transition md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link href="/" className="text-lg font-black">
            LendFlow
          </Link>
          <button className="md:hidden" onClick={() => setOpen(false)} aria-label="Close navigation">
            <X size={18} />
          </button>
        </div>
        <div className="px-5 pt-5 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
          {section === "borrower" ? "Loan Management" : "Admin Control"}
        </div>
        <nav className="mt-5 space-y-1 px-2">
          {links.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-md px-4 py-3 text-xs font-bold uppercase tracking-wide ${
                  active ? "bg-brand text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-5 left-4 right-4 rounded-md bg-white/10 p-4 text-xs text-slate-300">
          <div className="font-semibold text-white">{user.fullName}</div>
          <div className="mt-1">{user.email}</div>
        </div>
      </aside>

      {open ? <button className="fixed inset-0 z-30 bg-black/30 md:hidden" onClick={() => setOpen(false)} /> : null}

      <main className="min-h-screen pt-16 md:pl-60">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
