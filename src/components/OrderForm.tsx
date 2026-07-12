"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const cities = [
  "الرياض",
  "جدة",
  "مكة المكرمة",
  "المدينة المنورة",
  "الدمام",
  "الخبر",
  "الطائف",
  "تبوك",
  "أبها",
  "بريدة",
  "مدينة أخرى",
];

export default function OrderForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const westernized = e.target.value.replace(
      /[٠-٩]/g,
      (d) => String(d.charCodeAt(0) - 0x0660)
    );
    setPhone(westernized.replace(/\D/g, "").slice(0, 10));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const full_name = String(data.get("full_name") || "").trim();
    const city = String(data.get("city") || "").trim();
    const address = String(data.get("address") || "").trim();
    const notes = String(data.get("notes") || "").trim();

    if (!full_name || !phone || !city || !address) {
      setError("عبي كل الحقول المطلوبة عشان نقدر نوصلك الطلب");
      return;
    }

    if (!/^05\d{8}$/.test(phone)) {
      setError("رقم الجوال لازم يكون 10 أرقام ويبدأ بـ 05");
      return;
    }

    setLoading(true);
    const { error: insertError } = await supabase.from("orders").insert({
      full_name,
      phone,
      city,
      address,
      notes: notes || null,
    });
    setLoading(false);

    if (insertError) {
      setError("صار خطأ أثناء إرسال الطلب، حاولي مرة ثانية");
      return;
    }

    router.push(`/shokran?name=${encodeURIComponent(full_name)}&conv=1`);
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mx-auto mt-8 w-full max-w-md space-y-4 rounded-3xl bg-white p-6 text-right shadow-2xl"
    >
      <div>
        <label className="mb-1 block text-sm font-bold text-liora-900">
          الاسم الكامل
        </label>
        <input
          name="full_name"
          type="text"
          required
          placeholder="مثال: نورة العتيبي"
          className="w-full rounded-xl border border-liora-100 px-4 py-3 text-liora-950 outline-none transition focus:border-liora-500 focus:ring-2 focus:ring-liora-200"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold text-liora-900">
          رقم الجوال
        </label>
        <input
          name="phone"
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={10}
          required
          value={phone}
          onChange={handlePhoneChange}
          placeholder="05xxxxxxxx"
          className="w-full rounded-xl border border-liora-100 px-4 py-3 text-liora-950 outline-none transition focus:border-liora-500 focus:ring-2 focus:ring-liora-200"
          dir="ltr"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold text-liora-900">
          المدينة
        </label>
        <select
          name="city"
          required
          defaultValue=""
          className="w-full rounded-xl border border-liora-100 px-4 py-3 text-liora-950 outline-none transition focus:border-liora-500 focus:ring-2 focus:ring-liora-200"
        >
          <option value="" disabled>
            اختاري مدينتك
          </option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold text-liora-900">
          العنوان بالتفصيل
        </label>
        <input
          name="address"
          type="text"
          required
          placeholder="الحي، الشارع، رقم المبنى"
          className="w-full rounded-xl border border-liora-100 px-4 py-3 text-liora-950 outline-none transition focus:border-liora-500 focus:ring-2 focus:ring-liora-200"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold text-liora-900">
          ملاحظات (اختياري)
        </label>
        <textarea
          name="notes"
          rows={2}
          placeholder="أي تفاصيل إضافية تحبين تخبرينا فيها"
          className="w-full resize-none rounded-xl border border-liora-100 px-4 py-3 text-liora-950 outline-none transition focus:border-liora-500 focus:ring-2 focus:ring-liora-200"
        />
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600"
        >
          {error}
        </motion.p>
      )}

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.03 }}
        whileTap={{ scale: loading ? 1 : 0.97 }}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 py-4 text-lg font-black text-liora-950 shadow-lg transition disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            جارِ إرسال الطلب...
          </>
        ) : (
          "تأكيد الطلب 🎁"
        )}
      </motion.button>

      <p className="text-center text-xs text-liora-500">
        بتأكيدك الطلب، فريقنا بيتواصل معك خلال ساعات لتأكيد التوصيل
      </p>
    </motion.form>
  );
}
