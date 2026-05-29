"use client";

import { Download, Filter } from "lucide-react";
import { useEffect, useState } from "react";

import { DashboardGuard } from "@/components/DashboardGuard";
import { apiRequest, formatCurrency } from "@/lib/api";
import type { AuthUser, Loan } from "@/lib/types";

export default function DisbursementPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [message, setMessage] = useState("");

  const load = () =>
    apiRequest<{ loans: Loan[] }>("/dashboard/disbursement/loans")
      .then(({ loans }) => setLoans(loans))
      .catch(() => setLoans([]));

  useEffect(() => {
    load();
  }, []);

  const disburse = async (loan: Loan) => {
    await apiRequest(`/dashboard/disbursement/loans/${loan._id}/disburse`, { method: "PATCH" });
    setMessage("Loan marked as disbursed.");
    load();
  };

  return (
    <DashboardGuard module="disbursement">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-black sm:text-3xl">Disbursement Module</h1>
          <p className="mt-1 text-sm text-slate-600">Managing final stage release for sanctioned loan accounts.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:w-64">
          <div className="rounded-lg border border-line bg-white p-4">
            <div className="text-xs font-black uppercase text-slate-500">Pending</div>
            <div className="mt-1 font-black text-brand">{formatCurrency(loans.reduce((sum, loan) => sum + loan.amount, 0))}</div>
          </div>
          <div className="rounded-lg border border-line bg-white p-4">
            <div className="text-xs font-black uppercase text-slate-500">Queue</div>
            <div className="mt-1 font-black">{loans.length} Files</div>
          </div>
        </div>
      </div>
      {message ? <p className="mt-4 rounded-md bg-blue-50 p-3 text-sm font-bold text-blue-700">{message}</p> : null}
      <section className="mt-7 overflow-hidden rounded-lg border border-line bg-white">
        <div className="flex items-center justify-between border-b border-line p-5">
          <h2 className="font-black">Sanctioned Loans</h2>
          <div className="flex gap-2">
            <button className="inline-flex h-9 items-center gap-2 rounded-md border border-line px-3 text-sm font-bold">
              <Filter size={15} />
              Filter
            </button>
            <button className="inline-flex h-9 items-center gap-2 rounded-md border border-line px-3 text-sm font-bold">
              <Download size={15} />
              Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-4">Borrower</th>
                <th className="p-4">Loan Amount</th>
                <th className="p-4">Total Repayment</th>
                <th className="p-4">Sanction Date</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => {
                const borrower = loan.borrowerId as AuthUser;
                return (
                  <tr key={loan._id} className="border-t border-line">
                    <td className="p-4 font-black">{borrower.fullName}</td>
                    <td className="p-4 font-black">{formatCurrency(loan.amount)}</td>
                    <td className="p-4">{formatCurrency(loan.totalRepayment)}</td>
                    <td className="p-4">{loan.sanctionedAt ? new Date(loan.sanctionedAt).toLocaleDateString() : "-"}</td>
                    <td className="p-4">
                      <button onClick={() => disburse(loan)} className="rounded-md bg-black px-4 py-2 text-xs font-black text-white">
                        Mark Disbursed
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardGuard>
  );
}
