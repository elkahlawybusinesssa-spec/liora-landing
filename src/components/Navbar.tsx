"use client";

import { motion } from "framer-motion";
import { trackInitiateCheckout } from "@/lib/pixels";

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-40 border-b border-liora-100 bg-white/90 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <span className="text-2xl font-black text-liora-800">
          Liora<span className="text-gold-500">.</span>
        </span>
        <a
          href="/#order"
          onClick={() => trackInitiateCheckout()}
          className="rounded-full bg-liora-800 px-5 py-2 text-sm font-bold text-white shadow-md shadow-liora-800/20 transition hover:scale-105 hover:bg-liora-900"
        >
          اطلبي الآن
        </a>
      </div>

      <div className="border-t border-gold-500/20 bg-liora-950 px-3 py-2 text-center text-[11px] font-black text-gold-400 sm:text-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 whitespace-nowrap sm:gap-4">
          <span>حق المعاينة قبل الاستلام</span>
          <span className="text-gold-500/70">•</span>
          <span>الشحن مجاني</span>
          <span className="text-gold-500/70">•</span>
          <span>الدفع بعد الاستلام</span>
        </div>
      </div>
    </motion.header>
  );
}
