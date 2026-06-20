import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "ayard_cart_v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch (e) {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product, { size, color, quantity = 1 }) => {
    setItems((prev) => {
      const key = `${product.id}|${size || ""}|${color || ""}`;
      const idx = prev.findIndex((p) => p._key === key);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [
        ...prev,
        {
          _key: key,
          product_id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image,
          accent: product.accent,
          size,
          color,
          quantity,
        },
      ];
    });
    setDrawerOpen(true);
  }, []);

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((p) => p._key !== key));
  }, []);

  const updateQty = useCallback((key, qty) => {
    setItems((prev) =>
      prev.map((p) => (p._key === key ? { ...p, quantity: Math.max(1, qty) } : p))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clear,
        subtotal,
        count,
        drawerOpen,
        setDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
