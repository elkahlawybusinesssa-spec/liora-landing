import { ShieldCheck, Banknote } from "lucide-react";

const items = [
  { icon: ShieldCheck, text: "ضمان حق المعاينة قبل الدفع" },
  { icon: Banknote, text: "الدفع عند الاستلام" },
];

export default function PromoBanner() {
  return (
    <div className="bg-gold-500 py-2 text-liora-950">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 text-center text-xs font-bold sm:gap-x-4 sm:text-sm">
        {items.map((item, i) => (
          <span key={item.text} className="flex items-center gap-3">
            {i > 0 && <span className="text-liora-950/40">|</span>}
            <span className="flex items-center gap-1.5">
              <item.icon size={15} />
              {item.text}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
