"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gift, X } from "lucide-react";
import { trackInitiateCheckout } from "@/lib/pixels";

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
        <motion.a
          href="#order"
          onClick={() => trackInitiateCheckout()}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="fixed bottom-24 right-4 z-50 flex w-[calc(100%-2rem)] max-w-xs items-start gap-3 rounded-2xl bg-liora-900 p-4 text-white shadow-2xl ring-1 ring-white/10 sm:w-72 md:bottom-6"
        >
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gold-500 text-liora-950">
            <Gift size={22} />
          </span>
          <span className="flex-1">
            <span className="block text-base font-black leading-snug">
              🎁 8 هدايا مجانية مع طلبك اليوم
            </span>
            <span className="mt-1 block text-xs leading-relaxed text-liora-200">
              استيكرز تحفيزية، شهادة تقدير، جدول متابعة، 3 أقنعة ترفيهية،
              ولوحات تعليمية (ABC، أ ب ت، أرقام إنجليزي وعربي)
            </span>
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setVisible(false);
            }}
            className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20"
            aria-label="إغلاق"
          >
            <X size={14} />
          </button>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
