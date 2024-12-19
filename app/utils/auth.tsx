export const checkToken = (): boolean => {
  const token = localStorage.getItem("token");
  const expireAt = localStorage.getItem("expireAt");

  if (!token || !expireAt || Date.now() > parseInt(expireAt, 10)) {
    return false; // 토큰이 유효하지 않음
  }

  return true; // 토큰이 유효함
};

export const logout = (router: any) => {
  localStorage.removeItem("token");
  localStorage.removeItem("expireAt");
  router.push("/"); // 로그인 페이지로 리다이렉트
};
