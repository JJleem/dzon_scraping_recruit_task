import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Query parameters
  const pageSize = searchParams.get("pageSize") || "10";
  const pageIdx = searchParams.get("pageIdx") || "1";
  const token = request.headers.get("Authorization")?.split("Bearer ")[1];

  if (!token) {
    return NextResponse.json({ error: "Token is missing" }, { status: 401 });
  }

  try {
    const response = await axios.get(
      "https://admin.octover.co.kr/admin/api/user/api/list",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          pageSize,
          pageIdx,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("API 목록 호출 실패:", error);
    return NextResponse.json(
      { error: "Failed to fetch API list" },
      { status: 500 }
    );
  }
}
