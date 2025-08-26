import { createClient } from "@supabase/supabase-js";
export const supa = createClient(
  import.meta.env.VITE_SB_URL,
  import.meta.env.VITE_SB_ANON
);
