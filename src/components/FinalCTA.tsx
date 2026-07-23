"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import OrderForm from "./OrderForm";
import { trackInitiateCheckout } from "@/lib/pixels";
import { fetchSiteSettings, DEFAULT_SETTINGS, SiteSettings } from "@/lib/settings";

type FinalCTAProps = {
  sectionId?: string;
  formId?: string;
};

export default function FinalCTA({
  sectionId = "order",
  formId = "order-form",
}: FinalCTAProps) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    fetchSiteSettings().then(setSettings);
  }, []);

  return (
    <section
      id={sectionId}
      className="relative overflow-hidden bg-gradient-to-b from-liora-800 to-liora-950 py-16 text-white"
    >
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-8 px-5 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center md:text-right"
        >
          <h2 className="text-3xl font-black md:text-4xl">
            جهزي طفلك للروضة
            <br />
            مع مجموعة <span className="text-gradient">Liora</span> اليوم
          </h2>

          <div className="mt-5 flex items-center justify-center gap-3 md:justify-start">
            <span className="text-4xl font-black text-gold-400">{settings.price_1} ريال</span>
            <span className="text-2xl font-bold text-gold-400 line-through decoration-white decoration-1">بدلاً من {settings.original_price} ريال</span>
          </div>
          <p className="mt-1 text-sm text-liora-200">
            + 8 هدايا مجانية لفترة محدودة
          </p>

          <ul className="mt-5 space-y-2 text-sm">
            {["الدفع عند الاستلام", "معاينة قبل الدفع", "توصيل خلال 2-4 أيام", "شحن مجاني"].map(
              (t) => (
                <li key={t} className="flex items-center justify-center gap-2 md:justify-start">
                  <Check size={16} className="text-gold-400" />
                  {t}
                </li>
              )
            )}
          </ul>

          <motion.a
            href={`#${formId}`}
            onClick={() => trackInitiateCheckout()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(240,201,94,0.5)",
                "0 0 0 16px rgba(240,201,94,0)",
              ],
            }}
            transition={{ boxShadow: { duration: 1.8, repeat: Infinity } }}
            className="mt-7 inline-block rounded-full bg-gold-500 px-10 py-4 text-xl font-black text-liora-950 shadow-xl md:hidden"
          >
            اطلبي الآن قبل نفاد الكمية
          </motion.a>
        </motion.div>

        <div id={formId}>
          <OrderForm />
        </div>
      </div>
    </section>
  );
}
