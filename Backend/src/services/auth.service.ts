import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";

import { env } from "../config/env";
import { type UserRole } from "../constants/roles";
import { User, type UserDocument } from "../models/User";
import { AppError } from "../utils/AppError";
import type { LoginInput, RegisterInput } from "../validators/auth.validators";

interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

const toAuthResponseUser = (user: UserDocument) => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  role: user.role
});

const signToken = (user: UserDocument) => {
  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role
  };

  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
};

export const registerBorrower = async (input: RegisterInput) => {
  const existingUser = await User.findOne({ email: input.email });

  if (existingUser) {
    throw new AppError(409, "Email is already registered");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await User.create({
    fullName: input.fullName,
    email: input.email,
    passwordHash,
    role: "BORROWER"
  });

  return {
    token: signToken(user),
    user: toAuthResponseUser(user)
  };
};

export const loginUser = async (input: LoginInput) => {
  const user = await User.findOne({ email: input.email }).select("+passwordHash");

  if (!user || !user.isActive) {
    throw new AppError(401, "Invalid email or password");
  }

  const passwordMatches = await user.comparePassword(input.password);

  if (!passwordMatches) {
    throw new AppError(401, "Invalid email or password");
  }

  return {
    token: signToken(user),
    user: toAuthResponseUser(user)
  };
};

export const getAuthUserById = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user || !user.isActive) {
    throw new AppError(401, "User account is not active");
  }

  return toAuthResponseUser(user);
};
