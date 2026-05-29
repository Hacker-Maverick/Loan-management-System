export const USER_ROLES = [
  "ADMIN",
  "SALES",
  "SANCTION",
  "DISBURSEMENT",
  "COLLECTION",
  "BORROWER"
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const EXECUTIVE_ROLES: UserRole[] = [
  "SALES",
  "SANCTION",
  "DISBURSEMENT",
  "COLLECTION"
];
