import { createFileRoute } from "@tanstack/react-router";
import { apiClient } from "@/lib/api";
import { getImageUrl } from "@/lib/utils";
import { AboutHero } from "@/components/about/AboutHero";
import { BrandStory } from "@/components/about/BrandStory";
import { LeadershipSection } from "@/components/about/LeadershipSection";
import { TechnologySection } from "@/components/about/TechnologySection";
import { QualityJourney } from "@/components/about/QualityJourney";
import { ComfortSection } from "@/components/about/ComfortSection";
import { MaterialsSection } from "@/components/about/MaterialsSection";
import { ProductCategories } from "@/components/about/ProductCategories";
import { ResponsibleManufacturing } from "@/components/about/ResponsibleManufacturing";
import { GeographicPresence } from "@/components/about/GeographicPresence";
import { NorthKeralaPresence } from "@/components/about/NorthKeralaPresence";
import { FutureSection } from "@/components/about/FutureSection";
import { AboutContactCTA } from "@/components/about/AboutContactCTA";
import { AboutPageNav } from "@/components/about/AboutPageNav";

export const Route = createFileRoute("/about")({
  loader: async () => {
    try {
      const res = await apiClient.products.list("limit=100");
      if (res && res.items) {
        const apiProducts = res.items.map((p: any) => ({
          id: p._id,
          artNumber: p.artNumber || "",
          name: p.name,
          category: (p.category?.name || p.category || "Men") as any,
          collection: (p.collection || "Casual") as any,
          price: p.price,
          image: getImageUrl(p.coverImage),
          description: p.description,
        }));
        return { products: apiProducts };
      }
    } catch (err) {
      console.warn("Failed to load products for About page", err);
    }
    return { products: [] };
  },
  head: () => ({
    meta: [
      { title: "About MOCS — Craftsmanship, Innovation & Footwear Excellence" },
      {
        name: "description",
        content:
          "Discover MOCS — 13+ years of direct-to-factory polyurethane (PU) footwear craftsmanship, technology, quality processes, and sustainable manufacturing in India.",
      },
      { property: "og:title", content: "About MOCS — Craftsmanship & Innovation" },
      {
        property: "og:description",
        content:
          "Refined in every step. 13+ years of premium footwear manufacturing and direct-to-factory excellence.",
      },
    ],
  }),
  component: About,
});

function About() {
  const { products } = Route.useLoaderData();

  return (
    <div className="relative min-h-screen bg-[#070707] text-[#F5F5F2] selection:bg-[#F26522] selection:text-white overflow-x-hidden">
      {/* Floating Vertical Desktop Progress Indicator */}
      <AboutPageNav />

      {/* 13 Section Storytelling Flow with Live Product Data */}
      <main>
        <AboutHero products={products} />
        <BrandStory />
        <LeadershipSection />
        <TechnologySection />
        <QualityJourney />
        <ComfortSection products={products} />
        <MaterialsSection products={products} />
        <ProductCategories products={products} />
        <ResponsibleManufacturing products={products} />
        <GeographicPresence />
        <NorthKeralaPresence />
        <FutureSection />
        <AboutContactCTA />
      </main>
    </div>
  );
}
