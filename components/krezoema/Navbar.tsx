"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  User,
  LogOut,
  MapPin,
  Package,
  ChevronDown,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

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
  const { cartItemCount, isHydrated: isCartHydrated } = useCart();
  const { customer, isLoggedIn, logout, isHydrated: isAuthHydrated } = useAuth();

  const totalItems = isCartHydrated ? cartItemCount() : 0;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Subtle scroll elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus upon navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);
  }, [pathname]);

  // Click outside to close desktop account menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
              <span className="font-sans text-xl sm:text-2xl tracking-[0.12em] font-extrabold text-foreground leading-none transition-colors group-hover:text-brand-pink">
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
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-pink rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons (Search, Customer Account, Cart) */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Search link */}
            <Link
              href="/koleksi"
              className="p-2.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink"
              aria-label="Cari Produk"
            >
              <Search className="w-5 h-5 stroke-[1.8]" />
            </Link>

            {/* Customer Account Button / State */}
            {isAuthHydrated && (
              <div className="relative" ref={accountMenuRef}>
                {isLoggedIn ? (
                  <div>
                    <button
                      type="button"
                      onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-foreground hover:bg-brand-pink-soft/50 border border-border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink"
                      aria-label="Menu Akun Pelanggan"
                      aria-expanded={accountMenuOpen}
                    >
                      <User className="w-4 h-4 text-brand-pink" />
                      <span className="hidden sm:inline max-w-[100px] truncate">
                        {customer?.nama || "Akun"}
                      </span>
                      <span className="sm:hidden">Akun</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
                          accountMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Account Dropdown */}
                    <AnimatePresence>
                      {accountMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-border shadow-lg p-2 z-50 overflow-hidden"
                        >
                          <div className="px-3 py-2.5 border-b border-border/60 mb-1">
                            <p className="text-xs font-bold text-foreground truncate">
                              {customer?.nama}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">
                              {customer?.email || customer?.whatsapp}
                            </p>
                          </div>

                          <Link
                            href="/akun"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-brand-pink-soft/40 hover:text-brand-pink-dark transition-colors"
                          >
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span>Akun Saya</span>
                          </Link>

                          <Link
                            href="/akun#alamat"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-brand-pink-soft/40 hover:text-brand-pink-dark transition-colors"
                          >
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>Alamat Pengiriman</span>
                          </Link>

                          <Link
                            href="/akun#pesanan"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-brand-pink-soft/40 hover:text-brand-pink-dark transition-colors"
                          >
                            <Package className="w-4 h-4 text-muted-foreground" />
                            <span>Pesanan</span>
                          </Link>

                          <div className="my-1 border-t border-border/60" />

                          <button
                            type="button"
                            onClick={() => {
                              logout();
                              setAccountMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Keluar</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-semibold text-foreground hover:text-brand-pink hover:bg-brand-pink-soft/40 border border-border/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink"
                    aria-label="Masuk Akun"
                  >
                    <User className="w-4 h-4" />
                    <span>Masuk</span>
                  </Link>
                )}
              </div>
            )}

            {/* Cart Icon */}
            <Link
              href="/keranjang"
              className="relative p-2.5 rounded-full text-foreground hover:bg-secondary/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink"
              aria-label={
                totalItems > 0
                  ? `Keranjang Belanja, ${totalItems} barang`
                  : "Keranjang Belanja"
              }
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-brand-pink text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm animate-in fade-in zoom-in-75 duration-200">
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
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-pink" />
                    )}
                  </Link>
                );
              })}

              {/* Account Section in Mobile Menu */}
              <div className="pt-4 mt-2 border-t border-border flex flex-col gap-2.5">
                {isLoggedIn ? (
                  <>
                    <div className="px-1 py-1">
                      <span className="text-xs text-muted-foreground">Masuk sebagai</span>
                      <p className="text-sm font-bold text-foreground">
                        {customer?.nama}
                      </p>
                    </div>
                    <Link
                      href="/akun"
                      className="flex items-center gap-2.5 text-sm font-medium text-foreground py-1.5 hover:text-brand-pink"
                    >
                      <User className="w-4 h-4 text-brand-pink" />
                      <span>Akun Saya</span>
                    </Link>
                    <Link
                      href="/akun#alamat"
                      className="flex items-center gap-2.5 text-sm font-medium text-foreground py-1.5 hover:text-brand-pink"
                    >
                      <MapPin className="w-4 h-4 text-brand-pink" />
                      <span>Alamat Pengiriman</span>
                    </Link>
                    <Link
                      href="/akun#pesanan"
                      className="flex items-center gap-2.5 text-sm font-medium text-foreground py-1.5 hover:text-brand-pink"
                    >
                      <Package className="w-4 h-4 text-brand-pink" />
                      <span>Pesanan</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2.5 text-sm font-medium text-rose-600 py-1.5 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar</span>
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      href="/login"
                      className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-full border border-border text-xs font-semibold text-foreground hover:bg-secondary text-center"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Masuk</span>
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center justify-center py-2.5 px-4 rounded-full bg-brand-pink text-white text-xs font-semibold text-center hover:bg-brand-pink-dark transition-colors"
                    >
                      <span>Daftar</span>
                    </Link>
                  </div>
                )}

                <Link
                  href="/koleksi"
                  className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground py-1 mt-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Cari Produk & Material Craft</span>
                </Link>

                <Link
                  href="/keranjang"
                  className="flex items-center justify-between text-sm bg-brand-pink text-white px-4 py-2.5 rounded-full text-center font-medium mt-1 active:scale-[0.98] transition-transform"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Lihat Keranjang</span>
                  </span>
                  <span className="bg-white/25 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
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
