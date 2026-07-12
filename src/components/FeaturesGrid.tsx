"use client";

import { motion } from "framer-motion";
import { Eraser, SmartphoneNfc, GraduationCap, Target, LucideIcon } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { features } from "@/data/content";

const iconMap: Record<string, LucideIcon> = {
  eraser: Eraser,
  "smartphone-off": SmartphoneNfc,
  "graduation-cap": GraduationCap,
  target: Target,
};

export default function FeaturesGrid() {
  return (
    <section className="bg-liora-800 py-16 text-white">
      <div className="mx-auto max-w-6xl px-5">
        <AnimatedSection className="text-center">
          <h2 className="text-3xl font-black md:text-4xl">
            ليش الأمهات يفضلن <span className="text-gradient">Liora</span>؟
          </h2>
        </AnimatedSection>

        <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {features.map((f, i) => {
            const Icon = iconMap[f.icon];
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -8 }}
                className="rounded-2xl bg-white/10 p-6 text-center ring-1 ring-white/10 backdrop-blur"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500 text-liora-950">
                  <Icon size={26} />
                </div>
                <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-liora-100">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
