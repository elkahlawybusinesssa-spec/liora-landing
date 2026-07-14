"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { trackInitiateCheckout } from "@/lib/pixels";
import { fetchSiteSettings, DEFAULT_SETTINGS, SiteSettings } from "@/lib/settings";

export default function StickyMobileCTA() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    fetchSiteSettings().then(setSettings);
  }, []);

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-3 border-t border-liora-100 bg-white/95 px-4 py-3 backdrop-blur md:hidden"
    >
      <div>
        <p className="text-xs text-liora-500 line-through">{settings.original_price} ريال</p>
        <p className="text-lg font-black text-liora-900">{settings.price_1} ريال</p>
      </div>
      <motion.a
        whileTap={{ scale: 0.95 }}
        href="#order-form"
        onClick={() => trackInitiateCheckout()}
        className="flex-1 rounded-full bg-gold-500 py-3 text-center text-sm font-black text-liora-950 shadow-md"
      >
        اطلبي الآن 🎁
      </motion.a>
    </motion.div>
  );
}
