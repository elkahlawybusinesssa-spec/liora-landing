"use client";

import { Calendar } from "lucide-react";

export interface DateRange {
  from: string | null;
  to: string | null;
}

const presets = [
  { label: "الكل", days: null },
  { label: "اليوم", days: 0 },
  { label: "أمس", days: 1, single: true },
  { label: "آخر 7 أيام", days: 7 },
  { label: "آخر 30 يوم", days: 30 },
];

function toDateInputValue(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function DateRangeFilter({
  value,
  onChange,
}: {
  value: DateRange;
  onChange: (range: DateRange) => void;
}) {
  function applyPreset(days: number | null, single?: boolean) {
    if (days === null) {
      onChange({ from: null, to: null });
      return;
    }
    const today = new Date();
    if (single) {
      const target = new Date(today);
      target.setDate(target.getDate() - days);
      onChange({
        from: toDateInputValue(target),
        to: toDateInputValue(target),
      });
      return;
    }
    const from = new Date(today);
    from.setDate(from.getDate() - days);
    onChange({ from: toDateInputValue(from), to: toDateInputValue(today) });
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-liora-100">
      <div className="flex items-center gap-1.5 text-sm font-bold text-liora-700">
        <Calendar size={16} />
        الفترة:
      </div>
      {presets.map((p) => (
        <button
          key={p.label}
          type="button"
          onClick={() => applyPreset(p.days, p.single)}
          className="rounded-full bg-liora-50 px-3 py-1.5 text-xs font-bold text-liora-800 transition hover:bg-liora-100"
        >
          {p.label}
        </button>
      ))}
      <div className="flex items-center gap-2">
        <input
          type="date"
          dir="ltr"
          value={value.from ?? ""}
          onChange={(e) => onChange({ ...value, from: e.target.value || null })}
          className="rounded-lg border border-liora-100 px-2 py-1 text-xs outline-none focus:border-liora-500"
        />
        <span className="text-xs text-liora-500">إلى</span>
        <input
          type="date"
          dir="ltr"
          value={value.to ?? ""}
          onChange={(e) => onChange({ ...value, to: e.target.value || null })}
          className="rounded-lg border border-liora-100 px-2 py-1 text-xs outline-none focus:border-liora-500"
        />
      </div>
    </div>
  );
}
