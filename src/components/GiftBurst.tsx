"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const emojis = ["🎉", "🎁", "✨", "🎊", "💜", "⭐", "🎈"];

function buildParticles() {
  return Array.from({ length: 60 }, (_, i) => {
    const angle = (i / 60) * Math.PI * 2 + Math.random() * 0.5;
    const distance = 260 + Math.random() * 420;
    return {
      id: i,
      emoji: emojis[i % emojis.length],
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      rotate: (Math.random() - 0.5) * 720,
      delay: Math.random() * 0.2,
      size: 26 + Math.random() * 34,
    };
  });
}

export default function GiftBurst() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [mounted, setMounted] = useState(false);
  const [particles] = useState(buildParticles);

  useEffect(() => setMounted(true), []);

  const overlay = inView && (
    <div className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
      <motion.div
        className="absolute h-24 w-24 rounded-full bg-gold-400"
        initial={{ opacity: 0.9, scale: 0 }}
        animate={{ opacity: 0, scale: 4 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute"
            style={{ fontSize: p.size }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.3, rotate: 0 }}
            animate={{
              x: p.x,
              y: p.y,
              opacity: 0,
              scale: 1.3,
              rotate: p.rotate,
            }}
            transition={{
              duration: 1.6,
              delay: p.delay,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {p.emoji}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );

  return (
    <div ref={ref} className="absolute inset-0 z-20">
      {mounted && overlay && createPortal(overlay, document.body)}
    </div>
  );
}
