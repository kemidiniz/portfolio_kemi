import { createClient } from "@supabase/supabase-js";
import { publicSupabaseConfig } from "../config/publicSupabase";

const url = import.meta.env?.VITE_SUPABASE_URL || publicSupabaseConfig.url;
const key =
  import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env?.VITE_SUPABASE_ANON_KEY ||
  publicSupabaseConfig.publishableKey;
export const supabase =
  url && key
    ? createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null;
