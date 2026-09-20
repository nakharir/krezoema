"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative bg-brand-warm pt-10 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Narrative Column (7 cols on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Simple Eyebrow Text */}
            <p className="text-xs sm:text-[13px] font-semibold tracking-wider uppercase text-brand-pink mb-4">
              KREZOEMA · Creative Craft &amp; Handmade Accessories
            </p>

            {/* Headline - Plus Jakarta Sans Bold, Modern & Readable */}
            <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl text-foreground font-bold sm:font-extrabold tracking-tight leading-[1.14] mb-6">
              Dari kreativitas <br className="hidden sm:inline" />
              menjadi karya.
            </h1>

            {/* Subheadline */}
            <p className="font-sans text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mb-8 sm:mb-10 font-normal">
              Temukan material dan perlengkapan craft untuk mengubah ide sederhana menjadi karya yang punya cerita.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <Link
                href="/koleksi"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-brand-pink text-white font-semibold text-sm sm:text-base hover:bg-brand-pink-dark active:scale-[0.98] transition-all shadow-none"
              >
                <span>Jelajahi Koleksi</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/cerita-kami"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-white border border-border text-foreground font-semibold text-sm sm:text-base hover:border-brand-pink/50 hover:bg-brand-pink-soft/30 active:scale-[0.98] transition-all"
              >
                <span>Cerita Kami</span>
              </Link>
            </div>

            {/* Clean Info Row */}
            <div className="mt-10 sm:mt-12 pt-6 border-t border-border/60 flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
              <span>Studio Craft · Est. 2017</span>
              <span className="text-border">•</span>
              <span>Material Terkurasi</span>
              <span className="text-border">•</span>
              <span>Handmade Indonesia</span>
            </div>
          </motion.div>

          {/* Simple Clean Visual Container (5 cols on desktop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="rounded-3xl bg-brand-cream border border-border p-6 sm:p-8 flex flex-col justify-between aspect-[4/3] sm:aspect-square max-h-[440px] shadow-sm">
              {/* Category Label at Top */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Material Showcase
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  KREZOEMA Studio
                </span>
              </div>

              {/* Centered Material Swatches Composition */}
              <div className="flex items-center justify-center my-auto py-6">
                <div className="flex items-center justify-center -space-x-4">
                  {/* Swatch 1: Glass bead */}
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-purple-400 to-pink-300 shadow-md border-2 border-white flex items-center justify-center"
                    title="Manik Kaca Aurora"
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-white/70 blur-[1px]" />
                  </div>

                  {/* Swatch 2: Ivory Pearl */}
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-white via-amber-50 to-amber-100 shadow-sm border-2 border-white -mt-6"
                    title="Mutiara Sintetis"
                  />

                  {/* Swatch 3: Acrylic Pastel */}
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-rose-300 to-orange-200 shadow-sm border-2 border-white mt-8"
                    title="Akrilik Pastel"
                  />
                </div>
              </div>

              {/* Caption at Bottom */}
              <div className="text-center pt-3 border-t border-border/60">
                <p className="text-xs sm:text-sm text-foreground font-medium">
                  Manik Kaca, Akrilik, &amp; Mutiara Berkualitas
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
