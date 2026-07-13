import type { ApiErrorResponse } from "./common";

export type AdminLoginRequest = {
  email: string;
  password: string;
};

export type AdminSafeUser = {
  id: string;
  email: string;
  name: string;
  roles: string[];
};

export type AdminLoginResponse =
  | { success: true; user: AdminSafeUser }
  | ApiErrorResponse;

export type AdminSafeSession = {
  expiresAt: string;
};

export type AdminSessionResponse =
  | {
      success: true;
      session: AdminSafeSession;
      user: AdminSafeUser;
    }
  | ApiErrorResponse;

export type AdminLogoutResponse = { success: true } | ApiErrorResponse;
