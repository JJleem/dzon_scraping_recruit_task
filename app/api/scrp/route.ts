import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Axios 인스턴스 생성 (타임아웃 설정)
const axiosInstance = axios.create({
  timeout: 5000, // 요청 타임아웃 설정 (5초)
});

// 재시도 로직
const axiosRetry = async (url: string, config: any, retries = 3) => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await axiosInstance.get(url, config); // GET 요청
    } catch (error) {
      attempt++;
      if (attempt >= retries) throw error; // 재시도 횟수 초과 시 에러 던지기
    }
  }
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Query Parameters
  const mdulCustCd = searchParams.get("mdulCustCd");
  const apiCd = searchParams.get("apiCd");

  // 유효성 검증
  if (!mdulCustCd || !apiCd) {
    return NextResponse.json(
      {
        errYn: "Y",
        code: "400",
        msg: "mdulCustCd와 apiCd는 필수입니다.",
      },
      { status: 400 }
    );
  }

  // Authorization 헤더에서 토큰 추출
  const token = req.headers.get("Authorization")?.split("Bearer ")[1];
  if (!token) {
    return NextResponse.json(
      {
        errYn: "Y",
        code: "401",
        msg: "인증 토큰이 없습니다.",
      },
      { status: 401 }
    );
  }

  try {
    // 외부 API 호출 (재시도 포함)
    const response = await axiosRetry(
      "https://admin.octover.co.kr/admin/api/recruit/scrp-recruit",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          mdulCustCd,
          apiCd,
        },
      },
      3 // 최대 3회 재시도
    );

    // 성공 응답 반환
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error("스크래핑 API 호출 실패:", error.response?.data || error);

    // 에러 응답 반환
    return NextResponse.json(
      {
        errYn: "Y",
        code: error.response?.status || "502",
        msg: "스크래핑 데이터 호출 실패",
        details: error.response?.data || "Unknown error",
      },
      { status: error.response?.status || 502 }
    );
  }
}
