"use client";

import { CreditCard } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

import { DashboardGuard } from "@/components/DashboardGuard";
import { apiRequest, formatCurrency } from "@/lib/api";
import type { AuthUser, Loan } from "@/lib/types";

interface LoanDetail {
  loan: Loan;
  totalPaid: number;
  outstandingBalance: number;
}

export default function CollectionPage() {
  const [rows, setRows] = useState<LoanDetail[]>([]);
  const [selected, setSelected] = useState<LoanDetail | null>(null);
  const [form, setForm] = useState({ utrNumber: "", amount: "", paymentDate: new Date().toISOString().slice(0, 10) });
  const [message, setMessage] = useState("");

  const load = async () => {
    const { loans } = await apiRequest<{ loans: Loan[] }>("/dashboard/collection/loans");
    const details = await Promise.all(
      loans.map((loan) => apiRequest<LoanDetail>(`/dashboard/loans/${loan._id}`))
    );
    setRows(details);
  };

  useEffect(() => {
    load().catch(() => setRows([]));
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!selected) return;
    await apiRequest(`/dashboard/collection/loans/${selected.loan._id}/payments`, {
      method: "POST",
      body: JSON.stringify({ ...form, amount: Number(form.amount) })
    });
    setSelected(null);
    setForm({ utrNumber: "", amount: "", paymentDate: new Date().toISOString().slice(0, 10) });
    setMessage("Payment recorded.");
    await load();
  };

  return (
    <DashboardGuard module="collection">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black sm:text-3xl">Loan Collections</h1>
          <p className="mt-1 text-sm text-slate-600">Manage and record repayments for disbursed loans.</p>
        </div>
        <button onClick={() => rows[0] && setSelected(rows[0])} className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-black px-5 font-black text-white">
          <CreditCard size={18} />
          Record Payment
        </button>
      </div>
      {message ? <p className="mt-4 rounded-md bg-blue-50 p-3 text-sm font-bold text-blue-700">{message}</p> : null}
      <div className="mt-7 grid gap-4 sm:grid-cols-4">
        <Metric label="Total Outstanding" value={formatCurrency(rows.reduce((sum, row) => sum + row.outstandingBalance, 0))} />
        <Metric label="Collected" value={formatCurrency(rows.reduce((sum, row) => sum + row.totalPaid, 0))} blue />
        <Metric label="Accounts" value={String(rows.length)} />
        <Metric label="Efficiency" value="Live" />
      </div>
      <section className="mt-5 overflow-hidden rounded-lg border border-line bg-white">
        <div className="border-b border-line p-5 font-black">Disbursed Loans</div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-4">Borrower</th>
                <th className="p-4">Total Repayment</th>
                <th className="p-4">Paid Amount</th>
                <th className="p-4">Outstanding Balance</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const borrower = row.loan.borrowerId as AuthUser;
                return (
                  <tr key={row.loan._id} className="border-t border-line">
                    <td className="p-4 font-black">{borrower.fullName}</td>
                    <td className="p-4 font-black">{formatCurrency(row.loan.totalRepayment)}</td>
                    <td className="p-4">{formatCurrency(row.totalPaid)}</td>
                    <td className="p-4 font-black text-red-600">{formatCurrency(row.outstandingBalance)}</td>
                    <td className="p-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">ON TRACK</span>
                    </td>
                    <td className="p-4">
                      <button onClick={() => setSelected(row)} className="text-xs font-black uppercase text-brand">
                        Record Payment
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
      {selected ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <form onSubmit={submit} className="w-full max-w-md rounded-lg bg-white p-6 shadow-soft">
            <h2 className="text-xl font-black">Record Payment</h2>
            <p className="mt-1 text-sm text-slate-600">Outstanding: {formatCurrency(selected.outstandingBalance)}</p>
            <label className="mt-4 block text-xs font-bold uppercase text-slate-600">UTR Number</label>
            <input className="mt-2 h-11 w-full rounded-md border border-line px-3 outline-none" value={form.utrNumber} onChange={(event) => setForm({ ...form, utrNumber: event.target.value })} required />
            <label className="mt-4 block text-xs font-bold uppercase text-slate-600">Amount</label>
            <input className="mt-2 h-11 w-full rounded-md border border-line px-3 outline-none" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} type="number" min="1" max={selected.outstandingBalance} required />
            <label className="mt-4 block text-xs font-bold uppercase text-slate-600">Payment Date</label>
            <input className="mt-2 h-11 w-full rounded-md border border-line px-3 outline-none" value={form.paymentDate} onChange={(event) => setForm({ ...form, paymentDate: event.target.value })} type="date" required />
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" onClick={() => setSelected(null)} className="h-10 rounded-md border border-line px-4 font-bold">
                Cancel
              </button>
              <button className="h-10 rounded-md bg-black px-4 font-black text-white">Save Payment</button>
            </div>
          </form>
        </div>
      ) : null}
    </DashboardGuard>
  );
}

function Metric({ label, value, blue = false }: { label: string; value: string; blue?: boolean }) {
  return (
    <div className="rounded-lg border border-line bg-white p-5">
      <div className="text-xs font-black uppercase text-slate-500">{label}</div>
      <div className={`mt-2 text-2xl font-black ${blue ? "text-brand" : ""}`}>{value}</div>
    </div>
  );
}
