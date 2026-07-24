import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ghckapztoiimrmxtadpx.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJIUzI1NiIsInJlZiI6ImdoY2thcHp0b2lpbXJteHRhZHB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2OTQwODEsImV4cCI6MjA5OTI3MDA4MX0.Jttuz2Uo1iciqBfarJYBH0ZwuAwyFww3ki-aS94kcwI";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  try {
    if (!SERVICE_ROLE_KEY) return NextResponse.json({ error: "SERVER_NOT_CONFIGURED" }, { status: 500 });

    const authorization = request.headers.get("authorization") || "";
    const accessToken = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
    if (!accessToken) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    const sessionClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    });
    const { data: sessionData, error: sessionError } = await sessionClient.auth.getUser(accessToken);
    if (sessionError || !sessionData.user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data: permission } = await admin.from("admin_permissions").select("role").eq("user_id", sessionData.user.id).maybeSingle();
    if (permission?.role !== "full_access") return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

    const body = await request.json();
    const userId = String(body.user_id || "");
    const password = String(body.password || "");
    if (!userId) return NextResponse.json({ error: "INVALID_USER" }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ error: "WEAK_PASSWORD" }, { status: 400 });

    const { error } = await admin.auth.admin.updateUserById(userId, { password });
    if (error) return NextResponse.json({ error: "UPDATE_FAILED" }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }
}
