import { supabase } from "@/lib/supabaseClient";
import type { User } from "@/types/user";

const mapUser = (u: any): User => ({
  id: u.id,
  email: u.email,
  name: u.user_metadata?.name || u.user_metadata?.full_name || u.email,
  provider: "supabase",
  addresses: [],
  createdAt: u.created_at,
});

export const getCurrentUser = async (): Promise<User | null> => {
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return null;

  return mapUser(data.user);
};

export const logout = async (): Promise<void> => {
  if (!supabase) return;

  await supabase.auth.signOut();
  window.location.href = "/";
};

export const loginWithGoogle = async (): Promise<boolean> => {
  if (!supabase) throw new Error("Supabase not initialized");

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) throw error;
  return true;
};

export const loginWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  if (!supabase) throw new Error("Supabase not initialized");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  if (!data?.user) throw new Error("Login failed");

  return mapUser(data.user);
};

// ✅ THIS IS THE MISSING FUNCTION (FIXES YOUR BUILD ERROR)
export const signupWithEmail = async (
  email: string,
  password: string,
  name?: string
): Promise<User> => {
  if (!supabase) throw new Error("Supabase not initialized");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name || email,
      },
    },
  });

  if (error) throw error;

  const user = data?.user || data?.session?.user;
  if (!user) throw new Error("Signup failed - no user returned");

  return mapUser(user);
};