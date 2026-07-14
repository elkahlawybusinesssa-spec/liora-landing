import Navbar from "@/components/Navbar";
import BrandIntro from "@/components/BrandIntro";
import FeaturesGrid from "@/components/FeaturesGrid";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ContentProtection from "@/components/ContentProtection";
import ShopCTAButton from "@/components/ShopCTAButton";

export const metadata = {
  title: "Liora | تعرفي على مجموعة ليورا التعليمية",
};

export default function HomePage() {
  return (
    <main className="protected-page">
      <ContentProtection />
      <Navbar />
      <BrandIntro />
      <FeaturesGrid />
      <Gallery />
      <Testimonials />

      <section className="bg-gradient-to-b from-liora-800 to-liora-950 py-14 text-center text-white">
        <div className="mx-auto max-w-2xl px-5">
          <h2 className="text-2xl font-black md:text-3xl">
            جاهزة تجهزي طفلك للروضة؟
          </h2>
          <p className="mt-2 text-liora-100">
            اطلبي مجموعة Liora الآن واستلمي مع الدفع عند الاستلام
          </p>
          <ShopCTAButton />
        </div>
      </section>

      <WhatsAppFloat />
      <Footer />
    </main>
  );
}
