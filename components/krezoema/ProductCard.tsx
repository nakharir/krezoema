"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/data/mockProducts";
import type { ApiProduct } from "@/lib/api/types";
import {
  formatRupiah,
  getPrimaryImageUrl,
  getCategorySlug,
  getCategoryLabel,
} from "@/lib/api/helpers";

export interface ProductCardProps {
  product?: Product;
  apiProduct?: ApiProduct;
  index?: number;
}

export default function ProductCard({ product, apiProduct }: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  // Normalize data between ApiProduct and legacy Product
  const slug = apiProduct ? apiProduct.slug : product?.slug || "";
  const name = apiProduct ? apiProduct.name : product?.name || "";
  const categorySlug = apiProduct
    ? getCategorySlug(apiProduct)
    : (product?.category as string) || "";
  const categoryLabel = apiProduct
    ? getCategoryLabel(apiProduct)
    : product?.categoryLabel || "";
  const formattedPrice = apiProduct
    ? formatRupiah(apiProduct.base_price)
    : product?.formattedPrice || "";
  const imageUrl = apiProduct
    ? getPrimaryImageUrl(apiProduct)
    : product?.image || null;
  const badge = product?.badge;

  const showImage = Boolean(imageUrl) && !imageFailed;

  return (
    <Link
      href={`/produk/${slug}`}
      className="group flex flex-col justify-between rounded-2xl bg-white border border-border p-3 sm:p-4 transition-all duration-200 hover:border-brand-pink/40 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink"
      aria-label={`${name} - ${formattedPrice}`}
    >
      {/* 1. Product Visual Area */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-brand-warm flex items-center justify-center border border-border/40 transition-all">
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl!}
            alt={name}
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-2 sm:p-4 transition-transform duration-300 ease-out group-hover:scale-105">
            {categorySlug === "manik-kaca" && (
              <div className="flex -space-x-2 items-center">
                <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-400 to-indigo-300 shadow-sm border border-white" />
                <span className="w-10 h-10 rounded-full bg-gradient-to-tr from-fuchsia-300 to-rose-200 shadow-md border border-white" />
                <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-300 to-blue-200 shadow-sm border border-white" />
              </div>
            )}
            {categorySlug === "akrilik" && (
              <div className="grid grid-cols-2 gap-1.5 p-1">
                <span className="w-6 h-6 rounded-lg bg-pink-300 shadow-sm" />
                <span className="w-6 h-6 rounded-full bg-violet-300 shadow-sm" />
                <span className="w-6 h-6 rounded-full bg-amber-200 shadow-sm" />
                <span className="w-6 h-6 rounded-lg bg-emerald-200 shadow-sm" />
              </div>
            )}
            {categorySlug === "mutiara" && (
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-50 border border-amber-200" />
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-white via-amber-50 to-amber-100 shadow-sm border border-white" />
                <span className="w-6 h-6 rounded-full bg-amber-50 border border-amber-200" />
              </div>
            )}
            {categorySlug === "tali-kawat" && (
              <div className="w-14 h-14 rounded-full border-2 border-orange-300 flex items-center justify-center p-2">
                <div className="w-8 h-8 rounded-full border border-orange-400" />
              </div>
            )}
            {categorySlug === "alat-crafting" && (
              <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center border border-border">
                <span className="w-2 h-6 rounded-sm bg-neutral-700 transform -rotate-12" />
                <span className="w-2 h-6 rounded-sm bg-neutral-700 transform rotate-12 -ml-1" />
              </div>
            )}
          </div>
        )}

        {/* Minimalist badge if product has one */}
        {badge && (
          <span className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 bg-white border border-border px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold text-foreground">
            {badge}
          </span>
        )}
      </div>

      {/* Product Information (Category, Name, Price) */}
      <div className="pt-2.5 sm:pt-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Category */}
          <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-muted-foreground font-semibold block mb-0.5 sm:mb-1">
            {categoryLabel}
          </span>

          {/* Product Name */}
          <h3 className="font-sans text-xs sm:text-base font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-brand-pink transition-colors">
            {name}
          </h3>
        </div>

        {/* Price */}
        <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-border/50 flex items-center justify-between gap-1">
          <span className="font-sans text-xs sm:text-base font-bold text-foreground">
            {formattedPrice}
          </span>

          <span className="text-[11px] sm:text-xs font-semibold text-brand-pink hover:text-brand-pink-dark transition-colors shrink-0">
            Detail
          </span>
        </div>
      </div>
    </Link>
  );
}
