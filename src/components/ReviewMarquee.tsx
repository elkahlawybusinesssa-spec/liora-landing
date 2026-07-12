"use client";

import {
  motion,
  useMotionValue,
  useAnimationFrame,
} from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const SPEED_PX_PER_SEC = 45;

export default function ReviewMarquee({
  images,
  reverse = false,
}: {
  images: string[];
  reverse?: boolean;
}) {
  const loop = [...images, ...images];
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const isDragging = useRef(false);
  const direction = reverse ? 1 : -1;

  function wrap(value: number, trackWidth: number) {
    if (!trackWidth) return value;
    let wrapped = value % trackWidth;
    if (wrapped > 0) wrapped -= trackWidth;
    return wrapped;
  }

  useAnimationFrame((_, delta) => {
    const trackWidth = trackRef.current ? trackRef.current.scrollWidth / 2 : 0;
    if (!trackWidth) return;
    if (isDragging.current) return;
    const next = x.get() + direction * (delta / 1000) * SPEED_PX_PER_SEC;
    x.set(wrap(next, trackWidth));
  });

  function handleDragEnd() {
    isDragging.current = false;
    const trackWidth = trackRef.current ? trackRef.current.scrollWidth / 2 : 0;
    x.set(wrap(x.get(), trackWidth));
  }

  return (
    <div className="overflow-hidden py-3" dir="ltr">
      <motion.div
        ref={trackRef}
        dir="ltr"
        className="flex w-max cursor-grab gap-4 active:cursor-grabbing"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -Infinity, right: Infinity }}
        dragElastic={0.05}
        onDragStart={() => {
          isDragging.current = true;
        }}
        onDragEnd={handleDragEnd}
      >
        {loop.map((src, i) => (
          <div
            key={i}
            className="h-40 w-32 flex-shrink-0 overflow-hidden rounded-2xl shadow-md ring-1 ring-liora-100 sm:h-48 sm:w-36"
          >
            <Image
              src={src}
              alt="مجموعة Liora"
              width={200}
              height={260}
              draggable={false}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
