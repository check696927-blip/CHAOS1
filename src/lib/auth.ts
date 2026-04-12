import { supabase } from "@/lib/supabaseClient";

// LOGIN EMAIL
export const loginWithEmail = async (email: string, password: string) => {
  if (!supabase) throw new Error("Supabase not initialized");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data.user;
};

// SIGNUP EMAIL (FIXED EXPORT)
export const signupWithEmail = async (
  email: string,
  password: string,
  name: string
) => {
  if (!supabase) throw new Error("Supabase not initialized");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });

  if (error) throw error;
  return data.user;
};

// GOOGLE LOGIN
export const loginWithGoogle = async () => {
  if (!supabase) return null;

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) throw error;
  return true;
};

// LOGOUT (optional compatibility)
export const logout = async () => {
  await supabase?.auth.signOut();
  window.location.href = "/";
};