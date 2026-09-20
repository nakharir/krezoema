"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Minus, Plus, Trash2, ArrowRight, ArrowLeft, ShoppingBag } from "lucide-react";

export default function CartContent() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartItemCount,
    isHydrated,
  } = useCart();
  const { isLoggedIn } = useAuth();

  const [confirmClear, setConfirmClear] = useState<boolean>(false);

  // Format currency helper (IDR)
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Prevent hydration mismatch: render a calm loading placeholder until client storage hydrates
  if (!isHydrated) {
    return (
      <div className="w-full py-16 sm:py-24 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto py-12 text-sm text-muted-foreground font-sans">
            Memuat keranjang belanja...
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart State
  if (items.length === 0) {
    return (
      <div className="w-full py-12 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-wider text-brand-pink font-semibold block mb-2">
              KREZOEMA · KERANJANG
            </span>
            <h1 className="font-sans text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              Keranjang Belanja
            </h1>
          </div>

          {/* Empty Card */}
          <div className="max-w-md mx-auto rounded-3xl bg-brand-warm border border-border/80 p-8 sm:p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-white border border-border flex items-center justify-center mx-auto mb-5 text-brand-pink shadow-xs">
              <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
            </div>

            <h2 className="font-sans text-xl sm:text-2xl font-bold text-foreground mb-2">
              Keranjangmu masih kosong
            </h2>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-8">
              Yuk temukan material yang ingin kamu gunakan untuk membuat sesuatu.
            </p>

            <Link
              href="/koleksi"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-brand-pink text-white font-semibold text-sm hover:bg-brand-pink-dark transition-all shadow-none active:scale-95"
            >
              <span>Jelajahi Koleksi</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalQuantity = cartItemCount();
  const totalPrice = cartTotal();

  return (
    <div className="w-full py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cart Page Header */}
        <div className="mb-8 sm:mb-12 pb-6 border-b border-border/60 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-1.5">
              KREZOEMA · KERANJANG
            </span>
            <h1 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-bold sm:font-extrabold text-foreground tracking-tight">
              Keranjang Belanja
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Total <strong className="text-foreground font-semibold">{totalQuantity}</strong> item dalam keranjang
          </p>
        </div>

        {/* Main Grid: 2/3 Items + 1/3 Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column (2/3 on Desktop): Cart Item List */}
          <div className="lg:col-span-8 w-full space-y-4">
            <div className="divide-y divide-border/60 border-y border-border/60">
              {items.map((item) => {
                const variantEntries = Object.entries(item.selectedVariants);

                return (
                  <div
                    key={item.id}
                    className="py-5 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    {/* Visual & Basic Info */}
                    <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
                      {/* Product Visual Thumbnail */}
                      <Link
                        href={`/produk/${item.product.slug}`}
                        className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-brand-warm border border-border/60 flex items-center justify-center shrink-0 overflow-hidden group"
                        aria-label={`Lihat detail ${item.product.name}`}
                      >
                        <div className="scale-75 transition-transform duration-200 group-hover:scale-90">
                          {item.product.category === "manik-kaca" && (
                            <div className="flex -space-x-1.5 items-center">
                              <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-400 to-indigo-300 shadow-sm border border-white" />
                              <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-fuchsia-300 to-rose-200 shadow-md border border-white" />
                            </div>
                          )}
                          {item.product.category === "akrilik" && (
                            <div className="grid grid-cols-2 gap-1 p-1">
                              <span className="w-4 h-4 rounded-md bg-pink-300" />
                              <span className="w-4 h-4 rounded-full bg-violet-300" />
                              <span className="w-4 h-4 rounded-full bg-amber-200" />
                              <span className="w-4 h-4 rounded-md bg-emerald-200" />
                            </div>
                          )}
                          {item.product.category === "mutiara" && (
                            <div className="flex items-center gap-1">
                              <span className="w-5 h-5 rounded-full bg-amber-50 border border-amber-200" />
                              <span className="w-7 h-7 rounded-full bg-gradient-to-br from-white to-amber-100 border border-white shadow-sm" />
                            </div>
                          )}
                          {item.product.category === "tali-kawat" && (
                            <div className="w-10 h-10 rounded-full border-2 border-orange-300 flex items-center justify-center">
                              <div className="w-6 h-6 rounded-full border border-orange-400" />
                            </div>
                          )}
                          {item.product.category === "alat-crafting" && (
                            <div className="w-10 h-10 rounded-lg bg-neutral-100 border border-border flex items-center justify-center">
                              <span className="w-1.5 h-5 rounded-sm bg-neutral-700 transform -rotate-12" />
                              <span className="w-1.5 h-5 rounded-sm bg-neutral-700 transform rotate-12 -ml-1" />
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Product Details */}
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-0.5">
                          {item.product.categoryLabel}
                        </span>
                        <h2 className="font-sans text-sm sm:text-base font-semibold text-foreground truncate">
                          <Link
                            href={`/produk/${item.product.slug}`}
                            className="hover:text-brand-pink transition-colors"
                          >
                            {item.product.name}
                          </Link>
                        </h2>

                        {/* Selected Variants */}
                        {variantEntries.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {variantEntries
                              .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`)
                              .join(" • ")}
                          </p>
                        )}

                        <div className="text-xs text-muted-foreground mt-1">
                          {item.product.formattedPrice} / butir atau paket
                        </div>
                      </div>
                    </div>

                    {/* Quantity Selector, Subtotal & Remove */}
                    <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                      {/* Quantity Controls */}
                      <div className="inline-flex items-center rounded-full border border-border bg-white p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          aria-label={`Kurangi jumlah ${item.product.name}`}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-9 sm:w-10 text-center text-xs sm:text-sm font-bold text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label={`Tambah jumlah ${item.product.name}`}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Item Total Price */}
                      <div className="text-right min-w-[90px] sm:min-w-[110px]">
                        <span className="font-sans text-sm sm:text-base font-bold text-foreground">
                          {formatRupiah(item.product.price * item.quantity)}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Hapus ${item.product.name} dari keranjang`}
                        className="p-2 text-muted-foreground hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
                        title="Hapus item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions: Clear Cart & Back to Collection */}
            <div className="flex items-center justify-between pt-4 text-xs sm:text-sm text-muted-foreground">
              <Link
                href="/koleksi"
                className="inline-flex items-center gap-1.5 font-medium hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Lanjut Belanja Material</span>
              </Link>

              {/* Subtle Clear Cart action with quick confirmation */}
              {!confirmClear ? (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="text-muted-foreground hover:text-rose-600 font-medium transition-colors"
                >
                  Kosongkan Keranjang
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-rose-600 font-semibold">Yakin kosongkan?</span>
                  <button
                    type="button"
                    onClick={() => {
                      clearCart();
                      setConfirmClear(false);
                    }}
                    className="px-2.5 py-1 rounded-md bg-rose-600 text-white font-semibold text-xs hover:bg-rose-700 transition-colors"
                  >
                    Ya
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="px-2.5 py-1 rounded-md bg-secondary text-foreground font-medium text-xs hover:bg-border transition-colors"
                  >
                    Batal
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (1/3 on Desktop): Order Summary */}
          <div className="lg:col-span-4 w-full sticky top-28">
            <div className="rounded-3xl bg-brand-warm border border-border/80 p-6 sm:p-7 shadow-sm">
              <h2 className="font-sans text-lg sm:text-xl font-bold text-foreground mb-4">
                Ringkasan Pesanan
              </h2>

              <div className="space-y-3 pb-5 border-b border-border/60 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Total Kuantitas</span>
                  <span className="font-semibold text-foreground">{totalQuantity} item</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Estimasi Pengiriman</span>
                  <span className="font-medium text-foreground italic">Dihitung saat checkout</span>
                </div>
              </div>

              {/* Subtotal */}
              <div className="py-5 flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider block font-semibold">
                    Subtotal
                  </span>
                  <span className="text-xs text-muted-foreground font-normal">
                    Belum termasuk ongkir
                  </span>
                </div>
                <span className="font-sans text-xl sm:text-2xl font-bold text-foreground">
                  {formatRupiah(totalPrice)}
                </span>
              </div>

              {/* Checkout CTA: points to /checkout if logged in, otherwise /login?redirect=/checkout */}
              <Link
                href={isLoggedIn ? "/checkout" : "/login?redirect=/checkout"}
                className="w-full h-12 rounded-full bg-brand-pink text-white font-semibold text-sm hover:bg-brand-pink-dark transition-all flex items-center justify-center gap-2 shadow-none active:scale-[0.99]"
              >
                <span>Lanjut ke Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="mt-4 text-center">
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Pesanan akan diproses aman dan dikemas teliti menggunakan kemasan ramah lingkungan.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
