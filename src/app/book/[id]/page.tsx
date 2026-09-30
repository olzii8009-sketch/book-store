"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useBooks } from "../../BookContext";
import { useCart } from "../../CartContext";

export default function BookPage() {
  const params = useParams<{ id: string }>();
  const { books, loading } = useBooks();
  const { items, add } = useCart();

  const book = books.find((b) => b.id === Number(params.id));

  if (loading) {
    return (
      <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
        <p>Ачаалж байна...</p>
      </main>
    );
  }

  if (!book) {
    return (
      <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
        <Link href="/" style={{ color: "#1f4d3a" }}>
          ← Дэлгүүр рүү буцах
        </Link>
        <h1 style={{ marginTop: "16px" }}>Ном олдсонгүй</h1>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "900px" }}>
      <Link href="/" style={{ color: "#1f4d3a" }}>
        ← Дэлгүүр рүү буцах
      </Link>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "32px",
          marginTop: "24px",
        }}
      >
        <div
          style={{
            width: "300px",
            aspectRatio: "2 / 3",
            background: "#e5e5e5",
            borderRadius: "8px",
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

        <div style={{ flex: 1, minWidth: "260px" }}>
          <h1>{book.title}</h1>
          <p style={{ marginTop: "8px" }}>{book.author}</p>
          <p style={{ color: "#888", marginTop: "4px" }}>{book.category}</p>
          <h2 style={{ marginTop: "20px" }}>{book.price.toLocaleString()}₮</h2>
          <p style={{ marginTop: "20px", lineHeight: 1.6 }}>{book.description}</p>

          <button
            onClick={() => add(book.id)}
            style={{ marginTop: "24px", padding: "10px 18px", cursor: "pointer" }}
          >
            Сагсанд нэмэх
          </button>
          {items[book.id] > 0 && (
            <p style={{ marginTop: "12px" }}>
              Сагсанд {items[book.id]} ширхэг байна.{" "}
              <Link href="/cart" style={{ color: "#1f4d3a" }}>
                Сагс үзэх →
              </Link>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}