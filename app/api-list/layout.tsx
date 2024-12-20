"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-[100vh] flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
