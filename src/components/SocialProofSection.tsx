import ReviewMarquee from "./ReviewMarquee";
import AnimatedSection from "./AnimatedSection";

const STORAGE_BASE =
  "https://ghckapztoiimrmxtadpx.supabase.co/storage/v1/object/public/catalog/catalog";

const productShots = [
  `${STORAGE_BASE}/pre/1.webp`,
  `${STORAGE_BASE}/Letters-en/1.webp`,
  `${STORAGE_BASE}/numbers-en/1.webp`,
  `${STORAGE_BASE}/Letters-ar/1.webp`,
  `${STORAGE_BASE}/numbers-ar/1.webp`,
];

export default function SocialProofSection() {
  return (
    <section className="bg-liora-50 py-8">
      <AnimatedSection className="text-center">
        <p className="text-sm font-bold text-liora-700">
          👈 حرك يمين أو يسار لاستعراض مجموعة ليورا 👉
        </p>
      </AnimatedSection>
      <ReviewMarquee images={productShots} />
    </section>
  );
}
