import { supabase } from "@/lib/supabaseClient"

export const getCurrentUser = async () => {
  if (!supabase) return null
  try {
    const { data } = await supabase.auth.getUser()
    return data?.user ?? null
  } catch {
    return null
  }
}

export const logout = async () => {
  if (!supabase) return
  try {
    await supabase.auth.signOut()
  } catch (e) {
    console.error("Logout error:", e)
  }
  window.location.href = "/"
}

export const loginWithGoogle = async () => {
  if (!supabase) {
    console.warn("Supabase not initialised — cannot login with Google")
    return null
  }
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    })
    if (error) throw error
    return true
  } catch (e) {
    console.error("Google login error:", e)
    return null
  }
}

export const loginWithEmail = async (email: string, password: string) => {
  if (!supabase) throw new Error("Database not connected.")
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data.user
}

export const signupWithEmail = async (
  email: string,
  password: string,
  name: string
) => {
  if (!supabase) throw new Error("Database not connected.")
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  })
  if (error) throw error
  return data.user
}