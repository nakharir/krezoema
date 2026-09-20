import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/krezoema/Navbar";
import Footer from "@/components/krezoema/Footer";
import { Clock, MapPin, MessageCircle, Instagram, ArrowUpRight, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Hubungi Kami — KREZOEMA",
  description:
    "Hubungi studio kerajinan kreatif KREZOEMA untuk pertanyaan seputar material craft, pesanan khusus, atau konsultasi perlengkapan kerajinan.",
  openGraph: {
    title: "Hubungi Kami — KREZOEMA",
    description:
      "Hubungi studio kerajinan kreatif KREZOEMA untuk pertanyaan seputar material craft, pesanan khusus, atau konsultasi perlengkapan kerajinan.",
  },
};

export default function HubungiKamiPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-brand-pink-soft selection:text-brand-pink-dark">
      <Navbar />

      <main className="flex-1 w-full overflow-x-hidden">
        {/* Header */}
        <section className="bg-brand-warm border-b border-border/60 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs uppercase tracking-wider text-brand-pink font-semibold block mb-2">
              KREZOEMA · KONTAK
            </span>
            <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold sm:font-extrabold text-foreground tracking-tight leading-[1.15] mb-4">
              Hubungi Studio KREZOEMA
            </h1>
            <p className="font-sans text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Punya pertanyaan seputar ketersediaan material atau ingin berdiskusi tentang proyek kerajinan tanganmu? Kami siap membantu.
            </p>
          </div>
        </section>

        {/* Contact Cards Section */}
        <section className="py-14 sm:py-20 bg-white border-b border-border/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Card 1: Layanan WhatsApp */}
              <div className="rounded-3xl bg-brand-warm border border-border/80 p-7 sm:p-8 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white border border-border flex items-center justify-center text-emerald-600 mb-5 shadow-sm">
                    <MessageCircle className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h2 className="font-sans text-xl font-bold text-foreground mb-2">
                    Layanan Pelanggan WhatsApp
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    Respon cepat untuk konfirmasi pesanan, ketersediaan stok manik-manik, dan konsultasi kebutuhan material craft.
                  </p>
                </div>

                <div>
                  <a
                    href="https://wa.me/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-all shadow-sm"
                  >
                    <span>Hubungi via WhatsApp</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Card 2: Instagram Studio */}
              <div className="rounded-3xl bg-brand-warm border border-border/80 p-7 sm:p-8 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white border border-border flex items-center justify-center text-brand-magenta mb-5 shadow-sm">
                    <Instagram className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h2 className="font-sans text-xl font-bold text-foreground mb-2">
                    Instagram &amp; Inspirasi Kreasi
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    Lihat tutorial merangkai, update katalog material terbaru, dan karya buatan tangan kreator KREZOEMA.
                  </p>
                </div>

                <div>
                  <a
                    href="https://instagram.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-border text-foreground font-semibold text-sm hover:border-brand-pink/50 hover:bg-brand-pink-soft/30 hover:text-brand-pink-dark transition-all"
                  >
                    <span>Kunjungi Instagram</span>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                  </a>
                </div>
              </div>

              {/* Card 3: Jam Operasional */}
              <div className="rounded-3xl bg-white border border-border/80 p-7 sm:p-8 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-brand-warm border border-border flex items-center justify-center text-foreground mb-5">
                  <Clock className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-sans text-lg font-bold text-foreground mb-2">
                  Jam Operasional
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Senin – Sabtu<br />
                  09.00 – 17.00 WIB<br />
                  <span className="text-xs text-muted-foreground/80 mt-1 block">
                    (Pesan di luar jam kerja akan dibalas pada hari kerja berikutnya)
                  </span>
                </p>
              </div>

              {/* Card 4: Lokasi Studio */}
              <div className="rounded-3xl bg-white border border-border/80 p-7 sm:p-8 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-brand-warm border border-border flex items-center justify-center text-foreground mb-5">
                  <MapPin className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-sans text-lg font-bold text-foreground mb-2">
                  Studio KREZOEMA
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Studio Kerajinan Kreatif KREZOEMA<br />
                  Indonesia<br />
                  <span className="text-xs text-muted-foreground/80 mt-1 block">
                    Pengiriman pesanan melayani seluruh wilayah Indonesia via kurir reguler.
                  </span>
                </p>
              </div>
            </div>

            {/* Back to Home CTA */}
            <div className="mt-12 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-brand-pink transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Beranda KREZOEMA</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
