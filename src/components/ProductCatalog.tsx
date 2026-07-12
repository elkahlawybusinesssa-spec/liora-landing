"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { productImages } from "@/data/content";

interface CatalogItem {
  id: string;
  label: string;
  numeric?: string;
  cover: string;
  images: string[];
}

const STORAGE_BASE =
  "https://ghckapztoiimrmxtadpx.supabase.co/storage/v1/object/public/catalog/catalog";

const bookImages = (folder: string, count: number) =>
  Array.from({ length: count }, (_, i) => `${STORAGE_BASE}/${folder}/${i + 1}.webp`);

const writingReadinessImages = bookImages("pre", 15);
const abcImages = bookImages("Letters-en", 15);
const numbersEnImages = bookImages("numbers-en", 15);
const arabicLettersImages = bookImages("Letters-ar", 15);
const numbersArImages = bookImages("numbers-ar", 15);
const giftsImages = bookImages("gifts", 8);

const catalogItems: CatalogItem[] = [
  {
    id: "writing-readiness",
    label: "كتاب التهيئة للكتابة",
    cover: writingReadinessImages[0],
    images: writingReadinessImages,
  },
  {
    id: "abc",
    label: "كتاب",
    numeric: "ABC",
    cover: abcImages[0],
    images: abcImages,
  },
  {
    id: "numbers-en",
    label: "كتاب",
    numeric: "1 2 3",
    cover: numbersEnImages[0],
    images: numbersEnImages,
  },
  {
    id: "arabic-letters",
    label: "كتاب أ ب ت",
    cover: arabicLettersImages[0],
    images: arabicLettersImages,
  },
  {
    id: "numbers-ar",
    label: "كتاب",
    numeric: "١ ٢ ٣",
    cover: numbersArImages[0],
    images: numbersArImages,
  },
  {
    id: "gifts",
    label: "مجموعة الهدايا",
    cover: giftsImages[0],
    images: giftsImages,
  },
];

export default function ProductCatalog() {
  const [active, setActive] = useState<CatalogItem | null>(null);

  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-5xl px-5">
        <h2 className="text-center text-2xl font-black text-liora-900 md:text-3xl">
          🔍 اكتشفي محتويات كل كتاب
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {catalogItems.map((item, i) => (
            <motion.button
              key={item.id}
              onClick={() => setActive(item)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="overflow-hidden rounded-2xl bg-liora-50 text-center shadow ring-1 ring-liora-100"
            >
              <div className="relative h-28 w-full overflow-hidden sm:h-36">
                <Image
                  src={item.cover}
                  alt={item.numeric ? `${item.label} ${item.numeric}` : item.label}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="px-2 py-3 text-sm font-bold text-liora-900">
                {item.label}
                {item.numeric && (
                  <bdi dir="ltr" className="inline-block">
                    {" "}
                    {item.numeric}
                  </bdi>
                )}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-liora-900">
                  {active.label}
                  {active.numeric && (
                    <bdi dir="ltr" className="inline-block">
                      {" "}
                      {active.numeric}
                    </bdi>
                  )}
                </h3>
                <button
                  onClick={() => setActive(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-liora-50 text-liora-800"
                >
                  <X size={18} />
                </button>
              </div>

              {active.images.length === 0 ? (
                <div className="mt-6 flex flex-col items-center gap-2 py-10 text-center">
                  <span className="text-4xl">📖</span>
                  <p className="font-bold text-liora-700">
                    صور محتوى هذا الكتاب قريبًا
                  </p>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-5">
                  {active.images.map((src, i) => (
                    <div
                      key={i}
                      className="overflow-hidden rounded-xl bg-liora-50 ring-1 ring-liora-100"
                    >
                      <Image
                        src={src}
                        alt={active.label}
                        width={400}
                        height={550}
                        className="h-auto w-full"
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
