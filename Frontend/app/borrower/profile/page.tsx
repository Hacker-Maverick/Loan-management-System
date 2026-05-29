"use client";

import { Briefcase, CheckCircle2, UserX } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

import { apiRequest } from "@/lib/api";
import type { BorrowerProfile, EmploymentMode } from "@/lib/types";

const employmentOptions: { value: EmploymentMode; label: string }[] = [
  { value: "SALARIED", label: "Salaried" },
  { value: "SELF_EMPLOYED", label: "Self-Employed" },
  { value: "UNEMPLOYED", label: "Unemployed" }
];

export default function BorrowerProfilePage() {
  const [form, setForm] = useState({
    fullName: "",
    pan: "",
    dateOfBirth: "",
    monthlySalary: "50000",
    employmentMode: "SALARIED" as EmploymentMode
  });
  const [profile, setProfile] = useState<BorrowerProfile | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiRequest<{ profile: BorrowerProfile | null }>("/borrower/profile")
      .then(({ profile }) => {
        if (!profile) return;
        setProfile(profile);
        setForm({
          fullName: profile.fullName,
          pan: profile.pan,
          dateOfBirth: profile.dateOfBirth.slice(0, 10),
          monthlySalary: String(profile.monthlySalary),
          employmentMode: profile.employmentMode
        });
      })
      .catch(() => undefined);
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const result = await apiRequest<{ profile: BorrowerProfile; bre: { failureReasons: string[] } }>(
        "/borrower/profile",
        {
          method: "POST",
          body: JSON.stringify({
            ...form,
            monthlySalary: Number(form.monthlySalary)
          })
        }
      );
      setProfile(result.profile);
      setMessage(result.profile.breStatus === "PASSED" ? "Eligibility passed. Continue to salary slip upload." : "");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not check eligibility");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black sm:text-3xl">Eligibility Assessment</h1>
        <p className="mt-1 text-sm text-slate-600">Update your personal details to run the Business Rule Engine.</p>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <form onSubmit={submit} className="rounded-lg border border-line bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-2 font-black">
            <CheckCircle2 size={18} className="text-brand" />
            Personal Information
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-bold uppercase text-slate-600">Full Name</span>
              <input
                className="mt-2 h-11 w-full rounded-md border border-line px-3 outline-none"
                value={form.fullName}
                onChange={(event) => setForm({ ...form, fullName: event.target.value })}
                required
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase text-slate-600">PAN Card Number</span>
              <input
                className="mt-2 h-11 w-full rounded-md border border-line px-3 uppercase outline-none"
                value={form.pan}
                onChange={(event) => setForm({ ...form, pan: event.target.value.toUpperCase() })}
                placeholder="ABCDE1234F"
                required
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase text-slate-600">Date of Birth</span>
              <input
                className="mt-2 h-11 w-full rounded-md border border-line px-3 outline-none"
                value={form.dateOfBirth}
                onChange={(event) => setForm({ ...form, dateOfBirth: event.target.value })}
                type="date"
                required
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase text-slate-600">Monthly Salary</span>
              <input
                className="mt-2 h-11 w-full rounded-md border border-line px-3 outline-none"
                value={form.monthlySalary}
                onChange={(event) => setForm({ ...form, monthlySalary: event.target.value })}
                type="number"
                min="0"
                required
              />
            </label>
          </div>
          <div className="mt-5 text-xs font-bold uppercase text-slate-600">Employment Mode</div>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            {employmentOptions.map((option) => (
              <button
                type="button"
                key={option.value}
                onClick={() => setForm({ ...form, employmentMode: option.value })}
                className={`h-20 rounded-md border font-bold ${
                  form.employmentMode === option.value ? "border-brand bg-blue-50 text-brand" : "border-line"
                }`}
              >
                <Briefcase className="mx-auto mb-2" size={18} />
                {option.label}
              </button>
            ))}
          </div>
          <button disabled={loading} className="mt-6 h-12 w-full rounded-md bg-black font-black text-white">
            {loading ? "Checking..." : "Check Eligibility"}
          </button>
          {message ? <p className="mt-4 rounded-md bg-blue-50 p-3 text-sm font-bold text-blue-700">{message}</p> : null}
          {profile?.breStatus === "FAILED" ? (
            <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
              <div className="mb-2 flex items-center gap-2 font-black">
                <UserX size={17} />
                BRE Rejected
              </div>
              {profile.breFailureReasons.map((reason) => (
                <div key={reason}>• {reason}</div>
              ))}
            </div>
          ) : null}
        </form>
        <aside className="space-y-4">
          <div className="rounded-lg bg-panel p-6 text-white shadow-soft">
            <div className="h-20 rounded border-b border-slate-600" />
            <div className="mt-5 text-sm font-bold">Powered by BRE v2.4</div>
          </div>
          <div className="rounded-lg border border-line bg-white p-5 text-sm text-slate-600">
            <div className="font-black text-slate-900">Pro Tip</div>
            <p className="mt-2">Keep PAN, salary, age, and employment details accurate before applying.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
