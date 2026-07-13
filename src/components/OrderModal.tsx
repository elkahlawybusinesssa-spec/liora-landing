"use client";

import { useState, FormEvent } from "react";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { STATUS_OPTIONS } from "@/lib/orderStatus";

interface EditableOrder {
  id: string;
  full_name: string;
  phone: string;
  product: string | null;
  price: number | null;
  city: string;
  address: string;
  status: string;
  source: string | null;
  notes: string | null;
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
  const isEdit = !!order;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const data = new FormData(e.currentTarget);
    const full_name = String(data.get("full_name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const product = String(data.get("product") || "").trim();
    const price = Number(data.get("price") || 0);
    const city = String(data.get("city") || "").trim();
    const address = String(data.get("address") || "").trim();
    const status = String(data.get("status") || "new");
    const source = String(data.get("source") || "whatsapp");
    const notes = String(data.get("notes") || "").trim();

    if (!full_name || !phone) {
      setError("الاسم ورقم الجوال مطلوبين");
      return;
    }

    const payload = {
      full_name,
      phone,
      product,
      price,
      city,
      address,
      status,
      source,
      notes: notes || null,
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
              السعر (ريال)
            </label>
            <input
              name="price"
              type="number"
              defaultValue={order?.price ?? 179}
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
            <select
              name="source"
              defaultValue={order?.source ?? "whatsapp"}
              className="w-full rounded-xl border border-liora-100 px-3 py-2 outline-none focus:border-liora-500"
            >
              <option value="whatsapp">واتساب</option>
              <option value="website">الموقع</option>
            </select>
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
