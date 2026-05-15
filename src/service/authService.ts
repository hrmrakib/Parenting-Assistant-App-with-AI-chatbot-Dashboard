"use server";

import { cookies } from "next/headers";

export const saveTokens = async (token: string): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
};

export const saveRefreshToken = async (token: string): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set("long_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });
};

export const getCurrentUser = async (): Promise<string | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
};

export const getRefreshToken = async (): Promise<string | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get("long_token")?.value;
};

export const logout = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("long_token");
};
