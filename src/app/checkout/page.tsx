"use client";

import { useState } from "react";
import Link from "next/link";
import { books } from "../book";
import { useCart } from "../CartContext";

export default function CheckoutPage() {
  const { items, clear } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Сагсан дахь номнуудыг олох
  const orderItems = Object.entries(items)
    .map(([id, quantity]) => {
      const book = books.find((b) => b.id === Number(id));

      if (!book) return null;

      return {
        book,
        quantity,
      };
    })
    .filter(
      (
        item
      ): item is {
        book: (typeof books)[number];
        quantity: number;
      } => item !== null
    );

  // Нийт үнэ
  const total = orderItems.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (orderItems.length === 0) {
      alert("Таны сагс хоосон байна.");
      return;
    }

    setSubmitted(true);
    clear();
  };

  // Захиалга амжилттай болсон хэсэг
  if (submitted) {
    return (
      <main
        style={{
          maxWidth: "700px",
          margin: "60px auto",
          padding: "24px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            border: "1px solid #ddd",
            borderRadius: "12px",
          }}
        >
          <div style={{ fontSize: "50px" }}>✅</div>

          <h1 style={{ marginTop: "16px" }}>
            Захиалга амжилттай!
          </h1>

          <p style={{ color: "#666", marginTop: "12px" }}>
            Таны захиалга амжилттай бүртгэгдлээ.
          </p>

          <div
            style={{
              textAlign: "left",
              background: "#f7f7f7",
              padding: "20px",
              borderRadius: "8px",
              marginTop: "24px",
            }}
          >
            <p>
              <strong>Нэр:</strong> {name}
            </p>

            <p>
              <strong>Утас:</strong> {phone}
            </p>

            <p>
              <strong>Хаяг:</strong> {address}
            </p>
          </div>

          <Link
            href="/"
            style={{
              display: "inline-block",
              marginTop: "24px",
              padding: "10px 20px",
              background: "#0070f3",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            Номын дэлгүүр рүү буцах
          </Link>
        </div>
      </main>
    );
  }

  // Сагс хоосон
  if (orderItems.length === 0) {
    return (
      <main
        style={{
          maxWidth: "700px",
          margin: "60px auto",
          padding: "24px",
          fontFamily: "sans-serif",
          textAlign: "center",
        }}
      >
        <h1>Захиалга өгөх</h1>

        <p style={{ marginTop: "20px", color: "#666" }}>
          Таны сагс хоосон байна.
        </p>

        <Link
          href="/"
          style={{
            display: "inline-block",
            marginTop: "20px",
            padding: "10px 20px",
            background: "#0070f3",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          Ном сонгох
        </Link>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: "1000px",
        margin: "40px auto",
        padding: "24px",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Захиалга өгөх</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          marginTop: "30px",
        }}
      >
        {/* ЗАХИАЛАГЧИЙН МЭДЭЭЛЭЛ */}
        <form onSubmit={handleSubmit}>
          <h2>Хүргэлтийн мэдээлэл</h2>

          <label
            style={{
              display: "block",
              marginTop: "20px",
              marginBottom: "6px",
              fontWeight: "bold",
            }}
          >
            Нэр
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Нэрээ оруулна уу"
            required
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          />

          <label
            style={{
              display: "block",
              marginTop: "18px",
              marginBottom: "6px",
              fontWeight: "bold",
            }}
          >
            Утас
          </label>

          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="99112233"
            required
            pattern="[0-9]{8}"
            title="8 оронтой утасны дугаар оруулна уу"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          />

          <label
            style={{
              display: "block",
              marginTop: "18px",
              marginBottom: "6px",
              fontWeight: "bold",
            }}
          >
            Хаяг
          </label>

          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Хүргэлт хийх дэлгэрэнгүй хаяг"
            required
            rows={5}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              resize: "vertical",
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              marginTop: "24px",
              padding: "14px",
              background: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Захиалга өгөх
          </button>
        </form>

        {/* ЗАХИАЛГЫН ТОЙМ */}
        <div>
          <h2>Захиалгын тойм</h2>

          <div
            style={{
              marginTop: "20px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "20px",
            }}
          >
            {orderItems.map(({ book, quantity }) => (
              <div
                key={book.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "20px",
                  padding: "14px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <div>
                  <strong>{book.title}</strong>

                  <div
                    style={{
                      marginTop: "5px",
                      color: "#777",
                      fontSize: "14px",
                    }}
                  >
                    {quantity} ширхэг ×{" "}
                    {book.price.toLocaleString()}₮
                  </div>
                </div>

                <strong style={{ whiteSpace: "nowrap" }}>
                  {(book.price * quantity).toLocaleString()}₮
                </strong>
              </div>
            ))}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
                fontSize: "20px",
              }}
            >
              <strong>Нийт:</strong>

              <strong>{total.toLocaleString()}₮</strong>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
