import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { safeUser } from "@/lib/userSafe";
import type { User } from "@/types/user";

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
          setUser(
            safeUser({
              id: data.user.id,
              email: data.user.email,
              name: data.user.user_metadata?.name,
              provider: data.user.app_metadata?.provider,
            })
          );
        }
      } catch {
        setUser(null);
      }

      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(
          session?.user
            ? safeUser({
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.name,
                provider: session.user.app_metadata?.provider,
              })
            : null
        );
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const isAuthenticated = !!user;

  // unified logout name (CRITICAL FIX)
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
    signout,
  };
};