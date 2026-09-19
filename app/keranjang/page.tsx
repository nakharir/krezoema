import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/krezoema/Navbar";
import Footer from "@/components/krezoema/Footer";
import CartContent from "@/components/krezoema/CartContent";

export const metadata: Metadata = {
  title: "Keranjang Belanja — KREZOEMA",
  description:
    "Periksa dan selesaikan pesanan material craft, manik-manik, dan perlengkapan kreasi buatan tangan Anda di KREZOEMA.",
  openGraph: {
    title: "Keranjang Belanja — KREZOEMA",
    description:
      "Periksa dan selesaikan pesanan material craft, manik-manik, dan perlengkapan kreasi buatan tangan Anda di KREZOEMA.",
  },
};

export default function KeranjangPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-brand-purple/10 selection:text-brand-purple">
      {/* 1. Navbar with Cart Counter */}
      <Navbar />

      {/* 2. Main Cart Flow */}
      <main className="flex-1 w-full overflow-x-hidden">
        <CartContent />
      </main>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
}
