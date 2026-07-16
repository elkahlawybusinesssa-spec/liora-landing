import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import PromoBanner from "@/components/PromoBanner";
import Hero from "@/components/Hero";
import SocialProofSection from "@/components/SocialProofSection";
import ProductCatalog from "@/components/ProductCatalog";
import FeaturesGrid from "@/components/FeaturesGrid";
import BonusSection from "@/components/BonusSection";
import Testimonials from "@/components/Testimonials";
import Gallery from "@/components/Gallery";
import GuaranteeStrip from "@/components/GuaranteeStrip";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import Footer from "@/components/Footer";
import VisitTracker from "@/components/VisitTracker";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ContentProtection from "@/components/ContentProtection";
import GiftBadge from "@/components/GiftBadge";

export default function Home() {
  return (
    <main className="protected-page">
      <ContentProtection />
      <VisitTracker />
      <GiftBadge />
      <TopBar />
      <Navbar />
      <PromoBanner />
      <Hero />
      <SocialProofSection />
      <ProductCatalog />
      <BonusSection />
      <FeaturesGrid />
      <Gallery />
      <Testimonials />
      <GuaranteeStrip />
      <FAQ />
      <FinalCTA />
      <StickyMobileCTA />
      <WhatsAppFloat />
      <Footer />
    </main>
  );
}
