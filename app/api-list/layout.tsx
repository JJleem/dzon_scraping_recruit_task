"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import Header from "../components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />

      {children}
    </div>
  );
}
