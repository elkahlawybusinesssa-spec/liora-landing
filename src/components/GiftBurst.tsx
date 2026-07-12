"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const emojis = ["🎉", "🎁", "✨", "🎊", "💜", "⭐"];

const particles = Array.from({ length: 24 }, (_, i) => {
  const angle = (i / 24) * Math.PI * 2 + Math.random() * 0.4;
  const distance = 120 + Math.random() * 160;
  return {
    id: i,
    emoji: emojis[i % emojis.length],
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance - 40,
    rotate: (Math.random() - 0.5) * 360,
    delay: Math.random() * 0.15,
    size: 18 + Math.random() * 16,
  };
});

export default function GiftBurst() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
    >
      {inView &&
        particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute left-1/2 top-1/2"
            style={{ fontSize: p.size }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
            animate={{
              x: p.x,
              y: p.y,
              opacity: 0,
              scale: 1,
              rotate: p.rotate,
            }}
            transition={{
              duration: 1.1,
              delay: p.delay,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {p.emoji}
          </motion.span>
        ))}
    </div>
  );
}
