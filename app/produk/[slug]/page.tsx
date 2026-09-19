import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { mockProducts, Product } from "@/data/mockProducts";
import Navbar from "@/components/krezoema/Navbar";
import Footer from "@/components/krezoema/Footer";
import ProductCard from "@/components/krezoema/ProductCard";
import ProductDetailView from "@/components/krezoema/ProductDetailView";
import { ArrowLeft, ChevronRight } from "lucide-react";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return mockProducts.map((p) => ({
    slug: p.slug,
  }));
}

export function generateMetadata({ params }: ProductPageProps): Metadata {
  const product = mockProducts.find((p) => p.slug === params.slug);
  if (!product) {
    return {
      title: "Produk Tidak Ditemukan — KREZOEMA",
    };
  }

  return {
    title: `${product.name} — KREZOEMA`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} — KREZOEMA`,
      description: product.shortDescription,
    },
  };
}

// Compute related products: priority to same category, then other categories, max 4
function getRelatedProducts(currentProduct: Product, allProducts: Product[]): Product[] {
  const otherProducts = allProducts.filter((p) => p.slug !== currentProduct.slug);
  const sameCategory = otherProducts.filter((p) => p.category === currentProduct.category);
  const differentCategory = otherProducts.filter((p) => p.category !== currentProduct.category);
  return [...sameCategory, ...differentCategory].slice(0, 4);
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const product = mockProducts.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product, mockProducts);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-brand-purple/10 selection:text-brand-purple">
      {/* 1. Navbar */}
      <Navbar />

      <main className="flex-1 w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          
          {/* 2. Top Navigation: Back Link & Breadcrumb */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8 text-xs sm:text-sm text-muted-foreground pb-4 border-b border-border/60">
            {/* Back to Collection Link */}
            <Link
              href={`/koleksi?kategori=${product.category}`}
              className="inline-flex items-center gap-1.5 font-medium hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span>Kembali ke Koleksi</span>
            </Link>

            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="overflow-x-auto no-scrollbar py-0.5">
              <ol className="flex items-center gap-1.5 whitespace-nowrap">
                <li>
                  <Link href="/" className="hover:text-foreground transition-colors">
                    Beranda
                  </Link>
                </li>
                <li aria-hidden="true" className="text-border">
                  <ChevronRight className="w-3.5 h-3.5" />
                </li>
                <li>
                  <Link href="/koleksi" className="hover:text-foreground transition-colors">
                    Koleksi
                  </Link>
                </li>
                <li aria-hidden="true" className="text-border">
                  <ChevronRight className="w-3.5 h-3.5" />
                </li>
                <li>
                  <Link
                    href={`/koleksi?kategori=${product.category}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {product.categoryLabel}
                  </Link>
                </li>
                <li aria-hidden="true" className="text-border">
                  <ChevronRight className="w-3.5 h-3.5" />
                </li>
                <li className="font-semibold text-foreground truncate max-w-[180px] sm:max-w-none" aria-current="page">
                  {product.name}
                </li>
              </ol>
            </nav>
          </div>

          {/* 3. Main Product Detail Section (Visual + Info + Variants + Quantity + Add to Cart) */}
          <section className="mb-14 sm:mb-20">
            <ProductDetailView product={product} />
          </section>

          {/* 4. Product Description & Specifications */}
          <section className="border-t border-border/80 pt-10 sm:pt-14 mb-16 sm:mb-24">
            <div className="max-w-3xl">
              <h2 className="font-sans text-xl sm:text-2xl font-bold text-foreground mb-4">
                Tentang Produk
              </h2>
              <p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed mb-8">
                {product.shortDescription}
              </p>

              {/* Material Details & Specifications from Mock Data */}
              <div className="bg-brand-warm rounded-2xl border border-border/80 p-5 sm:p-7">
                <h3 className="font-sans text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">
                  Spesifikasi Material
                </h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  {product.materialDetails && (
                    <div>
                      <dt className="text-muted-foreground font-medium mb-1">
                        Detail Material &amp; Isi
                      </dt>
                      <dd className="font-semibold text-foreground">
                        {product.materialDetails}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-muted-foreground font-medium mb-1">
                      Kategori Material
                    </dt>
                    <dd className="font-semibold text-foreground">
                      {product.categoryLabel}
                    </dd>
                  </div>
                  {product.variants && product.variants.length > 0 && (
                    <div className="sm:col-span-2">
                      <dt className="text-muted-foreground font-medium mb-1">
                        Pilihan Varian
                      </dt>
                      <dd className="font-medium text-foreground">
                        {product.variants
                          .map((v) => `${v.type.toUpperCase()}: ${v.options.join(", ")}`)
                          .join(" • ")}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </section>

          {/* 5. Related Products: Mungkin Kamu Suka */}
          {relatedProducts.length > 0 && (
            <section className="border-t border-border/80 pt-10 sm:pt-14">
              <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-1">
                    Koleksi Terkait
                  </span>
                  <h2 className="font-sans text-xl sm:text-2xl font-bold text-foreground">
                    Mungkin Kamu Suka
                  </h2>
                </div>
                <Link
                  href="/koleksi"
                  className="text-xs sm:text-sm font-semibold text-foreground hover:text-brand-purple transition-colors"
                >
                  Lihat Semua
                </Link>
              </div>

              {/* 4-column responsive grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
                {relatedProducts.map((p, index) => (
                  <ProductCard key={p.id} product={p} index={index} />
                ))}
              </div>
            </section>
          )}

        </div>
      </main>

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}
