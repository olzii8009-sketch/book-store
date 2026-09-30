"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { useBooks } from "../BookContext";
import { useCart } from "../CartContext";

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  fontSize: "16px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  marginTop: "6px",
  marginBottom: "16px",
  background: "white",
};

export default function CheckoutPage() {
  const { books, loading } = useBooks();
  const { items, clear } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const cartBooks = books.filter((b) => items[b.id]);
  const total = cartBooks.reduce((sum, b) => sum + b.price * items[b.id], 0);

  const submit = async () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError("Нэр, утас, хаягаа бүрэн бөглөнө үү.");
      return;
    }
    if (!/^\d{8}$/.test(phone.replace(/\s/g, ""))) {
      setError("Утасны дугаар 8 оронтой байх ёстой.");
      return;
    }
    setError("");
    setSubmitting(true);

    const { error: dbError } = await supabase.from("orders").insert({
      name: name.trim(),
      phone: phone.replace(/\s/g, ""),
      address: address.trim(),
      note: note.trim() || null,
      items: cartBooks.map((b) => ({
        id: b.id,
        title: b.title,
        price: b.price,
        quantity: items[b.id],
      })),
      total,
    });

    setSubmitting(false);

    if (dbError) {
      setError("Захиалга илгээхэд алдаа гарлаа: " + dbError.message);
      return;
    }

    clear();
    setDone(true);
  };

  if (done) {
    return (
      <main style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "600px" }}>
        <h1>✅ Захиалга амжилттай!</h1>
        <p style={{ marginTop: "16px" }}>Баярлалаа, {name}!</p>
        <p style={{ marginTop: "8px" }}>
          Бид тантай {phone} дугаараар холбогдох болно.
        </p>
        <Link
          href="/"
          style={{ display: "inline-block", marginTop: "24px", color: "#0070f3" }}
        >
          ← Дэлгүүр рүү буцах
        </Link>
      </main>
    );
  }

  if (loading) {
    return (
      <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
        <p>Ачаалж байна...</p>
      </main>
    );
  }

  if (cartBooks.length === 0) {
    return (
      <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
        <h1>Захиалга</h1>
        <p style={{ marginTop: "16px" }}>Сагс хоосон байна.</p>
        <Link
          href="/"
          style={{ display: "inline-block", marginTop: "16px", color: "#0070f3" }}
        >
          ← Дэлгүүр рүү буцах
        </Link>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "900px" }}>
      <Link href="/cart" style={{ color: "#0070f3" }}>
        ← Сагс руу буцах
      </Link>
      <h1 style={{ marginTop: "16px" }}>Захиалга өгөх</h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "40px", marginTop: "24px" }}>
        <div style={{ flex: 1, minWidth: "280px" }}>
          <label>
            Нэр *
            <input
              style={inputStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Таны нэр"
            />
          </label>

          <label>
            Утасны дугаар *
            <input
              style={inputStyle}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="99112233"
              inputMode="numeric"
            />
          </label>

          <label>
            Хүргэлтийн хаяг *
            <textarea
              style={{ ...inputStyle, minHeight: "80px" }}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Дүүрэг, хороо, байр, тоот"
            />
          </label>

          <label>
            Нэмэлт тайлбар
            <textarea
              style={{ ...inputStyle, minHeight: "60px" }}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Хэрэв байвал"
            />
          </label>

          {error && <p style={{ color: "#d32f2f", marginBottom: "12px" }}>{error}</p>}

          <button
            onClick={submit}
            disabled={submitting}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              background: submitting ? "#7a8aa0" : "#1e3a5f",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: submitting ? "default" : "pointer",
            }}
          >
            {submitting ? "Илгээж байна..." : "Захиалах"}
          </button>
        </div>

        <div
          style={{
            flex: 1,
            minWidth: "260px",
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
            alignSelf: "flex-start",
          }}
        >
          <h3>Таны захиалга</h3>
          {cartBooks.map((b) => (
            <div
              key={b.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
                marginTop: "12px",
              }}
            >
              <span>
                {b.title} × {items[b.id]}
              </span>
              <span>{(b.price * items[b.id]).toLocaleString()}₮</span>
            </div>
          ))}
          <hr style={{ margin: "16px 0", border: "none", borderTop: "1px solid #ddd" }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <b>Нийт:</b>
            <b>{total.toLocaleString()}₮</b>
          </div>
        </div>
      </div>
    </main>
  );
}