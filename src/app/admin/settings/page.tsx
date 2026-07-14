"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { fetchSiteSettings, DEFAULT_SETTINGS, SiteSettings } from "@/lib/settings";

export default function SiteSettingsPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        router.replace("/admin");
        return;
      }
      setCheckingAuth(false);
      const s = await fetchSiteSettings();
      setSettings(s);
      setLoading(false);
    });
  }, [router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("site_settings")
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq("id", 1);

    setSaving(false);

    if (error) {
      setMessage("صار خطأ أثناء الحفظ");
      return;
    }

    setMessage("تم الحفظ بنجاح ✅");
    setTimeout(() => setMessage(""), 3000);
  }

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  if (checkingAuth || loading) return null;

  return (
    <main className="min-h-screen bg-liora-50 px-4 py-8" dir="rtl">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-liora-900">
            إعدادات الأسعار والشحن
          </h1>
          <Link
            href="/admin/orders"
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-liora-800 shadow ring-1 ring-liora-100"
          >
            <ArrowRight size={16} />
            رجوع للطلبات
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-liora-100"
        >
          <div>
            <h2 className="mb-3 text-lg font-black text-liora-900">
              الأسعار والخصم
            </h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-bold text-liora-900">
                  السعر الأصلي (مشطوب) — ريال
                </label>
                <input
                  type="number"
                  dir="ltr"
                  value={settings.original_price}
                  onChange={(e) => update("original_price", Number(e.target.value))}
                  className="w-full rounded-xl border border-liora-100 px-3 py-2 outline-none focus:border-liora-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-bold text-liora-900">
                    مجموعة واحدة
                  </label>
                  <input
                    type="number"
                    dir="ltr"
                    value={settings.price_1}
                    onChange={(e) => update("price_1", Number(e.target.value))}
                    className="w-full rounded-xl border border-liora-100 px-3 py-2 outline-none focus:border-liora-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold text-liora-900">
                    مجموعتين
                  </label>
                  <input
                    type="number"
                    dir="ltr"
                    value={settings.price_2}
                    onChange={(e) => update("price_2", Number(e.target.value))}
                    className="w-full rounded-xl border border-liora-100 px-3 py-2 outline-none focus:border-liora-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold text-liora-900">
                    3 مجموعات
                  </label>
                  <input
                    type="number"
                    dir="ltr"
                    value={settings.price_3}
                    onChange={(e) => update("price_3", Number(e.target.value))}
                    className="w-full rounded-xl border border-liora-100 px-3 py-2 outline-none focus:border-liora-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-liora-100 pt-6">
            <h2 className="mb-3 text-lg font-black text-liora-900">
              طريقة الشحن (توصيل للمنزل)
            </h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-bold text-liora-900">
                  العنوان
                </label>
                <input
                  value={settings.shipping_delivery_label}
                  onChange={(e) => update("shipping_delivery_label", e.target.value)}
                  className="w-full rounded-xl border border-liora-100 px-3 py-2 outline-none focus:border-liora-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-liora-900">
                  التكلفة (ريال)
                </label>
                <input
                  type="number"
                  dir="ltr"
                  value={settings.shipping_delivery_cost}
                  onChange={(e) => update("shipping_delivery_cost", Number(e.target.value))}
                  className="w-full rounded-xl border border-liora-100 px-3 py-2 outline-none focus:border-liora-500"
                />
              </div>
            </div>
          </div>

          {message && (
            <p className="rounded-lg bg-green-50 px-3 py-2 text-sm font-bold text-green-700">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-liora-800 py-3 font-bold text-white transition hover:bg-liora-900 disabled:opacity-70"
          >
            <Save size={18} />
            {saving ? "جارِ الحفظ..." : "حفظ التعديلات"}
          </button>

          <p className="text-center text-xs text-liora-500">
            التعديلات هتظهر على الموقع مباشرة بدون ما تحتاجي رفع كود جديد
          </p>
        </form>
      </div>
    </main>
  );
}
