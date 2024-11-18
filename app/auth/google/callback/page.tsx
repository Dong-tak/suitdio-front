"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GoogleCallback() {
  const router = useRouter();
  let redirectUri = `https://suitdio.com/auth/google/callback/`;
  if (
    process.env.NEXT_PUBLIC_POST_API_URL == "http://localhost:8000/v1" ||
    process.env.NEXT_PUBLIC_POST_API_URL == "http://127.0.0.1:8000/v1"
  ) {
    redirectUri = `http://localhost:3000/auth/google/callback/`;
  } else if (
    process.env.NEXT_PUBLIC_POST_API_URL == "https://test.suitdio.com/v1"
  ) {
    redirectUri = `https://test.suitdio.com/auth/google/callback/`;
  } else {
    redirectUri = `https://suitdio.com/auth/google/callback/`;
  }
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const codeParam = searchParams.get("code");

    if (codeParam) {
      // 백엔드로 인증 코드 전송
      fetch(`${process.env.NEXT_PUBLIC_POST_API_URL}/auth/google/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: codeParam,
          redirect_uri: redirectUri,
        }),
        credentials: "include",
      })
        .then((response) =>
          response.json().then((data) => ({ status: response.status, data })),
        )
        .then(({ status, data }) => {
          if (status === 200) {
            if (data.message === "login success") {
              const userId = data.user.id;
              router.replace(`/home/${userId}`);
            } else if (data.message === "additional information required") {
              router.push(`/setuserid-social?token=${data.token}`);
            }
          } else if (status === 400) {
            if (data.error_code === "SOCIAL_ACCOUNT_NOT_FOUND") {
              // 에러 페이지로 이동
              const errorMessage = encodeURIComponent(data.error);
              router.push(`/error?message=${errorMessage}`);
            } else {
              alert(data.error);
              router.push("/login");
            }
          } else {
            alert("알 수 없는 오류가 발생했습니다.");
            router.push("/login");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          router.push("/login");
        });
    } else {
      router.push("/login");
    }
  }, [router]);

  return <div>구글 로그인 처리 중...</div>;
}
