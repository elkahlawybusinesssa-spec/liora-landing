"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useAnimationFrame,
} from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { testimonials } from "@/data/content";

const SPEED_PX_PER_SEC = 35;

export default function Testimonials() {
  const loop = [...testimonials, ...testimonials];
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const isDragging = useRef(false);

  function wrap(value: number, trackWidth: number) {
    if (!trackWidth) return value;
    let wrapped = value % trackWidth;
    if (wrapped > 0) wrapped -= trackWidth;
    return wrapped;
  }

  useAnimationFrame((_, delta) => {
    const trackWidth = trackRef.current ? trackRef.current.scrollWidth / 2 : 0;
    if (!trackWidth || isDragging.current) return;
    const next = x.get() - (delta / 1000) * SPEED_PX_PER_SEC;
    x.set(wrap(next, trackWidth));
  });

  function handleDragEnd() {
    isDragging.current = false;
    const trackWidth = trackRef.current ? trackRef.current.scrollWidth / 2 : 0;
    x.set(wrap(x.get(), trackWidth));
  }

  return (
    <section className="bg-liora-50 py-16">
      <div className="mx-auto max-w-6xl px-5">
        <AnimatedSection className="text-center">
          <h2 className="text-3xl font-black text-liora-900 md:text-4xl">
            آراء العملاء بعد تجربة مجموعة Liora التعليمية
          </h2>
          <p className="mt-2 text-sm font-bold text-liora-700">
            👈 حركي التقييمات بإيدك يمين أو يسار 👉
          </p>
        </AnimatedSection>

        <div className="mt-8 overflow-hidden" dir="ltr">
          <motion.div
            ref={trackRef}
            dir="ltr"
            className="flex w-max cursor-grab gap-5 active:cursor-grabbing"
            style={{ x, touchAction: "pan-y" }}
            drag="x"
            dragConstraints={{ left: -Infinity, right: Infinity }}
            dragElastic={0.05}
            dragMomentum={false}
            onDragStart={() => {
              isDragging.current = true;
            }}
            onDragEnd={handleDragEnd}
          >
            {loop.map((t, i) => (
              <div
                key={t.name + i}
                className="flex w-72 flex-shrink-0 flex-col rounded-2xl bg-white p-6 text-center shadow ring-1 ring-liora-100"
              >
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={56}
                  height={56}
                  draggable={false}
                  className="mx-auto h-14 w-14 rounded-full object-cover ring-2 ring-liora-100"
                />
                <p className="mt-3 font-bold text-liora-900">
                  {t.name} — {t.city}
                </p>
                <div className="mt-1 flex justify-center gap-0.5 text-gold-500">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-liora-700">
                  {t.review}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
