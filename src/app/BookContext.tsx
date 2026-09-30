"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "./lib/supabase";

export type Book = {
  id: number;
  title: string;
  author: string;
  price: number;
  cover: string | null;
  category: string | null;
  description: string | null;
};

type BooksContextType = {
  books: Book[];
  loading: boolean;
  error: string;
};

const BooksContext = createContext<BooksContextType>({
  books: [],
  loading: true,
  error: "",
});

export function BooksProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase
      .from("books")
      .select("*")
      .order("id")
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setBooks((data as Book[]) || []);
        setLoading(false);
      });
  }, []);

  return (
    <BooksContext.Provider value={{ books, loading, error }}>
      {children}
    </BooksContext.Provider>
  );
}

export function useBooks() {
  return useContext(BooksContext);
}