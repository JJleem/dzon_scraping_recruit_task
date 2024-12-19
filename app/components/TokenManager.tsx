"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearAuth } from "@/store/authSlice";
import { useRouter } from "next/navigation";

export default function TokenManager() {
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  // 남은 시간 업데이트 함수
  const updateRemainingTime = () => {
    const expireAt = localStorage.getItem("expireAt");
    if (expireAt) {
      const remaining = parseInt(expireAt, 10) - Date.now();
      setRemainingTime(remaining > 0 ? remaining : 0); // 만료된 경우 0으로 설정
    } else {
      setRemainingTime(null); // 토큰이 없으면 null
    }
  };

  // 유효시간 변경 함수
  const changeExpireTime = (deltaDuration: number) => {
    const expireAt = localStorage.getItem("expireAt");
    let newExpireAt: number;

    if (expireAt) {
      const currentExpireAt = parseInt(expireAt, 10); // 기존 만료 시간 가져오기
      newExpireAt = currentExpireAt + deltaDuration; // 시간 변경

      if (newExpireAt <= Date.now()) {
        // 만료 시간이 현재 시간보다 작아지면 초기화
        newExpireAt = Date.now();
        handleLogout(); // 만료 처리 및 로그아웃
      }
    } else {
      // 만료 시간이 없으면 현재 시간부터 설정 (deltaDuration 적용)
      newExpireAt = Date.now() + deltaDuration;
      if (newExpireAt <= Date.now()) {
        // 만료 시간이 0 이하인 경우
        newExpireAt = Date.now();
        handleLogout(); // 만료 처리 및 로그아웃
      }
    }

    localStorage.setItem("expireAt", newExpireAt.toString());
    updateRemainingTime(); // UI 업데이트
  };

  // 로그아웃 처리
  const handleLogout = () => {
    dispatch(clearAuth()); // Redux 상태 및 localStorage 초기화
    router.push("/"); // 로그인 페이지로 리다이렉트
  };

  // 남은 시간이 0이 되었을 때 로그아웃 처리
  useEffect(() => {
    if (remainingTime === 0) {
      handleLogout();
    }
  }, [remainingTime]);

  // 실시간으로 남은 시간을 업데이트
  useEffect(() => {
    updateRemainingTime(); // 초기화
    const interval = setInterval(updateRemainingTime, 1000); // 1초마다 업데이트

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 클리어
  }, []);

  // 토큰이 없을 때 리다이렉트 처리
  // useEffect(() => {
  //   if (remainingTime === null) {
  //     handleLogout(); // 즉시 로그아웃 처리
  //   }
  // }, [remainingTime]);

  // 남은 시간을 사람이 읽을 수 있는 포맷으로 변환
  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000) % 60;
    const minutes = Math.floor(milliseconds / 1000 / 60) % 60;
    const hours = Math.floor(milliseconds / 1000 / 60 / 60);
    return `${hours}시간 ${minutes}분 ${seconds}초`;
  };

  // 즉시 완료 로직
  const handleImmediateExpire = () => {
    localStorage.setItem("expireAt", "0"); // 유효시간을 0으로 설정
    handleLogout(); // 바로 로그아웃
  };

  return (
    <div className=" flex flex-col justify-center items-end text-sm text-gray-500 mt-3 gap-4">
      {remainingTime !== null ? (
        <>
          <h1>유효시간 관리</h1>
          <p>
            남은 유효시간:{" "}
            {remainingTime > 0 ? formatTime(remainingTime) : "만료됨"}
          </p>
          <div className="flex gap-3">
            <button
              className="bg-white p-2 rounded-lg border border-gray-300"
              onClick={() => changeExpireTime(-1 * 60 * 1000)}
            >
              -1분
            </button>
            <button
              className="bg-white p-2 rounded-lg border border-gray-300"
              onClick={() => changeExpireTime(-10 * 60 * 1000)}
            >
              -10분
            </button>
            <button
              className="bg-white p-2 rounded-lg border border-gray-300"
              onClick={() => changeExpireTime(-60 * 60 * 1000)}
            >
              -1시간
            </button>
            <button
              className="bg-white p-2 rounded-lg border border-gray-300"
              onClick={() => changeExpireTime(10 * 60 * 1000)}
            >
              +10분
            </button>
            <button
              className="bg-white p-2 rounded-lg border border-gray-300"
              onClick={() => changeExpireTime(60 * 60 * 1000)}
            >
              +1시간
            </button>
            <button
              className="bg-white p-2 rounded-lg border border-gray-300"
              onClick={handleImmediateExpire}
            >
              즉시 만료
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
