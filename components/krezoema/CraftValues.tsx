"use client";

import React from "react";

interface ValuePillar {
  code: string;
  name: string;
  sublabel: string;
  description: string;
}

const pillars: ValuePillar[] = [
  {
    code: "KRE",
    name: "Kreativitas",
    sublabel: "Awal Sebuah Ide",
    description: "Berawal dari keberanian untuk mencoba sesuatu yang baru. Menangkap inspirasi di sekeliling dan mewujudkannya dalam rancangan nyata.",
  },
  {
    code: "ZO",
    name: "Eksplorasi",
    sublabel: "Kebebasan Bereksperimen",
    description: "Memadukan warna, material, bentuk, dan kemungkinan tanpa takut bereksperimen. Menciptakan kombinasi yang tak terduga namun harmonis.",
  },
  {
    code: "EMA",
    name: "Ekspresi",
    sublabel: "Karakter & Identitas",
    description: "Mengubah ide menjadi karya yang memiliki karakter dan identitas. Menjadikan setiap perhiasan berbicara tentang siapa diri Anda.",
  },
];

export default function CraftValues() {
  return (
    <section className="py-16 sm:py-24 bg-brand-warm border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-2">
            Pilar Identitas
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold sm:font-extrabold text-foreground tracking-tight">
            Tiga Nilai di Balik Nama
          </h2>
          <p className="font-sans text-muted-foreground text-sm sm:text-base mt-3 leading-relaxed">
            KREZOEMA dirancang sebagai wadah bagi setiap jiwa kreatif untuk berkarya dengan percaya diri.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((pillar) => (
            <div
              key={pillar.code}
              className="relative rounded-2xl bg-white border border-border p-7 sm:p-8 flex flex-col justify-between overflow-hidden shadow-sm"
            >
              {/* Flat Clean Watermark Typography */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-3 -right-2 font-sans text-7xl font-black text-black/[0.03] select-none"
              >
                {pillar.code}
              </div>

              {/* Code Header */}
              <div className="relative z-10 mb-6">
                <span className="font-sans text-2xl font-extrabold text-foreground tracking-tight">
                  {pillar.code}
                </span>
                <span className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold mt-1">
                  {pillar.sublabel}
                </span>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="font-sans text-xl sm:text-2xl font-bold text-foreground mb-2">
                  {pillar.name}
                </h3>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
