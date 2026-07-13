"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const WHATSAPP_NUMBER = "966501712904";
const MESSAGE = "مرحباً، عندي سؤال عن مجموعة Liora التعليمية";
const ICON_URL =
  "https://ghckapztoiimrmxtadpx.supabase.co/storage/v1/object/public/catalog/catalog/icons/whatsapp_logo_icon-2-removebg-preview.png";

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
      className="fixed bottom-24 left-4 z-50 flex flex-col items-center gap-1 md:bottom-6"
      aria-label="تواصلي معنا على واتساب"
    >
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-green-500 p-2 shadow-xl shadow-green-500/30">
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
      </span>
      <span className="rounded-full bg-liora-950/80 px-2 py-0.5 text-center text-[10px] font-bold leading-tight text-white shadow">
        تواصل واتساب
        <br />
        للاستفسارات
      </span>
    </motion.a>
  );
}
