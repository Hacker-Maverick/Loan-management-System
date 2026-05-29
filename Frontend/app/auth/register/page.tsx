"use client";

import { ArrowRight, Building2, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { apiRequest } from "@/lib/api";
import { saveSession } from "@/lib/auth";
import type { AuthUser } from "@/lib/types";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await apiRequest<{ token: string; user: AuthUser }>("/auth/register", {
        method: "POST",
        auth: false,
        body: JSON.stringify({ fullName, email, password })
      });
      saveSession(result.token, result.user);
      router.push("/borrower/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4 py-8">
      <form onSubmit={submit} className="w-full max-w-md overflow-hidden rounded-lg border border-line bg-white shadow-soft">
        <div className="bg-panel px-8 py-8 text-center text-white">
          <Building2 className="mx-auto" size={34} />
          <div className="mt-5 text-sm text-slate-300">Secure Borrower Registration</div>
        </div>
        <div className="p-6 sm:p-8">
          <h1 className="text-center text-xl font-black">Create your account</h1>
          <p className="mt-2 text-center text-sm text-slate-600">Enter your details to begin your application.</p>
          <label className="mt-5 block">
            <span className="text-xs font-bold uppercase text-slate-600">Full Name</span>
            <span className="mt-2 flex h-11 items-center gap-2 rounded-md border border-line bg-slate-50 px-3">
              <User size={17} className="text-slate-400" />
              <input
                className="w-full bg-transparent text-sm outline-none"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="John Doe"
                required
              />
            </span>
          </label>
          <label className="mt-5 block">
            <span className="text-xs font-bold uppercase text-slate-600">Email Address</span>
            <span className="mt-2 flex h-11 items-center gap-2 rounded-md border border-line bg-slate-50 px-3">
              <Mail size={17} className="text-slate-400" />
              <input
                className="w-full bg-transparent text-sm outline-none"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="john.doe@company.com"
                type="email"
                required
              />
            </span>
          </label>
          <label className="mt-5 block">
            <span className="text-xs font-bold uppercase text-slate-600">Secure Password</span>
            <span className="mt-2 flex h-11 items-center gap-2 rounded-md border border-line bg-slate-50 px-3">
              <Lock size={17} className="text-slate-400" />
              <input
                className="w-full bg-transparent text-sm outline-none"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                type="password"
                required
              />
            </span>
          </label>
          {error ? <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
          <button
            disabled={loading}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-black font-black text-white disabled:opacity-60"
          >
            {loading ? "Creating..." : "Register Account"}
            <ArrowRight size={18} />
          </button>
          <div className="mt-6 border-t border-line pt-5 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-black text-brand">
              Login
            </Link>
          </div>
        </div>
      </form>
    </main>
  );
}
