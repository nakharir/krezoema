"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Beranda", href: "/" },
  { label: "Koleksi", href: "/koleksi" },
  { label: "Cerita Kami", href: "/cerita-kami" },
  { label: "Hubungi Kami", href: "/hubungi-kami" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { cartItemCount, isHydrated } = useCart();
  const totalItems = isHydrated ? cartItemCount() : 0;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Subtle scroll elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu upon navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-[#FAF8F5]/92 backdrop-blur-md shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] border-b border-border/80"
          : "bg-[#FAF8F5] border-b border-border/40"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="KREZOEMA Beranda"
          >
            <div className="flex flex-col">
              <span className="font-sans text-xl sm:text-2xl tracking-[0.12em] font-extrabold text-foreground leading-none transition-colors group-hover:text-brand-purple">
                KREZOEMA
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mt-1">
                Craft &amp; Accessories
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-sm tracking-wide transition-colors duration-200 py-1 font-medium ${
                    isActive
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-purple rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons (Search & Cart) */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/koleksi"
              className="p-2.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Cari Produk"
            >
              <Search className="w-5 h-5 stroke-[1.8]" />
            </Link>

            <Link
              href="/keranjang"
              className="relative p-2.5 rounded-full text-foreground hover:bg-secondary/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={
                totalItems > 0
                  ? `Keranjang Belanja, ${totalItems} barang`
                  : "Keranjang Belanja"
              }
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-brand-purple text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm animate-in fade-in zoom-in-75 duration-200">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-full text-foreground hover:bg-secondary/70 transition-colors focus:outline-none"
              aria-label={mobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 stroke-[2]" />
              ) : (
                <Menu className="w-5 h-5 stroke-[2]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-b border-border bg-[#FAF8F5]/98 backdrop-blur-md overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname?.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-base py-2 transition-colors flex items-center justify-between ${
                      isActive
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-purple" />
                    )}
                  </Link>
                );
              })}

              <div className="pt-4 mt-2 border-t border-border flex flex-col gap-3">
                <Link
                  href="/koleksi"
                  className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground py-1"
                >
                  <Search className="w-4 h-4" />
                  <span>Cari Produk & Material Craft</span>
                </Link>
                <Link
                  href="/keranjang"
                  className="flex items-center justify-between text-sm bg-foreground text-background px-4 py-2.5 rounded-full text-center font-medium mt-2 active:scale-[0.98] transition-transform"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Lihat Keranjang</span>
                  </span>
                  <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                    {totalItems} item
                  </span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
