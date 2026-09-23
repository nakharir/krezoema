"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/krezoema/Navbar";
import Footer from "@/components/krezoema/Footer";
import { useAuth, CustomerAddress } from "@/context/AuthContext";
import {
  User,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Star,
  LogOut,
  Package,
  X,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function AkunPage() {
  const router = useRouter();
  const {
    customer,
    addresses,
    isAddressesLoading,
    addressError,
    isLoggedIn,
    isHydrated,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    logout,
  } = useAuth();

  // Profile Edit Modal State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    nama: "",
    whatsapp: "",
    email: "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Address Modal State (Add or Edit)
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    label: "Rumah",
    nama: "",
    whatsapp: "",
    alamat: "",
    kecamatan: "",
    kotaKabupaten: "",
    provinsi: "",
    kodePos: "",
    isDefault: false,
  });
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addressActionError, setAddressActionError] = useState<string | null>(null);
  const [addressActionId, setAddressActionId] = useState<string | null>(null);

  // Active section tab (profil/alamat/pesanan)
  const [activeTab, setActiveTab] = useState<"profil-alamat" | "pesanan">(
    "profil-alamat"
  );

  // Sync profile form when customer changes
  useEffect(() => {
    if (customer) {
      setProfileForm({
        nama: customer.nama,
        whatsapp: customer.whatsapp,
        email: customer.email,
      });
    }
  }, [customer]);

  // Handle opening Add Address modal
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      label: "Rumah",
      nama: customer?.nama || "",
      whatsapp: customer?.whatsapp || "",
      alamat: "",
      kecamatan: "",
      kotaKabupaten: "",
      provinsi: "",
      kodePos: "",
      isDefault: addresses.length === 0,
    });
    setAddressErrors({});
    setIsAddressModalOpen(true);
  };

  // Handle opening Edit Address modal
  const handleOpenEditAddress = (addr: CustomerAddress) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      label: addr.label,
      nama: addr.nama,
      whatsapp: addr.whatsapp,
      alamat: addr.alamat,
      kecamatan: addr.kecamatan,
      kotaKabupaten: addr.kotaKabupaten,
      provinsi: addr.provinsi,
      kodePos: addr.kodePos,
      isDefault: addr.isDefault,
    });
    setAddressErrors({});
    setIsAddressModalOpen(true);
  };

  // Validate and submit address modal
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!addressForm.nama.trim()) errs.nama = "Nama penerima wajib diisi.";
    if (!addressForm.whatsapp.trim()) errs.whatsapp = "Nomor WhatsApp wajib diisi.";
    if (!addressForm.alamat.trim()) errs.alamat = "Alamat lengkap wajib diisi.";
    if (!addressForm.kecamatan.trim()) errs.kecamatan = "Kecamatan wajib diisi.";
    if (!addressForm.kotaKabupaten.trim())
      errs.kotaKabupaten = "Kota / Kabupaten wajib diisi.";
    if (!addressForm.provinsi.trim()) errs.provinsi = "Provinsi wajib diisi.";
    if (!addressForm.kodePos.trim()) errs.kodePos = "Kode pos wajib diisi.";

    if (Object.keys(errs).length > 0) {
      setAddressErrors(errs);
      return;
    }

    setIsSavingAddress(true);
    setAddressActionError(null);
    try {
      if (editingAddressId) {
        await updateAddress(editingAddressId, addressForm);
      } else {
        await addAddress(addressForm);
      }
      setIsAddressModalOpen(false);
    } catch (error: any) {
      setAddressActionError(error?.response?.data?.message || "Gagal menyimpan alamat. Silakan coba lagi.");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    setAddressActionId(id);
    setAddressActionError(null);
    try {
      await setDefaultAddress(id);
    } catch {
      setAddressActionError("Gagal mengatur alamat utama. Silakan coba lagi.");
    } finally {
      setAddressActionId(null);
    }
  };

  const handleDeleteAddress = async (id: string, label: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus alamat "${label}"?`)) return;
    setAddressActionId(id);
    setAddressActionError(null);
    try {
      await deleteAddress(id);
    } catch {
      setAddressActionError("Gagal menghapus alamat. Silakan coba lagi.");
    } finally {
      setAddressActionId(null);
    }
  };

  // Logout State
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Submit profile edit to backend
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.nama.trim() || !profileForm.email.trim()) return;

    setIsSavingProfile(true);
    setProfileError(null);

    try {
      const res = await updateProfile({
        name: profileForm.nama.trim(),
        email: profileForm.email.trim(),
        whatsapp: profileForm.whatsapp.trim(),
      });

      if (res.success) {
        setIsEditingProfile(false);
      } else {
        setProfileError(res.error || "Gagal memperbarui profil.");
      }
    } catch {
      setProfileError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      router.push("/login");
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-warm text-foreground">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20 text-muted-foreground text-sm">
          Memuat akun Anda...
        </main>
        <Footer />
      </div>
    );
  }

  // Not logged in view
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-warm text-foreground antialiased selection:bg-brand-pink-soft selection:text-brand-pink-dark">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6">
          <div className="max-w-md w-full bg-white rounded-3xl border border-border/80 p-8 sm:p-10 text-center shadow-sm">
            <div className="w-14 h-14 rounded-full bg-brand-pink-soft text-brand-pink-dark flex items-center justify-center mx-auto mb-5">
              <User className="w-7 h-7" />
            </div>
            <h1 className="font-sans text-2xl font-bold text-foreground mb-2">
              Masuk untuk Melihat Akun
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-8">
              Masuk atau buat akun baru untuk mengelola profil, alamat pengiriman, dan mempercepat proses checkout.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/login?redirect=/akun"
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-brand-pink text-white font-semibold text-xs sm:text-sm hover:bg-brand-pink-dark transition-colors"
              >
                Masuk ke Akun
              </Link>
              <Link
                href="/register?redirect=/akun"
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white border border-border text-foreground font-semibold text-xs sm:text-sm hover:bg-secondary transition-colors"
              >
                Daftar Akun Baru
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-warm text-foreground antialiased selection:bg-brand-pink-soft selection:text-brand-pink-dark">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12 lg:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header & Account Greeting */}
          <div className="mb-8 pb-6 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-brand-pink font-semibold block mb-1">
                KREZOEMA · AKUN SAYA
              </span>
              <h1 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                Halo, {customer?.nama}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Kelola profil pribadimu dan daftar alamat pengiriman.
              </p>
            </div>

            {/* Quick Actions & Logout */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-white text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isLoggingOut ? "Keluar..." : "Keluar"}</span>
              </button>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-2 mb-8 border-b border-border/60 pb-3">
            <button
              type="button"
              onClick={() => setActiveTab("profil-alamat")}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "profil-alamat"
                  ? "bg-brand-pink text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-white"
              }`}
            >
              Profil &amp; Alamat
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("pesanan")}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "pesanan"
                  ? "bg-brand-pink text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-white"
              }`}
            >
              Pesanan Saya
            </button>
          </div>

          {activeTab === "profil-alamat" && (
            <div className="space-y-10">
              {/* SECTION 1: PROFIL */}
              <section className="bg-white rounded-3xl border border-border/80 p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border/60">
                  <div>
                    <h2 className="font-sans text-lg sm:text-xl font-bold text-foreground">
                      Profil Saya
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Informasi kontak akun pelanggan.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-border text-foreground text-xs font-semibold hover:border-brand-pink/50 hover:bg-brand-pink-soft/30 transition-all self-start sm:self-auto"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-brand-pink" />
                    <span>Edit Profil</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm">
                  <div className="bg-brand-warm rounded-2xl p-4 border border-border/60">
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold block mb-1">
                      Nama Lengkap
                    </span>
                    <p className="font-semibold text-foreground text-sm sm:text-base">
                      {customer?.nama}
                    </p>
                  </div>

                  <div className="bg-brand-warm rounded-2xl p-4 border border-border/60">
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold block mb-1">
                      Nomor WhatsApp
                    </span>
                    <p className="font-semibold text-foreground text-sm sm:text-base">
                      {customer?.whatsapp}
                    </p>
                  </div>

                  <div className="bg-brand-warm rounded-2xl p-4 border border-border/60">
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold block mb-1">
                      Alamat Email
                    </span>
                    <p className="font-semibold text-foreground text-sm sm:text-base truncate">
                      {customer?.email}
                    </p>
                  </div>
                </div>
              </section>

              {/* SECTION 2: ALAMAT PENGIRIMAN */}
              <section id="alamat" className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-sans text-xl sm:text-2xl font-bold text-foreground">
                      Alamat Pengiriman
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Daftar alamat tersimpan untuk mempercepat checkout.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenAddAddress}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-pink text-white font-semibold text-xs sm:text-sm hover:bg-brand-pink-dark transition-all self-start sm:self-auto shadow-none"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Alamat</span>
                  </button>
                </div>

                {/* Address Cards List */}
                {addressError || addressActionError ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {addressActionError || addressError}
                  </div>
                ) : isAddressesLoading ? (
                  <div className="bg-white rounded-3xl border border-border/80 p-8 text-center text-sm text-muted-foreground">
                    Memuat alamat...
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-border/80 p-8 sm:p-12 text-center">
                    <div className="w-12 h-12 rounded-full bg-brand-pink-soft text-brand-pink-dark flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <h3 className="font-sans text-base sm:text-lg font-bold text-foreground mb-1">
                      Belum ada alamat tersimpan.
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                      Simpan alamat agar checkout berikutnya lebih cepat dan tanpa repot mengetik ulang.
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenAddAddress}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-pink text-white font-semibold text-xs sm:text-sm hover:bg-brand-pink-dark transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Alamat</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`rounded-3xl border p-6 flex flex-col justify-between transition-all ${
                          addr.isDefault
                            ? "bg-white border-brand-pink shadow-sm ring-1 ring-brand-pink/40"
                            : "bg-white border-border hover:border-border/90"
                        }`}
                      >
                        <div>
                          {/* Header & Badges */}
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-brand-pink-soft text-brand-pink-dark">
                                {addr.label}
                              </span>
                              {addr.isDefault && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-pink-dark bg-rose-50 px-2 py-0.5 rounded-full border border-brand-pink/20">
                                  <Star className="w-3 h-3 fill-brand-pink text-brand-pink" />
                                  <span>Alamat Utama</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Recipient details */}
                          <p className="font-bold text-foreground text-sm sm:text-base">
                            {addr.nama}
                          </p>
                          <p className="text-xs text-muted-foreground mb-3">
                            {addr.whatsapp}
                          </p>

                          {/* Detailed address */}
                          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                            {addr.alamat}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            {addr.kecamatan}, {addr.kotaKabupaten}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {addr.provinsi}, {addr.kodePos}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between gap-2 text-xs">
                          <div>
                            {!addr.isDefault && (
                              <button
                                type="button"
                                onClick={() => handleSetDefaultAddress(addr.id)}
                                disabled={addressActionId === addr.id}
                                className="font-semibold text-brand-pink hover:text-brand-pink-dark transition-colors disabled:opacity-60"
                              >
                                {addressActionId === addr.id ? "Mengatur..." : "Set Alamat Utama"}
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleOpenEditAddress(addr)}
                              className="font-medium text-foreground hover:text-brand-pink flex items-center gap-1 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAddress(addr.id, addr.label)}
                              disabled={addressActionId === addr.id}
                              className="font-medium text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors disabled:opacity-60"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{addressActionId === addr.id ? "Menghapus..." : "Hapus"}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* SECTION 3: PESANAN SAYA */}
          {activeTab === "pesanan" && (
            <div className="bg-white rounded-3xl border border-border/80 p-8 sm:p-12 text-center shadow-sm">
              <div className="w-14 h-14 rounded-full bg-brand-pink-soft text-brand-pink-dark flex items-center justify-center mx-auto mb-4">
                <Package className="w-7 h-7 stroke-[1.8]" />
              </div>
              <h2 className="font-sans text-xl font-bold text-foreground mb-2">
                Riwayat Pesanan Anda
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-6">
                Pesanan KREZOEMA dikonfirmasi dan diverifikasi manual melalui WhatsApp oleh tim admin studio kami.
              </p>
              <div className="p-4 rounded-2xl bg-brand-warm border border-border/80 max-w-md mx-auto text-xs text-muted-foreground text-left">
                <p className="font-semibold text-foreground mb-1">
                  Catatan Pengiriman:
                </p>
                <p>
                  Jika Anda telah melakukan checkout, detail pesanan Anda telah dikirim dan dapat Anda konfirmasi ulang langsung via WhatsApp.
                </p>
              </div>
              <div className="mt-8">
                <Link
                  href="/koleksi"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-pink text-white font-semibold text-xs sm:text-sm hover:bg-brand-pink-dark transition-colors"
                >
                  <span>Mulai Belanja</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL 1: EDIT PROFILE */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-border max-w-md w-full p-6 sm:p-8 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/60">
              <h3 className="font-sans text-lg font-bold text-foreground">
                Edit Profil
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="p-1.5 rounded-full text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {profileError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={profileForm.nama}
                  onChange={(e) =>
                    setProfileForm((prev) => ({ ...prev, nama: e.target.value }))
                  }
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Nomor WhatsApp
                </label>
                <input
                  type="tel"
                  value={profileForm.whatsapp}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      whatsapp: e.target.value,
                    }))
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  disabled={isSavingProfile}
                  className="px-4 py-2 rounded-full border border-border text-xs font-medium text-foreground hover:bg-secondary disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-5 py-2 rounded-full bg-brand-pink text-white text-xs font-semibold hover:bg-brand-pink-dark disabled:opacity-60 transition-colors"
                >
                  {isSavingProfile ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT ADDRESS */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-border max-w-lg w-full p-6 sm:p-8 shadow-xl my-8 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/60">
              <h3 className="font-sans text-lg font-bold text-foreground">
                {editingAddressId ? "Edit Alamat" : "Tambah Alamat Baru"}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="p-1.5 rounded-full text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              {/* Address Label Pills */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Label Alamat
                </label>
                <div className="flex items-center gap-2">
                  {["Rumah", "Kantor", "Kos", "Studio"].map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() =>
                        setAddressForm((prev) => ({ ...prev, label: lbl }))
                      }
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        addressForm.label === lbl
                          ? "bg-brand-pink text-white shadow-xs"
                          : "bg-brand-warm text-muted-foreground border border-border/80 hover:text-foreground"
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nama Penerima & WA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Nama Penerima <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addressForm.nama}
                    onChange={(e) =>
                      setAddressForm((prev) => ({
                        ...prev,
                        nama: e.target.value,
                      }))
                    }
                    placeholder="Nama lengkap"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink"
                  />
                  {addressErrors.nama && (
                    <p className="text-rose-600 text-[11px] mt-1">
                      {addressErrors.nama}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Nomor WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={addressForm.whatsapp}
                    onChange={(e) =>
                      setAddressForm((prev) => ({
                        ...prev,
                        whatsapp: e.target.value,
                      }))
                    }
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink"
                  />
                  {addressErrors.whatsapp && (
                    <p className="text-rose-600 text-[11px] mt-1">
                      {addressErrors.whatsapp}
                    </p>
                  )}
                </div>
              </div>

              {/* Alamat Lengkap */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Alamat Lengkap <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={addressForm.alamat}
                  onChange={(e) =>
                    setAddressForm((prev) => ({
                      ...prev,
                      alamat: e.target.value,
                    }))
                  }
                  placeholder="Nama jalan, nomor rumah, RT/RW, detail lainnya"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink resize-none"
                />
                {addressErrors.alamat && (
                  <p className="text-rose-600 text-[11px] mt-1">
                    {addressErrors.alamat}
                  </p>
                )}
              </div>

              {/* Kecamatan & Kota */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Kecamatan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addressForm.kecamatan}
                    onChange={(e) =>
                      setAddressForm((prev) => ({
                        ...prev,
                        kecamatan: e.target.value,
                      }))
                    }
                    placeholder="Kecamatan"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink"
                  />
                  {addressErrors.kecamatan && (
                    <p className="text-rose-600 text-[11px] mt-1">
                      {addressErrors.kecamatan}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Kota / Kabupaten <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addressForm.kotaKabupaten}
                    onChange={(e) =>
                      setAddressForm((prev) => ({
                        ...prev,
                        kotaKabupaten: e.target.value,
                      }))
                    }
                    placeholder="Kota atau kabupaten"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink"
                  />
                  {addressErrors.kotaKabupaten && (
                    <p className="text-rose-600 text-[11px] mt-1">
                      {addressErrors.kotaKabupaten}
                    </p>
                  )}
                </div>
              </div>

              {/* Provinsi & Kode Pos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Provinsi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addressForm.provinsi}
                    onChange={(e) =>
                      setAddressForm((prev) => ({
                        ...prev,
                        provinsi: e.target.value,
                      }))
                    }
                    placeholder="Provinsi"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink"
                  />
                  {addressErrors.provinsi && (
                    <p className="text-rose-600 text-[11px] mt-1">
                      {addressErrors.provinsi}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Kode Pos <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={addressForm.kodePos}
                    onChange={(e) =>
                      setAddressForm((prev) => ({
                        ...prev,
                        kodePos: e.target.value,
                      }))
                    }
                    placeholder="12345"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink"
                  />
                  {addressErrors.kodePos && (
                    <p className="text-rose-600 text-[11px] mt-1">
                      {addressErrors.kodePos}
                    </p>
                  )}
                </div>
              </div>

              {/* Checkbox Set Default */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={addressForm.isDefault}
                    onChange={(e) =>
                      setAddressForm((prev) => ({
                        ...prev,
                        isDefault: e.target.checked,
                      }))
                    }
                    className="rounded border-border text-brand-pink focus:ring-brand-pink w-4 h-4"
                  />
                  <span>Jadikan sebagai alamat pengiriman utama</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  disabled={isSavingAddress}
                  className="px-4 py-2 rounded-full border border-border text-xs font-medium text-foreground hover:bg-secondary"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingAddress}
                  className="px-5 py-2 rounded-full bg-brand-pink text-white text-xs font-semibold hover:bg-brand-pink-dark transition-colors shadow-none disabled:opacity-60"
                >
                  {isSavingAddress ? "Menyimpan..." : editingAddressId ? "Simpan Perubahan" : "Tambah Alamat"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
