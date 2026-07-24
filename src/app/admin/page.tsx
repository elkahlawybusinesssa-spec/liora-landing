"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/admin/orders");
    });
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/resolve-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const result = await response.json();

      if (!response.ok || !result.email) {
        setError("بيانات الدخول غير صحيحة");
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: result.email,
        password,
      });

      if (signInError) {
        setError("اسم المستخدم أو كلمة المرور غير صحيحة");
        return;
      }

      router.replace("/admin/orders");
    } catch {
      setError("تعذر تسجيل الدخول الآن");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-liora-950 px-5">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-3xl bg-white p-8 text-right shadow-2xl">
        <h1 className="text-center text-2xl font-black text-liora-900">دخول لوحة الطلبات</h1>

        <div>
          <label className="mb-1 block text-sm font-bold text-liora-900">اسم المستخدم</label>
          <input
            type="text"
            required
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            dir="ltr"
            placeholder="username"
            className="w-full rounded-xl border border-liora-100 px-4 py-3 outline-none focus:border-liora-500 focus:ring-2 focus:ring-liora-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold text-liora-900">كلمة المرور</label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            dir="ltr"
            className="w-full rounded-xl border border-liora-100 px-4 py-3 outline-none focus:border-liora-500 focus:ring-2 focus:ring-liora-200"
          />
        </div>

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>}

        <button type="submit" disabled={loading} className="w-full rounded-full bg-liora-800 py-3 font-bold text-white transition hover:bg-liora-900 disabled:opacity-70">
          {loading ? "جارِ الدخول..." : "دخول"}
        </button>
      </form>
    </main>
  );
}
