"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const ScrpListPage = () => {
  const { results } = useSelector((state: RootState) => state.scraping);

  if (results.length === 0) {
    return <p>아직 호출된 데이터가 없습니다.</p>;
  }

  return (
    <div>
      <h1>스크래핑 결과</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">API 코드</th>
            <th className="border border-gray-300 px-4 py-2">모듈 코드</th>
            <th className="border border-gray-300 px-4 py-2">상태</th>
            <th className="border border-gray-300 px-4 py-2">결과</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">
                {result.apiCd}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {result.mdulCustCd}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {result.success ? "성공" : "실패"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {result.success ? (
                  <pre>{JSON.stringify(result.data, null, 2)}</pre>
                ) : (
                  <pre>{JSON.stringify(result.error, null, 2)}</pre>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScrpListPage;
