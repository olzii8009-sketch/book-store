"use client";

import Link from "next/link";
import { useBooks } from "../BookContext";
import { useCart } from "../CartContext";

export default function CartPage() {
  const { books, loading } = useBooks();
  const { items, add, decrease, remove, clear } = useCart();

  const cartBooks = books.filter((b) => items[b.id]);
  const total = cartBooks.reduce((sum, b) => sum + b.price * items[b.id], 0);

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "800px" }}>
      <Link href="/" style={{ color: "#1f4d3a" }}>
        ← Дэлгүүр рүү буцах
      </Link>
      <h1 style={{ marginTop: "16px" }}>🛒 Миний сагс</h1>

      {loading ? (
        <p style={{ marginTop: "24px" }}>Ачаалж байна...</p>
      ) : cartBooks.length === 0 ? (
        <p style={{ marginTop: "24px" }}>Сагс хоосон байна.</p>
      ) : (
        <>
          <div style={{ marginTop: "24px" }}>
            {cartBooks.map((book) => (
              <div
                key={book.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  borderBottom: "1px solid #ddd",
                  padding: "16px 0",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "90px",
                    background: "#e5e5e5",
                    borderRadius: "4px",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={book.cover || undefined}
                    alt={book.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <div>
                    <b>{book.title}</b>
                  </div>
                  <div>{book.author}</div>
                  <div>{book.price.toLocaleString()}₮</div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button onClick={() => decrease(book.id)} style={{ width: "32px", cursor: "pointer" }}>
                    −
                  </button>
                  <span>{items[book.id]}</span>
                  <button onClick={() => add(book.id)} style={{ width: "32px", cursor: "pointer" }}>
                    +
                  </button>
                </div>

                <div style={{ width: "100px", textAlign: "right" }}>
                  <b>{(book.price * items[book.id]).toLocaleString()}₮</b>
                </div>

                <button
                  onClick={() => remove(book.id)}
                  style={{ cursor: "pointer" }}
                  title="Устгах"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "24px",
            }}
          >
            <button onClick={clear} style={{ padding: "8px 12px", cursor: "pointer" }}>
              Сагс хоослох
            </button>
            <h2>Нийт: {total.toLocaleString()}₮</h2>
          </div>

          <div style={{ textAlign: "right", marginTop: "16px" }}>
            <Link
              href="/checkout"
              style={{
                display: "inline-block",
                padding: "12px 24px",
                background: "#1f4d3a",
                color: "white",
                borderRadius: "8px",
                textDecoration: "none",
              }}
            >
              Захиалах →
            </Link>
          </div>
        </>
      )}
    </main>
  );
}