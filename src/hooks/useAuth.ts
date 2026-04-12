import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export const useAuth = () => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Guard: if supabase is not initialised, bail out safely
    if (!supabase) {
      setLoading(false)
      return
    }

    const run = async () => {
      try {
        const { data, error } = await supabase!.auth.getUser()
        if (error) {
          console.error("Auth error:", error)
          setUser(null)
        } else {
          setUser(data?.user ?? null)
        }
      } catch (e) {
        console.error("Auth crash prevented:", e)
        setUser(null)
      }
      setLoading(false)
    }

    run()

    // ✅ onAuthStateChange is now INSIDE the null guard
    const { data: listener } = supabase!.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  // ✅ Expose isAuthenticated and a no-op login for compatibility
  const isAuthenticated = !!user

  const login = (userData: any) => {
    setUser(userData)
  }

  return { user, loading, isAuthenticated, login }
}