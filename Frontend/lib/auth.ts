"use client";

import type { AuthUser, UserRole } from "./types";

const tokenKey = "lms_token";
const userKey = "lms_user";

export const saveSession = (token: string, user: AuthUser) => {
  localStorage.setItem(tokenKey, token);
  localStorage.setItem(userKey, JSON.stringify(user));
};

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(tokenKey);
};

export const getStoredUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(userKey);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

export const clearSession = () => {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(userKey);
};

export const isDashboardRole = (role: UserRole) => role !== "BORROWER";

export const defaultPathForRole = (role: UserRole) => {
  if (role === "BORROWER") return "/borrower/profile";
  if (role === "SALES") return "/dashboard/sales";
  if (role === "SANCTION") return "/dashboard/sanction";
  if (role === "DISBURSEMENT") return "/dashboard/disbursement";
  if (role === "COLLECTION") return "/dashboard/collection";
  return "/dashboard/sales";
};

export const canAccessDashboardModule = (role: UserRole, module: string) =>
  role === "ADMIN" || role.toLowerCase() === module;
