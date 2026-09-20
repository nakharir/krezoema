"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CollectionCTA() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Simple Warm Container */}
        <div className="rounded-3xl bg-brand-cream border border-border p-10 sm:p-14 lg:p-16 text-center">
          <div className="max-w-xl mx-auto flex flex-col items-center">
            
            {/* Headline */}
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold sm:font-extrabold text-foreground tracking-tight leading-[1.15] mb-4">
              Ada ide yang ingin diwujudkan?
            </h2>

            {/* Subheadline */}
            <p className="font-sans text-muted-foreground text-sm sm:text-base lg:text-lg leading-relaxed mb-8">
              Mulai dari material kecil. Buat sesuatu yang terasa milikmu sendiri.
            </p>

            {/* Action CTA Button */}
            <div>
              <Link
                href="/koleksi"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-brand-pink text-white font-semibold text-sm sm:text-base hover:bg-brand-pink-dark active:scale-[0.98] transition-all shadow-none"
              >
                <span>Lihat Semua Koleksi</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
