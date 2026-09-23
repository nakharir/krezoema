"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getCategories } from "@/lib/api/ecommerce";
import type { ApiCategory } from "@/lib/api/types";
import { craftCategories } from "@/data/mockProducts";

// Visual metadata map to preserve Stage 10 tactile design motifs per category slug
const CATEGORY_STYLE_MAP: Record<
  string,
  {
    highlightText: string;
    bgTint: string;
    borderColor: string;
    accentColor: string;
  }
> = {
  "manik-kaca": {
    highlightText: "Transparansi & Refleksi",
    bgTint: "bg-[#FAF6FF]",
    borderColor: "border-[#E9DCFC]",
    accentColor: "text-brand-purple",
  },
  akrilik: {
    highlightText: "Warna Pop & Ringan",
    bgTint: "bg-[#FDF2F7]",
    borderColor: "border-[#F8D7E8]",
    accentColor: "text-brand-magenta",
  },
  mutiara: {
    highlightText: "Satin & Tekstur Alami",
    bgTint: "bg-[#FFFDF7]",
    borderColor: "border-[#F3ECD8]",
    accentColor: "text-foreground",
  },
  "tali-kawat": {
    highlightText: "Fondasi Struktur",
    bgTint: "bg-[#FFF9F5]",
    borderColor: "border-[#FCE5D4]",
    accentColor: "text-foreground",
  },
  "alat-crafting": {
    highlightText: "Presisi Berkarya",
    bgTint: "bg-[#F9F9FA]",
    borderColor: "border-[#E8E8EC]",
    accentColor: "text-foreground",
  },
};

export default function CategorySection() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadCategories() {
      try {
        const data = await getCategories();
        if (!cancelled && data && data.length > 0) {
          setCategories(data);
        }
      } catch {
        // Fallback handled in rendering
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }
    loadCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  // Use API categories if available; otherwise fallback to mock data
  const effectiveCats =
    categories.length > 0
      ? categories.map((c) => {
          const style = CATEGORY_STYLE_MAP[c.slug] || {
            highlightText: "Material Craft",
            bgTint: "bg-brand-warm",
            borderColor: "border-border",
            accentColor: "text-brand-pink",
          };
          const count =
            typeof c.active_products_count === "number"
              ? `${c.active_products_count} Produk`
              : typeof c.products_count === "number"
              ? `${c.products_count} Produk`
              : "Koleksi Aktif";

          return {
            id: String(c.id),
            name: c.name,
            slug: c.slug,
            description: c.description || "",
            itemCount: count,
            ...style,
          };
        })
      : craftCategories;

  const [featuredCat1, featuredCat2, ...remainingCats] = effectiveCats;

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-wider text-brand-pink font-semibold block mb-2">
              Koleksi Material Craft
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold sm:font-extrabold text-foreground tracking-tight">
              Temukan Materialmu
            </h2>
            <p className="font-sans text-muted-foreground text-sm sm:text-base mt-3 leading-relaxed">
              Dari warna, tekstur, hingga detail kecil yang membuat setiap karya terasa personal.
            </p>
          </div>

          <Link
            href="/koleksi"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-brand-pink transition-colors self-start md:self-end"
          >
            <span>Lihat Semua Material</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 5-Category Grid: Clean & Structured */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 h-72 rounded-2xl bg-brand-warm animate-pulse border border-border" />
            <div className="lg:col-span-5 h-72 rounded-2xl bg-brand-warm animate-pulse border border-border" />
            <div className="lg:col-span-4 h-64 rounded-2xl bg-brand-warm animate-pulse border border-border" />
            <div className="lg:col-span-4 h-64 rounded-2xl bg-brand-warm animate-pulse border border-border" />
            <div className="lg:col-span-4 h-64 rounded-2xl bg-brand-warm animate-pulse border border-border" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Card 1: Featured 1 (7 cols) */}
            {featuredCat1 && (
              <Link
                href={`/koleksi?category=${featuredCat1.slug}`}
                className="lg:col-span-7 group rounded-2xl bg-[#FAF6FF] border border-[#E9DCFC] p-7 sm:p-9 flex flex-col justify-between transition-all duration-200 hover:border-brand-purple/50 hover:shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-semibold text-brand-purple tracking-wide">
                    {featuredCat1.highlightText}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-white text-foreground flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>

                {/* Clean Tactile Visual Motif */}
                <div className="my-8 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-400 to-pink-300 shadow-md border-2 border-white flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                    <span className="w-3.5 h-3.5 rounded-full bg-white/70 blur-[1px]" />
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground font-medium mb-1">
                    {featuredCat1.itemCount}
                  </div>
                  <h3 className="font-sans text-xl sm:text-2xl font-bold text-foreground">
                    {featuredCat1.name}
                  </h3>
                  <p className="font-sans text-sm text-muted-foreground mt-1.5 max-w-lg leading-relaxed">
                    {featuredCat1.description}
                  </p>
                </div>
              </Link>
            )}

            {/* Card 2: Featured 2 (5 cols) */}
            {featuredCat2 && (
              <Link
                href={`/koleksi?category=${featuredCat2.slug}`}
                className="lg:col-span-5 group rounded-2xl bg-[#FDF2F7] border border-[#F8D7E8] p-7 sm:p-9 flex flex-col justify-between transition-all duration-200 hover:border-brand-magenta/50 hover:shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-semibold text-brand-magenta tracking-wide">
                    {featuredCat2.highlightText}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-white text-foreground flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>

                {/* Clean Tactile Visual Motif */}
                <div className="my-8 flex items-center justify-center">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/80 border border-pink-100 transition-transform duration-300 group-hover:scale-105">
                    <span className="w-7 h-7 rounded-lg bg-pink-300 shadow-sm" />
                    <span className="w-7 h-7 rounded-full bg-fuchsia-300 shadow-sm" />
                    <span className="w-7 h-7 rounded-full bg-amber-200 shadow-sm" />
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground font-medium mb-1">
                    {featuredCat2.itemCount}
                  </div>
                  <h3 className="font-sans text-xl sm:text-2xl font-bold text-foreground">
                    {featuredCat2.name}
                  </h3>
                  <p className="font-sans text-sm text-muted-foreground mt-1.5 leading-relaxed">
                    {featuredCat2.description}
                  </p>
                </div>
              </Link>
            )}

            {/* Cards 3, 4, 5 (4 cols each) */}
            {remainingCats.map((cat) => (
              <Link
                key={cat.id}
                href={`/koleksi?category=${cat.slug}`}
                className={`lg:col-span-4 group rounded-2xl ${cat.bgTint} border ${cat.borderColor} p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 hover:border-foreground/30 hover:shadow-sm`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-semibold text-foreground tracking-wide">
                    {cat.highlightText}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-white text-foreground flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>

                {/* Material Visual Motif */}
                <div className="my-6 flex items-center justify-center py-2">
                  {cat.slug === "mutiara" && (
                    <div className="flex items-center gap-2 transition-transform duration-300 group-hover:scale-105">
                      <span className="w-5 h-5 rounded-full bg-amber-50 border border-amber-200" />
                      <span className="w-9 h-9 rounded-full bg-gradient-to-tr from-white to-amber-100 border border-amber-200 shadow-sm" />
                      <span className="w-6 h-6 rounded-full bg-amber-50 border border-amber-200" />
                    </div>
                  )}
                  {cat.slug === "tali-kawat" && (
                    <div className="w-14 h-14 rounded-full border-2 border-orange-300 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                      <div className="w-8 h-8 rounded-full border border-orange-400" />
                    </div>
                  )}
                  {cat.slug === "alat-crafting" && (
                    <div className="w-14 h-14 rounded-xl bg-white border border-border flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-105">
                      <span className="w-2.5 h-7 rounded-sm bg-neutral-700 transform -rotate-12" />
                      <span className="w-2.5 h-7 rounded-sm bg-neutral-700 transform rotate-12 -ml-1.5" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-xs text-muted-foreground font-medium mb-1">
                    {cat.itemCount}
                  </div>
                  <h3 className="font-sans text-lg sm:text-xl font-bold text-foreground">
                    {cat.name}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </Link>
            ))}

          </div>
        )}
      </div>
    </section>
  );
}
