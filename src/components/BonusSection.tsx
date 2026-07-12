"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Gift } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import CountdownTimer from "./CountdownTimer";
import ReviewMarquee from "./ReviewMarquee";
import { productImages, reviewShots } from "@/data/content";
import { trackInitiateCheckout } from "@/lib/pixels";
import GiftBurst from "./GiftBurst";

export default function BonusSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-liora-50 to-white py-16">
      <GiftBurst />
      <AnimatedSection className="mx-auto max-w-3xl px-5 text-center">
        <motion.div
          animate={{ rotate: [0, -8, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-500 text-liora-950"
        >
          <Gift size={28} />
        </motion.div>

        <h2 className="mt-4 text-3xl font-black text-liora-900 md:text-4xl">
          لفترة محدودة ⏳ 8 هدايا إضافية من Liora 🎁✨
        </h2>
        <p className="mt-2 text-liora-700">
          العرض ينتهي خلال:
        </p>

        <div className="mt-4">
          <CountdownTimer minutes={45} />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-8 max-w-sm overflow-hidden rounded-3xl shadow-xl"
        >
          <Image
            src={productImages.giftsBonus}
            alt="هدايا إضافية من Liora"
            width={600}
            height={600}
            className="w-full object-cover"
          />
        </motion.div>

        <div className="-mx-5">
          <ReviewMarquee images={[...reviewShots].reverse()} reverse />
        </div>

        <motion.a
          href="#order"
          onClick={() => trackInitiateCheckout()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 inline-block rounded-full bg-gold-500 px-9 py-4 text-lg font-black text-liora-950 shadow-lg"
        >
          احجزي هداياك قبل ما تخلص
        </motion.a>
      </AnimatedSection>
    </section>
  );
}
