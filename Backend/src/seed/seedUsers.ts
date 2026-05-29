import bcrypt from "bcryptjs";

import { connectDatabase } from "../config/database";
import { User } from "../models/User";

const seedUsers = [
  {
    fullName: "Admin User",
    email: "admin@lms.com",
    password: "Admin@123",
    role: "ADMIN"
  },
  {
    fullName: "Sales Executive",
    email: "sales@lms.com",
    password: "Sales@123",
    role: "SALES"
  },
  {
    fullName: "Sanction Executive",
    email: "sanction@lms.com",
    password: "Sanction@123",
    role: "SANCTION"
  },
  {
    fullName: "Disbursement Executive",
    email: "disbursement@lms.com",
    password: "Disbursement@123",
    role: "DISBURSEMENT"
  },
  {
    fullName: "Collection Executive",
    email: "collection@lms.com",
    password: "Collection@123",
    role: "COLLECTION"
  },
  {
    fullName: "Borrower User",
    email: "borrower@lms.com",
    password: "Borrower@123",
    role: "BORROWER"
  }
] as const;

const runSeed = async () => {
  await connectDatabase();

  for (const seedUser of seedUsers) {
    const passwordHash = await bcrypt.hash(seedUser.password, 12);

    await User.findOneAndUpdate(
      { email: seedUser.email },
      {
        fullName: seedUser.fullName,
        email: seedUser.email,
        passwordHash,
        role: seedUser.role,
        isActive: true
      },
      {
        upsert: true,
        new: true,
        runValidators: true
      }
    );
  }

  console.log("Seed users created:");
  for (const seedUser of seedUsers) {
    console.log(`${seedUser.role}: ${seedUser.email} / ${seedUser.password}`);
  }
};

runSeed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed to seed users", error);
    process.exit(1);
  });
