"use client";

import { useState } from "react";
import Link from "next/link";
import { useBooks } from "./BookContext";
import { useCart } from "./CartContext";

export default function Home() {
  const { books, loading, error } = useBooks();
  const { add } = useCart();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Бүгд");

  const categories = [
    "Бүгд",
    ...Array.from(
      new Set(books.map((b) => b.category).filter((c): c is string => !!c))
    ),
  ];

  const query = search.trim().toLowerCase();
  const filtered = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(query) ||
      b.author.toLowerCase().includes(query);
    const matchesCategory = category === "Бүгд" || b.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1 style={{ margin: 0 }}>Номын жагсаалт</h1>

      <div style={{ marginTop: "24px" }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Номын нэр эсвэл зохиолчоор хайх..."
          style={{
            width: "100%",
            maxWidth: "420px",
            padding: "10px 14px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "16px" }}>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              border: "1px solid #999",
              cursor: "pointer",
              background: category === c ? "#0070f3" : "transparent",
              color: category === c ? "white" : "inherit",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ marginTop: "32px" }}>Ачаалж байна...</p>
      ) : error ? (
        <p style={{ marginTop: "32px", color: "#d32f2f" }}>
          Алдаа гарлаа: {error}
        </p>
      ) : filtered.length === 0 ? (
        <p style={{ marginTop: "32px" }}>Хайлтад тохирох ном олдсонгүй.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "20px",
            marginTop: "24px",
          }}
        >
          {filtered.map((book) => (
            <div
              key={book.id}
              className="card"
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
              }}
            >
              <Link href={`/book/${book.id}`}>
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "2 / 3",
                    background: "#e5e5e5",
                    borderRadius: "6px",
                    overflow: "hidden",
                    marginBottom: "12px",
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
              </Link>
              <h3>
                <Link
                  href={`/book/${book.id}`}
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  {book.title}
                </Link>
              </h3>
              <p>{book.author}</p>
              <p style={{ fontSize: "13px", color: "#888" }}>{book.category}</p>
              <p>
                <b>{book.price.toLocaleString()}₮</b>
              </p>
              <button
                onClick={() => add(book.id)}
                style={{ padding: "8px 12px", cursor: "pointer" }}
              >
                Сагсанд нэмэх
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}