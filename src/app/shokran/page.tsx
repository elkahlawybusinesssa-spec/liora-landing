import type { Metadata } from "next";
import ThankYouContent from "@/components/ThankYouContent";

export const metadata: Metadata = {
  title: "تم استلام طلبك | Liora",
};

export default function ShokranPage({
  searchParams,
}: {
  searchParams: { name?: string; conv?: string };
}) {
  return (
    <ThankYouContent
      name={searchParams.name ?? ""}
      trackConversion={searchParams.conv === "1"}
    />
  );
}
