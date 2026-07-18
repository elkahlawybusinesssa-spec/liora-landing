"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const WHATSAPP_NUMBER = "966544468047";
const MESSAGE = "مرحباً، عندي سؤال عن مجموعة Liora التعليمية";
const ICON_URL =
  "https://ghckapztoiimrmxtadpx.supabase.co/storage/v1/object/public/catalog/catalog/icons/whatsapp.png";

export default function WhatsAppFloat() {
  return (
    <motion.a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 200, damping: 14 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-24 left-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-green-500 p-2 shadow-xl shadow-green-500/30 md:bottom-6"
      aria-label="تواصلي معنا على واتساب"
    >
      <motion.span
        className="absolute inset-0 rounded-full bg-green-500"
        animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />
      <Image
        src={ICON_URL}
        alt="واتساب"
        width={40}
        height={40}
        className="relative h-full w-full object-contain"
      />
    </motion.a>
  );
}
