import type { User } from "@/types/user";

export const emptyUser = (): User => ({
  id: "",
  email: "",
  name: "Guest",
  provider: "guest",
  addresses: [],
  createdAt: new Date(),
});

export const safeUser = (user: any): User => {
  if (!user) return emptyUser();

  return {
    id: user.id ?? "",
    email: user.email ?? "",
    name: user.name ?? "User",
    provider: user.provider ?? "unknown",
    addresses: Array.isArray(user.addresses) ? user.addresses : [],
    createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
  };
};

export const safeString = (v: any, fallback = "") =>
  typeof v === "string" ? v : fallback;

export const safeNumber = (v: any, fallback = 0) =>
  typeof v === "number" ? v : fallback;