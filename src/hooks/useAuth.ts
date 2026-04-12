import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@/types/user";

// Internal mapper — inline user construction (no external dependency needed)
const mapToUser = (u: any): User => ({
  id: u?.id ?? "",
  email: u?.email ?? "",
  name:
    u?.user_metadata?.name ??
    u?.user_metadata?.full_name ??
    u?.email ??
    "Guest",
  provider: "supabase",
  addresses: [],
  createdAt: u?.created_at ?? new Date().toISOString(),
});

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const init = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error || !data?.user) {
          setUser(null);
        } else {
          setUser(mapToUser(data.user));
        }
      } catch {
        setUser(null);
      }

      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ? mapToUser(session.user) : null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const isAuthenticated = !!user;

  // Exposed so AuthModal can immediately reflect the logged-in user
  // without waiting for the next onAuthStateChange tick
  const login = (u: User) => setUser(u);

  const signout = async () => {
    try {
      await supabase?.auth.signOut();
      setUser(null);
    } catch (e) {
      console.error("Signout error:", e);
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    signout,
  };
};