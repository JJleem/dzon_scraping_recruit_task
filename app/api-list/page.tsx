"use client";
import React, { useState } from "react";
import ScrpListPage from "../components/list/ScrpList";

import ApiListPage from "../components/list/ApiList";

const ApiList = () => {
  const [tab, setTab] = useState<"api" | "scrp">("api"); // 현재 탭 상태

  return (
    <div className="px-4">
      {/* 탭 헤더 */}
      <div className="pt-4 pb-0 flex w-full border-b">
        <button
          onClick={() => setTab("api")}
          className={`border p-4 rounded-t-xl ${
            tab === "api" ? "bg-blue-500 text-white" : "bg-gray-100 text-black"
          }`}
        >
          API 목록 조회
        </button>
        <button
          onClick={() => setTab("scrp")}
          className={`border p-4 rounded-t-xl ${
            tab === "scrp" ? "bg-blue-500 text-white" : "bg-gray-100 text-black"
          }`}
        >
          호출 목록 조회
        </button>
      </div>

      {/* 탭 내용 */}
      <div className="">
        {tab === "api" ? <ApiListPage /> : <ScrpListPage />}
      </div>
    </div>
  );
};

export default ApiList;
