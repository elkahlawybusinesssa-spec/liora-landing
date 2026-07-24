import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ghckapztoiimrmxtadpx.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function normalizeUsername(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

export async function POST(request: Request) {
  try {
    const { username } = await request.json();
    const normalized = normalizeUsername(String(username || ""));

    if (!normalized) {
      return NextResponse.json({ error: "USERNAME_REQUIRED" }, { status: 400 });
    }

    if (normalized.includes("@")) {
      return NextResponse.json({ email: normalized });
    }

    if (!SERVICE_ROLE_KEY) {
      return NextResponse.json({ email: `${normalized}@liora.local` });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data, error } = await admin
      .from("admin_permissions")
      .select("email,username")
      .or(`username.eq.${normalized},email.ilike.${normalized}@%`)
      .limit(1)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: "LOOKUP_FAILED" }, { status: 500 });
    }

    return NextResponse.json({ email: data?.email || `${normalized}@liora.local` });
  } catch {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }
}
