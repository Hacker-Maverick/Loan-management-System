export type UserRole =
  | "ADMIN"
  | "SALES"
  | "SANCTION"
  | "DISBURSEMENT"
  | "COLLECTION"
  | "BORROWER";

export type LoanStatus = "APPLIED" | "SANCTIONED" | "REJECTED" | "DISBURSED" | "CLOSED";
export type EmploymentMode = "SALARIED" | "SELF_EMPLOYED" | "UNEMPLOYED";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface BorrowerProfile {
  _id: string;
  fullName: string;
  pan: string;
  dateOfBirth: string;
  monthlySalary: number;
  employmentMode: EmploymentMode;
  breStatus: "PENDING" | "PASSED" | "FAILED";
  breFailureReasons: string[];
}

export interface Loan {
  _id: string;
  borrowerId: string | AuthUser;
  borrowerProfileId: string | BorrowerProfile;
  salarySlipId: string | { _id: string; originalName: string; path: string };
  amount: number;
  tenureDays: number;
  interestRateAnnual: number;
  interestAmount: number;
  totalRepayment: number;
  status: LoanStatus;
  rejectionReason?: string;
  createdAt: string;
  sanctionedAt?: string;
  disbursedAt?: string;
}

export interface SalesLead {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  profile: BorrowerProfile | null;
}
