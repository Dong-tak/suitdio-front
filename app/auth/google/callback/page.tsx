"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function GoogleCallback() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const redirectUri = useMemo(() => {
    if (
      process.env.NEXT_PUBLIC_POST_API_URL == "http://localhost:8000/v1" ||
      process.env.NEXT_PUBLIC_POST_API_URL == "http://127.0.0.1:8000/v1"
    ) {
      return `http://localhost:3000/auth/google/callback/`;
    } else if (
      process.env.NEXT_PUBLIC_POST_API_URL == "https://test.suitdio.com/v1"
    ) {
      return `https://test.suitdio.com/auth/google/callback/`;
    }
    return `https://suitdio.com/auth/google/callback/`;
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const searchParams = new URLSearchParams(window.location.search);
    const codeParam = searchParams.get("code");

    async function processGoogleCallback() {
      if (!codeParam || isProcessing) return;

      try {
        setIsProcessing(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_POST_API_URL}/auth/google/login/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              code: codeParam,
              redirect_uri: redirectUri,
            }),
            credentials: "include",
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (response.status === 200) {
          if (data.message === "login success") {
            router.replace(`/${data.workspace.id}`);
          } else if (data.message === "additional information required") {
            router.push(`/setuserid-social?token=${data.token}`);
          }
        } else if (response.status === 400) {
          if (data.error_code === "SOCIAL_ACCOUNT_NOT_FOUND") {
            router.push(`/error?message=${encodeURIComponent(data.error)}`);
          } else {
            alert(data.error);
            router.push("/login");
          }
        } else {
          alert("알 수 없는 오류가 발생했습니다.");
          router.push("/login");
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Error:", error);
          router.push("/login");
        }
      }
    }

    processGoogleCallback();

    return () => {
      controller.abort();
    };
  }, [router, redirectUri]);

  return <div>구글 로그인 처리 중...</div>;
}
