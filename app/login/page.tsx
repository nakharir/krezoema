"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/krezoema/Navbar";
import Footer from "@/components/krezoema/Footer";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const redirectTarget = redirectParam || "/akun";

  const { login, isLoggedIn, isHydrated } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [forgotNotice, setForgotNotice] = useState(false);

  // If already logged in, redirect immediately to target
  React.useEffect(() => {
    if (isHydrated && isLoggedIn) {
      router.replace(redirectTarget);
    }
  }, [isHydrated, isLoggedIn, redirectTarget, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setForgotNotice(false);

    if (!identifier.trim()) {
      setError("Nomor WhatsApp atau email wajib diisi.");
      return;
    }

    if (!password) {
      setError("Password wajib diisi.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const res = login(identifier, password);
      setLoading(false);

      if (res.success) {
        router.push(redirectTarget);
      } else {
        setError(res.error || "Gagal masuk. Periksa kembali data Anda.");
      }
    }, 400);
  };

  return (
    <div className="max-w-md w-full mx-auto">
      {/* Login Card */}
      <div className="bg-white rounded-3xl border border-border/80 p-7 sm:p-9 shadow-sm">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-wider text-brand-pink font-semibold block mb-2">
            Akun KREZOEMA
          </span>
          <h1 className="font-sans text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-2">
            Masuk ke KREZOEMA
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {redirectParam === "/checkout"
              ? "Masuk ke akun KREZOEMA untuk melanjutkan pesanan."
              : "Simpan alamatmu dan checkout lebih cepat."}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {forgotNotice && (
          <div className="mb-5 p-3.5 rounded-xl bg-brand-pink-soft/50 border border-brand-pink/30 text-brand-pink-dark text-xs font-medium flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Untuk reset kata sandi, silakan kirim pesan ke WhatsApp KREZOEMA dengan menyertakan email/nomor Anda.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="identifier"
              className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5"
            >
              Nomor WhatsApp / Email
            </label>
            <div className="relative">
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Contoh: 08123456789 atau nama@email.com"
                autoComplete="username"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-border text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-xs sm:text-sm font-semibold text-foreground"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setForgotNotice(true)}
                className="text-xs font-medium text-brand-pink hover:text-brand-pink-dark transition-colors"
              >
                Lupa password?
              </button>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                autoComplete="current-password"
                className="w-full px-4 py-2.5 pr-10 rounded-xl bg-white border border-border text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 sm:h-12 mt-2 rounded-full bg-brand-pink text-white font-semibold text-sm hover:bg-brand-pink-dark active:scale-[0.99] transition-all shadow-none flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span>Memproses...</span>
            ) : (
              <>
                <span>Masuk</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-border/60 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link
              href={
                redirectParam
                  ? `/register?redirect=${encodeURIComponent(redirectParam)}`
                  : "/register"
              }
              className="font-semibold text-brand-pink hover:text-brand-pink-dark transition-colors"
            >
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-warm text-foreground antialiased selection:bg-brand-pink-soft selection:text-brand-pink-dark">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 sm:py-16 px-4 sm:px-6">
        <Suspense
          fallback={
            <div className="max-w-md w-full mx-auto p-8 text-center text-sm text-muted-foreground">
              Memuat halaman masuk...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
