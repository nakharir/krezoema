import React, { Suspense } from "react";
import type { Metadata } from "next";
import Navbar from "@/components/krezoema/Navbar";
import Footer from "@/components/krezoema/Footer";
import KoleksiContent from "@/components/krezoema/KoleksiContent";

export const metadata: Metadata = {
  title: "Koleksi Material Craft & Manik-manik",
  description:
    "Eksplorasi manik kaca, akrilik, mutiara, tali, kawat, dan perlengkapan craft untuk mewujudkan kreasi aksesoris buatan tangan Anda.",
  openGraph: {
    title: "Koleksi Material Craft & Manik-manik — KREZOEMA",
    description:
      "Eksplorasi manik kaca, akrilik, mutiara, tali, kawat, dan perlengkapan craft untuk mewujudkan kreasi aksesoris buatan tangan Anda.",
  },
};

export default function KoleksiPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-brand-purple/10 selection:text-brand-purple">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Catalog Flow */}
      <main className="flex-1 w-full overflow-x-hidden">
        <Suspense
          fallback={
            <div className="py-24 text-center text-muted-foreground text-sm font-sans">
              Memuat katalog material craft...
            </div>
          }
        >
          <KoleksiContent />
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
