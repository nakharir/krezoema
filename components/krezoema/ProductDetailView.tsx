"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Product } from "@/data/mockProducts";
import type { ApiProduct } from "@/lib/api/types";
import { Minus, Plus, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import {
  formatRupiah,
  getSortedImages,
  getCategorySlug,
  getCategoryLabel,
  findMatchingVariant,
  apiProductToLegacyProduct,
} from "@/lib/api/helpers";

interface ProductDetailViewProps {
  product?: Product;
  apiProduct?: ApiProduct;
  onAddToCart?: (
    product: Product,
    selectedVariants: Record<string, string>,
    quantity: number
  ) => void;
}

export default function ProductDetailView({
  product,
  apiProduct,
  onAddToCart,
}: ProductDetailViewProps) {
  const { addToCart } = useCart();

  // Extract option groups dynamically from apiProduct or legacy product
  const optionGroups = useMemo(() => {
    if (apiProduct && apiProduct.variants && apiProduct.variants.length > 0) {
      const groupsMap = new Map<string, Set<string>>();
      for (const variant of apiProduct.variants) {
        if (variant.is_active && variant.options) {
          for (const [key, value] of Object.entries(variant.options)) {
            if (!groupsMap.has(key)) {
              groupsMap.set(key, new Set());
            }
            groupsMap.get(key)!.add(String(value));
          }
        }
      }
      return Array.from(groupsMap.entries()).map(([type, optionsSet]) => ({
        type,
        options: Array.from(optionsSet),
      }));
    }

    if (product?.variants && product.variants.length > 0) {
      return product.variants.map((v) => ({
        type: v.type,
        options: v.options,
      }));
    }

    return [];
  }, [apiProduct, product]);

  // Initialize variant selections with first available options
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const group of optionGroups) {
      if (group.options.length > 0) {
        initial[group.type] = group.options[0];
      }
    }
    return initial;
  });

  // Keep selectedVariants valid when optionGroups change
  React.useEffect(() => {
    setSelectedVariants((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const group of optionGroups) {
        if (!next[group.type] && group.options.length > 0) {
          next[group.type] = group.options[0];
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [optionGroups]);

  // Images resolution
  const sortedImages = useMemo(() => {
    if (apiProduct) {
      return getSortedImages(apiProduct);
    }
    if (product?.image) {
      return [{ url: product.image, alt: product.name }];
    }
    return [];
  }, [apiProduct, product]);

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [imageError, setImageError] = useState<boolean>(false);

  // Find matching variant from API to get accurate price and stock
  const matchingVariant = useMemo(() => {
    if (!apiProduct || !apiProduct.variants) return undefined;
    return findMatchingVariant(apiProduct.variants, selectedVariants);
  }, [apiProduct, selectedVariants]);

  // Stock check
  const isOutOfStock = useMemo(() => {
    if (matchingVariant) {
      return matchingVariant.stock <= 0 || !matchingVariant.is_active;
    }
    return false;
  }, [matchingVariant]);

  const availableStock = matchingVariant ? matchingVariant.stock : 99;

  // Price determination
  const currentPrice = useMemo(() => {
    if (matchingVariant) {
      return matchingVariant.effective_price;
    }
    if (apiProduct) {
      return apiProduct.base_price;
    }
    return product?.price || 0;
  }, [matchingVariant, apiProduct, product]);

  const formattedPrice = formatRupiah(currentPrice);

  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  // Common metadata
  const name = apiProduct ? apiProduct.name : product?.name || "";
  const categorySlug = apiProduct ? getCategorySlug(apiProduct) : product?.category || "";
  const categoryLabel = apiProduct ? getCategoryLabel(apiProduct) : product?.categoryLabel || "";
  const shortDescription = apiProduct ? apiProduct.description || "" : product?.shortDescription || "";
  const badge = product?.badge;

  const currentActiveImage = sortedImages[activeImageIndex]?.url;
  const showImage = Boolean(currentActiveImage) && !imageError;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    // Convert apiProduct to legacy Product format for CartContext compatibility
    const cartProduct = apiProduct
      ? apiProductToLegacyProduct(apiProduct, matchingVariant)
      : product!;

    addToCart(cartProduct, selectedVariants, quantity, matchingVariant?.id ?? null);
    if (onAddToCart) {
      onAddToCart(cartProduct, selectedVariants, quantity);
    }
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* 1. Left Column: Product Visual & Gallery */}
      <div className="lg:col-span-6 w-full">
        <div className="relative w-full aspect-square rounded-2xl sm:rounded-3xl bg-brand-warm border border-border/80 p-4 sm:p-6 flex items-center justify-center overflow-hidden">
          {showImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentActiveImage}
              alt={name}
              onError={() => setImageError(true)}
              className="w-full h-full object-contain rounded-xl transition-all duration-300"
            />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              {categorySlug === "manik-kaca" && (
                <div className="flex -space-x-4 items-center">
                  <span className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-purple-400 via-indigo-300 to-purple-200 shadow-md border-2 border-white" />
                  <span className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-fuchsia-300 via-pink-200 to-rose-100 shadow-lg border-2 border-white z-10" />
                  <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-cyan-300 via-sky-200 to-blue-200 shadow-md border-2 border-white" />
                </div>
              )}
              {categorySlug === "akrilik" && (
                <div className="grid grid-cols-2 gap-4 p-4">
                  <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-pink-300 shadow-sm border-2 border-white" />
                  <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-violet-300 shadow-sm border-2 border-white" />
                  <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-200 shadow-sm border-2 border-white" />
                  <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-200 shadow-sm border-2 border-white" />
                </div>
              )}
              {categorySlug === "mutiara" && (
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-amber-50 border-2 border-amber-200 shadow-sm" />
                  <span className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-white via-amber-50 to-amber-100 shadow-lg border-2 border-white" />
                  <span className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-amber-50 border-2 border-amber-200 shadow-sm" />
                </div>
              )}
              {categorySlug === "tali-kawat" && (
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 border-orange-300 flex items-center justify-center p-4">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-orange-400 flex items-center justify-center">
                    <span className="w-8 h-8 rounded-full bg-orange-100" />
                  </div>
                </div>
              )}
              {categorySlug === "alat-crafting" && (
                <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl bg-white border border-border flex items-center justify-center shadow-sm">
                  <span className="w-5 h-20 rounded-md bg-neutral-700 transform -rotate-12" />
                  <span className="w-5 h-20 rounded-md bg-neutral-700 transform rotate-12 -ml-3" />
                </div>
              )}
            </div>
          )}

          {/* Minimalist badge if product has one */}
          {badge && (
            <span className="absolute top-4 left-4 sm:top-5 sm:left-5 bg-white border border-border px-3 py-1 rounded-full text-xs font-semibold text-foreground shadow-sm">
              {badge}
            </span>
          )}
        </div>

        {/* Thumbnail gallery if multiple images */}
        {sortedImages.length > 1 && (
          <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar py-1">
            {sortedImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setActiveImageIndex(idx);
                  setImageError(false);
                }}
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-brand-warm border transition-all shrink-0 ${
                  activeImageIndex === idx
                    ? "border-brand-pink ring-2 ring-brand-pink/30"
                    : "border-border hover:border-brand-pink/40"
                }`}
                aria-label={`Lihat gambar ke-${idx + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Right Column: Product Information & Purchase Controls */}
      <div className="lg:col-span-6 w-full flex flex-col justify-start">
        {/* Category Label */}
        <Link
          href={`/koleksi?category=${categorySlug}`}
          className="text-xs uppercase tracking-wider text-muted-foreground font-semibold hover:text-brand-pink transition-colors mb-2 inline-block w-fit"
        >
          {categoryLabel}
        </Link>

        {/* Product Name */}
        <h1 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-bold sm:font-extrabold text-foreground tracking-tight leading-tight mb-3">
          {name}
        </h1>

        {/* Price & Stock status */}
        <div className="flex items-baseline gap-3 mb-4">
          <div className="text-2xl sm:text-3xl font-bold text-foreground">
            {formattedPrice}
          </div>
          {matchingVariant && (
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                isOutOfStock
                  ? "bg-rose-50 text-rose-600 border border-rose-200"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}
            >
              {isOutOfStock ? "Stok Habis" : `Tersedia (${matchingVariant.stock})`}
            </span>
          )}
        </div>

        {/* Short Description */}
        <p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 pb-6 border-b border-border/60">
          {shortDescription}
        </p>

        {/* Variants Selection */}
        {optionGroups.length > 0 && (
          <div className="space-y-5 mb-6">
            {optionGroups.map((group) => {
              const currentSelected = selectedVariants[group.type] || group.options[0];
              return (
                <div key={group.type}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-semibold text-foreground capitalize">
                      {group.type}:{" "}
                      <span className="font-normal text-muted-foreground">
                        {currentSelected}
                      </span>
                    </span>
                  </div>

                  <div
                    role="radiogroup"
                    aria-label={`Pilih ${group.type}`}
                    className="flex flex-wrap gap-2"
                  >
                    {group.options.map((option) => {
                      const isSelected = currentSelected === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() =>
                            setSelectedVariants((prev) => ({
                              ...prev,
                              [group.type]: option,
                            }))
                          }
                          className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                            isSelected
                              ? "bg-brand-pink text-white font-semibold shadow-none"
                              : "bg-white text-foreground border border-border hover:border-brand-pink/40 hover:bg-brand-pink-soft/20"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quantity Selector */}
        <div className="mb-6">
          <label className="text-xs sm:text-sm font-semibold text-foreground block mb-2">
            Jumlah
          </label>
          <div className="inline-flex items-center rounded-full border border-border bg-white p-1">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1 || isOutOfStock}
              aria-label="Kurangi jumlah"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-12 text-center text-sm font-bold text-foreground">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() =>
                setQuantity((q) => Math.min(availableStock > 0 ? availableStock : 99, q + 1))
              }
              disabled={quantity >= availableStock || isOutOfStock}
              aria-label="Tambah jumlah"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Primary Action Button: Tambah ke Keranjang */}
        <div className="pt-2">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full sm:w-auto min-w-[240px] h-12 px-8 rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-none active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed ${
                isAdded
                  ? "bg-brand-pink-dark text-white opacity-95 ring-2 ring-brand-pink/30"
                  : isOutOfStock
                  ? "bg-neutral-300 text-neutral-600"
                  : "bg-brand-pink text-white hover:bg-brand-pink-dark"
              }`}
            >
              {isOutOfStock ? (
                <span>Varian Tidak Tersedia</span>
              ) : isAdded ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Produk ditambahkan ke keranjang.</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 stroke-[2]" />
                  <span>Tambah ke Keranjang</span>
                </>
              )}
            </button>

            {isAdded && (
              <Link
                href="/keranjang"
                className="h-12 px-6 rounded-full border border-brand-pink/40 bg-brand-pink-soft/30 text-brand-pink-dark hover:bg-brand-pink-soft/60 font-semibold text-sm flex items-center justify-center transition-all animate-in fade-in"
              >
                Lihat Keranjang →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
