"use client";

import { addApiCall } from "@/store/apiHistorySlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";

const ApiListPage = () => {
  const [apiList, setApiList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [token, setToken] = useState<string | null>(null); // 토큰 상태 추가

  // 브라우저 환경에서만 localStorage에서 토큰 가져오기
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, []);

  const fetchApiList = async () => {
    if (!token) {
      console.error("토큰이 없습니다.");
      return;
    }

    try {
      const response = await fetch(
        `/api/list?pageSize=50&pageIdx=${currentPage}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch API list");
      }

      const data = await response.json();
      console.log(data);

      setApiList(data.data.list);

      // totalPages 계산
      const totalCount = Number(data.data.totalCount || 0); // 총 데이터 개수
      const calculatedTotalPages = Math.ceil(totalCount / 10); // 10개 단위로 나눔
      setTotalPages(calculatedTotalPages || 1); // 최소 1페이지
    } catch (error) {
      console.error("API 목록 조회 실패:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchApiList();
    }
  }, [currentPage, token]);

  return (
    <div className="p-4 flex flex-col gap-2 justify-between">
      <div>
        <ApiTable apiList={apiList} token={token} />
      </div>
      <div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

const ApiTable = ({ apiList, token }: { apiList: any[]; token: string }) => {
  const dispatch = useDispatch();
  const handleApiCall = async (apiCd: string, mdulCustCd: string) => {
    const timestamp = new Date().toISOString(); // 현재 시간
    const apiName = apiList.find((api) => api.apiCd === apiCd)?.apiNm || "";

    try {
      const response = await fetch(
        `/api/scrp?mdulCustCd=${mdulCustCd}&apiCd=${apiCd}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("API 호출 실패");
      }

      const data = await response.json();

      // Redux에 호출 데이터 저장
      dispatch(
        addApiCall({
          timestamp,
          apiName,
          apiCode: apiCd,
          moduleCode: mdulCustCd,
          moduleName: apiList.find((api) => api.apiCd === apiCd)?.mdulNm || "",
          id: uuidv4(),
        })
      );

      alert(`API 호출 성공: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error("API 호출 에러:", error);
      alert("API 호출에 실패했습니다.");
    }
  };

  return (
    <div>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">API 이름</th>
            <th className="border border-gray-300 px-4 py-2">API 코드</th>
            <th className="border border-gray-300 px-4 py-2">API 설명</th>
            <th className="border border-gray-300 px-4 py-2">모듈 코드</th>
            <th className="border border-gray-300 px-4 py-2">모듈 이름</th>
            <th className="border border-gray-300 px-4 py-2">키워드 코드</th>
            <th className="border border-gray-300 px-4 py-2">키워드 이름</th>
            <th className="border border-gray-300 px-4 py-2">제공기관</th>
          </tr>
        </thead>
        <tbody>
          {apiList.map((api, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">{api.apiNm}</td>
              <td className=" border border-gray-300 px-4 py-2 text-center">
                {api.apiCd}{" "}
                <button
                  onClick={() => handleApiCall(api.apiCd, api.mdulCustCd)}
                  className=" border ml-9 -mr-9 p-2 hover:bg-NauticalBlue bg-LittleBoyBlue text-white font-bold rounded-lg"
                >
                  호출
                </button>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {api.apiDesc}
              </td>
              <td className="w- border  border-gray-300 px-4 py-2 text-center">
                {api.mdulCustCd}
                <button
                  onClick={() => handleApiCall(api.apiCd, api.mdulCustCd)}
                  className=" border ml-9 -mr-9 p-2 hover:bg-NauticalBlue bg-LittleBoyBlue text-white font-bold rounded-lg"
                >
                  호출
                </button>
              </td>
              <td className="border border-gray-300 px-4 py-2">{api.mdulNm}</td>
              <td className="border border-gray-300 px-4 py-2">{api.kwrdCd}</td>
              <td className="border border-gray-300 px-4 py-2">{api.kwrdNm}</td>
              <td className="border border-gray-300 px-4 py-2">{api.prvr}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => (
  <div className="flex justify-center mt-4">
    {Array.from({ length: totalPages }).map((_, index) => (
      <button
        key={index}
        className={`px-4 py-2 mx-1 ${
          currentPage === index + 1
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-black"
        }`}
        onClick={() => onPageChange(index + 1)}
      >
        {index + 1}
      </button>
    ))}
  </div>
);

export default ApiListPage;
