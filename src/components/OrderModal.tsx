"use client";

import { useEffect, useState, FormEvent } from "react";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { STATUS_OPTIONS } from "@/lib/orderStatus";
import { fetchSiteSettings, DEFAULT_SETTINGS, SiteSettings } from "@/lib/settings";

interface EditableOrder {
  id: string;
  full_name: string;
  phone: string;
  product: string | null;
  price: number | null;
  quantity?: number | null;
  city: string;
  address: string;
  status: string;
  source: string | null;
  notes: string | null;
  created_at?: string;
}

function toLocalInputValue(iso?: string) {
  const d = iso ? new Date(iso) : new Date();
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export default function OrderModal({
  order,
  onClose,
  onSaved,
}: {
  order?: EditableOrder | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [sources, setSources] = useState<string[]>(["واتساب", "الموقع"]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [quantity, setQuantity] = useState(order?.quantity ?? 1);
  const [price, setPrice] = useState(order?.price ?? DEFAULT_SETTINGS.price_1);
  const isEdit = !!order;

  useEffect(() => {
    supabase
      .from("orders")
      .select("source")
      .then(({ data }) => {
        if (!data) return;
        const custom = data
          .map((row) => row.source)
          .filter((s): s is string => !!s && s !== "whatsapp" && s !== "website");
        setSources((prev) => Array.from(new Set([...prev, ...custom])));
      });
  }, []);

  useEffect(() => {
    fetchSiteSettings().then((s) => {
      setSettings(s);
      if (!isEdit) setPrice(s.price_1);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const quantityOptions = [
    { qty: 1, price: settings.price_1, label: "مجموعة واحدة" },
    { qty: 2, price: settings.price_2, label: "مجموعتين" },
    { qty: 3, price: settings.price_3, label: "3 مجموعات" },
  ];

  function handleQuantitySelect(qty: number, tierPrice: number) {
    setQuantity(qty);
    setPrice(tierPrice);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const data = new FormData(e.currentTarget);
    const full_name = String(data.get("full_name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const product = String(data.get("product") || "").trim();
    const city = String(data.get("city") || "").trim();
    const address = String(data.get("address") || "").trim();
    const status = String(data.get("status") || "new");
    const source = String(data.get("source") || "whatsapp");
    const notes = String(data.get("notes") || "").trim();
    const createdAtLocal = String(data.get("created_at") || "");

    if (!full_name || !phone) {
      setError("الاسم ورقم الجوال مطلوبين");
      return;
    }

    const payload = {
      full_name,
      phone,
      product,
      price,
      quantity,
      city,
      address,
      status,
      source,
      notes: notes || null,
      ...(createdAtLocal && { created_at: new Date(createdAtLocal).toISOString() }),
    };

    setSaving(true);
    const { error: saveError } = isEdit
      ? await supabase.from("orders").update(payload).eq("id", order!.id)
      : await supabase.from("orders").insert(payload);
    setSaving(false);

    if (saveError) {
      setError("صار خطأ أثناء حفظ الطلب");
      return;
    }

    onSaved();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 text-right shadow-2xl"
        dir="rtl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-liora-900">
            {isEdit ? "تعديل الطلب" : "إضافة طلب يدوي"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-liora-50 text-liora-800"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-sm font-bold text-liora-900">
              اسم العميل *
            </label>
            <input
              name="full_name"
              required
              defaultValue={order?.full_name}
              className="w-full rounded-xl border border-liora-100 px-3 py-2 outline-none focus:border-liora-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-liora-900">
              رقم الجوال *
            </label>
            <input
              name="phone"
              required
              dir="ltr"
              defaultValue={order?.phone}
              className="w-full rounded-xl border border-liora-100 px-3 py-2 outline-none focus:border-liora-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-liora-900">
              المنتج
            </label>
            <input
              name="product"
              defaultValue={order?.product ?? "مجموعة Liora التعليمية"}
              className="w-full rounded-xl border border-liora-100 px-3 py-2 outline-none focus:border-liora-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-liora-900">
              عدد المجموعات
            </label>
            <div className="grid grid-cols-3 gap-2">
              {quantityOptions.map((opt) => (
                <button
                  key={opt.qty}
                  type="button"
                  onClick={() => handleQuantitySelect(opt.qty, opt.price)}
                  className={`rounded-xl border px-2 py-2 text-center text-sm font-bold transition ${
                    quantity === opt.qty
                      ? "border-liora-500 bg-liora-50 text-liora-900 ring-2 ring-liora-200"
                      : "border-liora-100 text-liora-700"
                  }`}
                >
                  {opt.label}
                  <span className="mt-0.5 block text-xs font-black text-liora-800">
                    {opt.price} ريال
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-liora-900">
              السعر (ريال)
            </label>
            <input
              name="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              dir="ltr"
              className="w-full rounded-xl border border-liora-100 px-3 py-2 outline-none focus:border-liora-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-liora-900">
              المدينة
            </label>
            <input
              name="city"
              defaultValue={order?.city}
              className="w-full rounded-xl border border-liora-100 px-3 py-2 outline-none focus:border-liora-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-liora-900">
              العنوان
            </label>
            <input
              name="address"
              defaultValue={order?.address}
              className="w-full rounded-xl border border-liora-100 px-3 py-2 outline-none focus:border-liora-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-liora-900">
              مصدر العميل
            </label>
            <input
              name="source"
              list="source-options"
              defaultValue={
                order?.source === "whatsapp"
                  ? "واتساب"
                  : order?.source === "website"
                  ? "الموقع"
                  : order?.source ?? "واتساب"
              }
              placeholder="اكتبي مصدر جديد أو اختاري من القائمة"
              className="w-full rounded-xl border border-liora-100 px-3 py-2 outline-none focus:border-liora-500"
            />
            <datalist id="source-options">
              {sources.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-liora-900">
              تاريخ الطلب
            </label>
            <input
              name="created_at"
              type="datetime-local"
              dir="ltr"
              defaultValue={toLocalInputValue(order?.created_at)}
              className="w-full rounded-xl border border-liora-100 px-3 py-2 outline-none focus:border-liora-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-liora-900">
              حالة الطلب
            </label>
            <select
              name="status"
              defaultValue={order?.status ?? "new"}
              className="w-full rounded-xl border border-liora-100 px-3 py-2 outline-none focus:border-liora-500"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-liora-900">
              ملاحظات
            </label>
            <textarea
              name="notes"
              rows={2}
              defaultValue={order?.notes ?? ""}
              className="w-full resize-none rounded-xl border border-liora-100 px-3 py-2 outline-none focus:border-liora-500"
            />
          </div>
        </div>

        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-5 w-full rounded-full bg-liora-800 py-3 font-bold text-white transition hover:bg-liora-900 disabled:opacity-70"
        >
          {saving ? "جارِ الحفظ..." : isEdit ? "حفظ التعديلات" : "حفظ الطلب"}
        </button>
      </form>
    </div>
  );
}
