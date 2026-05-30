"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { defaultPathForRole, getStoredUser } from "@/lib/auth";

export default function DashboardIndex() {
  const router = useRouter();

  useEffect(() => {
    const user = getStoredUser();

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    router.replace(defaultPathForRole(user.role));
  }, [router]);

  return <div className="text-sm text-slate-500">Opening your dashboard...</div>;
}
