"use client";

import { useEffect, useState } from "react";

import { DashboardGuard } from "@/components/DashboardGuard";
import { apiRequest, formatCurrency } from "@/lib/api";
import type { BorrowerProfile, Loan } from "@/lib/types";

export default function SanctionPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [rejecting, setRejecting] = useState<Loan | null>(null);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  const load = () =>
    apiRequest<{ loans: Loan[] }>("/dashboard/sanction/loans")
      .then(({ loans }) => setLoans(loans))
      .catch(() => setLoans([]));

  useEffect(() => {
    load();
  }, []);

  const approve = async (loan: Loan) => {
    await apiRequest(`/dashboard/sanction/loans/${loan._id}/approve`, { method: "PATCH" });
    setMessage("Loan approved.");
    load();
  };

  const reject = async () => {
    if (!rejecting) return;
    await apiRequest(`/dashboard/sanction/loans/${rejecting._id}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ reason })
    });
    setRejecting(null);
    setReason("");
    setMessage("Loan rejected.");
    load();
  };

  return (
    <DashboardGuard module="sanction">
      <h1 className="text-2xl font-black sm:text-3xl">Sanction Queue</h1>
      <p className="mt-1 text-sm text-slate-600">Review and approve credit-verified loan applications.</p>
      {message ? <p className="mt-4 rounded-md bg-blue-50 p-3 text-sm font-bold text-blue-700">{message}</p> : null}
      <section className="mt-7 overflow-hidden rounded-lg border border-line bg-white">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-4">Borrower</th>
                <th className="p-4">PAN</th>
                <th className="p-4">Salary</th>
                <th className="p-4">Requested Amount</th>
                <th className="p-4">Tenure</th>
                <th className="p-4">Total Repayment</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => {
                const profile = loan.borrowerProfileId as BorrowerProfile;
                return (
                  <tr key={loan._id} className="border-t border-line">
                    <td className="p-4 font-black">{profile.fullName}</td>
                    <td className="p-4">{profile.pan}</td>
                    <td className="p-4">{formatCurrency(profile.monthlySalary)}</td>
                    <td className="p-4 font-black text-brand">{formatCurrency(loan.amount)}</td>
                    <td className="p-4">{loan.tenureDays} days</td>
                    <td className="p-4 font-black">{formatCurrency(loan.totalRepayment)}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => approve(loan)} className="rounded bg-green-700 px-3 py-2 text-xs font-black text-white">
                          Approve
                        </button>
                        <button onClick={() => setRejecting(loan)} className="rounded bg-red-700 px-3 py-2 text-xs font-black text-white">
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
      {rejecting ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-soft">
            <h2 className="text-xl font-black">Reject Loan</h2>
            <textarea
              className="mt-4 min-h-28 w-full rounded-md border border-line p-3 outline-none"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Enter rejection reason"
            />
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setRejecting(null)} className="h-10 rounded-md border border-line px-4 font-bold">
                Cancel
              </button>
              <button onClick={reject} className="h-10 rounded-md bg-black px-4 font-black text-white">
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </DashboardGuard>
  );
}
