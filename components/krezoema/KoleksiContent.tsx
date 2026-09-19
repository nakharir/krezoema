"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { mockProducts, craftCategories } from "@/data/mockProducts";
import ProductCard from "./ProductCard";
import { Search, X, RotateCcw, ArrowUpDown } from "lucide-react";

type SortOption = "terbaru" | "nama-asc" | "harga-asc" | "harga-desc";

export default function KoleksiContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read initial states from URL query parameters
  const initialCategory = searchParams.get("kategori") || "semua";
  const initialSearch = searchParams.get("search") || "";
  const initialSort = (searchParams.get("sort") as SortOption) || "terbaru";

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);

  // Sync state when URL searchParams change externally (e.g. browser back/forward)
  useEffect(() => {
    const cat = searchParams.get("kategori") || "semua";
    const q = searchParams.get("search") || "";
    const s = (searchParams.get("sort") as SortOption) || "terbaru";

    setActiveCategory((prev) => (prev !== cat ? cat : prev));
    setSortBy((prev) => (prev !== s ? s : prev));
    setSearchQuery((prev) => (prev !== q ? q : prev));
  }, [searchParams]);

  // Debounced URL sync for typing in search
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentUrlCategory = searchParams.get("kategori") || "semua";
      const currentUrlSearch = searchParams.get("search") || "";
      const currentUrlSort = searchParams.get("sort") || "terbaru";

      const categoryMatches = activeCategory === currentUrlCategory;
      const searchMatches = searchQuery.trim() === currentUrlSearch.trim();
      const sortMatches = sortBy === currentUrlSort;

      if (!categoryMatches || !searchMatches || !sortMatches) {
        const params = new URLSearchParams();
        if (activeCategory && activeCategory !== "semua") {
          params.set("kategori", activeCategory);
        }
        if (searchQuery && searchQuery.trim() !== "") {
          params.set("search", searchQuery.trim());
        }
        if (sortBy && sortBy !== "terbaru") {
          params.set("sort", sortBy);
        }
        const queryString = params.toString();
        const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
        router.replace(targetUrl, { scroll: false });
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery, sortBy, pathname, router, searchParams]);

  // Direct URL update helper for immediate actions (category click, sort change, clear, reset)
  const updateUrlImmediately = useCallback(
    (catSlug: string, searchVal: string, sortVal: SortOption) => {
      const params = new URLSearchParams();
      if (catSlug && catSlug !== "semua") {
        params.set("kategori", catSlug);
      }
      if (searchVal && searchVal.trim() !== "") {
        params.set("search", searchVal.trim());
      }
      if (sortVal && sortVal !== "terbaru") {
        params.set("sort", sortVal);
      }
      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(targetUrl, { scroll: false });
    },
    [pathname, router]
  );

  // Category filter selection handler
  const handleSelectCategory = (catSlug: string) => {
    setActiveCategory(catSlug);
    updateUrlImmediately(catSlug, searchQuery, sortBy);
  };

  // Search input change handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Clear search input
  const handleClearSearch = () => {
    setSearchQuery("");
    updateUrlImmediately(activeCategory, "", sortBy);
  };

  // Sort dropdown change handler
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as SortOption;
    setSortBy(val);
    updateUrlImmediately(activeCategory, searchQuery, val);
  };

  // Reset all filters to default
  const handleResetFilters = () => {
    setActiveCategory("semua");
    setSearchQuery("");
    setSortBy("terbaru");
    router.replace(pathname, { scroll: false });
  };

  // Combined Filtering + Sorting logic
  const filteredProducts = useMemo(() => {
    return mockProducts
      .filter((product) => {
        // 1. Category Filter
        const matchesCategory =
          activeCategory === "semua" || product.category === activeCategory;

        // 2. Search Query Filter (name, categoryLabel, category slug, shortDescription, materialDetails, variants)
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.categoryLabel.toLowerCase().includes(query) ||
          product.shortDescription.toLowerCase().includes(query) ||
          (product.materialDetails &&
            product.materialDetails.toLowerCase().includes(query)) ||
          (product.variants &&
            product.variants.some((v) =>
              v.options.some((opt) => opt.toLowerCase().includes(query))
            ));

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        // 3. Sorting
        switch (sortBy) {
          case "nama-asc":
            return a.name.localeCompare(b.name, "id");
          case "harga-asc":
            return a.price - b.price;
          case "harga-desc":
            return b.price - a.price;
          case "terbaru":
          default:
            return 0; // Preserves original catalog ordering
        }
      });
  }, [activeCategory, searchQuery, sortBy]);

  const isFilterActive =
    activeCategory !== "semua" || searchQuery.trim() !== "" || sortBy !== "terbaru";

  return (
    <div className="w-full">
      {/* 1. Collection Header: Clean, Warm, and Focused */}
      <section className="bg-brand-warm border-b border-border/60 py-10 sm:py-14 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-2">
              KREZOEMA · KOLEKSI
            </span>
            <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold sm:font-extrabold text-foreground tracking-tight leading-[1.15] mb-3">
              Temukan Material untuk Berkarya
            </h1>
            <p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed">
              Eksplorasi manik, mutiara, tali, kawat, dan perlengkapan craft untuk mewujudkan ide yang kamu punya.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Control Bar: Search + Category Quick Navigation + Sorting */}
      <section className="bg-white border-b border-border/60 sticky top-20 z-20 backdrop-blur-md bg-white/95 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 space-y-4">
          
          {/* Top Row: Search Input + Sorting Selector */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            
            {/* Search Input Box */}
            <div className="relative flex-1 max-w-lg">
              <label htmlFor="product-search" className="sr-only">
                Cari material atau perlengkapan craft
              </label>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                <Search className="w-4 h-4" />
              </div>
              <input
                id="product-search"
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Cari material atau perlengkapan..."
                className="w-full pl-10 pr-9 py-2.5 rounded-full bg-brand-warm border border-border text-foreground placeholder:text-muted-foreground text-sm font-normal focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Hapus kata kunci pencarian"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Selector Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <label
                htmlFor="product-sort"
                className="text-xs text-muted-foreground font-medium hidden sm:inline-flex items-center gap-1"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Urutkan:</span>
              </label>
              <div className="relative">
                <select
                  id="product-sort"
                  value={sortBy}
                  onChange={handleSortChange}
                  aria-label="Urutkan produk"
                  className="appearance-none bg-brand-warm border border-border text-foreground text-xs sm:text-sm font-semibold rounded-full pl-3.5 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-foreground/20 cursor-pointer transition-all"
                >
                  <option value="terbaru">Terbaru</option>
                  <option value="nama-asc">Nama A–Z</option>
                  <option value="harga-asc">Harga Terendah</option>
                  <option value="harga-desc">Harga Tertinggi</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                  ▼
                </span>
              </div>
            </div>

          </div>

          {/* Bottom Row: Category Quick Navigation Pills */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div
              role="tablist"
              aria-label="Pilihan Kategori"
              className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 w-full max-w-full"
            >
              {/* Option: Semua */}
              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === "semua"}
                onClick={() => handleSelectCategory("semua")}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === "semua"
                    ? "bg-foreground text-background shadow-sm"
                    : "bg-brand-warm text-muted-foreground hover:text-foreground hover:bg-secondary border border-border/80"
                }`}
              >
                Semua
              </button>

              {/* 5 Craft Categories */}
              {craftCategories.map((cat) => {
                const isSelected = activeCategory === cat.slug;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => handleSelectCategory(cat.slug)}
                    className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-foreground text-background shadow-sm"
                        : "bg-brand-warm text-muted-foreground hover:text-foreground hover:bg-secondary border border-border/80"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* 3. Product Catalog Content Area */}
      <section className="py-8 sm:py-12 bg-white min-h-[500px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Status Header: Product Count & Reset Action */}
          <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8 text-xs sm:text-sm text-muted-foreground">
            <div>
              {isFilterActive ? (
                <span>
                  Menampilkan <strong className="text-foreground font-semibold">{filteredProducts.length}</strong> dari {mockProducts.length} produk
                </span>
              ) : (
                <span>
                  Menampilkan <strong className="text-foreground font-semibold">{mockProducts.length}</strong> produk
                </span>
              )}
            </div>

            {isFilterActive && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Reset semua filter"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filter</span>
              </button>
            )}
          </div>

          {/* 4. Product Grid or Empty State */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            /* 5. Clean Empty State */
            <div className="rounded-3xl bg-brand-warm border border-border p-10 sm:p-14 text-center max-w-lg mx-auto my-8">
              <h2 className="font-sans text-xl sm:text-2xl font-bold text-foreground mb-2">
                Produk tidak ditemukan
              </h2>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-6">
                Coba gunakan kata kunci lain atau pilih kategori yang berbeda.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-foreground text-background font-semibold text-xs sm:text-sm hover:bg-foreground/90 active:scale-95 transition-all shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Filter</span>
              </button>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
