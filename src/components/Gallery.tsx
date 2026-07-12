"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import AnimatedSection from "./AnimatedSection";
import { galleryShots, productImages } from "@/data/content";

const shots = [...galleryShots, productImages.finalShot];

export default function Gallery() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-5">
        <AnimatedSection className="text-center">
          <h2 className="text-3xl font-black text-liora-900 md:text-4xl">
            صور لمجموعة كتب Liora على الطبيعة 📷
          </h2>
        </AnimatedSection>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {shots.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="group overflow-hidden rounded-3xl shadow-lg"
            >
              <Image
                src={src}
                alt="مجموعة Liora"
                width={500}
                height={600}
                className="h-72 w-full object-cover transition duration-500 group-hover:scale-110"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
