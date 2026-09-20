"use client";

import React from "react";
import Link from "next/link";
import { Instagram, MessageCircle, MapPin, Clock, ArrowUpRight } from "lucide-react";

export default function Footer() {

  return (
    <footer className="bg-brand-cream border-t border-border/80 text-foreground transition-colors">
      {/* Brand Statement Banner */}
      <div className="border-b border-border/60 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left max-w-2xl">
            <span className="text-xs uppercase tracking-wider text-brand-pink font-semibold block mb-2">
              KREZOEMA Philosophy — Est. 2017
            </span>
            <p className="font-sans text-xl sm:text-2xl text-foreground font-bold italic leading-snug">
              &ldquo;Dari kreativitas menjadi karya, dari karya menjadi identitas.&rdquo;
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground">
            <span>KRE · Kreativitas</span>
            <span>•</span>
            <span>ZO · Eksplorasi</span>
            <span>•</span>
            <span>EMA · Ekspresi</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4 focus:outline-none group">
              <div className="flex flex-col">
                <span className="font-sans text-xl sm:text-2xl tracking-[0.12em] font-extrabold text-foreground leading-none transition-colors group-hover:text-brand-pink">
                  KREZOEMA
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mt-1">
                  Craft &amp; Accessories
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-6">
              Studio kerajinan kreatif dan aksesoris handmade. Kami menyediakan material berkualitas, beads artistik, dan karya kerajinan tangan penuh cerita yang melengkapi ekspresi diri Anda.
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Berdiri Sejak 2017</span>
              <span>•</span>
              <span>Handcrafted in Indonesia</span>
            </div>
          </div>

          {/* Koleksi Craft */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground mb-4">
              Koleksi Material
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/koleksi?kategori=manik-kaca"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Manik Kaca
                </Link>
              </li>
              <li>
                <Link
                  href="/koleksi?kategori=akrilik"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Akrilik
                </Link>
              </li>
              <li>
                <Link
                  href="/koleksi?kategori=mutiara"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Mutiara Sintetis & Air Tawar
                </Link>
              </li>
              <li>
                <Link
                  href="/koleksi?kategori=tali-kawat"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Tali & Kawat Crafting
                </Link>
              </li>
              <li>
                <Link
                  href="/koleksi?kategori=alat-crafting"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Alat & Tang Crafting
                </Link>
              </li>
            </ul>
          </div>

          {/* Halaman / Navigasi */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground mb-4">
              Eksplorasi
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-brand-pink transition-colors"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/koleksi"
                  className="text-muted-foreground hover:text-brand-pink transition-colors"
                >
                  Semua Koleksi
                </Link>
              </li>
              <li>
                <Link
                  href="/cerita-kami"
                  className="text-muted-foreground hover:text-brand-pink transition-colors"
                >
                  Cerita Kami & Filosofi
                </Link>
              </li>
              <li>
                <Link
                  href="/hubungi-kami"
                  className="text-muted-foreground hover:text-brand-pink transition-colors"
                >
                  Hubungi Studio
                </Link>
              </li>
              <li>
                <Link
                  href="/keranjang"
                  className="text-muted-foreground hover:text-brand-pink transition-colors"
                >
                  Keranjang Belanja
                </Link>
              </li>
              <li>
                <Link
                  href="/akun"
                  className="text-muted-foreground hover:text-brand-pink transition-colors"
                >
                  Akun Pelanggan
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak & Studio */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground mb-4">
              Studio & Layanan
            </h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 mt-0.5 text-foreground shrink-0" />
                <span className="text-xs leading-relaxed">
                  Senin – Sabtu<br />
                  09.00 – 17.00 WIB
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 text-foreground shrink-0" />
                <span className="text-xs leading-relaxed">
                  Studio Kerajinan Kreatif KREZOEMA, Indonesia
                </span>
              </div>
              <div className="pt-2 flex items-center gap-2">
                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-border text-xs font-medium text-foreground hover:border-foreground/40 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                  <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
                </a>
                <a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-border text-xs font-medium text-foreground hover:border-foreground/40 transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5 text-brand-magenta" />
                  <span>Instagram</span>
                  <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/60 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2017 – 2026 KREZOEMA. Hak cipta dilindungi undang-undang.</p>
          <p className="flex items-center gap-2">
            <span>Creative Craft &amp; Handmade Accessories</span>
            <span>•</span>
            <span>Indonesia</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
