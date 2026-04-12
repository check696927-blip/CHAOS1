import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export const useAuth = () => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()

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

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  return { user, loading }
}