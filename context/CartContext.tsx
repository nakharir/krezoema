"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Product } from "@/data/mockProducts";

export interface CartItem {
  id: string; // Deterministic ID: slug + sorted variant entries
  product: Product;
  selectedVariants: Record<string, string>;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (
    product: Product,
    selectedVariants: Record<string, string>,
    quantity?: number
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  clearCart: () => void;
  getCartItemQuantity: (itemId: string) => number;
  cartTotal: () => number;
  cartItemCount: () => number;
  isHydrated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "krezoema-cart";

/**
 * Generates a stable, deterministic ID based on product slug and selected variants.
 */
export function generateCartItemId(
  slug: string,
  selectedVariants: Record<string, string>
): string {
  const sortedKeys = Object.keys(selectedVariants).sort();
  const variantParts = sortedKeys.map((key) => `${key}:${selectedVariants[key]}`);
  return variantParts.length > 0 ? `${slug}__${variantParts.join("__")}` : slug;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Hydrate cart from localStorage on client mount
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (err) {
      console.error("Gagal memuat keranjang belanja dari localStorage:", err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Persist cart to localStorage whenever items change after initial hydration
  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error("Gagal menyimpan keranjang belanja ke localStorage:", err);
    }
  }, [items, isHydrated]);

  /**
   * Adds an item to the cart. If the same product with identical variants already exists,
   * increments its quantity. Otherwise, creates a new cart item.
   */
  const addToCart = useCallback(
    (
      product: Product,
      selectedVariants: Record<string, string>,
      quantity: number = 1
    ) => {
      const validQty = Math.max(1, Math.floor(quantity));
      const itemId = generateCartItemId(product.slug, selectedVariants);

      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex((item) => item.id === itemId);

        if (existingIndex > -1) {
          const updated = [...prevItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + validQty,
          };
          return updated;
        }

        return [
          ...prevItems,
          {
            id: itemId,
            product,
            selectedVariants,
            quantity: validQty,
          },
        ];
      });
    },
    []
  );

  /**
   * Removes an item by its unique ID.
   */
  const removeFromCart = useCallback((itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }, []);

  /**
   * Updates an item's quantity. Ensures quantity cannot fall below 1.
   */
  const updateQuantity = useCallback((itemId: string, newQuantity: number) => {
    const validQty = Math.max(1, Math.floor(newQuantity));

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: validQty } : item
      )
    );
  }, []);

  /**
   * Clears all items in the cart.
   */
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  /**
   * Retrieves quantity for a specific item ID.
   */
  const getCartItemQuantity = useCallback(
    (itemId: string) => {
      const item = items.find((i) => i.id === itemId);
      return item ? item.quantity : 0;
    },
    [items]
  );

  /**
   * Calculates the grand total price of all items in the cart.
   */
  const cartTotal = useCallback(() => {
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }, [items]);

  /**
   * Calculates the total number of items (sum of all quantities).
   */
  const cartItemCount = useCallback(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartItemQuantity,
      cartTotal,
      cartItemCount,
      isHydrated,
    }),
    [
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartItemQuantity,
      cartTotal,
      cartItemCount,
      isHydrated,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
