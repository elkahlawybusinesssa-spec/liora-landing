import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import Pixels from "@/components/Pixels";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Liora | مجموعة ليورا التعليمية للأطفال",
  description:
    "مجموعة Liora التعليمية: 5 كتب قابلة للكتابة والمسح + 5 أقلام هدية. تبعد طفلك عن الشاشات وتجهزه للروضة بمتعة.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tajawal.variable} font-tajawal antialiased`}>
        <Pixels />
        {children}
      </body>
    </html>
  );
}
