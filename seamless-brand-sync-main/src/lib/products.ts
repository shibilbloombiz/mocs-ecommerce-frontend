const shoe1 = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800";
const shoe2 = "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800";
const shoe3 = "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800";
const shoe4 = "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800";
const shoe5 = "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800";
const shoe6 = "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800";
const lifestyleMen = "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800";
const lifestyleWomen = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800";

export type ProductView = {
  label: "Front" | "Side" | "Back" | "Top" | "Sole" | "Lifestyle";
  src: string;
};

export type Category = "Men" | "Women" | "Kids";
export type Collection = "Sports" | "Casual" | "Formal" | "Trending" | "New Arrival";

export type Product = {
  id: string;
  _id?: string;
  artNumber?: string;
  name: string;
  /** Audience the product is built for. */
  category: Category;
  /** Marketing collection used by the Collection filter. */
  collection: Collection;
  /** Sub-type used by the trend / lifestyle copy. */
  type: "Running" | "Basketball" | "Lifestyle" | "School" | "Casual" | "Formal" | "Trail";
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  stock: number;
  image: string;
  colors: { name: string; hex: string; stock?: number }[];
  sizes: number[];
  outOfStockSizes?: number[];
  description: string;
  isNew?: boolean;
  trending?: boolean;
  bestSelling?: boolean;
  views?: ProductView[];
};

const baseSizes = [6, 7, 8, 9, 10, 11, 12];

// Helper: generate a 6-view gallery for each product from the available assets.
// In production these would be distinct front/side/back/top/sole/lifestyle
// photos served from Cloudinary or storage.
const buildViews = (primary: string, alt: string, lifestyle: string): ProductView[] => [
  { label: "Front", src: primary },
  { label: "Side", src: alt },
  { label: "Back", src: primary },
  { label: "Top", src: alt },
  { label: "Sole", src: primary },
  { label: "Lifestyle", src: lifestyle },
];

export const products: Product[] = [
  {
    id: "1",
    _id: "1",
    artNumber: "9056",
    name: "Ladies Casual Luxe",
    category: "Women",
    collection: "Casual",
    type: "Casual",
    price: 399,
    oldPrice: 499,
    rating: 4.8,
    reviews: 24,
    stock: 15,
    image: shoe1,
    colors: [
      { name: "Black", hex: "#000000", stock: 10 },
      { name: "Cream", hex: "#FFFDD0", stock: 5 },
    ],
    sizes: baseSizes,
    description: "Step into comfort and style with these sleek Ladies Casual Luxe footwear. Perfect for everyday casual wear.",
    isNew: true,
    trending: true,
    views: buildViews(shoe1, shoe2, lifestyleWomen),
  },
  {
    id: "2",
    _id: "2",
    artNumber: "9057",
    name: "Urban Ease Comfort Sandals",
    category: "Women",
    collection: "Casual",
    type: "Casual",
    price: 299,
    oldPrice: 399,
    rating: 4.7,
    reviews: 18,
    stock: 20,
    image: shoe2,
    colors: [
      { name: "Black", hex: "#000000", stock: 12 },
      { name: "Brown", hex: "#5C4033", stock: 8 },
    ],
    sizes: baseSizes,
    description: "Experience ultimate comfort with the Urban Ease Comfort Sandals. Designed for support and ventilation.",
    isNew: true,
    trending: true,
    views: buildViews(shoe2, shoe3, lifestyleWomen),
  },
  {
    id: "3",
    _id: "3",
    artNumber: "8041",
    name: "Velocity Pro Runner",
    category: "Men",
    collection: "Sports",
    type: "Running",
    price: 699,
    oldPrice: 899,
    rating: 4.9,
    reviews: 36,
    stock: 25,
    image: shoe3,
    colors: [
      { name: "Solar Orange", hex: "#F26522", stock: 15 },
      { name: "Blackout", hex: "#111111", stock: 10 },
    ],
    sizes: baseSizes,
    description: "High-performance running shoe with advanced polyurethane sole technology for maximum energy return.",
    isNew: true,
    trending: true,
    bestSelling: true,
    views: buildViews(shoe3, shoe4, lifestyleMen),
  },
  {
    id: "4",
    _id: "4",
    artNumber: "8042",
    name: "Aero Glide Streetwear",
    category: "Men",
    collection: "Casual",
    type: "Lifestyle",
    price: 599,
    oldPrice: 799,
    rating: 4.6,
    reviews: 14,
    stock: 18,
    image: shoe4,
    colors: [
      { name: "Carbon Grey", hex: "#4A4A4A", stock: 10 },
      { name: "White Flash", hex: "#FAFAFA", stock: 8 },
    ],
    sizes: baseSizes,
    description: "Modern street style sneaker crafted with breathable mesh and direct-injected flexible PU sole.",
    isNew: false,
    trending: false,
    views: buildViews(shoe4, shoe5, lifestyleMen),
  },
  {
    id: "5",
    _id: "5",
    artNumber: "7021",
    name: "Junior Sprint Trainer",
    category: "Kids",
    collection: "Sports",
    type: "School",
    price: 349,
    oldPrice: 449,
    rating: 4.9,
    reviews: 29,
    stock: 30,
    image: shoe5,
    colors: [
      { name: "Royal Blue", hex: "#1E3A8A", stock: 18 },
      { name: "Black", hex: "#000000", stock: 12 },
    ],
    sizes: [1, 2, 3, 4, 5, 6],
    description: "Durable, featherlight everyday school and sports shoes for kids with non-marking grip soles.",
    isNew: true,
    trending: false,
    views: buildViews(shoe5, shoe6, lifestyleMen),
  },
  {
    id: "6",
    _id: "6",
    artNumber: "8099",
    name: "Classic Formal Loafer",
    category: "Men",
    collection: "Formal",
    type: "Formal",
    price: 799,
    oldPrice: 999,
    rating: 4.8,
    reviews: 22,
    stock: 12,
    image: shoe6,
    colors: [
      { name: "Classic Black", hex: "#0A0A0A", stock: 8 },
      { name: "Dark Tan", hex: "#8B4513", stock: 4 },
    ],
    sizes: baseSizes,
    description: "Refined formal slip-on with anatomical footbed cushioning and premium PU construction.",
    isNew: false,
    trending: false,
    views: buildViews(shoe6, shoe1, lifestyleMen),
  }
];

export const getProduct = (id: string) => {
  if (!id) return products[0];
  const direct = products.find(
    (p) =>
      p.id === id ||
      p._id === id ||
      p.artNumber === id ||
      (p as any).slug === id ||
      p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === id.toLowerCase()
  );
  if (direct) return direct;
  return products[0];
};

export const getRelated = (id: string) => {
  const current = getProduct(id);
  if (!current) return products.slice(0, 4);
  // Prefer same category, fall back to other products
  const same = products.filter((p) => p.id !== id && p.category === current.category);
  const others = products.filter((p) => p.id !== id && p.category !== current.category);
  return [...same, ...others].slice(0, 4);
};

/** Products that share at least one colour name with the given color. */
export const getSimilarByColor = (id: string, colorName: string) =>
  products
    .filter((p) => p.id !== id && p.colors.some((c) => c.name === colorName))
    .slice(0, 4);

export const categories = ["All", "Men", "Women", "Kids"] as const;
export const collections = ["All", "Sports", "Casual", "Formal", "Trending", "New Arrival"] as const;
export const sortOptions = [
  "Top Trending",
  "Price: Low to High",
  "Price: High to Low",
  "Newest",
  "Best Selling",
] as const;

/** Unique colour swatches across the whole catalogue, used by Shop colour filter. */
export const allColors = (() => {
  const map = new Map<string, string>();
  products.forEach((p) => p.colors.forEach((c) => map.set(c.name, c.hex)));
  return Array.from(map, ([name, hex]) => ({ name, hex }));
})();

// Mock color-specific reviews — in production these come from /api/reviews/:productId
export type Review = {
  name: string;
  rating: number;
  text: string;
  days: number;
  color: string;
  verified: boolean;
};

export const reviewsByProduct: Record<string, Review[]> = {
  "velocity-pro": [
    { name: "Aaron M.", rating: 5, text: "Insane comfort and the build quality is top tier.", days: 3, color: "Solar Orange", verified: true },
    { name: "Priya S.", rating: 5, text: "True to size and even better in person. Obsessed.", days: 9, color: "White Flash", verified: true },
    { name: "Muhammed ", rating: 4, text: "Great shoe, wish it came in more colours.", days: 14, color: "Carbon", verified: true },
    { name: "Mia R.", rating: 5, text: "Orange pops in person — runs feel effortless.", days: 21, color: "Solar Orange", verified: true },
  ],
};

export const getReviews = (productId: string, color?: string): Review[] => {
  const all = reviewsByProduct[productId] ?? [
    { name: "Sam K.", rating: 5, text: "Quality is unreal for the price.", days: 5, color: "Solar Orange", verified: true },
    { name: "Sharon T.", rating: 4, text: "Comfortable and stylish — daily driver.", days: 12, color: "Blackout", verified: true },
    { name: "Basil B.", rating: 5, text: "Fit is perfect and looks even better in person.", days: 19, color: "Solar Orange", verified: true },
  ];
  return color ? all.filter((r) => r.color === color) : all;
};
