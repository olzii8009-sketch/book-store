"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type CartItems = Record<number, number>;

type CartContextType = {
  items: CartItems;
  count: number;
  add: (id: number) => void;
  decrease: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItems>({});
  const [loaded, setLoaded] = useState(false);

  // Хадгалсан сагсыг browser-оос унших
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  // Сагс өөрчлөгдөх бүрт хадгалах
  useEffect(() => {
    if (loaded) localStorage.setItem("cart", JSON.stringify(items));
  }, [items, loaded]);

  const add = (id: number) =>
    setItems((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

  const decrease = (id: number) =>
    setItems((prev) => {
      const next = { ...prev };
      if ((next[id] || 0) <= 1) delete next[id];
      else next[id] -= 1;
      return next;
    });

  const remove = (id: number) =>
    setItems((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

  const clear = () => setItems({});

  const count = Object.values(items).reduce((sum, q) => sum + q, 0);

  return (
    <CartContext.Provider value={{ items, count, add, decrease, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}