"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { fetchSiteSettings, DEFAULT_SETTINGS, SiteSettings } from "@/lib/settings";

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
  const [quantity, setQuantity] = useState(1);
  const [shippingMethod] = useState<"delivery">("delivery");
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    fetchSiteSettings().then(setSettings);
  }, []);

  const quantityOptions = [
    { qty: 1, price: settings.price_1, label: "مجموعة واحدة", popular: false },
    { qty: 2, price: settings.price_2, label: "مجموعتين", popular: true },
    { qty: 3, price: settings.price_3, label: "3 مجموعات", popular: false },
  ];

  const shippingOptions = [
    {
      id: "delivery" as const,
      label: settings.shipping_delivery_label,
      note: "",
      cost: settings.shipping_delivery_cost,
    },
  ];

  const selectedTier =
    quantityOptions.find((q) => q.qty === quantity) ?? quantityOptions[0];
  const shippingCost =
    shippingOptions.find((s) => s.id === shippingMethod)?.cost ?? 0;
  const total = selectedTier.price + shippingCost;

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
      price: selectedTier.price,
      quantity: selectedTier.qty,
      shipping_method: shippingMethod,
      shipping_cost: shippingCost,
      source: "website",
    });
    setLoading(false);

    if (insertError) {
      setError("صار خطأ أثناء إرسال الطلب، حاولي مرة ثانية");
      return;
    }

    router.push(
      `/shokran?name=${encodeURIComponent(full_name)}&conv=1&value=${total}`
    );
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

      <div>
        <label className="mb-2 block text-sm font-bold text-liora-900">
          كام مجموعة تحبي تطلبي؟
        </label>
        <div className="grid grid-cols-3 gap-2">
          {quantityOptions.map((option) => {
            const selected = quantity === option.qty;
            const savings = option.qty * settings.price_1 - option.price;
            return (
              <button
                key={option.qty}
                type="button"
                onClick={() => setQuantity(option.qty)}
                className={`relative flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-center transition ${
                  savings > 0 ? "mt-2" : ""
                } ${
                  selected
                    ? "border-liora-500 bg-liora-50 ring-2 ring-liora-200"
                    : "border-liora-100"
                }`}
              >
                {savings > 0 && (
                  <span className="absolute -top-3 right-1/2 translate-x-1/2 rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-black text-liora-950 whitespace-nowrap">
                    وفري {savings} ريال
                  </span>
                )}
                <span className="text-sm font-bold text-liora-900">
                  {option.label}
                </span>
                <span className="text-lg font-black text-liora-800">
                  {option.price}
                  <span className="text-xs font-bold"> ريال</span>
                </span>
                {option.popular && (
                  <span className="mt-1 rounded-full bg-liora-100 px-2 py-0.5 text-[10px] font-black text-liora-700 whitespace-nowrap">
                    ⭐ الأكثر طلباً
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-liora-900">
          اختاري طريقة الشحن
        </label>
        <div className="space-y-2">
          {shippingOptions.map((option) => {
            const selected = shippingMethod === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setShippingMethod(option.id)}
                className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-right transition ${
                  selected
                    ? "border-liora-500 bg-liora-50 ring-2 ring-liora-200"
                    : "border-liora-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                      selected
                        ? "border-liora-600 bg-liora-600 text-white"
                        : "border-liora-200"
                    }`}
                  >
                    {selected && <Check size={12} strokeWidth={3} />}
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-liora-900">
                      {option.label}
                    </span>
                    {option.note && (
                      <span className="mt-0.5 block text-xs text-liora-500">
                        {option.note}
                      </span>
                    )}
                  </span>
                </div>
                <span className="flex-shrink-0 text-sm font-bold text-liora-800">
                  {option.cost === 0 ? "مجاني" : `${option.cost} ريال`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-liora-50 px-4 py-3">
        <span className="font-bold text-liora-900">الإجمالي</span>
        <span className="text-xl font-black text-liora-900">{total} ريال</span>
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
