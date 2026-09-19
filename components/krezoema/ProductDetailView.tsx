"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/data/mockProducts";
import { Minus, Plus, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProductDetailViewProps {
  product: Product;
  onAddToCart?: (
    product: Product,
    selectedVariants: Record<string, string>,
    quantity: number
  ) => void;
}

export default function ProductDetailView({
  product,
  onAddToCart,
}: ProductDetailViewProps) {
  const { addToCart } = useCart();

  // Initialize variant selections with first available options
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach((v) => {
        if (v.options.length > 0) {
          initial[v.type] = v.options[0];
        }
      });
    }
    return initial;
  });

  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const handleAddToCart = () => {
    addToCart(product, selectedVariants, quantity);
    if (onAddToCart) {
      onAddToCart(product, selectedVariants, quantity);
    }
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* 1. Left Column: Product Visual */}
      <div className="lg:col-span-6 w-full">
        <div className="relative w-full aspect-square rounded-2xl sm:rounded-3xl bg-brand-warm border border-border/80 p-6 sm:p-10 flex items-center justify-center overflow-hidden">
          {/* Tactile Material Motif scaled up cleanly */}
          <div className="relative w-full h-full flex items-center justify-center">
            {product.category === "manik-kaca" && (
              <div className="flex -space-x-4 items-center">
                <span className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-purple-400 via-indigo-300 to-purple-200 shadow-md border-2 border-white" />
                <span className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-fuchsia-300 via-pink-200 to-rose-100 shadow-lg border-2 border-white z-10" />
                <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-cyan-300 via-sky-200 to-blue-200 shadow-md border-2 border-white" />
              </div>
            )}
            {product.category === "akrilik" && (
              <div className="grid grid-cols-2 gap-4 p-4">
                <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-pink-300 shadow-sm border-2 border-white" />
                <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-violet-300 shadow-sm border-2 border-white" />
                <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-200 shadow-sm border-2 border-white" />
                <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-200 shadow-sm border-2 border-white" />
              </div>
            )}
            {product.category === "mutiara" && (
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-amber-50 border-2 border-amber-200 shadow-sm" />
                <span className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-white via-amber-50 to-amber-100 shadow-lg border-2 border-white" />
                <span className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-amber-50 border-2 border-amber-200 shadow-sm" />
              </div>
            )}
            {product.category === "tali-kawat" && (
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 border-orange-300 flex items-center justify-center p-4">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-orange-400 flex items-center justify-center">
                  <span className="w-8 h-8 rounded-full bg-orange-100" />
                </div>
              </div>
            )}
            {product.category === "alat-crafting" && (
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl bg-white border border-border flex items-center justify-center shadow-sm">
                <span className="w-5 h-20 rounded-md bg-neutral-700 transform -rotate-12" />
                <span className="w-5 h-20 rounded-md bg-neutral-700 transform rotate-12 -ml-3" />
              </div>
            )}
          </div>

          {/* Minimalist badge if product has one */}
          {product.badge && (
            <span className="absolute top-4 left-4 sm:top-5 sm:left-5 bg-white border border-border px-3 py-1 rounded-full text-xs font-semibold text-foreground shadow-sm">
              {product.badge}
            </span>
          )}
        </div>
      </div>

      {/* 2. Right Column: Product Information & Purchase Controls */}
      <div className="lg:col-span-6 w-full flex flex-col justify-start">
        {/* Category Label */}
        <Link
          href={`/koleksi?kategori=${product.category}`}
          className="text-xs uppercase tracking-wider text-muted-foreground font-semibold hover:text-brand-purple transition-colors mb-2 inline-block w-fit"
        >
          {product.categoryLabel}
        </Link>

        {/* Product Name */}
        <h1 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-bold sm:font-extrabold text-foreground tracking-tight leading-tight mb-3">
          {product.name}
        </h1>

        {/* Price */}
        <div className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
          {product.formattedPrice}
        </div>

        {/* Short Description */}
        <p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 pb-6 border-b border-border/60">
          {product.shortDescription}
        </p>

        {/* Variants Selection */}
        {product.variants && product.variants.length > 0 && (
          <div className="space-y-5 mb-6">
            {product.variants.map((v) => {
              const currentSelected = selectedVariants[v.type] || v.options[0];
              return (
                <div key={v.type}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-semibold text-foreground capitalize">
                      {v.type}:{" "}
                      <span className="font-normal text-muted-foreground">
                        {currentSelected}
                      </span>
                    </span>
                  </div>

                  <div
                    role="radiogroup"
                    aria-label={`Pilih ${v.type}`}
                    className="flex flex-wrap gap-2"
                  >
                    {v.options.map((option) => {
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
                              [v.type]: option,
                            }))
                          }
                          className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                            isSelected
                              ? "bg-foreground text-background shadow-sm"
                              : "bg-white text-foreground border border-border hover:border-foreground/30 hover:bg-brand-warm"
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
              disabled={quantity <= 1}
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
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Tambah jumlah"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
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
              className={`w-full sm:w-auto min-w-[240px] h-12 px-8 rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] ${
                isAdded
                  ? "bg-foreground text-background opacity-95 ring-2 ring-foreground/20"
                  : "bg-foreground text-background hover:bg-foreground/90"
              }`}
            >
              {isAdded ? (
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
                className="h-12 px-6 rounded-full border border-border bg-white text-foreground hover:bg-secondary font-semibold text-sm flex items-center justify-center transition-all animate-in fade-in"
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
