import { supabase } from "./supabase";

/**
 * LOGIN
 */
export const loginWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data.user;
};

/**
 * SIGNUP (FIXED — NOW MATCHES YOUR MODAL)
 */
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
        full_name: name ?? "",
      },
    },
  });

  if (error) throw error;

  return data.user;
};

/**
 * GOOGLE LOGIN
 */
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

/**
 * SIGNOUT
 */
export const signout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};