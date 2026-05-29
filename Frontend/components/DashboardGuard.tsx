"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { canAccessDashboardModule, defaultPathForRole, getStoredUser } from "@/lib/auth";

export function DashboardGuard({ module, children }: { module: string; children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      router.replace("/auth/login");
      return;
    }
    if (!canAccessDashboardModule(user.role, module)) {
      router.replace(defaultPathForRole(user.role));
      return;
    }
    setAllowed(true);
  }, [module, router]);

  if (!allowed) {
    return <div className="text-sm text-slate-500">Checking access...</div>;
  }

  return <>{children}</>;
}
