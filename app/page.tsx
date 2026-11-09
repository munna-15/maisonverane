import { BrandStory } from "@/components/home/BrandStory";
import { CuratedEdit } from "@/components/home/CuratedEdit";
import { EditorialCampaign } from "@/components/home/EditorialCampaign";
import { Hero } from "@/components/home/Hero";
import { NewArrivals } from "@/components/home/NewArrivals";
import { ShopByCategory } from "@/components/home/ShopByCategory";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ShopByCategory />
      <NewArrivals />
      <BrandStory />
      <CuratedEdit />
      <EditorialCampaign />
    </>
  );
}
