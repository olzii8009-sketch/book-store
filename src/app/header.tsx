"use client";

import Link from "next/link";
import { useCart } from "./CartContext";

export default function Header() {
  const { count } = useCart();

  return (
    <header className="header">
      <Link href="/" className="logo">
        📚 Миний номын дэлгүүр
      </Link>
      <Link href="/cart" className="cart-link">
        🛒 Сагс
        {count > 0 && <span className="badge">{count}</span>}
      </Link>
    </header>
  );
}