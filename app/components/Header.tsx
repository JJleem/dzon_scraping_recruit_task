"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useState, useEffect } from "react";
import TokenManager from "./TokenManager";

const Header = () => {
  const { userId, expireAt, iat } = useSelector(
    (state: RootState) => state.auth
  );
  console.log(iat);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true); // 클라이언트 렌더링 후 상태를 true로 설정
  }, []);

  // Hydration 전에는 아무것도 렌더링하지 않음
  if (!hydrated) {
    return null;
  }

  return (
    <header className="bg-gray-100 border-b border-gray-300 p-4 flex justify-between items-center">
      <div className="flex flex-col">
        <span className="w-[60px] h-6  bg-no-repeat bg-cover bg-[url('/logo.svg')]" />

        <h1 className="text-lg font-bold">Dozn_Scraping_recruit_task_임재준</h1>
        <p className="text-sm text-gray-600">사용자 ID: {userId || "N/A"}</p>
      </div>

      {/* 오른쪽: 유효 시간 정보 */}
      <div className="text-right">
        <p className="text-sm text-gray-500">
          발급 시간: {iat ? iat : "발급 정보 없음"}
        </p>
        <TokenManager />
      </div>
    </header>
  );
};

export default Header;
