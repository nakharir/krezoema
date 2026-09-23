// ============================================================================
// KREZOEMA — Stage 13A: Helpers for mapping API data to UI
// ============================================================================

import type { ApiProduct, ApiProductVariant, ApiCategory } from "./types";
import type { Product } from "@/data/mockProducts";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * Centralized IDR price formatter.
 * Returns formatted string like "Rp 25.000"
 */
export function formatRupiah(amount: number): string {
  if (typeof amount !== "number" || isNaN(amount)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("IDR", "Rp")
    .trim();
}

/**
 * Resolves a backend image URL into an absolute URL.
 * Prepend backend API URL if the image path is relative.
 */
export function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const cleanBase = API_URL.replace(/\/+$/, "");
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${cleanBase}${cleanPath}`;
}

/**
 * Get the display price for a product.
 * Uses base_price as the primary display price.
 */
export function getDisplayPrice(product: ApiProduct): number {
  return product.base_price;
}

/**
 * Get the display price for a specific variant.
 * Uses effective_price (variant price ?? product base_price).
 */
export function getVariantDisplayPrice(variant: ApiProductVariant): number {
  return variant.effective_price;
}

/**
 * Get the primary image URL for a product.
 * Priority: product.image (precomputed by backend) > primary image in images array > first image > null
 */
export function getPrimaryImageUrl(product: ApiProduct): string | null {
  if (product.image) {
    return resolveImageUrl(product.image);
  }
  if (product.images && product.images.length > 0) {
    const primary = product.images.find((img) => img.is_primary);
    if (primary) return resolveImageUrl(primary.image_url);
    const sorted = [...product.images].sort((a, b) => a.sort_order - b.sort_order);
    return resolveImageUrl(sorted[0].image_url);
  }
  return null;
}

/**
 * Get all image URLs sorted properly for a product detail view.
 */
export function getSortedImages(
  product: ApiProduct
): { url: string; alt: string }[] {
  if (!product.images || product.images.length === 0) {
    const primary = getPrimaryImageUrl(product);
    if (primary) {
      return [{ url: primary, alt: product.name }];
    }
    return [];
  }

  return [...product.images]
    .sort((a, b) => {
      // Primary image first, then by sort_order
      if (a.is_primary && !b.is_primary) return -1;
      if (!a.is_primary && b.is_primary) return 1;
      return a.sort_order - b.sort_order;
    })
    .map((img) => ({
      url: resolveImageUrl(img.image_url) || img.image_url,
      alt: img.alt_text || product.name,
    }));
}

/**
 * Get the category slug from the product's category.
 */
export function getCategorySlug(product: ApiProduct): string {
  return product.category?.slug || "";
}

/**
 * Get the category display name from the product's category.
 */
export function getCategoryLabel(product: ApiProduct): string {
  return product.category?.name || "";
}

/**
 * Get the products count for a category, handling both possible count keys.
 */
export function getCategoryProductCount(category: ApiCategory): number {
  if (typeof category.active_products_count === "number") {
    return category.active_products_count;
  }
  if (typeof category.products_count === "number") {
    return category.products_count;
  }
  return 0;
}

/**
 * Finds the matching API variant for a set of selected variant options.
 * Used to get the correct price and stock for the selected combination.
 */
export function findMatchingVariant(
  variants: ApiProductVariant[] | undefined,
  selectedOptions: Record<string, string>
): ApiProductVariant | undefined {
  if (!variants || variants.length === 0) return undefined;

  const selectedKeys = Object.keys(selectedOptions);
  if (selectedKeys.length === 0) return variants[0];

  return variants.find((variant) => {
    if (!variant.options || typeof variant.options !== "object") return false;
    return selectedKeys.every(
      (key) => String(variant.options[key]) === String(selectedOptions[key])
    );
  });
}

/**
 * Gets the price to display given a product and selected variant options.
 * Falls back to base_price if no matching variant is found.
 */
export function getSelectedPrice(
  product: ApiProduct,
  selectedOptions: Record<string, string>
): number {
  const matchingVariant = findMatchingVariant(product.variants, selectedOptions);
  if (matchingVariant) {
    return matchingVariant.effective_price;
  }
  return product.base_price;
}

/**
 * Maps an API product to the legacy Product interface used by CartContext.
 * This ensures full backward compatibility with the existing cart system.
 */
export function apiProductToLegacyProduct(
  apiProduct: ApiProduct,
  selectedVariant?: ApiProductVariant
): Product {
  // Build legacy variants from API variant options
  const variantsMap = new Map<string, Set<string>>();

  if (apiProduct.variants && apiProduct.variants.length > 0) {
    for (const variant of apiProduct.variants) {
      if (variant.options && typeof variant.options === "object") {
        for (const [key, value] of Object.entries(variant.options)) {
          if (!variantsMap.has(key)) {
            variantsMap.set(key, new Set());
          }
          variantsMap.get(key)!.add(String(value));
        }
      }
    }
  }

  const legacyVariants: Product["variants"] = [];
  for (const [type, optionsSet] of variantsMap) {
    legacyVariants.push({
      type: type as "warna" | "ukuran" | "bentuk",
      options: Array.from(optionsSet),
    });
  }

  const effectivePrice = selectedVariant
    ? selectedVariant.effective_price
    : apiProduct.base_price;

  return {
    id: String(apiProduct.id),
    slug: apiProduct.slug,
    name: apiProduct.name,
    category: getCategorySlug(apiProduct) as Product["category"],
    categoryLabel: getCategoryLabel(apiProduct),
    price: effectivePrice,
    formattedPrice: formatRupiah(effectivePrice),
    image: getPrimaryImageUrl(apiProduct) || undefined,
    shortDescription: apiProduct.description || "",
    materialDetails: apiProduct.material || undefined,
    badge: undefined,
    variants: legacyVariants.length > 0 ? legacyVariants : undefined,
  };
}

/**
 * Validates and sanitizes a redirect target to prevent open redirects.
 * Only allows internal paths starting with a single leading slash.
 */
export function getSafeRedirectUrl(
  target: string | null | undefined,
  fallback: string = "/akun"
): string {
  if (!target) return fallback;
  try {
    const decoded = decodeURIComponent(target).trim();
    // Must start with exactly one '/', not '//' or containing protocols
    if (
      decoded.startsWith("/") &&
      !decoded.startsWith("//") &&
      !decoded.includes("://") &&
      !decoded.includes("\\")
    ) {
      return decoded;
    }
  } catch {
    // on decode error, return fallback
  }
  return fallback;
}
