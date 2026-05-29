"use client";

import { getToken } from "./auth";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type ApiOptions = RequestInit & {
  auth?: boolean;
};

export const apiRequest = async <T>(path: string, options: ApiOptions = {}) => {
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth !== false) {
    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(response.status, data.message ?? "Something went wrong");
  }

  return data as T;
};

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);

export const calculateLoan = (amount: number, tenureDays: number) => {
  const interestAmount = Number(((amount * 12 * tenureDays) / (365 * 100)).toFixed(2));
  return {
    interestAmount,
    totalRepayment: Number((amount + interestAmount).toFixed(2))
  };
};
