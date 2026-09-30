"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../../lib/supabase";

type Book = {
  id: number;
  title: string;
  author: string;
  price: number;
  cover: string | null;
  category: string | null;
  description: string | null;
};

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

export default function AdminBooksPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState(0);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadBooks = async () => {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("id");
    if (error) setError(error.message);
    else setBooks((data as Book[]) || []);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) loadBooks();
  }, [session]);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setAuthor("");
    setPrice("");
    setCategory("");
    setDescription("");
    setCover("");
    setFile(null);
    setFileKey((k) => k + 1);
  };

  const startEdit = (b: Book) => {
    setEditingId(b.id);
    setTitle(b.title);
    setAuthor(b.author);
    setPrice(String(b.price));
    setCategory(b.category || "");
    setDescription(b.description || "");
    setCover(b.cover || "");
    setFile(null);
    setFileKey((k) => k + 1);
    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async () => {
    setError("");
    setMessage("");

    if (!title.trim() || !author.trim() || !price.trim()) {
      setError("Нэр, зохиолч, үнийг заавал бөглөнө үү.");
      return;
    }
    const priceNum = Number(price);
    if (!Number.isInteger(priceNum) || priceNum <= 0) {
      setError("Үнэ нь 0-ээс их бүхэл тоо байх ёстой.");
      return;
    }

    setSaving(true);

    let coverUrl = cover;
    if (file) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${Date.now()}.${ext}`;
      const { error: upError } = await supabase.storage
        .from("covers")
        .upload(path, file);
      if (upError) {
        setError("Зураг оруулахад алдаа гарлаа: " + upError.message);
        setSaving(false);
        return;
      }
      coverUrl = supabase.storage.from("covers").getPublicUrl(path).data.publicUrl;
    }

    const payload = {
      title: title.trim(),
      author: author.trim(),
      price: priceNum,
      category: category.trim() || null,
      description: description.trim() || null,
      cover: coverUrl || null,
    };

    const { error: dbError } = editingId
      ? await supabase.from("books").update(payload).eq("id", editingId)
      : await supabase.from("books").insert(payload);

    setSaving(false);

    if (dbError) {
      setError("Хадгалахад алдаа гарлаа: " + dbError.message);
      return;
    }

    setMessage(editingId ? "Ном шинэчлэгдлээ ✅" : "Ном нэмэгдлээ ✅");
    resetForm();
    loadBooks();
  };

  const remove = async (b: Book) => {
    if (!confirm(`"${b.title}" номыг устгах уу?`)) return;
    const { error } = await supabase.from("books").delete().eq("id", b.id);
    if (error) {
      setError("Устгахад алдаа гарлаа: " + error.message);
      return;
    }
    if (editingId === b.id) resetForm();
    setMessage("Ном устгагдлаа");
    loadBooks();
  };

  if (checking) {
    return (
      <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
        <p>Ачаалж байна...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
        <p>Эхлээд нэвтэрнэ үү.</p>
        <Link
          href="/admin"
          style={{ display: "inline-block", marginTop: "12px", color: "#0070f3" }}
        >
          Нэвтрэх хуудас руу →
        </Link>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "1000px" }}>
      <Link href="/admin" style={{ color: "#0070f3" }}>
        ← Захиалгууд руу буцах
      </Link>
      <h1 style={{ marginTop: "16px" }}>Номын удирдлага</h1>

      <div
        style={{
          background: "white",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "24px",
          marginTop: "24px",
          maxWidth: "600px",
        }}
      >
        <h3 style={{ marginBottom: "16px" }}>
          {editingId ? `Ном засах (#${editingId})` : "Шинэ ном нэмэх"}
        </h3>

        <label>
          Номын нэр *
          <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>

        <label>
          Зохиолч *
          <input style={inputStyle} value={author} onChange={(e) => setAuthor(e.target.value)} />
        </label>

        <label>
          Үнэ (₮) *
          <input
            style={inputStyle}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            inputMode="numeric"
            placeholder="15000"
          />
        </label>

        <label>
          Ангилал
          <input
            style={inputStyle}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Уран зохиол"
          />
        </label>

        <label>
          Тайлбар
          <textarea
            style={{ ...inputStyle, minHeight: "80px" }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <div>
          Хавтасны зураг
          {cover && !file && (
            <div style={{ marginTop: "8px" }}>
              <img
                src={cover}
                alt="Одоогийн зураг"
                style={{ height: "90px", borderRadius: "4px", background: "#e5e5e5" }}
              />
            </div>
          )}
          <input
            key={fileKey}
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ display: "block", marginTop: "8px", marginBottom: "16px" }}
          />
        </div>

        {error && <p style={{ color: "#d32f2f", marginBottom: "12px" }}>{error}</p>}
        {message && <p style={{ color: "#2e7d32", marginBottom: "12px" }}>{message}</p>}

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={save}
            disabled={saving}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              background: saving ? "#7a8aa0" : "#1e3a5f",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: saving ? "default" : "pointer",
            }}
          >
            {saving ? "Хадгалж байна..." : editingId ? "Шинэчлэх" : "Нэмэх"}
          </button>
          {editingId && (
            <button
              onClick={resetForm}
              style={{ padding: "12px 24px", fontSize: "16px", cursor: "pointer" }}
            >
              Болих
            </button>
          )}
        </div>
      </div>

      <h2 style={{ marginTop: "40px" }}>Бүх ном ({books.length})</h2>
      <div style={{ marginTop: "16px", display: "grid", gap: "12px" }}>
        {books.map((b) => (
          <div
            key={b.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              background: "white",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "12px 16px",
            }}
          >
            <div
              style={{
                width: "45px",
                height: "68px",
                background: "#e5e5e5",
                borderRadius: "4px",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <img
                src={b.cover || undefined}
                alt={b.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div>
                <b>{b.title}</b>
              </div>
              <div style={{ color: "#666" }}>
                {b.author} · {b.category || "Ангилалгүй"}
              </div>
              <div>{b.price.toLocaleString()}₮</div>
            </div>
            <button onClick={() => startEdit(b)} style={{ padding: "6px 12px", cursor: "pointer" }}>
              Засах
            </button>
            <button onClick={() => remove(b)} style={{ padding: "6px 12px", cursor: "pointer" }}>
              🗑️
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}