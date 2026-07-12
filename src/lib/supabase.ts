import { createClient } from "@supabase/supabase-js";

// Anon/publishable key — safe to expose client-side, RLS only allows inserts.
const SUPABASE_URL = "https://ghckapztoiimrmxtadpx.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoY2thcHp0b2lpbXJteHRhZHB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2OTQwODEsImV4cCI6MjA5OTI3MDA4MX0.Jttuz2Uo1iciqBfarJYBH0ZwuAwyFww3ki-aS94kcwI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
