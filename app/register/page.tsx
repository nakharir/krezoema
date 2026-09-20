"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/krezoema/Navbar";
import Footer from "@/components/krezoema/Footer";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/akun";

  const { register } = useAuth();
  const [nama, setNama] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const err: Record<string, string> = {};

    if (!nama.trim()) {
      err.nama = "Nama lengkap wajib diisi.";
    }

    if (!whatsapp.trim()) {
      err.whatsapp = "Nomor WhatsApp wajib diisi.";
    } else if (whatsapp.trim().length < 8) {
      err.whatsapp = "Nomor WhatsApp minimal 8 digit.";
    }

    if (!email.trim()) {
      err.email = "Email wajib diisi.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      err.email = "Format email tidak valid.";
    }

    if (!password) {
      err.password = "Password wajib diisi.";
    } else if (password.length < 6) {
      err.password = "Password minimal 6 karakter.";
    }

    if (password !== confirmPassword) {
      err.confirmPassword = "Konfirmasi password tidak cocok.";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    setTimeout(() => {
      const res = register({
        nama,
        whatsapp,
        email,
        password,
      });

      setLoading(false);

      if (res.success) {
        router.push(redirectTarget);
      } else {
        setErrors({ form: res.error || "Gagal membuat akun." });
      }
    }, 450);
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="bg-white rounded-3xl border border-border/80 p-7 sm:p-9 shadow-sm">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-wider text-brand-pink font-semibold block mb-2">
            Akun KREZOEMA
          </span>
          <h1 className="font-sans text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-2">
            Daftar Akun Baru
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Buat akun untuk menyimpan alamat dan checkout lebih praktis.
          </p>
        </div>

        {errors.form && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="nama"
              className="block text-xs sm:text-sm font-semibold text-foreground mb-1"
            >
              Nama Lengkap <span className="text-rose-500">*</span>
            </label>
            <input
              id="nama"
              type="text"
              value={nama}
              onChange={(e) => {
                setNama(e.target.value);
                if (errors.nama) setErrors((prev) => ({ ...prev, nama: "" }));
              }}
              placeholder="Masukkan nama lengkap"
              className={`w-full px-4 py-2.5 rounded-xl bg-white border text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.nama
                  ? "border-rose-400 focus:ring-rose-200"
                  : "border-border focus:ring-brand-pink/20 focus:border-brand-pink"
              }`}
            />
            {errors.nama && (
              <p className="text-rose-600 text-xs mt-1">{errors.nama}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="whatsapp"
              className="block text-xs sm:text-sm font-semibold text-foreground mb-1"
            >
              Nomor WhatsApp <span className="text-rose-500">*</span>
            </label>
            <input
              id="whatsapp"
              type="tel"
              value={whatsapp}
              onChange={(e) => {
                setWhatsapp(e.target.value);
                if (errors.whatsapp)
                  setErrors((prev) => ({ ...prev, whatsapp: "" }));
              }}
              placeholder="08xxxxxxxxxx"
              className={`w-full px-4 py-2.5 rounded-xl bg-white border text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.whatsapp
                  ? "border-rose-400 focus:ring-rose-200"
                  : "border-border focus:ring-brand-pink/20 focus:border-brand-pink"
              }`}
            />
            {errors.whatsapp && (
              <p className="text-rose-600 text-xs mt-1">{errors.whatsapp}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs sm:text-sm font-semibold text-foreground mb-1"
            >
              Email <span className="text-rose-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
              placeholder="nama@email.com"
              className={`w-full px-4 py-2.5 rounded-xl bg-white border text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? "border-rose-400 focus:ring-rose-200"
                  : "border-border focus:ring-brand-pink/20 focus:border-brand-pink"
              }`}
            />
            {errors.email && (
              <p className="text-rose-600 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs sm:text-sm font-semibold text-foreground mb-1"
            >
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password)
                    setErrors((prev) => ({ ...prev, password: "" }));
                }}
                placeholder="Minimal 6 karakter"
                className={`w-full px-4 py-2.5 pr-10 rounded-xl bg-white border text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? "border-rose-400 focus:ring-rose-200"
                    : "border-border focus:ring-brand-pink/20 focus:border-brand-pink"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                aria-label={
                  showPassword ? "Sembunyikan password" : "Lihat password"
                }
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-rose-600 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs sm:text-sm font-semibold text-foreground mb-1"
            >
              Konfirmasi Password <span className="text-rose-500">*</span>
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword)
                  setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
              placeholder="Ulangi kata sandi"
              className={`w-full px-4 py-2.5 rounded-xl bg-white border text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.confirmPassword
                  ? "border-rose-400 focus:ring-rose-200"
                  : "border-border focus:ring-brand-pink/20 focus:border-brand-pink"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-rose-600 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 sm:h-12 mt-4 rounded-full bg-brand-pink text-white font-semibold text-sm hover:bg-brand-pink-dark active:scale-[0.99] transition-all shadow-none flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span>Mendaftarkan...</span>
            ) : (
              <>
                <span>Buat Akun</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-border/60 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link
              href={
                redirectTarget !== "/akun"
                  ? `/login?redirect=${encodeURIComponent(redirectTarget)}`
                  : "/login"
              }
              className="font-semibold text-brand-pink hover:text-brand-pink-dark transition-colors"
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-warm text-foreground antialiased selection:bg-brand-pink-soft selection:text-brand-pink-dark">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 sm:py-16 px-4 sm:px-6">
        <Suspense
          fallback={
            <div className="max-w-md w-full mx-auto p-8 text-center text-sm text-muted-foreground">
              Memuat formulir pendaftaran...
            </div>
          }
        >
          <RegisterForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
