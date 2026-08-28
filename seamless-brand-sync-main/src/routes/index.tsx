import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { apiClient } from "@/lib/api";
import { getImageUrl } from "@/lib/utils";
import type { Slide } from "@/components/Hero";
import { HomeSkeleton } from "@/components/skeletons/HomeSkeleton";

// Home Components
import { Hero } from "@/components/Hero";
import { AboutMocsSection } from "@/components/AboutMocsSection";
import { TrendingProducts } from "@/components/TrendingProducts";

import { NewArrivals } from "@/components/NewArrivals";
import { CategoriesSection } from "@/components/CategoriesSection";
import { ProductsCarousel } from "@/components/ProductsCarousel";
import { ScrollBrandReveal } from "@/components/ScrollBrandReveal";
import { AdCarousel } from "@/components/AdCarousel";
import { SandalsCarousel } from "@/components/SandalsCarousel";
import { QualityPromise } from "@/components/QualityPromise";
import { ReviewsMarquee } from "@/components/ReviewsMarquee";

export function formatApiProducts(items: any[]): import("@/lib/products").Product[] {
  if (!items || !Array.isArray(items)) return [];
  return items.map((p: any) => ({
    id: p._id,
    _id: p._id,
    artNumber: p.artNumber || "",
    name: p.name,
    category: (p.category?.name || p.category || "Men") as any,
    collection: (p.collection || "Casual") as any,
    type: "Running" as const,
    price: p.price,
    oldPrice: p.oldPrice,
    rating: Number(p.rating || 5),
    reviews: Number(p.reviewCount ?? p.reviews ?? 0),
    stock: p.stock || 0,
    image: getImageUrl(p.coverImage),
    colors: p.colors && p.colors.length > 0
      ? p.colors.map((c: any) => ({ name: c.name, hex: c.hex }))
      : [{ name: "Default", hex: "#000000" }],
    sizes: p.sizes || [7, 8, 9, 10, 11, 12],
    description: p.description,
    isNew: p.isNew,
    isTrending: p.isTrending,
    views: p.additionalImages && p.additionalImages.length > 0
      ? [
        { label: "Front" as const, src: getImageUrl(p.coverImage) },
        ...p.additionalImages.map((img: any) => ({
          label: (img.label || "Side") as any,
          src: getImageUrl(img.url)
        }))
      ]
      : [{ label: "Front" as const, src: getImageUrl(p.coverImage) }]
  }));
}

const EMPTY_LOADER_DATA = {
  products: [] as ReturnType<typeof formatApiProducts>,
  heroSlides: [] as Slide[],
  categoriesBanners: null as any[] | null,
  collectionsBanners: null as any[] | null,
  promiseCollage: null as any[] | null,
  advertisements: [] as string[],
};

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      // All settings + products fetched in parallel on the server before first paint.
      // Every call has .catch(() => null) so one failing endpoint never blocks the page.
      const [
        productsRes,
        heroRes,
        categoryBannersRes,
        collectionBannersRes,
        promiseRes,
        adsRes,
      ] = await Promise.all([
        apiClient.products.list("limit=100").catch(() => null),
        apiClient.settings.get("hero_slides").catch(() => null),
        apiClient.settings.get("categories_banners").catch(() => null),
        apiClient.settings.get("collections_banners").catch(() => null),
        apiClient.settings.get("promise_collage").catch(() => null),
        apiClient.settings.get("advertisements").catch(() => null),
      ]);

      // Map hero slides to the Slide shape with full image URLs (done server-side
      // so the browser receives complete URLs in the HTML — no client transform needed).
      const heroSlides: Slide[] =
        heroRes?.value && Array.isArray(heroRes.value) && heroRes.value.length > 0
          ? heroRes.value.map((slide: any) => ({
              eyebrow: slide.eyebrow,
              title: slide.title,
              subtitle: slide.subtitle,
              cta: slide.cta,
              to: slide.to || slide.path || "/shop",
              bg:
                getImageUrl(slide.bg || slide.image, { width: 1920, quality: 95 }) ||
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1920",
              mobileBg: slide.mobileBg
                ? getImageUrl(slide.mobileBg, { width: 1080, quality: 92 })
                : undefined,
              isMobileMain: Boolean(slide.isMobileMain || slide.fixMobileMain),
              objectFit: slide.objectFit || "cover",
              objectPosition: slide.objectPosition || "center",
            }))
          : [];

      return {
        products: productsRes?.items ? formatApiProducts(productsRes.items) : [],
        heroSlides,
        categoriesBanners:
          categoryBannersRes?.value &&
          Array.isArray(categoryBannersRes.value) &&
          categoryBannersRes.value.length === 5
            ? categoryBannersRes.value
            : null,
        collectionsBanners:
          collectionBannersRes?.value &&
          Array.isArray(collectionBannersRes.value) &&
          collectionBannersRes.value.length > 0
            ? collectionBannersRes.value
            : null,
        promiseCollage:
          promiseRes?.value &&
          Array.isArray(promiseRes.value) &&
          promiseRes.value.length > 0
            ? promiseRes.value
            : null,
        advertisements:
          adsRes?.value && Array.isArray(adsRes.value) && adsRes.value.length > 0
            ? adsRes.value
            : [],
      };
    } catch (err) {
      console.warn("Homepage loader failed, using empty fallback:", err);
      return EMPTY_LOADER_DATA;
    }
  },
  head: ({ loaderData }) => {
    const firstHeroBg = loaderData?.heroSlides?.[0]?.bg;
    return {
      meta: [
        { title: "MOCS — Premium Footwear" },
        {
          name: "description",
          content:
            "MOCS — premium footwear for Men, Women and Kids. Engineered for performance, crafted for everyday style.",
        },
        { property: "og:title", content: "MOCS — Premium Footwear" },
        {
          property: "og:description",
          content: "Premium footwear engineered for performance.",
        },
      ],
      links: firstHeroBg
        ? [
            {
              rel: "preload",
              as: "image",
              href: firstHeroBg,
            },
          ]
        : [],
    };
  },
  pendingComponent: HomeSkeleton,
  component: Home,
});

const reviews = [
  {
    name: "Gokul Nair",
    text: "Best footwear our boutique has stocked. Customers love them, returns are negligible.",
    rating: 5,
  },
  {
    name: "Anjali Kurup",
    text: "MOCS handled a custom run for our brand and delivered on time, on spec, on budget.",
    rating: 5,
  },
  {
    name: "Mathew Joseph",
    text: "Comfortable from the first wear. Build quality you don't expect at this price.",
    rating: 5,
  },
  {
    name: "Hiba",
    text: "Good and comfortable to wear.",
    rating: 5,
  },
];

// Fallback category banners shown when the admin hasn't configured images in Settings.
// Replace bg: "" with Unsplash URLs in Step 3, or configure via the admin panel.
const DEFAULT_CATEGORY_BANNERS = [
  {
    key: "main",
    title: "We Are MOCS",
    desc: "Awesome, clean & creative footwear collections engineered for everyday agility, comfort, and style.",
    cta: "Purchase Now!",
    to: "/shop",
    bg: "https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    key: "women",
    title: "Women",
    desc: "Best Footwear For Women",
    cta: "Discover More",
    to: "/shop",
    search: { category: "Women" },
    bg: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
  },
  {
    key: "men",
    title: "Men",
    desc: "Best Collections For Men",
    cta: "Discover More",
    to: "/shop",
    search: { category: "Men" },
    bg: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&auto=format&fit=crop",
  },
  {
    key: "kids",
    title: "Kids",
    desc: "Best Shoes For Kids",
    cta: "Discover More",
    to: "/shop",
    search: { category: "Kids" },
    bg: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=800&auto=format&fit=crop",
  },
  {
    key: "trending",
    title: "Trending",
    desc: "Best Trend Collections",
    cta: "Discover More",
    to: "/shop",
    search: { collection: "Trending" },
    bg: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop",
  },
];

const DEFAULT_COLLECTION_BANNERS = [
  {
    key: "sports",
    title: "SPORTS",
    bg: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=70&auto=format&fit=crop&w=400",
    to: "/shop",
    search: { collection: "Sports" },
  },
  {
    key: "casual",
    title: "CASUAL",
    bg: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=70&auto=format&fit=crop&w=400",
    to: "/shop",
    search: { collection: "Casual" },
  },
  {
    key: "formal",
    title: "FORMAL",
    bg: "https://images.unsplash.com/photo-1486308512493-ae6a625e368a?q=70&auto=format&fit=crop&w=400",
    to: "/shop",
    search: { collection: "Formal" },
  },
];

function Home() {
  // All data comes from the server-side loader — no client-side fetches.
  const {
    products,
    heroSlides,
    categoriesBanners: rawCategoryBanners,
    collectionsBanners: rawCollectionBanners,
    promiseCollage: rawPromise,
    advertisements,
  } = Route.useLoaderData();

  // Use loader data directly; fall back to defaults if admin hasn't configured settings yet.
  const allProducts = products;
  const categoriesBanners = rawCategoryBanners ?? DEFAULT_CATEGORY_BANNERS;
  const collectionsBanners = rawCollectionBanners ?? DEFAULT_COLLECTION_BANNERS;
  const promiseCollage = rawPromise ?? [];

  const trendingProducts = useMemo(() => {
    const list = allProducts.filter((p: any) => p.isTrending);
    const seen = new Set();
    return list.filter((p: any) => {
      const key = p.artNumber || p.name;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [allProducts]);

  const processedProducts = useMemo(() => {
    const newProducts = allProducts.filter((p: any) => p.isNew);
    const regularProducts = allProducts.filter((p: any) => !p.isNew);
    return [...newProducts, ...regularProducts];
  }, [allProducts]);

  const newArrivals = useMemo(() => {
    const list = allProducts.filter((p: any) => p.isNew);
    const seen = new Set();
    return list.filter((p: any) => {
      const key = p.artNumber || p.name;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [allProducts]);

  const sandalsProducts = useMemo(() => {
    const firstFourTrending = processedProducts.slice(0, 4).map((p: any) => p.id || p._id || p.artNumber);
    const firstFourNewArrivals = newArrivals.slice(0, 4).map((p: any) => p.id || p._id || p.artNumber);
    const firstFourTrendingList = trendingProducts.slice(0, 4).map((p: any) => p.id || p._id || p.artNumber);

    const forbiddenIds = new Set([...firstFourTrending, ...firstFourNewArrivals, ...firstFourTrendingList]);

    const allSandals = allProducts.filter((p: any) => {
      const cat = (p.category || "").toLowerCase();
      const name = (p.name || "").toLowerCase();
      return cat.includes("sandal") || name.includes("sandal") || cat.includes("chappal") || cat.includes("slide");
    });

    const differentSandals = allSandals.filter((p: any) => {
      const pid = p.id || p._id || p.artNumber;
      return !forbiddenIds.has(pid);
    });

    if (differentSandals.length < 4) {
      const differentOthers = allProducts.filter((p: any) => {
        const pid = p.id || p._id || p.artNumber;
        const cat = (p.category || "").toLowerCase();
        const name = (p.name || "").toLowerCase();
        const isSandal = cat.includes("sandal") || name.includes("sandal") || cat.includes("chappal") || cat.includes("slide");
        return !isSandal && !forbiddenIds.has(pid);
      });
      differentSandals.push(...differentOthers);
    }

    const firstFour = differentSandals.slice(0, 4);
    const firstFourIds = new Set(firstFour.map((p: any) => p.id || p._id || p.artNumber));

    const remainingSandals = allSandals.filter((p: any) => {
      const pid = p.id || p._id || p.artNumber;
      return !firstFourIds.has(pid);
    });

    const remainingOthers = allProducts.filter((p: any) => {
      const pid = p.id || p._id || p.artNumber;
      if (firstFourIds.has(pid)) return false;
      const cat = (p.category || "").toLowerCase();
      const name = (p.name || "").toLowerCase();
      const isSandal = cat.includes("sandal") || name.includes("sandal") || cat.includes("chappal") || cat.includes("slide");
      return !isSandal;
    });

    const combined = [...firstFour, ...remainingSandals, ...remainingOthers];
    const seen = new Set();
    return combined.filter((p: any) => {
      const key = p.id || p._id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [allProducts, processedProducts, newArrivals, trendingProducts]);

  return (
    <>
      <Hero slides={heroSlides || []} collageImages={(allProducts || []).map((p: any) => ({ src: p?.image || "", name: p?.name || "" }))} />
      {/* About section hidden — remove the `hidden` class to re-enable */}
      <div className="hidden"><AboutMocsSection /></div>
      <TrendingProducts products={trendingProducts} />

      <NewArrivals products={newArrivals} />
      <CategoriesSection categoriesBanners={categoriesBanners} />
      <ProductsCarousel products={processedProducts} />
      <div className="my-16 md:my-20">
        <ScrollBrandReveal collections={collectionsBanners} />
      </div>
      <AdCarousel advertisements={advertisements} />
      <QualityPromise collage={promiseCollage} />
      <ReviewsMarquee reviews={reviews} />
    </>
  );
}
