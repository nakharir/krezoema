import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/krezoema/Navbar";
import Footer from "@/components/krezoema/Footer";
import CraftValues from "@/components/krezoema/CraftValues";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Cerita Kami — KREZOEMA",
  description:
    "Perjalanan KREZOEMA sejak 2017 dalam mendampingi kreator dan pecinta aksesoris handmade dengan material berkualitas dan penuh cerita.",
  openGraph: {
    title: "Cerita Kami — KREZOEMA",
    description:
      "Perjalanan KREZOEMA sejak 2017 dalam mendampingi kreator dan pecinta aksesoris handmade dengan material berkualitas dan penuh cerita.",
  },
};

export default function CeritaKamiPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-brand-pink-soft selection:text-brand-pink-dark">
      <Navbar />

      <main className="flex-1 w-full overflow-x-hidden">
        {/* Header */}
        <section className="bg-brand-warm border-b border-border/60 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs uppercase tracking-wider text-brand-pink font-semibold block mb-2">
              KREZOEMA · TENTANG KAMI
            </span>
            <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold sm:font-extrabold text-foreground tracking-tight leading-[1.15] mb-4">
              Cerita &amp; Filosofi KREZOEMA
            </h1>
            <p className="font-sans text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Dari sebuah meja kerja sederhana pada tahun 2017 hingga menjadi rumah berkarya bagi para perajin aksesoris buatan tangan.
            </p>
          </div>
        </section>

        {/* Narrative Section */}
        <section className="py-14 sm:py-20 bg-white border-b border-border/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
              <h2 className="font-sans text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Dibuat dari Rasa Ingin Mencoba
              </h2>
              <p>
                KREZOEMA lahir dari rasa kecintaan terhadap detail kecil: kilau manik kaca di bawah sinar matahari, tekstur kawat perangkai yang lentur, serta perpaduan warna yang saling melengkapi. Bagi kami, setiap butir manik bukan sekadar ornamen, melainkan potongan ide yang siap dirangkai menjadi kisah yang personal.
              </p>
              <p>
                Sejak didirikan pada tahun 2017 di Indonesia, kami konsisten mengkurasi material kerajinan terbaik — mulai dari manik kaca kilau aurora, akrilik warna matte yang ceria, mutiara air tawar alami, hingga alat perangkai presisi yang nyaman digenggam.
              </p>

              <div className="p-6 sm:p-8 rounded-2xl bg-brand-warm border border-border/80 my-8">
                <p className="font-sans text-lg sm:text-xl font-bold text-foreground italic text-center">
                  &ldquo;Dari kreativitas menjadi karya, dari karya menjadi identitas.&rdquo;
                </p>
              </div>

              <p>
                Kami percaya bahwa seni merangkai aksesoris adalah ruang tenang bagi siapa saja untuk mengekspresikan karakter diri. Apapun yang ingin kamu ciptakan — gelang sederhana untuk sahabat, kalung statement, atau karya untuk brand kerajinanmu sendiri — KREZOEMA hadir menyediakan material yang terpercaya.
              </p>
            </div>
          </div>
        </section>

        {/* Craft Values Section */}
        <CraftValues />

        {/* CTA to Collection */}
        <section className="py-14 sm:py-20 bg-white">
          <div className="max-w-xl mx-auto px-4 text-center">
            <h3 className="font-sans text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Mulai Eksplorasi Karyamu
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-6">
              Temukan ribuan kemungkinan paduan material craft di katalog KREZOEMA.
            </p>
            <Link
              href="/koleksi"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-pink text-white font-semibold text-sm hover:bg-brand-pink-dark transition-all shadow-none"
            >
              <span>Jelajahi Koleksi</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
