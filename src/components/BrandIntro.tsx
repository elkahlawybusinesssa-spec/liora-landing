"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Sparkles, Heart, ShieldCheck } from "lucide-react";
import { productImages } from "@/data/content";

const pillars = [
  {
    icon: Heart,
    title: "رسالتنا",
    desc: "نساعد الأمهات يجهزن أطفالهن للروضة بمتعة حقيقية، بعيدًا عن الشاشات والجوال.",
  },
  {
    icon: ShieldCheck,
    title: "جودة نثق فيها",
    desc: "كتب قابلة للكتابة والمسح مئات المرات، من ورق متين مصمم عشان يتحمل استخدام يومي.",
  },
  {
    icon: Sparkles,
    title: "تجربة تعليمية ممتعة",
    desc: "أنشطة تدريجية بالحروف والأرقام تخلي طفلك يتعلم وهو يضحك ويستمتع.",
  },
];

export default function BrandIntro() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-liora-950 via-liora-800 to-liora-700 pb-16 pt-14 text-white">
        <motion.div
          className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-liora-400/30 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -right-16 top-40 h-64 w-64 rounded-full bg-gold-400/20 blur-3xl"
          animate={{ scale: [1.1, 1, 1.1] }}
          transition={{ duration: 7, repeat: Infinity }}
        />

        <div className="relative mx-auto max-w-6xl px-5">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              className="relative order-1 mx-auto w-full max-w-sm md:order-2"
            >
              <Image
                src={productImages.heroVertical}
                alt="مجموعة Liora التعليمية"
                width={500}
                height={700}
                className="w-full rounded-[2.5rem] object-cover shadow-2xl shadow-black/40 ring-4 ring-white/10"
                priority
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="order-2 text-center md:order-1 md:text-right"
            >
              <span className="mx-auto block w-fit rounded-full bg-white/10 px-4 py-1 text-sm font-bold text-gold-400 ring-1 ring-gold-400/40 md:mx-0">
                🌸 تعرفي على Liora
              </span>

              <h1 className="mt-5 text-[1.75rem] font-black leading-tight md:text-[2.5rem]">
                نصنع لطفلك رحلة تعلم
                <br />
                يحبها ويستنى وقتها
              </h1>

              <p className="mx-auto mt-4 max-w-md text-lg text-liora-100 md:mx-0">
                Liora مجموعة تعليمية سعودية صُممت خصيصًا لتجهيز الأطفال
                للروضة، وتخليهم يستمتعون بالتعلم بدل ما يقضون وقتهم على
                الجوال.
              </p>

              <motion.a
                href="/#order"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-7 inline-block rounded-full bg-gold-500 px-8 py-4 text-lg font-black text-liora-950 shadow-lg"
              >
                تسوقي مجموعة Liora 🎁
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-black text-liora-900 md:text-4xl">
              ليش <span className="text-gradient">Liora</span>؟
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-liora-700">
              مو بس مجموعة كتب، هي رفيقة طفلك في أول خطوة نحو الروضة
            </p>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="rounded-2xl bg-liora-50 p-6 text-center ring-1 ring-liora-100"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-liora-800 text-gold-400">
                  <p.icon size={26} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-liora-900">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-liora-700">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
