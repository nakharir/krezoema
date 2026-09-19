"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
  Truck,
  AlertCircle,
} from "lucide-react";

interface CheckoutFormData {
  nama: string;
  whatsapp: string;
  alamat: string;
  kecamatan: string;
  kota: string;
  provinsi: string;
  kodePos: string;
  catatan: string;
  metodePengiriman: "J&T" | "JNE" | "";
}

type FormErrors = Partial<Record<keyof CheckoutFormData, string>>;

export default function CheckoutContent() {
  const { items, cartTotal, cartItemCount, isHydrated } = useCart();

  const [formData, setFormData] = useState<CheckoutFormData>({
    nama: "",
    whatsapp: "",
    alamat: "",
    kecamatan: "",
    kota: "",
    provinsi: "",
    kodePos: "",
    catatan: "",
    metodePengiriman: "J&T", // Default to J&T manual option
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  // Format currency helper (IDR)
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof CheckoutFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleShippingChange = (method: "J&T" | "JNE") => {
    setFormData((prev) => ({ ...prev, metodePengiriman: method }));
    if (errors.metodePengiriman) {
      setErrors((prev) => ({ ...prev, metodePengiriman: undefined }));
    }
  };

  const validateForm = (): { isValid: boolean; firstKey?: string } => {
    const newErrors: FormErrors = {};

    if (!formData.nama.trim()) {
      newErrors.nama = "Nama lengkap wajib diisi.";
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = "Nomor WhatsApp wajib diisi.";
    } else if (formData.whatsapp.trim().length < 8) {
      newErrors.whatsapp = "Nomor WhatsApp minimal 8 digit.";
    }

    if (!formData.alamat.trim()) {
      newErrors.alamat = "Alamat lengkap wajib diisi.";
    }

    if (!formData.kecamatan.trim()) {
      newErrors.kecamatan = "Kecamatan wajib diisi.";
    }

    if (!formData.kota.trim()) {
      newErrors.kota = "Kota atau kabupaten wajib diisi.";
    }

    if (!formData.provinsi.trim()) {
      newErrors.provinsi = "Provinsi wajib diisi.";
    }

    if (!formData.kodePos.trim()) {
      newErrors.kodePos = "Kode pos wajib diisi.";
    }

    if (!formData.metodePengiriman) {
      newErrors.metodePengiriman = "Pilih salah satu metode pengiriman.";
    }

    setErrors(newErrors);
    const keys = Object.keys(newErrors);
    return { isValid: keys.length === 0, firstKey: keys[0] };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, firstKey } = validateForm();
    if (!isValid) {
      if (firstKey) {
        const el = document.getElementsByName(firstKey)[0];
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.focus();
        }
      }
      return;
    }

    setIsSubmitting(true);

    // Brief processing transition (local frontend state only, no server API)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsConfirmed(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 600);
  };

  // 1. Prevent hydration mismatch
  if (!isHydrated) {
    return (
      <div className="w-full py-16 sm:py-24 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto py-12 text-sm text-muted-foreground font-sans">
            Memuat informasi checkout...
          </div>
        </div>
      </div>
    );
  }

  // 2. Empty Cart State
  if (items.length === 0 && !isConfirmed) {
    return (
      <div className="w-full py-12 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-2">
              KREZOEMA · CHECKOUT
            </span>
            <h1 className="font-sans text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              Checkout
            </h1>
          </div>

          {/* Empty Card */}
          <div className="max-w-md mx-auto rounded-3xl bg-brand-warm border border-border/80 p-8 sm:p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-white border border-border flex items-center justify-center mx-auto mb-5 text-muted-foreground shadow-sm">
              <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
            </div>

            <h2 className="font-sans text-xl sm:text-2xl font-bold text-foreground mb-2">
              Keranjangmu masih kosong
            </h2>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-8">
              Tambahkan material terlebih dahulu sebelum melanjutkan ke checkout.
            </p>

            <Link
              href="/koleksi"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-all shadow-sm active:scale-95"
            >
              <span>Jelajahi Koleksi</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Order Confirmation State (Local UI state, no fake order ID)
  if (isConfirmed) {
    return (
      <div className="w-full py-12 sm:py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-brand-warm border border-border/80 p-7 sm:p-10 shadow-sm text-center">
            {/* Confirmation Icon */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-foreground text-background flex items-center justify-center mx-auto mb-6 shadow-sm">
              <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2]" />
            </div>

            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-2">
              KREZOEMA · KONFIRMASI PESANAN
            </span>

            <h1 className="font-sans text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-3">
              Pesanan Siap Diproses
            </h1>

            <p className="font-sans text-base sm:text-lg text-foreground font-semibold mb-2">
              Terima kasih, {formData.nama}.
            </p>

            <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto mb-2">
              Informasi pesananmu sudah kami terima di halaman ini.
            </p>

            <p className="font-sans text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto mb-8">
              Tim KREZOEMA akan mengonfirmasi detail pesanan dan pengiriman secara manual melalui WhatsApp{" "}
              <strong className="text-foreground font-semibold">({formData.whatsapp})</strong>.
            </p>

            {/* Order Summary Snapshot */}
            <div className="bg-white rounded-2xl border border-border/80 p-5 sm:p-6 text-left mb-8 max-w-xl mx-auto space-y-4">
              <h2 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground border-b border-border/60 pb-2">
                Ringkasan Informasi Pesanan
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Nama Penerima</span>
                  <span className="font-medium text-foreground">{formData.nama}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Nomor WhatsApp</span>
                  <span className="font-medium text-foreground">{formData.whatsapp}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-muted-foreground block text-[11px]">Alamat Pengiriman</span>
                  <span className="font-medium text-foreground leading-snug block">
                    {formData.alamat}, {formData.kecamatan}, {formData.kota},{" "}
                    {formData.provinsi} {formData.kodePos}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Metode Ekspedisi</span>
                  <span className="font-medium text-foreground">{formData.metodePengiriman}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Subtotal Produk</span>
                  <span className="font-bold text-foreground">{formatRupiah(cartTotal())}</span>
                </div>
                {formData.catatan && (
                  <div className="sm:col-span-2 pt-1 border-t border-border/40">
                    <span className="text-muted-foreground block text-[11px]">Catatan</span>
                    <span className="font-normal text-muted-foreground italic text-xs">
                      &ldquo;{formData.catatan}&rdquo;
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 bg-secondary/50 rounded-xl max-w-xl mx-auto mb-8 text-[12px] text-muted-foreground">
              Informasi pesanan siap dikonfirmasi. Periksa pesan WhatsApp Anda untuk verifikasi ongkir resmi dari admin KREZOEMA.
            </div>

            {/* Navigation Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-all shadow-sm active:scale-95"
              >
                Kembali ke Beranda
              </Link>
              <Link
                href="/koleksi"
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-white border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-all"
              >
                Lihat Koleksi Lagi
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. Main Checkout Form & Summary Flow
  const totalQuantity = cartItemCount();
  const subtotalPrice = cartTotal();

  return (
    <div className="w-full py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 sm:mb-12 pb-6 border-b border-border/60 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-1.5">
              KREZOEMA · CHECKOUT
            </span>
            <h1 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-bold sm:font-extrabold text-foreground tracking-tight mb-1">
              Lengkapi Pesananmu
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Isi informasi pengiriman berikut untuk melanjutkan pesanan.
            </p>
          </div>

          <Link
            href="/keranjang"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Keranjang</span>
          </Link>
        </div>

        {/* Checkout Grid: 2/3 Form + 1/3 Summary */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column (2/3 on Desktop): Customer Information & Shipping Method */}
            <div className="lg:col-span-8 w-full space-y-8">
              {/* Section 1: Informasi Pelanggan & Alamat Pengiriman */}
              <div className="rounded-3xl bg-white border border-border/80 p-6 sm:p-8 shadow-sm">
                <h2 className="font-sans text-lg sm:text-xl font-bold text-foreground mb-1">
                  Informasi Pengiriman
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mb-6">
                  Pastikan alamat dan nomor kontak aktif untuk kemudahan pengiriman kurir.
                </p>

                <div className="space-y-4 sm:space-y-5">
                  {/* Nama Lengkap */}
                  <div>
                    <label
                      htmlFor="nama"
                      className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5"
                    >
                      Nama Lengkap <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="nama"
                      name="nama"
                      value={formData.nama}
                      onChange={handleInputChange}
                      placeholder="Masukkan nama lengkap"
                      aria-required="true"
                      aria-invalid={!!errors.nama}
                      aria-describedby={errors.nama ? "error-nama" : undefined}
                      className={`w-full px-4 py-2.5 sm:py-3 rounded-xl bg-white border text-foreground placeholder:text-muted-foreground/60 text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.nama
                          ? "border-rose-500 focus:ring-rose-500/20"
                          : "border-border focus:ring-brand-purple/20 focus:border-brand-purple"
                      }`}
                    />
                    {errors.nama && (
                      <p id="error-nama" className="text-rose-600 text-xs font-medium mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.nama}</span>
                      </p>
                    )}
                  </div>

                  {/* Nomor WhatsApp */}
                  <div>
                    <label
                      htmlFor="whatsapp"
                      className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5"
                    >
                      Nomor WhatsApp <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="whatsapp"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      placeholder="08xxxxxxxxxx"
                      aria-required="true"
                      aria-invalid={!!errors.whatsapp}
                      aria-describedby={errors.whatsapp ? "error-whatsapp" : undefined}
                      className={`w-full px-4 py-2.5 sm:py-3 rounded-xl bg-white border text-foreground placeholder:text-muted-foreground/60 text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.whatsapp
                          ? "border-rose-500 focus:ring-rose-500/20"
                          : "border-border focus:ring-brand-purple/20 focus:border-brand-purple"
                      }`}
                    />
                    {errors.whatsapp && (
                      <p id="error-whatsapp" className="text-rose-600 text-xs font-medium mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.whatsapp}</span>
                      </p>
                    )}
                  </div>

                  {/* Alamat Lengkap */}
                  <div>
                    <label
                      htmlFor="alamat"
                      className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5"
                    >
                      Alamat Lengkap <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="alamat"
                      name="alamat"
                      rows={3}
                      value={formData.alamat}
                      onChange={handleInputChange}
                      placeholder="Nama jalan, nomor rumah, RT/RW, atau detail alamat lainnya"
                      aria-required="true"
                      aria-invalid={!!errors.alamat}
                      aria-describedby={errors.alamat ? "error-alamat" : undefined}
                      className={`w-full px-4 py-2.5 sm:py-3 rounded-xl bg-white border text-foreground placeholder:text-muted-foreground/60 text-sm transition-all focus:outline-none focus:ring-2 resize-none ${
                        errors.alamat
                          ? "border-rose-500 focus:ring-rose-500/20"
                          : "border-border focus:ring-brand-purple/20 focus:border-brand-purple"
                      }`}
                    />
                    {errors.alamat && (
                      <p id="error-alamat" className="text-rose-600 text-xs font-medium mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.alamat}</span>
                      </p>
                    )}
                  </div>

                  {/* Kecamatan & Kota/Kabupaten (2 columns on sm+) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="kecamatan"
                        className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5"
                      >
                        Kecamatan <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="kecamatan"
                        name="kecamatan"
                        value={formData.kecamatan}
                        onChange={handleInputChange}
                        placeholder="Masukkan kecamatan"
                        aria-required="true"
                        aria-invalid={!!errors.kecamatan}
                        aria-describedby={errors.kecamatan ? "error-kecamatan" : undefined}
                        className={`w-full px-4 py-2.5 sm:py-3 rounded-xl bg-white border text-foreground placeholder:text-muted-foreground/60 text-sm transition-all focus:outline-none focus:ring-2 ${
                          errors.kecamatan
                            ? "border-rose-500 focus:ring-rose-500/20"
                            : "border-border focus:ring-brand-purple/20 focus:border-brand-purple"
                        }`}
                      />
                      {errors.kecamatan && (
                        <p id="error-kecamatan" className="text-rose-600 text-xs font-medium mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.kecamatan}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="kota"
                        className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5"
                      >
                        Kota / Kabupaten <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="kota"
                        name="kota"
                        value={formData.kota}
                        onChange={handleInputChange}
                        placeholder="Masukkan kota atau kabupaten"
                        aria-required="true"
                        aria-invalid={!!errors.kota}
                        aria-describedby={errors.kota ? "error-kota" : undefined}
                        className={`w-full px-4 py-2.5 sm:py-3 rounded-xl bg-white border text-foreground placeholder:text-muted-foreground/60 text-sm transition-all focus:outline-none focus:ring-2 ${
                          errors.kota
                            ? "border-rose-500 focus:ring-rose-500/20"
                            : "border-border focus:ring-brand-purple/20 focus:border-brand-purple"
                        }`}
                      />
                      {errors.kota && (
                        <p id="error-kota" className="text-rose-600 text-xs font-medium mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.kota}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Provinsi & Kode Pos (2 columns on sm+) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="provinsi"
                        className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5"
                      >
                        Provinsi <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="provinsi"
                        name="provinsi"
                        value={formData.provinsi}
                        onChange={handleInputChange}
                        placeholder="Masukkan provinsi"
                        aria-required="true"
                        aria-invalid={!!errors.provinsi}
                        aria-describedby={errors.provinsi ? "error-provinsi" : undefined}
                        className={`w-full px-4 py-2.5 sm:py-3 rounded-xl bg-white border text-foreground placeholder:text-muted-foreground/60 text-sm transition-all focus:outline-none focus:ring-2 ${
                          errors.provinsi
                            ? "border-rose-500 focus:ring-rose-500/20"
                            : "border-border focus:ring-brand-purple/20 focus:border-brand-purple"
                        }`}
                      />
                      {errors.provinsi && (
                        <p id="error-provinsi" className="text-rose-600 text-xs font-medium mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.provinsi}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="kodePos"
                        className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5"
                      >
                        Kode Pos <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="kodePos"
                        name="kodePos"
                        inputMode="numeric"
                        value={formData.kodePos}
                        onChange={handleInputChange}
                        placeholder="12345"
                        aria-required="true"
                        aria-invalid={!!errors.kodePos}
                        aria-describedby={errors.kodePos ? "error-kodePos" : undefined}
                        className={`w-full px-4 py-2.5 sm:py-3 rounded-xl bg-white border text-foreground placeholder:text-muted-foreground/60 text-sm transition-all focus:outline-none focus:ring-2 ${
                          errors.kodePos
                            ? "border-rose-500 focus:ring-rose-500/20"
                            : "border-border focus:ring-brand-purple/20 focus:border-brand-purple"
                        }`}
                      />
                      {errors.kodePos && (
                        <p id="error-kodePos" className="text-rose-600 text-xs font-medium mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.kodePos}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Catatan Pesanan (Optional) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="catatan"
                        className="block text-xs sm:text-sm font-semibold text-foreground"
                      >
                        Catatan Pesanan
                      </label>
                      <span className="text-[11px] text-muted-foreground font-normal">
                        Opsional
                      </span>
                    </div>
                    <textarea
                      id="catatan"
                      name="catatan"
                      rows={2}
                      value={formData.catatan}
                      onChange={handleInputChange}
                      placeholder="Tambahkan catatan jika diperlukan..."
                      className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-white border border-border text-foreground placeholder:text-muted-foreground/60 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Pilihan Pengiriman (Selectable Radio Cards) */}
              <div className="rounded-3xl bg-white border border-border/80 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Truck className="w-5 h-5 text-foreground stroke-[1.8]" />
                  <h2 className="font-sans text-lg sm:text-xl font-bold text-foreground">
                    Metode Pengiriman
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-5">
                  Pilih ekspedisi pengiriman reguler. Biaya ongkos kirim akan dikonfirmasi secara manual oleh admin.
                </p>

                <div
                  role="radiogroup"
                  aria-label="Metode Pengiriman"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {/* J&T Card */}
                  <label
                    onClick={() => handleShippingChange("J&T")}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all flex items-start gap-3.5 ${
                      formData.metodePengiriman === "J&T"
                        ? "border-foreground bg-brand-warm/60 shadow-sm ring-1 ring-foreground"
                        : "border-border bg-white hover:border-foreground/40 hover:bg-brand-warm/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="metodePengiriman"
                      value="J&T"
                      checked={formData.metodePengiriman === "J&T"}
                      onChange={() => handleShippingChange("J&T")}
                      className="mt-1 w-4 h-4 text-foreground focus:ring-brand-purple border-border"
                    />
                    <div>
                      <span className="font-sans text-sm font-bold text-foreground block">
                        J&amp;T
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Pengiriman reguler melalui J&amp;T
                      </span>
                    </div>
                  </label>

                  {/* JNE Card */}
                  <label
                    onClick={() => handleShippingChange("JNE")}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all flex items-start gap-3.5 ${
                      formData.metodePengiriman === "JNE"
                        ? "border-foreground bg-brand-warm/60 shadow-sm ring-1 ring-foreground"
                        : "border-border bg-white hover:border-foreground/40 hover:bg-brand-warm/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="metodePengiriman"
                      value="JNE"
                      checked={formData.metodePengiriman === "JNE"}
                      onChange={() => handleShippingChange("JNE")}
                      className="mt-1 w-4 h-4 text-foreground focus:ring-brand-purple border-border"
                    />
                    <div>
                      <span className="font-sans text-sm font-bold text-foreground block">
                        JNE
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Pengiriman reguler melalui JNE
                      </span>
                    </div>
                  </label>
                </div>

                {errors.metodePengiriman && (
                  <p className="text-rose-600 text-xs font-medium mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.metodePengiriman}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Right Column (1/3 on Desktop): Order Summary */}
            <div className="lg:col-span-4 w-full lg:sticky lg:top-28">
              <div className="rounded-3xl bg-brand-warm border border-border/80 p-6 sm:p-7 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-sans text-lg sm:text-xl font-bold text-foreground">
                    Ringkasan Pesanan
                  </h2>
                  <span className="text-xs font-medium text-muted-foreground">
                    {totalQuantity} item
                  </span>
                </div>

                {/* Items Mini List */}
                <div className="divide-y divide-border/60 border-y border-border/60 max-h-72 overflow-y-auto pr-1 mb-5">
                  {items.map((item) => {
                    const variantEntries = Object.entries(item.selectedVariants);

                    return (
                      <div key={item.id} className="py-3.5 flex items-start gap-3">
                        {/* Thumbnail */}
                        <div className="w-12 h-12 rounded-lg bg-white border border-border/60 shrink-0 flex items-center justify-center overflow-hidden">
                          <div className="scale-50">
                            {item.product.category === "manik-kaca" && (
                              <div className="flex -space-x-1 items-center">
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
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-sans text-xs sm:text-sm font-semibold text-foreground truncate">
                            {item.product.name}
                          </h3>
                          {variantEntries.length > 0 && (
                            <p className="text-[11px] text-muted-foreground truncate">
                              {variantEntries
                                .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`)
                                .join(" • ")}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-1 text-xs">
                            <span className="text-muted-foreground">
                              × {item.quantity}
                            </span>
                            <span className="font-semibold text-foreground">
                              {formatRupiah(item.product.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Subtotal and Shipping Breakdown */}
                <div className="space-y-2.5 pb-4 border-b border-border/60 text-xs sm:text-sm">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-semibold text-foreground">
                      {formatRupiah(subtotalPrice)}
                    </span>
                  </div>
                  <div className="flex items-start justify-between text-muted-foreground">
                    <div>
                      <span>Pengiriman</span>
                      <span className="block text-[10px] text-muted-foreground/80">
                        {formData.metodePengiriman ? `Kurir: ${formData.metodePengiriman}` : "Belum dipilih"}
                      </span>
                    </div>
                    <span className="font-medium text-foreground text-right text-xs">
                      Dikonfirmasi setelah pesanan
                    </span>
                  </div>
                </div>

                {/* Total Preview */}
                <div className="py-4 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground block font-semibold">
                      Total Produk
                    </span>
                    <span className="text-[11px] text-muted-foreground font-normal">
                      Belum termasuk ongkos kirim
                    </span>
                  </div>
                  <span className="font-sans text-xl font-bold text-foreground">
                    {formatRupiah(subtotalPrice)}
                  </span>
                </div>

                {/* Primary Action Button: Konfirmasi Pesanan */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-full bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Memproses...</span>
                  ) : (
                    <>
                      <span>Konfirmasi Pesanan</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="mt-4 text-center">
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Informasi pesanan akan dicek oleh admin KREZOEMA untuk verifikasi ketersediaan material dan ongkir.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
