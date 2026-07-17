"use client";

import { motion } from "framer-motion";
import { Truck, RotateCcw } from "lucide-react";

const items = [
  { icon: Truck, text: "توصيل سريع لكل مناطق المملكة" },
  { icon: RotateCcw, text: "استبدال مجاني خلال 14 يوم" },
];

export default function TopBar() {
  return (
    <div className="relative overflow-hidden bg-liora-800 py-2 text-white" dir="ltr">
      <motion.div
        dir="ltr"
        className="flex w-max gap-10 whitespace-nowrap px-4 text-sm font-medium"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 18, ease: "linear", repeat: Infinity }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-2">
            <item.icon size={16} className="text-gold-400" />
            {item.text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
