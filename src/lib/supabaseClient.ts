import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (e) {
    console.error("Supabase client creation failed:", e);
    supabase = null;
  }
} else {
  console.warn(
    "⚠️ Supabase NOT initialized — VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing."
  );
}

export { supabase };