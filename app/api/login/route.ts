import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const axiosInstance = axios.create({
  timeout: 5000, // 요청 타임아웃 설정
});

const axiosRetry = async (url, data, retries = 3) => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await axiosInstance.post(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      attempt++;
      if (attempt >= retries) throw error; // 재시도 횟수 초과 시 에러 던지기
    }
  }
};

export async function POST(req: NextRequest) {
  try {
    const { admUserId, userPw } = await req.json();

    const response = await axiosRetry(
      "https://admin.octover.co.kr/admin/api/recruit/login-check",
      { admUserId, userPw }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("로그인 API 호출 실패:", error);
    return NextResponse.json(
      {
        errYn: "Y",
        msg: error.response?.data?.msg || "로그인 실패",
      },
      { status: error.response?.status || 502 }
    );
  }
}
