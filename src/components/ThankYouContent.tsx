"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, MessageCircle, Home } from "lucide-react";
import { trackOrderConversion } from "@/lib/pixels";

const sparkles = Array.from({ length: 10 });

export default function ThankYouContent({
  name,
  trackConversion,
}: {
  name: string;
  trackConversion: boolean;
}) {
  const fired = useRef(false);

  useEffect(() => {
    if (!trackConversion || fired.current) return;
    fired.current = true;
    trackOrderConversion();
  }, [trackConversion]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-liora-950 via-liora-800 to-liora-700 px-5 py-16 text-center text-white">
      {sparkles.map((_, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
          }}
          initial={{ opacity: 0, y: 0, rotate: 0 }}
          animate={{ opacity: [0, 1, 0], y: -40, rotate: 180 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.35,
            ease: "easeInOut",
          }}
        >
          {["✨", "🎁", "💜", "⭐"][i % 4]}
        </motion.span>
      ))}

      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
        className="flex h-24 w-24 items-center justify-center rounded-full bg-gold-500 text-liora-950 shadow-2xl"
      >
        <CheckCircle2 size={52} strokeWidth={2.5} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-6 text-3xl font-black md:text-4xl"
      >
        تم استلام طلبك{name ? ` يا ${name}` : ""}! 🎉
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.6 }}
        className="mt-3 max-w-md text-lg text-liora-100"
      >
        فريقنا بيتواصل معك خلال ساعات لتأكيد الطلب وتحديد موعد التوصيل.
        هدايا Liora الـ 8 محجوزة لك ✨
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
      >
        <a
          href="https://wa.me/966501712904"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 font-bold text-white shadow-lg transition hover:scale-105"
        >
          <MessageCircle size={20} />
          تواصلي معنا واتساب
        </a>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 font-bold text-white ring-1 ring-white/30 transition hover:scale-105"
        >
          <Home size={20} />
          رجوع للصفحة الرئيسية
        </Link>
      </motion.div>
    </main>
  );
}
