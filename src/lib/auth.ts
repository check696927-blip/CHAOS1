import { supabase } from "@/lib/supabaseClient"

export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser()
  return data?.user ?? null
}

export const logout = async () => {
  await supabase.auth.signOut()
  window.location.href = "/"
}

export const loginWithGoogle = async () => {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin
    }
  })
}

export const loginWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error
  return data.user
}

export const signupWithEmail = async (
  email: string,
  password: string,
  name: string
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name
      }
    }
  })

  if (error) throw error
  return data.user
}