import { Clock, ShieldCheck, Banknote } from "lucide-react";

const items = [
  { icon: Clock, text: "لفترة محدودة" },
  { icon: ShieldCheck, text: "ضمان حق المعاينة قبل الدفع" },
  { icon: Banknote, text: "الدفع عند الاستلام" },
];

export default function PromoBanner() {
  return (
    <div className="bg-gold-500 py-1.5 text-liora-950">
      <div className="mx-auto flex max-w-6xl flex-nowrap items-center justify-center gap-x-1.5 overflow-hidden px-2 text-center text-[9px] font-bold sm:gap-x-3 sm:text-xs">
        {items.map((item, i) => (
          <span key={item.text} className="flex flex-shrink-0 items-center gap-2">
            {i > 0 && <span className="text-liora-950/40">|</span>}
            <span className="flex items-center gap-1">
              <item.icon size={12} className="flex-shrink-0" />
              <span className="whitespace-nowrap">{item.text}</span>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
