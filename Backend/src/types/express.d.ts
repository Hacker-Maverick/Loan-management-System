import type { UserRole } from "../constants/roles";

declare global {
  namespace Express {
    interface AuthUser {
      id: string;
      role: UserRole;
      email: string;
    }

    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
