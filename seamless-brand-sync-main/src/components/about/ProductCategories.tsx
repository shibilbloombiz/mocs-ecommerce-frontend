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
      title: "LADIES BUCKLE SLIDE",
      desc: "Contoured anatomical footbed with crystal-embellished buckle strap and toe post.",
      img: "/about-products/trans_mocs-sandal-buckle.png",
      rotation: "-rotate-1",
    },
    {
      num: "02",
      title: "CRYSTAL STRAP FLAT",
      desc: "Dual-band flat sandal with sparkling crystal rows and supportive toe loop.",
      img: "/about-products/trans_mocs-sandal-rhinestone.png",
      rotation: "rotate-1",
    },
    {
      num: "03",
      title: "COMFORT WEDGE SLIDE",
      desc: "Shock-absorbing PU wedge with wood-textured grain and rhinestone square buckle.",
      img: "/about-products/trans_mocs-wedge-slide.png",
      rotation: "-rotate-1",
    },
    {
      num: "04",
      title: "PATENT CROSSOVER SLIDE",
      desc: "High-gloss crossover straps engineered with lightweight arch contouring.",
      img: "/about-products/trans_mocs-cross-slide.png",
      rotation: "rotate-1",
    },
    {
      num: "05",
      title: "ELEGANT BOW SLINGBACK",
      desc: "Sleek two-tone slingback flat embellished with a crystal bow ornament.",
      img: "/about-products/trans_mocs-bow-sandal.png",
      rotation: "-rotate-1",
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
            From daily elegance to all-day comfort, MOCS designs footwear that supports every step with comfort, quality, and timeless style.
          </p>
        </div>

        {/* Categories Grid / Horizontal Storyteller Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 sm:gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.num}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: idx * 0.12 }}
              className={`p-6 rounded-3xl bg-[#101212] border border-white/10 hover:border-[#F26522] transition-all duration-500 hover:-translate-y-2 group flex flex-col justify-between min-h-[440px] ${cat.rotation}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-black text-2xl text-[#F26522]">{cat.num}</span>
                  <span className="text-[10px] font-bold tracking-widest text-[#A5A5A5] uppercase">
                    COLLECTION
                  </span>
                </div>

                <h3 className="font-black text-lg sm:text-xl text-[#F5F5F2] uppercase mb-2 group-hover:text-[#F26522] transition-colors leading-tight">
                  {cat.title}
                </h3>

                <p className="text-xs text-[#A5A5A5] leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              {/* Live MOCS Product Image */}
              <div className="relative mt-6 p-3 flex items-center justify-center overflow-hidden rounded-2xl h-52 bg-[#191B1D]/80 border border-white/5">
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="w-full h-full object-contain filter drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
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
