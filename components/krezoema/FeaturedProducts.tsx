"use client";

import React from "react";
import Link from "next/link";
import { mockProducts } from "@/data/mockProducts";
import ProductCard from "./ProductCard";
import { ArrowRight } from "lucide-react";

export default function FeaturedProducts() {
  const featuredList = mockProducts.slice(0, 8);

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

        {/* Responsive Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredList.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

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
