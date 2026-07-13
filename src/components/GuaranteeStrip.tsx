import { ShieldCheck, PackageCheck, Banknote } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const items = [
  { icon: ShieldCheck, title: "معاينة قبل الدفع", desc: "تفتحين الطلب وتشوفين المنتج قبل ما تدفعين" },
  { icon: Banknote, title: "الدفع عند الاستلام", desc: "بدون أي مبلغ مقدم أو مخاطرة" },
  { icon: PackageCheck, title: "استبدال مجاني", desc: "خلال 14 يوم من الاستلام بدون أسئلة" },
];

export default function GuaranteeStrip() {
  return (
    <section className="bg-liora-900 py-10 text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-3 gap-2 px-4 sm:gap-6 sm:px-5">
        {items.map((item, i) => (
          <AnimatedSection
            key={item.title}
            delay={i * 0.1}
            className="flex flex-col items-center gap-2 text-center"
          >
            <item.icon size={24} className="shrink-0 text-gold-400 sm:h-[30px] sm:w-[30px]" />
            <p className="text-xs font-bold sm:text-base">{item.title}</p>
            <p className="text-[11px] text-liora-100 sm:text-sm">{item.desc}</p>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
