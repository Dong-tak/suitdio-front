"use client";

interface PostDataInClientProps {
  apiUrl: string;
  bodyData?: Record<string, any>;
  isReload?: boolean;
  method?: string;
  goHome?: string;
}

export const DataFetchInClient = async ({
  apiUrl,
  bodyData,
  isReload = false,
  goHome,
  method = "POST",
}: PostDataInClientProps) => {
  try {
    const accessCookies = document.cookie.split("accessToken=")[1];
    const refreshCookies = document.cookie.split("refreshToken=")[1];
    const accessToken = accessCookies;
    const refreshToken = refreshCookies;

    const fetchOptions: RequestInit = {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken} ${refreshToken}`,
      },
    };

    // bodyData가 있을 경우에만 body를 추가
    if (bodyData) {
      fetchOptions.body = JSON.stringify(bodyData);
    }

    const response = await fetch(`${apiUrl}`, fetchOptions);

    // 응답 상태 코드 확인
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`${errorText}`);
    }

    // 응답 상태 코드가 204인 경우 본문이 없음
    if (method === "DELETE" || response.status === 204) {
      console.log("No content in response");
      // 페이지 리로드 또는 다른 작업 수행
      if (isReload) {
        window.location.reload();
      } else if (goHome) {
        window.location.href = goHome;
      }
      return null; // 또는 적절한 값을 반환
    } else {
      // 응답 본문이 있는 경우에만 JSON 파싱
      const data = await response.json();
      console.log("Data saved successfully:", data);

      // 페이지 리로드 또는 다른 작업 수행
      if (isReload) {
        window.location.reload();
      } else if (goHome) {
        window.location.href = goHome;
      }

      return data; // 응답 데이터 반환
    }
  } catch (error) {
    console.error(error);
    throw error; // 에러 재발생
  }
};
