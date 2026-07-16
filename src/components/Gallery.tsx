"use client";

import {
  motion,
  useMotionValue,
  useAnimationFrame,
} from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import AnimatedSection from "./AnimatedSection";

const STORAGE_BASE =
  "https://ghckapztoiimrmxtadpx.supabase.co/storage/v1/object/public/catalog/catalog";

const shots = Array.from({ length: 4 }, (_, i) => `${STORAGE_BASE}/gallery-real/${i + 1}.png`);

const SPEED_PX_PER_SEC = 40;

export default function Gallery() {
  const loop = [...shots, ...shots];
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
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-5">
        <AnimatedSection className="text-center">
          <h2 className="text-3xl font-black text-liora-900 md:text-4xl">
            صور لمجموعة كتب Liora على الطبيعة 📷
          </h2>
          <p className="mt-2 text-sm font-bold text-liora-700">
            👈 حركي الصور بإيدك يمين أو يسار 👉
          </p>
        </AnimatedSection>

        <div className="mt-10 overflow-hidden" dir="ltr">
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
            {loop.map((src, i) => (
              <div
                key={i}
                className="aspect-[1448/1086] w-72 flex-shrink-0 overflow-hidden rounded-3xl shadow-lg sm:w-[420px]"
              >
                <Image
                  src={src}
                  alt="مجموعة Liora على الطبيعة"
                  width={1448}
                  height={1086}
                  draggable={false}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
