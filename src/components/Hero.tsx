"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star, BookOpen, PenTool, Gift, Check } from "lucide-react";
import { productImages } from "@/data/content";
import { trackInitiateCheckout } from "@/lib/pixels";

const highlights = [
  { icon: BookOpen, text: "5 كتب تعليمية" },
  { icon: PenTool, text: "5 أقلام هدية" },
  { icon: Gift, text: "8 هدايا إضافية" },
];

const features = [
  "الكتب قابلة للكتابة والمسح لأكثر من 1000 مرة",
  "الكتب من ورق متين ضد القطع",
  "8 هدايا مجانية لطفلك",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-liora-950 via-liora-800 to-liora-700 pb-16 pt-14 text-white">
      <motion.div
        className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-liora-400/30 blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute -right-16 top-40 h-64 w-64 rounded-full bg-gold-400/20 blur-3xl"
        animate={{ scale: [1.1, 1, 1.1] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      <div className="relative mx-auto max-w-6xl px-5">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto block w-fit rounded-full bg-white/10 px-4 py-1 text-center text-sm font-bold text-gold-400 ring-1 ring-gold-400/40 md:mx-0"
        >
          ‼️ خايفة كثرة الجوال تأثر على استعداد طفلك للروضة؟
        </motion.span>

        <div className="mt-6 grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="relative order-1 mx-auto w-full max-w-sm md:order-2"
          >
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <Image
                src={productImages.heroVertical}
                alt="مجموعة Liora التعليمية"
                width={500}
                height={700}
                className="w-full rounded-[2.5rem] object-cover shadow-2xl shadow-black/40 ring-4 ring-white/10"
                priority
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="order-2 text-center md:order-1 md:text-right"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="text-[1.6875rem] font-black leading-tight md:text-[2.25rem]"
            >
              مجموعة <span className="text-gradient">Liora</span> التعليمية
              <br />
              تبعد طفلك عن الشاشة… بمتعة حقيقية
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start"
            >
              {highlights.map((h) => (
                <span
                  key={h.text}
                  className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-bold text-white ring-1 ring-white/20"
                >
                  <h.icon size={16} className="text-gold-400" />
                  {h.text}
                </span>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58, duration: 0.7 }}
              className="mx-auto mt-3 max-w-md text-lg text-liora-100 md:mx-0"
            >
              خليه جاهز للروضة وهو يضحك ويستمتع
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.62, duration: 0.7 }}
              className="mx-auto mt-4 max-w-md space-y-2 text-right md:mx-0"
            >
              {features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-sm text-liora-100"
                >
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gold-500 text-liora-950">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.7 }}
              className="mt-6 flex flex-col items-center gap-3 md:items-start"
            >
              <div className="flex items-center gap-1 text-gold-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" strokeWidth={0} />
                ))}
                <span className="ms-2 text-sm text-liora-100">
                  +2,300 أم راضية عن المجموعة
                </span>
              </div>

              <motion.a
                href="#order"
                onClick={() => trackInitiateCheckout()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(240,201,94,0.5)",
                    "0 0 0 14px rgba(240,201,94,0)",
                  ],
                }}
                transition={{
                  boxShadow: { duration: 1.8, repeat: Infinity },
                }}
                className="rounded-full bg-gold-500 px-8 py-4 text-lg font-black text-liora-950 shadow-lg"
              >
                اطلبي مجموعتك الآن 🎁
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
