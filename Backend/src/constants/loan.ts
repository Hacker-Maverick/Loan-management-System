export const EMPLOYMENT_MODES = ["SALARIED", "SELF_EMPLOYED", "UNEMPLOYED"] as const;
export type EmploymentMode = (typeof EMPLOYMENT_MODES)[number];

export const BRE_STATUSES = ["PENDING", "PASSED", "FAILED"] as const;
export type BreStatus = (typeof BRE_STATUSES)[number];

export const LOAN_STATUSES = ["APPLIED", "SANCTIONED", "REJECTED", "DISBURSED", "CLOSED"] as const;
export type LoanStatus = (typeof LOAN_STATUSES)[number];

export const DOCUMENT_TYPES = ["SALARY_SLIP"] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const INTEREST_RATE_ANNUAL = 12;
export const MIN_LOAN_AMOUNT = 50000;
export const MAX_LOAN_AMOUNT = 500000;
export const MIN_TENURE_DAYS = 30;
export const MAX_TENURE_DAYS = 365;
export const MIN_MONTHLY_SALARY = 25000;
export const MIN_AGE = 23;
export const MAX_AGE = 50;
export const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;
