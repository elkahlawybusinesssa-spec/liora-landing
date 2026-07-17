"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function VisitTracker() {
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const key = `liora_visit_logged_${today}`;
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, "1");
    supabase.from("page_views").insert({ path: window.location.pathname }).then();
  }, []);

  return null;
}
