"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Eye, EyeOff, LockKeyhole, Plus, RefreshCw, ShieldCheck, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";

type AdminRole = "full_access" | "orders_only";

interface PermissionUser {
  user_id: string;
  email: string;
  username?: string | null;
  role: AdminRole;
  created_at: string;
}

const PERMISSIONS_PASSWORD = "43211";

function normalizeUsernameInput(value: string) {
  const normalized = value.trim().toLowerCase().replace(/\s+/g, "");
  return normalized.includes("@") ? normalized.split("@")[0] : normalized;
}

export default function PermissionsPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [users, setUsers] = useState<PermissionUser[] | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newRole, setNewRole] = useState<AdminRole>("orders_only");
  const [resettingUserId, setResettingUserId] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);

  const loadUsers = useCallback(async () => {
    setError("");
    const { data, error: fetchError } = await supabase
      .from("admin_permissions")
      .select("user_id,email,username,role,created_at")
      .order("created_at", { ascending: true });

    if (fetchError) {
      setUsers([]);
      setError("تعذر تحميل المستخدمين. تأكد من تحديث جدول الصلاحيات في Supabase.");
      return;
    }
    setUsers((data ?? []) as PermissionUser[]);
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("permissions_unlocked") === "true") setUnlocked(true);
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

  async function addUser(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const username = normalizeUsernameInput(newUsername);
    if (!/^[a-z0-9._-]{3,30}$/.test(username)) {
      setError("اكتب اسم مستخدم إنجليزي من 3 إلى 30 حرفًا. لو كتبت إيميل هنستخدم الجزء اللي قبل @ تلقائيًا.");
      return;
    }
    if (newPassword.length < 6) {
      setError("كلمة المرور لازم تكون 6 أحرف على الأقل.");
      return;
    }

    setAdding(true);
    const { data: sessionData } = await supabase.auth.getSession();
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionData.session?.access_token || ""}`,
      },
      body: JSON.stringify({ username, password: newPassword, role: newRole }),
    });
    const result = await response.json();
    setAdding(false);

    if (!response.ok) {
      const messages: Record<string, string> = {
        USERNAME_EXISTS: "اسم المستخدم موجود بالفعل.",
        INVALID_USERNAME: "اسم المستخدم غير صالح.",
        WEAK_PASSWORD: "كلمة المرور ضعيفة.",
        FORBIDDEN: "ليس لديك صلاحية لإضافة مستخدم.",
        SERVER_NOT_CONFIGURED: "يلزم إضافة مفاتيح Supabase السرية في إعدادات Vercel.",
      };
      setError(messages[result.error] || "تعذر إضافة المستخدم.");
      return;
    }

    setNewUsername("");
    setNewPassword("");
    setNewRole("orders_only");
    setSuccess(`تم إنشاء المستخدم ${username} وإضافة الصلاحية بنجاح.`);
    await loadUsers();
  }

  async function changeRole(user: PermissionUser, role: AdminRole) {
    setSavingUserId(user.user_id);
    setUsers((prev) => prev?.map((item) => item.user_id === user.user_id ? { ...item, role } : item) ?? prev);
    const { error: updateError } = await supabase.from("admin_permissions").update({ role }).eq("user_id", user.user_id);
    if (updateError) {
      setError("تعذر حفظ الصلاحية");
      await loadUsers();
    } else setError("");
    setSavingUserId(null);
  }

  async function updatePassword(user: PermissionUser) {
    setError("");
    setSuccess("");
    if (resetPassword.length < 6) {
      setError("كلمة المرور الجديدة لازم تكون 6 أحرف على الأقل.");
      return;
    }
    setSavingUserId(user.user_id);
    const { data: sessionData } = await supabase.auth.getSession();
    const response = await fetch("/api/admin/users/password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionData.session?.access_token || ""}`,
      },
      body: JSON.stringify({ user_id: user.user_id, password: resetPassword }),
    });
    const result = await response.json();
    setSavingUserId(null);
    if (!response.ok) {
      const messages: Record<string, string> = {
        WEAK_PASSWORD: "كلمة المرور الجديدة ضعيفة.",
        FORBIDDEN: "ليس لديك صلاحية لتغيير كلمة المرور.",
        SERVER_NOT_CONFIGURED: "مفتاح Supabase السري غير مضاف في Vercel.",
      };
      setError(messages[result.error] || "تعذر تغيير كلمة المرور.");
      return;
    }
    setResettingUserId(null);
    setResetPassword("");
    setSuccess(`تم تغيير كلمة مرور ${user.username || user.email.split("@")[0]} بنجاح.`);
  }

  if (!unlocked) {
    return (
      <main className="min-h-screen bg-liora-50 px-4 py-12" dir="rtl">
        <form onSubmit={unlock} className="mx-auto max-w-md rounded-3xl bg-white p-6 shadow-sm ring-1 ring-liora-100">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-liora-100 text-liora-800"><LockKeyhole size={28} /></div>
          <h1 className="mt-4 text-center text-2xl font-black text-liora-900">الدخول إلى الصلاحيات</h1>
          <input type="password" inputMode="numeric" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="كلمة المرور" className="mt-6 w-full rounded-xl border border-liora-100 px-4 py-3 text-center text-lg font-bold outline-none" autoFocus />
          {passwordError && <p className="mt-2 text-sm font-bold text-red-600">{passwordError}</p>}
          <button type="submit" className="mt-4 w-full rounded-xl bg-liora-800 px-4 py-3 font-bold text-white">دخول</button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-liora-50 px-3 py-8 sm:px-5" dir="rtl">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h1 className="flex items-center gap-2 text-2xl font-black text-liora-900"><Users size={25} /> الصلاحيات</h1><p className="mt-1 text-sm text-liora-500">إنشاء المستخدمين وتحديد ما يظهر لهم داخل لوحة الإدارة</p></div>
          <button onClick={loadUsers} className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-liora-800 shadow ring-1 ring-liora-100"><RefreshCw size={16} /> تحديث</button>
        </div>

        <form onSubmit={addUser} className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-liora-100">
          <h2 className="flex items-center gap-2 font-black text-liora-900"><Plus size={20} /> إضافة مستخدم</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_220px_auto] md:items-end">
            <label className="flex flex-col gap-1"><span className="text-xs font-bold text-liora-600">اسم المستخدم</span><input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} dir="ltr" placeholder="مثال: ahmed" className="rounded-xl border border-liora-100 px-3 py-2.5 outline-none" /></label>
            <label className="flex flex-col gap-1"><span className="text-xs font-bold text-liora-600">كلمة المرور</span><div className="relative"><input type={showNewPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} dir="ltr" placeholder="6 أحرف على الأقل" className="w-full rounded-xl border border-liora-100 px-10 py-2.5 outline-none" /><button type="button" onClick={() => setShowNewPassword((value) => !value)} className="absolute inset-y-0 left-2 flex items-center text-liora-600" aria-label="إظهار أو إخفاء كلمة المرور">{showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
            <label className="flex flex-col gap-1"><span className="text-xs font-bold text-liora-600">نوع الصلاحية</span><select value={newRole} onChange={(e) => setNewRole(e.target.value as AdminRole)} className="rounded-xl border border-liora-100 bg-white px-3 py-2.5 font-bold"><option value="orders_only">الطلبات فقط</option><option value="full_access">صلاحية كاملة</option></select></label>
            <button type="submit" disabled={adding} className="rounded-xl bg-liora-800 px-5 py-2.5 font-bold text-white disabled:opacity-60">{adding ? "جارِ الإضافة..." : "إضافة"}</button>
          </div>
          <p className="mt-2 text-xs text-liora-500">تقدر تكتب اسم مستخدم فقط، أو تكتب إيميل وسيتم استخدام الجزء الموجود قبل @ تلقائيًا.</p>
        </form>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-liora-100"><div className="flex items-center gap-2 font-black text-liora-900"><ShieldCheck size={20} /> صلاحية كاملة</div><p className="mt-2 text-sm text-liora-600">لوحة الإدارة كاملة.</p></div>
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-liora-100"><div className="flex items-center gap-2 font-black text-liora-900"><LockKeyhole size={20} /> الطلبات فقط</div><p className="mt-2 text-sm text-liora-600">صفحة الطلبات فقط.</p></div>
        </div>

        {error && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</p>}
        {success && <p className="mt-5 rounded-xl bg-green-50 px-4 py-3 text-sm font-bold text-green-700">{success}</p>}

        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-liora-100">
          {users === null ? <p className="p-8 text-center text-liora-500">جارِ تحميل المستخدمين...</p> : users.length === 0 ? <p className="p-8 text-center text-liora-500">لا يوجد مستخدمون.</p> : users.map((user) => (
            <div key={user.user_id} className="grid gap-3 border-b border-liora-50 px-5 py-4 last:border-0 sm:grid-cols-[1fr_220px_auto] sm:items-center">
              <div><p className="font-bold text-liora-900" dir="ltr">{user.username || user.email.split("@")[0]}</p><p className="mt-1 text-xs text-liora-400">تمت الإضافة: {new Date(user.created_at).toLocaleDateString("en-GB")}</p></div>
              <select value={user.role} disabled={savingUserId === user.user_id} onChange={(e) => changeRole(user, e.target.value as AdminRole)} className="rounded-xl border border-liora-100 bg-white px-3 py-2.5 text-sm font-bold text-liora-800 outline-none disabled:opacity-60"><option value="full_access">صلاحية كاملة</option><option value="orders_only">الطلبات فقط</option></select>
              <button onClick={() => { setResettingUserId(user.user_id); setResetPassword(""); }} className="rounded-xl bg-liora-50 px-3 py-2.5 text-sm font-bold text-liora-800 ring-1 ring-liora-100">تغيير كلمة المرور</button>
              {resettingUserId === user.user_id && <div className="sm:col-span-3 flex flex-col gap-2 rounded-xl bg-liora-50 p-3 sm:flex-row sm:items-center"><div className="relative flex-1"><input type={showResetPassword ? "text" : "password"} value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} placeholder="اكتب كلمة المرور الجديدة" className="w-full rounded-xl border border-liora-100 bg-white px-10 py-2.5 outline-none" /><button type="button" onClick={() => setShowResetPassword((value) => !value)} className="absolute inset-y-0 left-2 flex items-center text-liora-600">{showResetPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div><button onClick={() => updatePassword(user)} disabled={savingUserId === user.user_id} className="rounded-xl bg-liora-800 px-4 py-2.5 font-bold text-white disabled:opacity-60">حفظ كلمة المرور الجديدة</button><button onClick={() => setResettingUserId(null)} className="rounded-xl bg-white px-4 py-2.5 font-bold text-liora-700 ring-1 ring-liora-100">إلغاء</button></div>}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
