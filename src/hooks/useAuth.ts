import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@/types/user";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const normalizeUser = (u: any): User | null => {
    if (!u) return null;

    return {
      id: u.id,
      email: u.email ?? "",
      name: u.user_metadata?.name ?? u.email ?? "User",
      provider: "supabase",
      addresses: [],
      createdAt: u.created_at ?? new Date().toISOString(),
    };
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const init = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          setUser(null);
        } else {
          setUser(normalizeUser(data.user));
        }
      } catch (e) {
        console.error(e);
        setUser(null);
      }

      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(normalizeUser(session?.user));
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const isAuthenticated = !!user;

  const login = (u: User) => setUser(u);

  const signout = async () => {
    try {
      await supabase?.auth.signOut();
    } finally {
      setUser(null);
      window.location.href = "/";
    }
  };

  return { user, loading, isAuthenticated, login, signout };
};