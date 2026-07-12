"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
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
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (signInError) {
      setError("بيانات الدخول غير صحيحة");
      return;
    }
    router.replace("/admin/orders");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-liora-950 px-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-3xl bg-white p-8 text-right shadow-2xl"
      >
        <h1 className="text-center text-2xl font-black text-liora-900">
          دخول لوحة الطلبات
        </h1>

        <div>
          <label className="mb-1 block text-sm font-bold text-liora-900">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            dir="ltr"
            className="w-full rounded-xl border border-liora-100 px-4 py-3 outline-none focus:border-liora-500 focus:ring-2 focus:ring-liora-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold text-liora-900">
            كلمة المرور
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            dir="ltr"
            className="w-full rounded-xl border border-liora-100 px-4 py-3 outline-none focus:border-liora-500 focus:ring-2 focus:ring-liora-200"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-liora-800 py-3 font-bold text-white transition hover:bg-liora-900 disabled:opacity-70"
        >
          {loading ? "جارِ الدخول..." : "دخول"}
        </button>
      </form>
    </main>
  );
}
