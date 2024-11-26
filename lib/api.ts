import axios from "axios";

const api = axios.create({
  baseURL: "/api/proxy",
});

// 응답 인터셉터 설정
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 클라이언트에서 로그인 페이지로 리다이렉트
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
