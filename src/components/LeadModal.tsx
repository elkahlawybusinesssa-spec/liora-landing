"use client";

import { useState, FormEvent } from "react";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface EditableLead {
  id: string;
  full_name: string;
  phone: string;
  notes: string | null;
  source: string;
}

export default function LeadModal({
  lead,
  onClose,
  onSaved,
}: {
  lead?: EditableLead | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isEdit = !!lead;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const data = new FormData(e.currentTarget);
    const full_name = String(data.get("full_name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const source = String(data.get("source") || "whatsapp");
    const notes = String(data.get("notes") || "").trim();

    if (!full_name || !phone) {
      setError("الاسم ورقم الجوال مطلوبين");
      return;
    }

    const payload = { full_name, phone, source, notes: notes || null };

    setSaving(true);
    const { error: saveError } = isEdit
      ? await supabase.from("leads").update(payload).eq("id", lead!.id)
      : await supabase.from("leads").insert(payload);
    setSaving(false);

    if (saveError) {
      setError("صار خطأ أثناء حفظ الليد");
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
            {isEdit ? "تعديل الليد" : "إضافة ليد مهتم"}
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
              defaultValue={lead?.full_name}
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
              defaultValue={lead?.phone}
              className="w-full rounded-xl border border-liora-100 px-3 py-2 outline-none focus:border-liora-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-liora-900">
              مصدر العميل
            </label>
            <select
              name="source"
              defaultValue={lead?.source ?? "whatsapp"}
              className="w-full rounded-xl border border-liora-100 px-3 py-2 outline-none focus:border-liora-500"
            >
              <option value="whatsapp">واتساب</option>
              <option value="website">الموقع</option>
              <option value="other">مصدر آخر</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-liora-900">
              ملاحظات
            </label>
            <textarea
              name="notes"
              rows={3}
              defaultValue={lead?.notes ?? ""}
              placeholder="سبب الاهتمام، آخر تواصل، إلخ"
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
          {saving ? "جارِ الحفظ..." : isEdit ? "حفظ التعديلات" : "حفظ الليد"}
        </button>
      </form>
    </div>
  );
}
