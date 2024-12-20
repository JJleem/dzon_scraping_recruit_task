"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "@/store/authSlice";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [admUserId, setAdmUserId] = useState<string>("");
  const [userPw, setUserPw] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ admUserId, userPw }),
      });

      const data = await response.json();

      if (data.errYn === "N" && data.data?.accessToken) {
        const decodedToken = JSON.parse(
          atob(data.data.accessToken.split(".")[1])
        );
        const formatTimestamp = (timestamp: string | null) => {
          if (!timestamp) return "정보 없음";
          const date = new Date(Number(timestamp) * 1000); // 초 단위를 밀리초로 변환
          return date.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }); // 한국 시간대로 변환
        };

        dispatch(
          setAuth({
            token: data.data.accessToken,
            userId: decodedToken.identification,
            expireAt: (decodedToken.exp * 1000).toString(),
            iat: formatTimestamp(decodedToken.iat),
          })
        );

        router.push("/api-list");
      } else {
        setError(data.msg || "로그인에 실패했습니다.");
      }
    } catch (error) {
      setError("서버와의 통신에 문제가 발생했습니다.");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleLogin(); // Enter 키를 눌렀을 때 로그인 함수 호출
    }
  };

  return (
    <main
      className=" w-full h-[100vh] flex justify-center items-center flex-col  bg-no-repeat bg-cover bg-[url('/bg.jpg')] "
      onKeyDown={handleKeyDown}
    >
      <div className=" bg-white flex justify-center items-center flex-col shadow-lg px-20 pb-10 pt-10 gap-8 rounded-md">
        <span className="w-[100px] h-[40px]  bg-no-repeat bg-cover bg-[url('/logo.svg')]" />
        <div className="flex flex-col justify-center items-center borderw -full gap-5">
          <input
            type="text"
            placeholder="아이디"
            value={admUserId}
            onChange={(e) => setAdmUserId(e.target.value)}
            className="min-w-[332px] border border-gray-400 p-2 rounded-md pl-4"
          />

          <input
            type="password"
            placeholder="비밀번호"
            value={userPw}
            onChange={(e) => setUserPw(e.target.value)}
            className="w-full border border-gray-400 p-2 rounded-md pl-4"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-NauticalBlue py-2 rounded-md text-white"
          >
            로그인
          </button>
          <div className="w-full h-[20px]">
            {error && (
              <p className=" text-red-500 w-[100%]  text-ellipsis overflow-hidden">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
