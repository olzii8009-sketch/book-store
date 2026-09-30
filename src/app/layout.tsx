import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BooksProvider } from "./BookContext";
import { CartProvider } from "./CartContext";
import Header from "./header";
import Footer from "./Footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Миний номын дэлгүүр",
  description: "Онлайн номын дэлгүүр",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="mn" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <CartProvider>
  <BooksProvider>
    <Header />
    <div className="content">{children}</div>
    <Footer />
  </BooksProvider>
</CartProvider>
      </body>
    </html>
  );
}