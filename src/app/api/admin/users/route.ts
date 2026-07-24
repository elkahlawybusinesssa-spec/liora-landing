import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ghckapztoiimrmxtadpx.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

type AdminRole = "full_access" | "orders_only";

function normalizeUsername(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

export async function POST(request: Request) {
  try {
    if (!SERVICE_ROLE_KEY || !SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: "SERVER_NOT_CONFIGURED" }, { status: 500 });
    }

    const authorization = request.headers.get("authorization") || "";
    const accessToken = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";

    if (!accessToken) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const sessionClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    });
    const { data: sessionData, error: sessionError } = await sessionClient.auth.getUser(accessToken);

    if (sessionError || !sessionData.user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: permission } = await admin
      .from("admin_permissions")
      .select("role")
      .eq("user_id", sessionData.user.id)
      .maybeSingle();

    if (permission?.role !== "full_access") {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    const body = await request.json();
    const username = normalizeUsername(String(body.username || ""));
    const password = String(body.password || "");
    const role = body.role as AdminRole;

    if (!/^[a-z0-9._-]{3,30}$/.test(username)) {
      return NextResponse.json({ error: "INVALID_USERNAME" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "WEAK_PASSWORD" }, { status: 400 });
    }
    if (role !== "full_access" && role !== "orders_only") {
      return NextResponse.json({ error: "INVALID_ROLE" }, { status: 400 });
    }

    const email = `${username}@liora.local`;
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username },
    });

    if (createError || !created.user) {
      const duplicate = createError?.message?.toLowerCase().includes("already");
      return NextResponse.json({ error: duplicate ? "USERNAME_EXISTS" : "CREATE_FAILED" }, { status: duplicate ? 409 : 500 });
    }

    const { error: permissionError } = await admin.from("admin_permissions").upsert({
      user_id: created.user.id,
      email,
      username,
      role,
      updated_at: new Date().toISOString(),
    });

    if (permissionError) {
      await admin.auth.admin.deleteUser(created.user.id);
      return NextResponse.json({ error: "PERMISSION_SAVE_FAILED" }, { status: 500 });
    }

    return NextResponse.json({ user_id: created.user.id, username, role });
  } catch {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }
}
