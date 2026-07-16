"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gift, X } from "lucide-react";

export default function GiftBadge() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const hideTimer = setTimeout(() => setVisible(false), 12000);
    return () => clearTimeout(hideTimer);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="fixed right-3 top-20 z-50 w-[calc(100%-1.5rem)] max-w-[15rem] rounded-xl bg-gradient-to-br from-liora-800 to-liora-950 p-3 text-white shadow-2xl ring-1 ring-white/10 sm:w-60"
        >
          <div className="flex items-start gap-2">
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gold-500 text-liora-950">
              <Gift size={16} />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-black leading-snug">
                🎁 8 هدايا مجانية مع طلبك اليوم
              </span>
              <span className="mt-1 block text-[10px] leading-relaxed text-liora-200">
                استيكرات تحفيزية • شهادة تقدير • جدول متابعة
                <br />
                3 أقنعة ترفيهية • لوحات الحروف والأرقام
              </span>
            </span>
            <button
              type="button"
              onClick={() => setVisible(false)}
              className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20"
              aria-label="إغلاق"
            >
              <X size={12} />
            </button>
          </div>

          <a
            href="#gifts"
            onClick={() => setVisible(false)}
            className="mt-2 block w-full rounded-full bg-gold-500 py-1.5 text-center text-xs font-black text-liora-950 shadow"
          >
            شوفي الهدايا
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
