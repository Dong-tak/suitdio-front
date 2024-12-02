import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(req, params);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(req, params);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(req, params);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(req, params);
}

async function handleRequest(req: NextRequest, params: { path: string[] }) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!accessToken || !refreshToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let currentAccessToken = accessToken;
    const path = params.path.join("/");

    // 요청 본문을 미리 한 번만 읽어옴
    const requestBody = req.method !== "GET" ? await req.text() : undefined;

    // 첫본 요청의 모든 헤더를 복사
    const forwardHeaders = new Headers(req.headers);
    // Authorization 헤더만 덮어쓰기
    forwardHeaders.set("Authorization", `Bearer ${currentAccessToken}`);

    // 첫 번째 API 요청
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_POST_API_URL}/${path}/`,
      {
        method: req.method,
        headers: forwardHeaders,
        body: requestBody,
      }
    );

    // 토큰 만료 시 갱신
    if (response.status === 401) {
      const errorData = await response.json();

      if (errorData.detail === "Token has expired") {
        console.log("토큰 갱신 시도");
        const refreshResponse = await fetch(
          `${process.env.NEXT_PUBLIC_POST_API_URL}/auth/refresh/`,
          {
            method: "GET", // refresh는 GET 요청
            headers: {
              Authorization: `Bearer ${refreshToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!refreshResponse.ok) {
          return NextResponse.json(
            { error: "Refresh token invalid" },
            { status: 401 }
          );
        }

        const { access_token } = await refreshResponse.json();
        currentAccessToken = access_token;
        console.log("새 토큰 발급됨");

        // 새 토큰으로 원래 요청 재시도
        response = await fetch(
          `${process.env.NEXT_PUBLIC_POST_API_URL}/${path}/`, // URL 끝에 / 추가
          {
            method: req.method,
            headers: forwardHeaders,
            body: requestBody,
          }
        );
      }
    }

    // 204 응답 처리
    if (response.status === 204) {
      return new Response(null, { status: 204 });
    }

    let responseData = null;
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      responseData = await response.json();
    }

    const finalResponse = NextResponse.json(responseData, {
      status: response.status,
    });

    // 토큰이 갱신된 경우 쿠키 업데이트
    if (currentAccessToken !== accessToken) {
      finalResponse.cookies.set("accessToken", currentAccessToken, {
        httpOnly: true,
        secure: false, //process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }

    return finalResponse;
  } catch (error) {
    console.error("API 프록시 에러:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
