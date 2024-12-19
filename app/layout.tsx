"use client";

import "./globals.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkToken, logout } from "./utils/auth";
import { Provider } from "react-redux";
import { store } from "@/store/store";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useEffect(() => {
    const expireAt = localStorage.getItem("expireAt");
    if (!expireAt) return;

    const timeRemaining = parseInt(expireAt, 10) - Date.now();
    if (timeRemaining > 0) {
      const timeout = setTimeout(() => {
        logout(router); // 만료 시간에 맞춰 로그아웃
      }, timeRemaining);

      return () => clearTimeout(timeout); // 컴포넌트 언마운트 시 클리어
    } else {
      logout(router); // 이미 만료된 경우 즉시 로그아웃
    }
  }, [router]);
  return (
    <html lang="en">
      <body>
        <Provider store={store}> {children}</Provider>
      </body>
    </html>
  );
}
