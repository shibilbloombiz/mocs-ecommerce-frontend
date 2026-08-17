import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import blackSandals from "@/assets/black sandals.png";
const shoe1 = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800";
const shoe2 = "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800";
const shoe3 = "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800";

export function ProductCategories({ products }: { products?: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Find real product images for each category from the live dataset
  const womenProduct = products?.find((p: any) => p.category === "Women")?.image || products?.[0]?.image || shoe1;
  const kidsProduct = products?.find((p: any) => p.category === "Kids")?.image || products?.[1]?.image || blackSandals;
  const menProduct = products?.find((p: any) => p.category === "Men")?.image || products?.[2]?.image || shoe2;
  const extraProduct = products?.[3]?.image || shoe3;

  const categories = [
    {
      num: "01",
      title: "LADIES FOOTWEAR",
      desc: "Flat, heel, regular & XL sizes engineered for everyday elegance and arch support.",
      img: womenProduct,
      rotation: "-rotate-2",
    },
    {
      num: "02",
      title: "KIDS & SCHOOL",
      desc: "Durable school sandals designed for active play and all-day classroom comfort.",
      img: kidsProduct,
      rotation: "rotate-2",
    },
    {
      num: "03",
      title: "GENTS FOOTWEAR",
      desc: "Normal & shoe type silhouettes crafted with high-rebound PU soles for work & lifestyle.",
      img: menProduct,
      rotation: "-rotate-1",
    },
    {
      num: "04",
      title: "BOYS & GIRLS",
      desc: "Versatile flat & heel styles built to support growing feet with lightweight cushioning.",
      img: extraProduct,
      rotation: "rotate-1",
    },
  ];

  return (
    <section
      ref={containerRef}
      id="products"
      aria-label="Product Categories"
      className="relative py-24 sm:py-32 bg-[#070707] text-[#F5F5F2] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <motion.span
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs sm:text-sm font-bold tracking-[0.25em] text-[#F26522] uppercase block mb-3"
          >
            OUR RANGES
          </motion.span>
          <motion.h2
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-black text-4xl sm:text-6xl tracking-tight uppercase leading-tight"
          >
            PRODUCTS DESIGNED <br />
            <span className="text-[#F26522]">FOR EVERY STEP</span>
          </motion.h2>
          <p className="mt-4 text-[#A5A5A5] text-base sm:text-lg leading-relaxed">
            From school days to daily work, MOCS designs footwear that supports every step with comfort and reliability.
          </p>
        </div>

        {/* Categories Grid / Horizontal Storyteller Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.num}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className={`p-8 rounded-3xl bg-[#101212] border border-white/10 hover:border-[#F26522] transition-all duration-500 hover:-translate-y-2 group flex flex-col justify-between min-h-[420px] ${cat.rotation}`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-black text-3xl text-[#F26522]">{cat.num}</span>
                  <span className="text-xs font-bold tracking-widest text-[#A5A5A5] uppercase">
                    CATEGORY
                  </span>
                </div>

                <h3 className="font-black text-2xl text-[#F5F5F2] uppercase mb-3 group-hover:text-[#F26522] transition-colors">
                  {cat.title}
                </h3>

                <p className="text-sm text-[#A5A5A5] leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              {/* Live MOCS Product Image */}
              <div className="relative mt-8 pt-4 flex items-center justify-center overflow-hidden rounded-2xl h-44 bg-[#191B1D]">
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="w-full h-full object-cover rounded-2xl drop-shadow-md group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Shop All Action Button */}
        <div className="mt-16 flex justify-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#191B1D] hover:bg-[#F26522] text-white rounded-full font-bold text-xs sm:text-sm uppercase tracking-widest border border-white/10 hover:border-[#F26522] transition-all duration-300 shadow-xl group"
          >
            <span>Explore All MOCS Collections</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>

      </div>
    </section>
  );
}
