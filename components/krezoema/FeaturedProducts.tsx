"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts } from "@/lib/api/ecommerce";
import type { ApiProduct } from "@/lib/api/types";
import ProductCard from "./ProductCard";
import { ArrowRight } from "lucide-react";
import { mockProducts } from "@/data/mockProducts";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadFeatured() {
      try {
        const res = await getProducts({ per_page: 8, sort: "latest" });
        if (!cancelled && res.data && res.data.length > 0) {
          setProducts(res.data);
          setHasError(false);
        }
      } catch {
        if (!cancelled) {
          setHasError(true);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }
    loadFeatured();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-brand-warm border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-wider text-brand-pink font-semibold block mb-2">
              Koleksi Unggulan
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold sm:font-extrabold text-foreground tracking-tight">
              Pilihan Untuk Berkarya
            </h2>
            <p className="font-sans text-muted-foreground text-sm sm:text-base mt-3 leading-relaxed">
              Material pilihan untuk menemani ide yang sedang kamu kembangkan.
            </p>
          </div>

          <Link
            href="/koleksi"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-border text-sm font-semibold text-foreground hover:border-brand-pink/50 hover:bg-brand-pink-soft/30 hover:text-brand-pink-dark active:scale-[0.98] transition-all self-start md:self-end"
          >
            <span>Lihat Semua Katalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Loading State Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl bg-white border border-border p-3 sm:p-4"
              >
                <div className="aspect-square rounded-xl bg-brand-warm mb-3" />
                <div className="h-3 bg-brand-warm rounded-full w-1/3 mb-2" />
                <div className="h-4 bg-brand-warm rounded-full w-3/4 mb-3" />
                <div className="h-4 bg-brand-warm rounded-full w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Error Fallback to mock data if API unavailable */}
        {!isLoading && hasError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockProducts.slice(0, 8).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

        {/* API Products Grid */}
        {!isLoading && !hasError && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard key={product.id} apiProduct={product} index={index} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !hasError && products.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Belum ada produk unggulan yang tersedia saat ini.
          </div>
        )}

        {/* Simple Bottom Note */}
        <div className="mt-12 text-center">
          <p className="text-xs text-muted-foreground">
            Material dikurasi teliti untuk kemudahan merangkai dan ketahanan warna karya Anda.
          </p>
        </div>

      </div>
    </section>
  );
}
