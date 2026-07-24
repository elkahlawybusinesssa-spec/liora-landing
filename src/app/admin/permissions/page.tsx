"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { LockKeyhole, RefreshCw, ShieldCheck, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";

type AdminRole = "full_access" | "orders_only";

interface PermissionUser {
  user_id: string;
  email: string;
  role: AdminRole;
  created_at: string;
}

const PERMISSIONS_PASSWORD = "43211";

export default function PermissionsPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [users, setUsers] = useState<PermissionUser[] | null>(null);
  const [error, setError] = useState("");
  const [savingUserId, setSavingUserId] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setError("");
    const { data, error: fetchError } = await supabase
      .from("admin_permissions")
      .select("user_id,email,role,created_at")
      .order("created_at", { ascending: true });

    if (fetchError) {
      setUsers([]);
      setError("تعذر تحميل المستخدمين. تأكد من تنفيذ كود إعداد جدول الصلاحيات في Supabase.");
      return;
    }

    setUsers((data ?? []) as PermissionUser[]);
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("permissions_unlocked") === "true") {
      setUnlocked(true);
    }
  }, []);

  useEffect(() => {
    if (unlocked) loadUsers();
  }, [unlocked, loadUsers]);

  function unlock(event: FormEvent) {
    event.preventDefault();
    if (password !== PERMISSIONS_PASSWORD) {
      setPasswordError("كلمة المرور غير صحيحة");
      return;
    }
    sessionStorage.setItem("permissions_unlocked", "true");
    setPasswordError("");
    setUnlocked(true);
  }

  async function changeRole(user: PermissionUser, role: AdminRole) {
    setSavingUserId(user.user_id);
    setUsers((prev) => prev?.map((item) => item.user_id === user.user_id ? { ...item, role } : item) ?? prev);

    const { error: updateError } = await supabase
      .from("admin_permissions")
      .update({ role })
      .eq("user_id", user.user_id);

    if (updateError) {
      setError("تعذر حفظ الصلاحية");
      await loadUsers();
    } else {
      setError("");
    }
    setSavingUserId(null);
  }

  if (!unlocked) {
    return (
      <main className="min-h-screen bg-liora-50 px-4 py-12" dir="rtl">
        <form onSubmit={unlock} className="mx-auto max-w-md rounded-3xl bg-white p-6 shadow-sm ring-1 ring-liora-100">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-liora-100 text-liora-800">
            <LockKeyhole size={28} />
          </div>
          <h1 className="mt-4 text-center text-2xl font-black text-liora-900">الدخول إلى الصلاحيات</h1>
          <p className="mt-2 text-center text-sm text-liora-500">أدخل كلمة مرور صفحة الصلاحيات</p>
          <input
            type="password"
            inputMode="numeric"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="كلمة المرور"
            className="mt-6 w-full rounded-xl border border-liora-100 px-4 py-3 text-center text-lg font-bold outline-none focus:border-liora-400"
            autoFocus
          />
          {passwordError && <p className="mt-2 text-sm font-bold text-red-600">{passwordError}</p>}
          <button type="submit" className="mt-4 w-full rounded-xl bg-liora-800 px-4 py-3 font-bold text-white shadow">
            دخول
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-liora-50 px-3 py-8 sm:px-5" dir="rtl">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-black text-liora-900"><Users size={25} /> الصلاحيات</h1>
            <p className="mt-1 text-sm text-liora-500">تحديد ما يمكن لكل مستخدم رؤيته داخل لوحة الإدارة</p>
          </div>
          <button onClick={loadUsers} className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-liora-800 shadow ring-1 ring-liora-100">
            <RefreshCw size={16} /> تحديث
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-liora-100">
            <div className="flex items-center gap-2 font-black text-liora-900"><ShieldCheck size={20} /> صلاحية كاملة</div>
            <p className="mt-2 text-sm text-liora-600">تظهر له لوحة الإدارة كاملة: الطلبات، الليدز، الإحصائيات، الإعدادات والصلاحيات.</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-liora-100">
            <div className="flex items-center gap-2 font-black text-liora-900"><LockKeyhole size={20} /> الطلبات فقط</div>
            <p className="mt-2 text-sm text-liora-600">تظهر له الطلبات فقط، وتُخفى الليدز والإحصائيات والإعدادات والصلاحيات.</p>
          </div>
        </div>

        {error && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</p>}

        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-liora-100">
          <div className="hidden grid-cols-[1fr_220px] gap-4 border-b border-liora-100 bg-liora-50 px-5 py-3 text-sm font-black text-liora-800 sm:grid">
            <span>المستخدم</span>
            <span>الصلاحية</span>
          </div>

          {users === null ? (
            <p className="p-8 text-center text-liora-500">جارِ تحميل المستخدمين...</p>
          ) : users.length === 0 ? (
            <p className="p-8 text-center text-liora-500">لا يوجد مستخدمون داخل جدول الصلاحيات حتى الآن.</p>
          ) : (
            users.map((user) => (
              <div key={user.user_id} className="grid gap-3 border-b border-liora-50 px-5 py-4 last:border-0 sm:grid-cols-[1fr_220px] sm:items-center">
                <div>
                  <p className="font-bold text-liora-900" dir="ltr">{user.email}</p>
                  <p className="mt-1 text-xs text-liora-400">تمت الإضافة: {new Date(user.created_at).toLocaleDateString("en-GB")}</p>
                </div>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-liora-600 sm:hidden">الصلاحية</span>
                  <select
                    value={user.role}
                    disabled={savingUserId === user.user_id}
                    onChange={(event) => changeRole(user, event.target.value as AdminRole)}
                    className="rounded-xl border border-liora-100 bg-white px-3 py-2.5 text-sm font-bold text-liora-800 outline-none disabled:opacity-60"
                  >
                    <option value="full_access">صلاحية كاملة</option>
                    <option value="orders_only">الطلبات فقط</option>
                  </select>
                </label>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
