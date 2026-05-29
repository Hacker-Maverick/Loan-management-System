"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { apiRequest, formatCurrency } from "@/lib/api";
import type { Loan } from "@/lib/types";

const badgeClass: Record<string, string> = {
  APPLIED: "bg-yellow-50 text-yellow-700",
  SANCTIONED: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
  DISBURSED: "bg-blue-50 text-blue-700",
  CLOSED: "bg-slate-100 text-slate-700"
};

export default function MyLoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    apiRequest<{ loans: Loan[] }>("/borrower/loans")
      .then(({ loans }) => setLoans(loans))
      .catch(() => setLoans([]));
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black sm:text-3xl">My Loans</h1>
          <p className="mt-1 text-sm text-slate-600">View and manage your loan applications.</p>
        </div>
        <Link href="/borrower/apply" className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-black px-5 font-black text-white">
          <Plus size={18} />
          Apply New Loan
        </Link>
      </div>
      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-line bg-white p-5">
          <div className="text-xs font-black uppercase text-slate-500">Total Borrowed</div>
          <div className="mt-2 text-2xl font-black">{formatCurrency(loans.reduce((sum, loan) => sum + loan.amount, 0))}</div>
        </div>
        <div className="rounded-lg border border-line bg-white p-5">
          <div className="text-xs font-black uppercase text-slate-500">Active Loans</div>
          <div className="mt-2 text-2xl font-black">{loans.filter((loan) => ["APPLIED", "SANCTIONED", "DISBURSED"].includes(loan.status)).length}</div>
        </div>
        <div className="rounded-lg border border-line bg-white p-5">
          <div className="text-xs font-black uppercase text-slate-500">Closed Loans</div>
          <div className="mt-2 text-2xl font-black">{loans.filter((loan) => loan.status === "CLOSED").length}</div>
        </div>
      </div>
      <section className="mt-5 overflow-hidden rounded-lg border border-line bg-white">
        <div className="border-b border-line p-5 font-black">Loan History</div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-4">Loan Amount</th>
                <th className="p-4">Tenure</th>
                <th className="p-4">Interest</th>
                <th className="p-4">Total Repayment</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created Date</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan._id} className="border-t border-line">
                  <td className="p-4 font-black">{formatCurrency(loan.amount)}</td>
                  <td className="p-4">{loan.tenureDays} days</td>
                  <td className="p-4">{formatCurrency(loan.interestAmount)}</td>
                  <td className="p-4 font-bold">{formatCurrency(loan.totalRepayment)}</td>
                  <td className="p-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${badgeClass[loan.status]}`}>{loan.status}</span>
                  </td>
                  <td className="p-4">{new Date(loan.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {loans.length === 0 ? (
                <tr>
                  <td className="p-6 text-center text-slate-500" colSpan={6}>
                    No loans yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
