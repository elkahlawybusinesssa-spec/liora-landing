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
          className="fixed right-4 top-20 z-50 w-[calc(100%-2rem)] max-w-xs rounded-2xl bg-gradient-to-br from-liora-800 to-liora-950 p-4 text-white shadow-2xl ring-1 ring-white/10 sm:w-72"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gold-500 text-liora-950">
              <Gift size={22} />
            </span>
            <span className="flex-1">
              <span className="block text-base font-black leading-snug">
                🎁 8 هدايا مجانية مع طلبك اليوم
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-liora-200">
                استيكرات تحفيزية • شهادة تقدير • جدول متابعة
                <br />
                3 أقنعة ترفيهية • لوحات الحروف والأرقام
              </span>
            </span>
            <button
              type="button"
              onClick={() => setVisible(false)}
              className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20"
              aria-label="إغلاق"
            >
              <X size={14} />
            </button>
          </div>

          <a
            href="#gifts"
            onClick={() => setVisible(false)}
            className="mt-3 block w-full rounded-full bg-gold-500 py-2 text-center text-sm font-black text-liora-950 shadow"
          >
            شوفي الهدايا
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
