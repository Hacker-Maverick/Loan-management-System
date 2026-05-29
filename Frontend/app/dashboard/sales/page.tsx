"use client";

import { Download, Filter } from "lucide-react";
import { useEffect, useState } from "react";

import { DashboardGuard } from "@/components/DashboardGuard";
import { apiRequest } from "@/lib/api";
import type { SalesLead } from "@/lib/types";

export default function SalesPage() {
  const [leads, setLeads] = useState<SalesLead[]>([]);

  useEffect(() => {
    apiRequest<{ leads: SalesLead[] }>("/dashboard/sales/leads")
      .then(({ leads }) => setLeads(leads))
      .catch(() => setLeads([]));
  }, []);

  return (
    <DashboardGuard module="sales">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black sm:text-3xl">Sales Pipeline</h1>
          <p className="mt-1 text-sm text-slate-600">Monitoring borrower leads and eligibility status.</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex h-10 items-center gap-2 rounded-md border border-line bg-white px-4 text-sm font-black">
            <Filter size={16} />
            Filter
          </button>
          <button className="inline-flex h-10 items-center gap-2 rounded-md bg-black px-4 text-sm font-black text-white">
            <Download size={16} />
            Export Leads
          </button>
        </div>
      </div>
      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <Metric label="Total Leads" value={String(leads.length)} />
        <Metric label="Eligible Leads" value={String(leads.filter((lead) => lead.profile?.breStatus === "PASSED").length)} blue />
        <Metric label="BRE Active" value="Live" />
      </div>
      <section className="mt-5 overflow-hidden rounded-lg border border-line bg-white">
        <div className="border-b border-line p-5 font-black">Active Leads Monitor</div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-4">Borrower Name</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Registered Date</th>
                <th className="p-4">BRE Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-t border-line">
                  <td className="p-4 font-black">{lead.fullName}</td>
                  <td className="p-4">{lead.email}</td>
                  <td className="p-4">{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                      {lead.profile?.breStatus ?? "NO PROFILE"}
                    </span>
                  </td>
                </tr>
              ))}
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-slate-500">
                    No leads found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardGuard>
  );
}

function Metric({ label, value, blue = false }: { label: string; value: string; blue?: boolean }) {
  return (
    <div className="rounded-lg border border-line bg-white p-5">
      <div className="text-xs font-black uppercase text-slate-500">{label}</div>
      <div className={`mt-2 text-3xl font-black ${blue ? "text-brand" : ""}`}>{value}</div>
    </div>
  );
}
