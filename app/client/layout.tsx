import React from "react";
import Navbar from "@/components/krezoema/Navbar";
import Footer from "@/components/krezoema/Footer";
import { ProdukHoverProvider } from "../context/ProdukHoverContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProdukHoverProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-brand-purple/10 selection:text-brand-purple">
        {/* Boutique Sticky Header */}
        <Navbar />

        {/* Main Document Flow */}
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>

        {/* Boutique Footer */}
        <Footer />
      </div>
    </ProdukHoverProvider>
  );
}