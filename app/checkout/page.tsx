import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/krezoema/Navbar";
import Footer from "@/components/krezoema/Footer";
import CheckoutContent from "@/components/krezoema/CheckoutContent";

export const metadata: Metadata = {
  title: "Checkout — KREZOEMA",
  description: "Lengkapi informasi untuk melanjutkan pesanan KREZOEMA.",
  openGraph: {
    title: "Checkout — KREZOEMA",
    description: "Lengkapi informasi untuk melanjutkan pesanan KREZOEMA.",
  },
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-brand-purple/10 selection:text-brand-purple">
      {/* 1. Navbar */}
      <Navbar />

      {/* 2. Main Checkout Flow */}
      <main className="flex-1 w-full overflow-x-hidden">
        <CheckoutContent />
      </main>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
}
