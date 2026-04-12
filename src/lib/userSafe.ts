export type SafeUser = {
  name: string;
  email: string;
  addresses: any[];
  createdAt: string;
  provider: string;
};

const DEFAULT_USER: SafeUser = {
  name: "Guest",
  email: "",
  addresses: [],
  createdAt: new Date().toISOString(),
  provider: "unknown",
};

/**
 * Always returns a fully safe user object (never null/undefined)
 */
export const getSafeUser = (user: any): SafeUser => {
  if (!user) return DEFAULT_USER;

  return {
    name: user?.name ?? "Guest",
    email: user?.email ?? "",
    addresses: Array.isArray(user?.addresses) ? user.addresses : [],
    createdAt: user?.createdAt ?? new Date().toISOString(),
    provider: user?.provider ?? "unknown",
  };
};

/**
 * Safe avatar initial generator
 */
export const safeInitial = (user: any): string => {
  const name = user?.name ?? "U";
  return name.charAt(0).toUpperCase();
};

/**
 * Safe address count
 */
export const safeAddressCount = (user: any): number => {
  return Array.isArray(user?.addresses) ? user.addresses.length : 0;
};