import { ClockHeroSlider } from "@/components/home/ClockHeroSlider";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Categories } from "@/components/home/Categories";
import { Benefits } from "@/components/home/Benefits";
import { PromoSection } from "@/components/home/PromoSection";
import { Newsletter } from "@/components/home/Newsletter";

export default function Home() {
  return (
    <main>
      <ClockHeroSlider />
      <FeaturedProducts />
      <Categories />
      <PromoSection />
      <Benefits />
      <Newsletter />
    </main>
  );
}
