import React from "react";
import Navbar from "@/components/krezoema/Navbar";
import HeroSection from "@/components/krezoema/HeroSection";
import CategorySection from "@/components/krezoema/CategorySection";
import FeaturedProducts from "@/components/krezoema/FeaturedProducts";
import BrandStory from "@/components/krezoema/BrandStory";
import CraftValues from "@/components/krezoema/CraftValues";
import CollectionCTA from "@/components/krezoema/CollectionCTA";
import Footer from "@/components/krezoema/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-brand-pink-soft selection:text-brand-pink-dark">
      {/* Boutique Navigation Header */}
      <Navbar />

      {/* Main Homepage Flow */}
      <main className="flex-1 w-full overflow-x-hidden">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Category / Material Section */}
        <CategorySection />

        {/* 3. Featured Products */}
        <FeaturedProducts />

        {/* 4. Brand Story */}
        <BrandStory />

        {/* 5. Craft Values (KRE - ZO - EMA) */}
        <CraftValues />

        {/* 6. Collection CTA */}
        <CollectionCTA />
      </main>

      {/* 7. Boutique Footer */}
      <Footer />
    </div>
  );
}