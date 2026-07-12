import ReviewMarquee from "./ReviewMarquee";
import AnimatedSection from "./AnimatedSection";
import { galleryShots, productImages } from "@/data/content";

const productShots = [
  productImages.booksSet,
  productImages.giftsBonus,
  productImages.finalShot,
  ...galleryShots,
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
