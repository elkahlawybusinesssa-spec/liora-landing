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
    const hideTimer = setTimeout(() => setVisible(false), 10000);
    return () => clearTimeout(hideTimer);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="#order"
          onClick={() => trackInitiateCheckout()}
          initial={{ x: 120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="fixed right-4 top-20 z-50 flex w-[calc(100%-2rem)] max-w-xs items-center gap-3 rounded-2xl bg-liora-900 py-3 pl-3 pr-4 text-white shadow-2xl ring-1 ring-white/10 sm:w-auto"
        >
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gold-500 text-liora-950">
            <Gift size={20} />
          </span>
          <span className="text-sm font-bold leading-snug">
            🎁 8 هدايا مجانية مع طلبك اليوم
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
