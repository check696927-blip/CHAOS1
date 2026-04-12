import type { User } from "@/types/user";

/**
 * GLOBAL SAFETY LAYER
 * Never allow UI to directly trust raw user fields.
 */

export const safeUser = (user: User | null) => {
  return {
    id: user?.id ?? "",
    name: user?.name ?? "Guest",
    email: user?.email ?? "",
    provider: user?.provider ?? "guest",
    addresses: user?.addresses ?? [],
    createdAt: user?.createdAt ?? new Date().toISOString(),
  };
};

export const safeInitial = (user: User | null): string => {
  const name = user?.name ?? "U";
  return name.charAt(0).toUpperCase();
};

export const safeAddressCount = (user: User | null): number => {
  return user?.addresses?.length ?? 0;
};

export const isLoggedIn = (user: User | null): boolean => {
  return !!user?.id;
};