import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 1. 공용 경로 정의
const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/verify",
  "/setuserid-social",
  "/setuserid",
  "/auth/google/callback",
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 2. 공용 경로에 대한 접근 허용 ㄴ
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  try {
    // 3. 액세스 토큰과 리프레시 토큰 확인
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!accessToken || !refreshToken) {
      console.log("토큰 없어서 안됨");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    let userData;
    let currentAccessToken = accessToken;

    try {
      // 4. 사용자 정보 가져오기
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_POST_API_URL}/auth/users/me/`,
        {
          headers: {
            Authorization: `Bearer ${currentAccessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        userData = await response.json();
      } else {
        const errorData = await response.json();

        // 5. 토큰 만료 시 리프레시 토큰으로 새로운 토큰 발급
        if (
          response.status === 401 &&
          errorData.detail === "Token has expired"
        ) {
          const refreshResponse = await fetch(
            `${process.env.NEXT_PUBLIC_POST_API_URL}/auth/refresh/`,
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!refreshResponse.ok) {
            return NextResponse.redirect(new URL("/login", request.url));
          }

          const { access_token } = await refreshResponse.json();
          currentAccessToken = access_token;

          // 6. 새로운 토큰으로 사용자 정보 가져오기
          const newResponse = await fetch(
            `${process.env.NEXT_PUBLIC_POST_API_URL}/auth/users/me/`,
            {
              headers: {
                Authorization: `Bearer ${currentAccessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!newResponse.ok) {
            return NextResponse.redirect(new URL("/login", request.url));
          }

          userData = await newResponse.json();
        } else {
          return NextResponse.redirect(new URL("/login", request.url));
        }
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // 7. 최종 응답 결정
    let finalResponse;
    if (pathname === "/" && userData.workspaceId) {
      finalResponse = NextResponse.redirect(
        new URL(`/${userData.workspaceId}`, request.url)
      );
    } else {
      finalResponse = NextResponse.next();
    }

    // 8. 토큰 업데이트시 쿠키에 저장
    if (currentAccessToken !== accessToken) {
      finalResponse.cookies.set("accessToken", currentAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
      });
    }

    return finalResponse;
  } catch (error) {
    console.error("미들웨어 에러:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
