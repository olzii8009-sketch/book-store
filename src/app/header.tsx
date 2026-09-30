"use client";

import Link from "next/link";
import { useCart } from "./CartContext";

export default function Header() {
  const { count } = useCart();

  return (
    <header className="header">
      <Link href="/" className="logo">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <rect x="4" y="3" width="22" height="26" rx="3" fill="#e9a23b" />
          <rect x="8" y="3" width="18" height="26" rx="2" fill="#ffffff" />
          <path
            d="M12 10h10M12 15h10M12 20h6"
            stroke="#1f4d3a"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span>Миний номын дэлгүүр</span>
      </Link>
      <Link href="/cart" className="cart-link">
        🛒 Сагс
        {count > 0 && <span className="badge">{count}</span>}
      </Link>
    </header>
  );
}