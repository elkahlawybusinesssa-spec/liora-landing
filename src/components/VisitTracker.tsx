"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function VisitTracker() {
  useEffect(() => {
    if (sessionStorage.getItem("liora_visit_logged")) return;
    sessionStorage.setItem("liora_visit_logged", "1");
    supabase.from("page_views").insert({ path: window.location.pathname }).then();
  }, []);

  return null;
}
