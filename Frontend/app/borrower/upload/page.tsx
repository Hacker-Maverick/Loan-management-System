"use client";

import { FileUp } from "lucide-react";
import { FormEvent, useState } from "react";

import { apiRequest } from "@/lib/api";

export default function SalarySlipUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) {
      setMessage("Choose a PDF, JPG, or PNG salary slip first.");
      return;
    }

    const formData = new FormData();
    formData.append("salarySlip", file);
    setLoading(true);
    setMessage("");

    try {
      await apiRequest("/borrower/salary-slip", {
        method: "POST",
        body: formData
      });
      setMessage("Salary slip uploaded successfully. Continue to loan application.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-black sm:text-3xl">Income Verification</h1>
      <p className="mt-1 text-sm text-slate-600">Upload your most recent salary slip to complete assessment.</p>
      <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_280px]">
        <form onSubmit={submit} className="rounded-lg border border-line bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-2 font-black">
            <FileUp size={18} className="text-brand" />
            Upload Document
          </div>
          <label className="grid min-h-64 cursor-pointer place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <input
              className="sr-only"
              type="file"
              accept=".pdf,image/jpeg,image/png"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
            <span>
              <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-blue-100 text-brand">
                <FileUp size={28} />
              </span>
              <span className="block font-black">Drag and drop your file here</span>
              <span className="mt-2 block text-sm text-slate-500">or click to browse from your device</span>
              <span className="mt-4 flex justify-center gap-2 text-[11px] font-black text-slate-500">
                <span className="rounded-full bg-white px-3 py-1">PDF</span>
                <span className="rounded-full bg-white px-3 py-1">JPG</span>
                <span className="rounded-full bg-white px-3 py-1">PNG</span>
                <span className="rounded-full bg-white px-3 py-1">MAX 5 MB</span>
              </span>
            </span>
          </label>
          {file ? (
            <div className="mt-5 flex flex-col gap-3 rounded-lg border border-line bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-black">{file.name}</div>
                <div className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
              </div>
              <button disabled={loading} className="h-11 rounded-md bg-black px-6 font-black text-white">
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          ) : null}
          {message ? <p className="mt-4 rounded-md bg-blue-50 p-3 text-sm font-bold text-blue-700">{message}</p> : null}
        </form>
        <aside className="space-y-4">
          <div className="rounded-lg bg-panel p-6 text-white shadow-soft">
            <div className="h-40 rounded border-b border-slate-600" />
          </div>
          <div className="rounded-lg border border-line bg-white p-5 text-sm">
            <div className="font-black">Help Center</div>
            <div className="mt-4 border-t border-line pt-4">Alternative documents</div>
            <div className="mt-4 border-t border-line pt-4">Privacy policy</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
