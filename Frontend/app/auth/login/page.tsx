"use client";

import { Lock, Mail, MoveUpRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { apiRequest } from "@/lib/api";
import { defaultPathForRole, saveSession } from "@/lib/auth";
import type { AuthUser } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await apiRequest<{ token: string; user: AuthUser }>("/auth/login", {
        method: "POST",
        auth: false,
        body: JSON.stringify({ email, password })
      });
      saveSession(result.token, result.user);
      router.push(defaultPathForRole(result.user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-white to-slate-100 px-4 py-8">
      <section className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="text-3xl font-black">LendFlow</div>
          <div className="mt-1 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
            Professional Loan Management
          </div>
        </div>
        <form onSubmit={submit} className="overflow-hidden rounded-lg border border-line bg-white shadow-soft">
          <div className="p-6 sm:p-8">
            <h1 className="text-xl font-black">Welcome Back</h1>
            <p className="mt-2 text-sm text-slate-600">Enter your credentials to access your dashboard.</p>
            <label className="mt-6 block text-xs font-bold uppercase text-slate-600">Email Address</label>
            <div className="mt-2 flex h-11 items-center gap-2 rounded-md border border-line bg-slate-50 px-3">
              <Mail size={17} className="text-slate-400" />
              <input
                className="w-full bg-transparent text-sm outline-none"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@company.com"
                type="email"
                required
              />
            </div>
            <label className="mt-4 block text-xs font-bold uppercase text-slate-600">Password</label>
            <div className="mt-2 flex h-11 items-center gap-2 rounded-md border border-line bg-slate-50 px-3">
              <Lock size={17} className="text-slate-400" />
              <input
                className="w-full bg-transparent text-sm outline-none"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                type="password"
                required
              />
            </div>
            {error ? <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
            <button
              disabled={loading}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-black font-black text-white disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login to Dashboard"}
              <MoveUpRight size={17} />
            </button>
            <div className="my-6 h-px bg-line" />
            <Link
              href="/auth/register"
              className="flex h-11 items-center justify-center rounded-md border border-line font-bold"
            >
              Create borrower account
            </Link>
          </div>
          <div className="border-t border-line bg-slate-50 p-5">
            <div className="text-xs font-bold uppercase text-slate-500">Seed Credentials</div>
            <div className="mt-3 grid gap-3 text-xs sm:grid-cols-2">
              <div className="rounded border border-line bg-white p-3">admin@lms.com / Admin@123</div>
              <div className="rounded border border-line bg-white p-3">borrower@lms.com / Borrower@123</div>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}
