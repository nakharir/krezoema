"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function BrandStory() {
  return (
    <section className="py-16 sm:py-24 lg:py-28 bg-white border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Visual Column: Warm & Grounded Studio Card (5 cols) */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="rounded-3xl bg-brand-cream border border-border p-8 sm:p-10 flex flex-col justify-between aspect-square max-h-[420px] shadow-sm">
              <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                Perjalanan Studio
              </span>

              {/* Big Year Stat */}
              <div className="my-auto py-6 text-center">
                <span className="text-xs uppercase tracking-wider font-medium text-muted-foreground block mb-2">
                  Berdiri Sejak
                </span>
                <span className="font-sans text-6xl sm:text-7xl font-extrabold text-foreground tracking-tight block">
                  2017
                </span>
                <p className="text-xs sm:text-sm text-muted-foreground mt-3 max-w-xs mx-auto leading-relaxed">
                  Mendampingi kreator dan pecinta aksesoris handmade Indonesia.
                </p>
              </div>

              {/* Warm Statement Note */}
              <div className="pt-4 border-t border-border/60 text-center">
                <p className="text-xs text-muted-foreground italic">
                  &ldquo;Menyusun cerita di setiap simpul dan perpaduan warna.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Narrative Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start order-1 lg:order-2">
            <span className="text-xs uppercase tracking-wider text-brand-pink font-semibold block mb-3">
              Tentang KREZOEMA
            </span>

            <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold sm:font-extrabold text-foreground tracking-tight leading-[1.15] mb-6">
              Dibuat dari rasa <br className="hidden sm:inline" />
              ingin mencoba.
            </h2>

            <div className="space-y-4 text-muted-foreground text-sm sm:text-base leading-relaxed mb-8 max-w-2xl font-normal">
              <p>
                KREZOEMA berawal dari sebuah meja kerja sederhana pada tahun 2017. Berangkat dari kecintaan pada warna manik-manik, tekstur kawat perangkai, dan rasa ingin tahu saat memadukan material yang berbeda menjadi perhiasan yang utuh.
              </p>
              <p>
                Bagi kami, membuat aksesoris bukan sekadar aktivitas kerajinan biasa. Ini adalah ruang tenang untuk mengekspresikan apa yang dirasakan, mengeksplorasi keberanian memadukan palet warna, dan menghasilkan sesuatu yang benar-benar personal.
              </p>
            </div>

            {/* Core Philosophy Callout */}
            <div className="mb-8 p-5 rounded-2xl bg-brand-warm border border-border w-full max-w-2xl">
              <p className="font-sans text-base sm:text-lg font-semibold text-foreground italic leading-snug">
                &ldquo;Dari kreativitas menjadi karya, dari karya menjadi identitas.&rdquo;
              </p>
            </div>

            <Link
              href="/cerita-kami"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-brand-pink text-white text-sm sm:text-base font-semibold hover:bg-brand-pink-dark active:scale-[0.98] transition-all shadow-none"
            >
              <span>Kenali KREZOEMA</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
