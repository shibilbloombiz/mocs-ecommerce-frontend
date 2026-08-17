import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Search, X, TrendingUp, Loader2, Tag, Package } from "lucide-react";
import { useStore } from "@/lib/store";
import { getImageUrl } from "@/lib/utils";
import type { Product } from "@/lib/products";
import { apiClient } from "@/lib/api";

const trending = ["Sandals", "Ladies", "Kids", "Men", "Casual", "Sports", "Formal"];

/* ─── Scoring ─────────────────────────────────────────────────────────────── */
function scoreProduct(p: Product & { slug?: string }, q: string): number {
  if (!q) return 0;
  const term = q.trim().toLowerCase();
  const tokens = term.split(/\s+/).filter(Boolean);

  const fields = [
    { value: p.name, weight: 10 },
    { value: p.artNumber || "", weight: 9 },
    { value: (p as any).slug || "", weight: 8 },
    { value: p.category, weight: 7 },
    { value: p.collection, weight: 6 },
    { value: p.type, weight: 5 },
    { value: p.colors.map((c) => c.name).join(" "), weight: 4 },
    { value: p.description || "", weight: 2 },
  ];

  let score = 0;

  for (const { value, weight } of fields) {
    if (!value) continue;
    const val = value.toLowerCase();

    // Full exact match
    if (val === term) { score += weight * 100; continue; }
    // Starts with full term
    if (val.startsWith(term)) { score += weight * 50; continue; }
    // Contains full term
    if (val.includes(term)) { score += weight * 20; }

    // Token-by-token scoring (for multi-word search)
    for (const token of tokens) {
      if (!token) continue;
      if (val === token) score += weight * 30;
      else if (val.startsWith(token)) score += weight * 15;
      else if (val.includes(token)) score += weight * 8;
      else {
        // Character-level partial: check if any word starts with token
        const words = val.split(/\s+/);
        for (const word of words) {
          if (word.startsWith(token)) { score += weight * 5; break; }
        }
      }
    }
  }

  return score;
}

/* ─── Highlight matching text ──────────────────────────────────────────────── */
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const term = query.trim();
  const idx = text.toLowerCase().indexOf(term.toLowerCase());
  if (idx === -1) {
    // Try first token
    const token = term.split(/\s+/)[0];
    const ti = text.toLowerCase().indexOf(token.toLowerCase());
    if (ti === -1) return <>{text}</>;
    return (
      <>
        {text.slice(0, ti)}
        <mark className="bg-primary/20 text-primary font-bold rounded-sm px-0.5">
          {text.slice(ti, ti + token.length)}
        </mark>
        {text.slice(ti + token.length)}
      </>
    );
  }
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary/20 text-primary font-bold rounded-sm px-0.5">
        {text.slice(idx, idx + term.length)}
      </mark>
      {text.slice(idx + term.length)}
    </>
  );
}

/* ─── Map raw API product ──────────────────────────────────────────────────── */
function mapProduct(p: any): Product & { slug?: string } {
  return {
    id: p._id,
    _id: p._id,
    slug: p.slug || "",
    artNumber: p.artNumber || "",
    name: p.name,
    category: (p.category?.name || p.category || "Men") as any,
    collection: (p.collection || "Casual") as any,
    type: "Running" as any,
    price: p.price,
    oldPrice: p.oldPrice,
    rating: p.rating || 5,
    reviews: p.reviewCount || 0,
    stock: p.stock || 0,
    image: getImageUrl(p.coverImage),
    colors:
      p.colors && p.colors.length > 0
        ? p.colors.map((c: any) => ({ name: c.name, hex: c.hex }))
        : [{ name: "Default", hex: "#000000" }],
    sizes: p.sizes || [7, 8, 9, 10, 11, 12],
    description: p.description || "",
    isNew: p.isNew,
  };
}

/* ─── Component ────────────────────────────────────────────────────────────── */
export function SearchModal() {
  const { searchOpen, setSearchOpen } = useStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<(Product & { slug?: string })[]>([]);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<(Product & { slug?: string })[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load all products once when search opens for instant client-side filtering
  useEffect(() => {
    if (!searchOpen) {
      setQuery("");
      setResults([]);
      return;
    }
    setTimeout(() => inputRef.current?.focus(), 50);
    if (allProducts.length > 0) return; // already loaded
    const load = async () => {
      try {
        const res = await apiClient.products.list("limit=200");
        if (res?.items) setAllProducts(res.items.map(mapProduct));
      } catch {}
    };
    load();
  }, [searchOpen]);

  /* Live search: client-side scoring + optional backend search for edge cases */
  const search = useCallback(
    async (q: string) => {
      const term = q.trim();
      if (!term) { setResults([]); setLoading(false); return; }

      setLoading(true);

      // 1. Instant client-side results from cached product list
      const clientResults = allProducts
        .map((p) => ({ p, score: scoreProduct(p, term) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ p }) => p);

      setResults(clientResults);

      // 2. Also hit backend search API to catch products not yet in cache
      try {
        const res = await apiClient.products.list(
          `search=${encodeURIComponent(term)}&limit=50`
        );
        if (res?.items) {
          const apiMapped = res.items.map(mapProduct);
          // Merge: add any products from API not already in client results
          const seen = new Set(clientResults.map((p) => p.id));
          const extra = apiMapped.filter((p) => !seen.has(p.id));
          // Re-score and sort all merged results
          const merged = [...clientResults, ...extra]
            .map((p) => ({ p, score: scoreProduct(p, term) }))
            .filter(({ score }) => score > 0)
            .sort((a, b) => b.score - a.score)
            .map(({ p }) => p);
          setResults(merged);
          // Also update cache with any new products
          if (extra.length > 0) {
            setAllProducts((prev) => {
              const existingIds = new Set(prev.map((p) => p.id));
              return [...prev, ...extra.filter((p) => !existingIds.has(p.id))];
            });
          }
        }
      } catch {}

      setLoading(false);
    },
    [allProducts]
  );

  // Debounce: run immediately on first char, then debounce subsequent changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) { setResults([]); setLoading(false); return; }
    setLoading(true);
    debounceRef.current = setTimeout(() => search(query), 200);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, search]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSearchOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="mx-auto mt-0 w-full bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto max-w-3xl px-5 py-5 sm:px-8">

              {/* Input bar */}
              <div className="flex items-center gap-3 border-b-2 border-foreground pb-3">
                {loading ? (
                  <Loader2 className="h-5 w-5 text-primary animate-spin shrink-0" />
                ) : (
                  <Search className="h-5 w-5 text-primary shrink-0" />
                )}
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, categories, colors, art number…"
                  className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
                  autoComplete="off"
                  spellCheck={false}
                />
                {query && (
                  <button
                    type="button"
                    aria-label="Clear"
                    onClick={() => setQuery("")}
                    className="rounded-full p-1 hover:bg-accent transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  aria-label="Close search"
                  onClick={() => setSearchOpen(false)}
                  className="rounded-full p-1 hover:bg-accent transition ml-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Trending pills — shown when no query */}
              {!query && (
                <div className="mt-5">
                  <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <TrendingUp className="h-4 w-4" /> Trending searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {trending.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setQuery(t)}
                        className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium transition hover:bg-primary hover:text-primary-foreground"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Results */}
              {query && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 max-h-[60vh] overflow-y-auto"
                >
                  {/* Result count */}
                  {!loading && results.length > 0 && (
                    <p className="mb-2 text-xs text-muted-foreground font-medium">
                      {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
                    </p>
                  )}

                  {/* No results */}
                  {!loading && results.length === 0 && (
                    <div className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
                      <Package className="h-10 w-10 opacity-30" />
                      <p className="font-medium">No products found for &ldquo;{query}&rdquo;</p>
                      <p className="text-sm opacity-70">Try a different keyword, color, or art number</p>
                    </div>
                  )}

                  {/* Result list */}
                  <div className="space-y-1">
                    {results.map((p, i) => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.03, 0.2) }}
                      >
                        <Link
                          to="/product/$id"
                          params={{ id: p.id || (p as any)._id || "" }}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center gap-4 rounded-xl px-3 py-2.5 transition hover:bg-accent group"
                        >
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                            <img
                              src={getImageUrl(p.image)}
                              alt={p.name}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate leading-tight">
                              <Highlight text={p.name} query={query} />
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mt-0.5">
                              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                <Tag className="h-3 w-3" />
                                <Highlight text={p.category} query={query} />
                              </span>
                              {p.artNumber && (
                                <span className="text-xs text-muted-foreground/70">
                                  #{p.artNumber}
                                </span>
                              )}
                              {p.colors.slice(0, 3).map((c) => (
                                <span
                                  key={c.name}
                                  className="inline-block h-3 w-3 rounded-full border border-border"
                                  style={{ background: c.hex }}
                                  title={c.name}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-foreground">₹{p.price}</p>
                            {p.oldPrice && (
                              <p className="text-xs text-muted-foreground line-through">₹{p.oldPrice}</p>
                            )}
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
