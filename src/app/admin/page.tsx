"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

type OrderItem = { id: number; title: string; price: number; quantity: number };

type Order = {
  id: number;
  created_at: string;
  name: string;
  phone: string;
  address: string;
  note: string | null;
  items: OrderItem[];
  total: number;
  status: string;
};

const statuses = ["Шинэ", "Баталгаажсан", "Хүргэгдсэн", "Цуцлагдсан"];

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

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  // Нэвтэрсэн эсэхийг шалгах
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Нэвтэрсний дараа захиалгуудыг унших
  useEffect(() => {
    if (!session) return;
    setLoadingOrders(true);
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setOrdersError(error.message);
        else setOrders((data as Order[]) || []);
        setLoadingOrders(false);
      });
  }, [session]);

  const login = async () => {
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) setAuthError("Нэвтрэхэд алдаа гарлаа: " + error.message);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setOrders([]);
  };

  const changeStatus = async (id: number, status: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);
    if (error) {
      alert("Статус солиход алдаа гарлаа: " + error.message);
      return;
    }
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  if (checking) {
    return (
      <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
        <p>Ачаалж байна...</p>
      </main>
    );
  }

  // Нэвтрээгүй үед
  if (!session) {
    return (
      <main style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "400px" }}>
        <h1>Админ нэвтрэх</h1>
        <div style={{ marginTop: "24px" }}>
          <label>
            Имэйл
            <input
              type="email"
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Нууц үг
            <input
              type="password"
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") login();
              }}
            />
          </label>
          {authError && (
            <p style={{ color: "#d32f2f", marginBottom: "12px" }}>{authError}</p>
          )}
          <button
            onClick={login}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              background: "#1e3a5f",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Нэвтрэх
          </button>
        </div>
      </main>
    );
  }

  // Нэвтэрсэн үед
  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "1000px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <h1 style={{ margin: 0 }}>Захиалгууд ({orders.length})</h1>
        <div>
            <Link
  href="/admin/books"
  style={{ marginRight: "16px", color: "#0070f3" }}
>
  📚 Ном удирдах
</Link>
          <span style={{ marginRight: "12px", color: "#666" }}>
            {session.user.email}
          </span>
          <button onClick={logout} style={{ padding: "8px 12px", cursor: "pointer" }}>
            Гарах
          </button>
        </div>
      </div>

      {loadingOrders ? (
        <p style={{ marginTop: "24px" }}>Ачаалж байна...</p>
      ) : ordersError ? (
        <p style={{ marginTop: "24px", color: "#d32f2f" }}>
          Алдаа гарлаа: {ordersError}
        </p>
      ) : orders.length === 0 ? (
        <p style={{ marginTop: "24px" }}>
          Захиалга алга. Хэрэв захиалга өгсөн бол SQL дахь имэйл таны нэвтэрсэн
          имэйлтэй яг ижил эсэхийг шалгаарай.
        </p>
      ) : (
        <div style={{ marginTop: "24px", display: "grid", gap: "16px" }}>
          {orders.map((o) => (
            <div
              key={o.id}
              style={{
                background: "white",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <b>
                  #{o.id} · {o.name}
                </b>
                <span style={{ color: "#666" }}>
                  {new Date(o.created_at).toLocaleString()}
                </span>
              </div>

              <p style={{ marginTop: "8px" }}>📞 {o.phone}</p>
              <p style={{ marginTop: "4px" }}>📍 {o.address}</p>
              {o.note && (
                <p style={{ marginTop: "4px" }}>💬 {o.note}</p>
              )}

              <div style={{ marginTop: "12px" }}>
                {o.items.map((it, i) => (
                  <div
                    key={i}
                    style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}
                  >
                    <span>
                      {it.title} × {it.quantity}
                    </span>
                    <span>{(it.price * it.quantity).toLocaleString()}₮</span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                  marginTop: "16px",
                  paddingTop: "12px",
                  borderTop: "1px solid #eee",
                }}
              >
                <b>Нийт: {o.total.toLocaleString()}₮</b>
                <select
                  value={o.status}
                  onChange={(e) => changeStatus(o.id, e.target.value)}
                  style={{ padding: "6px 10px", fontSize: "15px" }}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}