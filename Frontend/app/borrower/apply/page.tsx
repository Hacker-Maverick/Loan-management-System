"use client";

import { ArrowRight, CalendarDays, IndianRupee } from "lucide-react";
import { FormEvent, useState } from "react";

import { apiRequest, calculateLoan, formatCurrency } from "@/lib/api";

export default function LoanApplicationPage() {
  const [amount, setAmount] = useState(150000);
  const [tenureDays, setTenureDays] = useState(180);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const calculation = calculateLoan(amount, tenureDays);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await apiRequest("/borrower/loans", {
        method: "POST",
        body: JSON.stringify({ amount, tenureDays })
      });
      setMessage("Loan application submitted. It is now waiting for sanction approval.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not apply for loan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-black sm:text-3xl">Apply for a New Loan</h1>
      <p className="mt-1 text-sm text-slate-600">Customize your loan terms. Interest is fixed at 12% p.a.</p>
      <form onSubmit={submit} className="mt-7 grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-lg font-black">
                <IndianRupee size={20} className="text-brand" />
                Loan Amount
              </div>
              <div className="rounded-md bg-blue-50 px-4 py-2 font-black text-brand">{formatCurrency(amount)}</div>
            </div>
            <input
              className="mt-8 w-full accent-brand"
              type="range"
              min="50000"
              max="500000"
              step="5000"
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
            />
            <div className="mt-2 flex justify-between text-xs font-semibold text-slate-500">
              <span>₹50,000</span>
              <span>₹5,00,000</span>
            </div>
          </section>
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-lg font-black">
                <CalendarDays size={20} className="text-brand" />
                Repayment Tenure
              </div>
              <div className="rounded-md bg-blue-50 px-4 py-2 font-black text-brand">{tenureDays} Days</div>
            </div>
            <input
              className="mt-8 w-full accent-brand"
              type="range"
              min="30"
              max="365"
              step="1"
              value={tenureDays}
              onChange={(event) => setTenureDays(Number(event.target.value))}
            />
            <div className="mt-2 flex justify-between text-xs font-semibold text-slate-500">
              <span>30 Days</span>
              <span>365 Days</span>
            </div>
          </section>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-panel p-5 font-black text-white">12% p.a.</div>
            <div className="rounded-lg border border-line bg-white p-5 font-black">Simple Interest</div>
          </div>
        </div>
        <aside className="overflow-hidden rounded-lg border border-brand bg-white shadow-soft">
          <div className="border-b border-line p-6">
            <h2 className="font-black">Loan Summary</h2>
            <p className="mt-1 text-sm text-slate-500">Review your repayment details</p>
          </div>
          <div className="space-y-4 p-6 text-sm">
            <div className="flex justify-between border-b border-line pb-3">
              <span>Principal Amount</span>
              <strong>{formatCurrency(amount)}</strong>
            </div>
            <div className="flex justify-between border-b border-line pb-3">
              <span>Interest Amount</span>
              <strong>{formatCurrency(calculation.interestAmount)}</strong>
            </div>
            <div className="pt-4">
              <div className="text-xs font-black uppercase text-brand">Total Repayment</div>
              <div className="mt-1 text-3xl font-black">{formatCurrency(calculation.totalRepayment)}</div>
            </div>
            <button disabled={loading} className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-panel font-black text-white">
              {loading ? "Applying..." : "Apply for Loan"}
              <ArrowRight size={18} />
            </button>
            {message ? <p className="rounded-md bg-blue-50 p-3 font-bold text-blue-700">{message}</p> : null}
          </div>
        </aside>
      </form>
    </div>
  );
}
