"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function CountdownTimer({
  minutes = 45,
}: {
  minutes?: number;
}) {
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : minutes * 60));
    }, 1000);
    return () => clearInterval(id);
  }, [minutes]);

  const h = Math.floor(secondsLeft / 3600);
  const m = Math.floor((secondsLeft % 3600) / 60);
  const s = secondsLeft % 60;

  const blocks = [
    { label: "ساعة", value: h },
    { label: "دقيقة", value: m },
    { label: "ثانية", value: s },
  ];

  return (
    <div className="flex items-center justify-center gap-3">
      {blocks.map((b) => (
        <div key={b.label} className="flex flex-col items-center">
          <motion.div
            key={b.value}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            className="flex h-14 w-14 items-center justify-center rounded-xl bg-liora-950 text-2xl font-black text-gold-400 shadow-inner"
          >
            {pad(b.value)}
          </motion.div>
          <span className="mt-1 text-xs font-semibold text-liora-700">
            {b.label}
          </span>
        </div>
      ))}
    </div>
  );
}
