import {
  MAX_AGE,
  MIN_AGE,
  MIN_MONTHLY_SALARY,
  type EmploymentMode
} from "../constants/loan";

interface BreInput {
  pan: string;
  dateOfBirth: Date | string;
  monthlySalary: number;
  employmentMode: EmploymentMode;
}

const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export const calculateAge = (dateOfBirth: Date | string, today = new Date()) => {
  const dob = typeof dateOfBirth === "string" ? new Date(dateOfBirth) : dateOfBirth;
  let age = today.getFullYear() - dob.getFullYear();
  const monthDifference = today.getMonth() - dob.getMonth();
  const hasBirthdayPassed =
    monthDifference > 0 ||
    (monthDifference === 0 && today.getDate() >= dob.getDate());

  if (!hasBirthdayPassed) {
    age -= 1;
  }

  return age;
};

export const runBre = (input: BreInput) => {
  const failureReasons: string[] = [];
  const age = calculateAge(input.dateOfBirth);

  if (age < MIN_AGE || age > MAX_AGE) {
    failureReasons.push(`Age must be between ${MIN_AGE} and ${MAX_AGE}`);
  }

  if (input.monthlySalary < MIN_MONTHLY_SALARY) {
    failureReasons.push(`Monthly salary must be at least ${MIN_MONTHLY_SALARY}`);
  }

  if (!panRegex.test(input.pan)) {
    failureReasons.push("PAN must match the format ABCDE1234F");
  }

  if (input.employmentMode === "UNEMPLOYED") {
    failureReasons.push("Applicant must not be unemployed");
  }

  return {
    status: failureReasons.length === 0 ? "PASSED" : "FAILED",
    failureReasons
  } as const;
};
