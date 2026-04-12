import { supabase } from "@/lib/supabaseClient";
import type { User } from "@/types/user";

const mapUser = (u: any): User => ({
  id: u.id,
  email: u.email,
  name: u.user_metadata?.name ?? u.email,
  provider: "supabase",
  addresses: [],
  createdAt: u.created_at,
});

export const getCurrentUser = async () => {
  if (!supabase) return null;

  const { data } = await supabase.auth.getUser();
  return data?.user ? mapUser(data.user) : null;
};

export const logout = async () => {
  await supabase?.auth.signOut();
  window.location.href = "/";
};

export const loginWithGoogle = async () => {
  if (!supabase) return null;

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin },
  });

  if (error) throw error;
  return true;
};

export const loginWithEmail = async (email: string, password: string) => {
  if (!supabase) throw new Error("No backend");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return mapUser(data.user);
};

/**
 * ✅ FIX: this was missing and is REQUIRED by AuthModal.tsx
 */
export const signupWithEmail = async (
  email: string,
  password: string,
  name?: string
) => {
  if (!supabase) throw new Error("No backend");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name ?? email,
      },
    },
  });

  if (error) throw error;
  return data.user ? mapUser(data.user) : null;
};