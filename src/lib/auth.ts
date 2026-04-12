// src/lib/auth.ts

import { supabase } from "@/lib/supabaseClient";

// ========================
// LOGIN WITH EMAIL
// ========================
export const loginWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data.user;
};

// ========================
// SIGNUP WITH EMAIL (FIX FOR YOUR BUILD ERROR)
// ========================
export const signupWithEmail = async (
  email: string,
  password: string,
  name?: string
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name || "",
      },
    },
  });

  if (error) throw error;

  return data.user;
};

// ========================
// GOOGLE LOGIN
// ========================
export const loginWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) throw error;

  return data;
};