"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import ProductCard from "./ProductCard";
import { Search, X, RotateCcw, ArrowUpDown, Loader2 } from "lucide-react";
import { getProducts, getCategories } from "@/lib/api/ecommerce";
import type { ApiProduct, ApiCategory, PaginationMeta } from "@/lib/api/types";

type SortOption = "latest" | "oldest" | "price_asc" | "price_desc" | "name_asc" | "name_desc";

export default function KoleksiContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read initial states from URL query parameters
  const initialCategory = searchParams.get("category") || searchParams.get("kategori") || "semua";
  const initialSearch = searchParams.get("search") || "";
  const initialSort = (searchParams.get("sort") as SortOption) || "latest";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  // Data state
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sync state when URL searchParams change externally (e.g. browser back/forward)
  useEffect(() => {
    const cat = searchParams.get("category") || searchParams.get("kategori") || "semua";
    const q = searchParams.get("search") || "";
    const s = (searchParams.get("sort") as SortOption) || "latest";
    const p = parseInt(searchParams.get("page") || "1", 10);

    setActiveCategory((prev) => (prev !== cat ? cat : prev));
    setSortBy((prev) => (prev !== s ? s : prev));
    setSearchQuery((prev) => (prev !== q ? q : prev));
    setCurrentPage((prev) => (prev !== p ? p : prev));
  }, [searchParams]);

  // Fetch categories on mount
  useEffect(() => {
    let cancelled = false;
    async function fetchCategories() {
      setIsCategoriesLoading(true);
      try {
        const data = await getCategories();
        if (!cancelled) {
          setCategories(data);
        }
      } catch {
        // Categories are non-critical; silently fail and show empty category list
        if (!cancelled) {
          setCategories([]);
        }
      } finally {
        if (!cancelled) {
          setIsCategoriesLoading(false);
        }
      }
    }
    fetchCategories();
    return () => { cancelled = true; };
  }, []);

  // Fetch products when filter/sort/page changes
  useEffect(() => {
    let cancelled = false;
    async function fetchProducts() {
      setIsLoading(true);
      setError(null);
      try {
        const params: Record<string, string | number> = {};
        if (activeCategory && activeCategory !== "semua") {
          params.category = activeCategory;
        }
        const searchTerm = searchParams.get("search") || "";
        if (searchTerm.trim()) {
          params.search = searchTerm.trim();
        }
        if (sortBy && sortBy !== "latest") {
          params.sort = sortBy;
        }
        if (currentPage > 1) {
          params.page = currentPage;
        }
        params.per_page = 12;

        const response = await getProducts(params);
        if (!cancelled) {
          setProducts(response.data);
          setPagination(response.meta);
        }
      } catch {
        if (!cancelled) {
          setError("Produk belum dapat dimuat. Silakan coba lagi.");
          setProducts([]);
          setPagination(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }
    fetchProducts();
    return () => { cancelled = true; };
  }, [activeCategory, sortBy, currentPage, searchParams]);

  // Direct URL update helper for immediate actions
  const updateUrl = useCallback(
    (catSlug: string, searchVal: string, sortVal: SortOption, page: number = 1) => {
      const params = new URLSearchParams();
      if (catSlug && catSlug !== "semua") {
        params.set("category", catSlug);
      }
      if (searchVal && searchVal.trim() !== "") {
        params.set("search", searchVal.trim());
      }
      if (sortVal && sortVal !== "latest") {
        params.set("sort", sortVal);
      }
      if (page > 1) {
        params.set("page", String(page));
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
    setCurrentPage(1);
    updateUrl(catSlug, searchQuery, sortBy, 1);
  };

  // Search submit handler
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    updateUrl(activeCategory, searchQuery, sortBy, 1);
  };

  // Search input change handler (debounced URL update)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Debounced URL sync for search typing
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentUrlSearch = searchParams.get("search") || "";
      if (searchQuery.trim() !== currentUrlSearch.trim()) {
        setCurrentPage(1);
        updateUrl(activeCategory, searchQuery, sortBy, 1);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, activeCategory, sortBy, searchParams, updateUrl]);

  // Clear search input
  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    updateUrl(activeCategory, "", sortBy, 1);
  };

  // Sort dropdown change handler
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as SortOption;
    setSortBy(val);
    setCurrentPage(1);
    updateUrl(activeCategory, searchQuery, val, 1);
  };

  // Reset all filters to default
  const handleResetFilters = () => {
    setActiveCategory("semua");
    setSearchQuery("");
    setSortBy("latest");
    setCurrentPage(1);
    router.replace(pathname, { scroll: false });
  };

  // Pagination handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrl(activeCategory, searchQuery, sortBy, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isFilterActive =
    activeCategory !== "semua" || searchQuery.trim() !== "" || sortBy !== "latest";

  return (
    <div className="w-full">
      {/* 1. Collection Header: Clean, Warm, and Focused */}
      <section className="bg-brand-warm border-b border-border/60 py-10 sm:py-14 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-wider text-brand-pink font-semibold block mb-2">
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
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-lg">
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
                className="w-full pl-10 pr-9 py-2.5 rounded-full bg-brand-warm border border-border text-foreground placeholder:text-muted-foreground text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink transition-all"
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
            </form>

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
                  className="appearance-none bg-brand-warm border border-border text-foreground text-xs sm:text-sm font-semibold rounded-full pl-3.5 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink cursor-pointer transition-all"
                >
                  <option value="latest">Terbaru</option>
                  <option value="oldest">Terlama</option>
                  <option value="name_asc">Nama A–Z</option>
                  <option value="name_desc">Nama Z–A</option>
                  <option value="price_asc">Harga Terendah</option>
                  <option value="price_desc">Harga Tertinggi</option>
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
                    ? "bg-brand-pink text-white shadow-none"
                    : "bg-brand-warm text-muted-foreground hover:text-foreground hover:bg-brand-pink-soft/30 hover:border-brand-pink/30 border border-border/80"
                }`}
              >
                Semua
              </button>

              {/* Dynamic Categories from API */}
              {isCategoriesLoading ? (
                <span className="text-xs text-muted-foreground px-2">Memuat...</span>
              ) : (
                categories.map((cat) => {
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
                          ? "bg-brand-pink text-white shadow-none"
                          : "bg-brand-warm text-muted-foreground hover:text-foreground hover:bg-brand-pink-soft/30 hover:border-brand-pink/30 border border-border/80"
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })
              )}
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
              {pagination ? (
                <span>
                  Menampilkan <strong className="text-foreground font-semibold">{products.length}</strong> dari {pagination.total} produk
                  {pagination.last_page > 1 && (
                    <span> · Halaman {pagination.current_page} dari {pagination.last_page}</span>
                  )}
                </span>
              ) : (
                <span>&nbsp;</span>
              )}
            </div>

            {isFilterActive && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-pink hover:text-brand-pink-dark transition-colors"
                aria-label="Reset semua filter"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filter</span>
              </button>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-brand-warm border border-border p-3 sm:p-4">
                  <div className="aspect-square rounded-xl bg-border/40 mb-3" />
                  <div className="h-3 bg-border/40 rounded-full w-1/3 mb-2" />
                  <div className="h-4 bg-border/40 rounded-full w-3/4 mb-3" />
                  <div className="h-3 bg-border/40 rounded-full w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <div className="rounded-3xl bg-brand-warm border border-border p-10 sm:p-14 text-center max-w-lg mx-auto my-8">
              <h2 className="font-sans text-xl sm:text-2xl font-bold text-foreground mb-2">
                Gagal Memuat Produk
              </h2>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-6">
                {error}
              </p>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setCurrentPage(1);
                  updateUrl(activeCategory, searchQuery, sortBy, 1);
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-brand-pink text-white font-semibold text-xs sm:text-sm hover:bg-brand-pink-dark active:scale-95 transition-all shadow-none"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Coba Lagi</span>
              </button>
            </div>
          )}

          {/* 4. Product Grid or Empty State */}
          {!isLoading && !error && products.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
              {products.map((product, index) => (
                <ProductCard key={product.id} apiProduct={product} index={index} />
              ))}
            </div>
          )}

          {/* 5. Empty State */}
          {!isLoading && !error && products.length === 0 && (
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
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-brand-pink text-white font-semibold text-xs sm:text-sm hover:bg-brand-pink-dark active:scale-95 transition-all shadow-none"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Filter</span>
              </button>
            </div>
          )}

          {/* 6. Pagination */}
          {!isLoading && !error && pagination && pagination.last_page > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page <= 1}
                className="px-4 py-2 rounded-full border border-border text-xs font-semibold text-foreground hover:border-brand-pink/40 hover:bg-brand-pink-soft/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                ← Sebelumnya
              </button>
              
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
                .filter((page) => {
                  // Show first, last, and pages near current
                  const current = pagination.current_page;
                  return page === 1 || page === pagination.last_page || Math.abs(page - current) <= 1;
                })
                .map((page, idx, arr) => (
                  <React.Fragment key={page}>
                    {/* Show ellipsis if there's a gap */}
                    {idx > 0 && page - arr[idx - 1] > 1 && (
                      <span className="text-xs text-muted-foreground px-1">…</span>
                    )}
                    <button
                      type="button"
                      onClick={() => handlePageChange(page)}
                      className={`w-9 h-9 rounded-full text-xs font-semibold transition-all ${
                        page === pagination.current_page
                          ? "bg-brand-pink text-white"
                          : "border border-border text-foreground hover:border-brand-pink/40 hover:bg-brand-pink-soft/20"
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}

              <button
                type="button"
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page >= pagination.last_page}
                className="px-4 py-2 rounded-full border border-border text-xs font-semibold text-foreground hover:border-brand-pink/40 hover:bg-brand-pink-soft/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Selanjutnya →
              </button>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
