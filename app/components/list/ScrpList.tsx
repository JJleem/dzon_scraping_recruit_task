"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toggleBookmark } from "@/store/apiHistorySlice";

const ScrpListPage = () => {
  const history = useSelector((state: RootState) => state.apiHistory.history);
  const dispatch = useDispatch();
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [popupData, setPopupData] = useState<any | null>(null);
  console.log("history", history);
  // 정렬된 히스토리
  const sortedHistory = [...history].sort((a, b) => {
    if (a.isBookmarked !== b.isBookmarked) {
      return b.isBookmarked ? 1 : -1; // 북마크된 항목을 항상 위로 정렬
    }
    return sortOrder === "latest"
      ? new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      : new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">호출 목록 조회</h1>

      {/* 정렬 버튼 */}
      <div className="mb-4 flex gap-4">
        <button
          onClick={() => setSortOrder("latest")}
          className={`px-4 py-2 ${
            sortOrder === "latest" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          최신 순
        </button>
        <button
          onClick={() => setSortOrder("oldest")}
          className={`px-4 py-2 ${
            sortOrder === "oldest" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          오래된 순
        </button>
      </div>

      {/* 요청 내역 카드 */}
      <ul className="grid grid-cols-5 gap-4">
        {sortedHistory.map((record, index) => (
          <li
            key={record.id}
            className="border p-6 shadow-md flex flex-col gap-4 relative"
          >
            <p>
              <strong>호출 시간:</strong> {record.timestamp}
            </p>
            <p>
              <strong>API 이름:</strong> {record.apiName}
            </p>
            <p>
              <strong>API 코드:</strong> {record.apiCode}
            </p>
            <p>
              <strong>모듈 코드:</strong> {record.moduleCode}
            </p>
            <p>
              <strong>모듈 이름:</strong> {record.moduleName}
            </p>

            {/* 북마크 버튼 */}
            <button
              onClick={() => dispatch(toggleBookmark(record.id))}
              className={`absolute top-4 right-4 ${
                record.isBookmarked ? "text-yellow-500" : "text-gray-400"
              }`}
            >
              {record.isBookmarked ? "★" : "☆"}
            </button>

            {/* 팝업 버튼 */}
            <button
              onClick={() => setPopupData(record)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              호출 하기
            </button>
          </li>
        ))}
      </ul>

      {/* 팝업 */}
      {popupData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-md mb-4">응답 데이터</h2>
            <div className="max-h-96 overflow-auto">
              <pre className="whitespace-pre-wrap break-words">
                {JSON.stringify(popupData, null, 1)}
              </pre>
            </div>
            <button
              onClick={() => setPopupData(null)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrpListPage;
