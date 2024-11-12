"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className="flex h-screen w-full">
      {/* 1100px 이상일 때 */}
      <div className="hidden w-1/2 items-center justify-center bg-white xl:flex">
        {/* 1100px 이상일 때 표시되는 배경 이미지나 다른 요소 */}
        <div className="ml-[100px] flex w-full items-center justify-center bg-white py-2">
          <Image
            src="/images/mileque-image.jpg"
            alt="auth-bg"
            width={600}
            height={600}
          />
        </div>
      </div>

      {/* 1100px 이하일 때 */}
      <div className="relative flex w-full items-center justify-center xl:w-1/2">
        {/* 현재 경로가 로 시작하는 경우에만 버튼을 표시 */}
        <div className="sm:px-4">
          {/* 헤더 */}
          <div
            className="absolute right-0 top-0 flex max-h-[104px] min-h-[56px] w-full items-end justify-between px-8 pt-4"
            style={{ padding: "16px 32px 0px 32px" }}
          >
            {/* 현재 경로가 signup,login 아닌 경우 뒤로가기 버튼을 표시 */}
            {pathname !== "/login" && (
              <div className="flex h-[40px] w-full items-end justify-start">
                <Link href="/login">
                  <Button variant={"ghost"} onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                    뒤로가기
                  </Button>
                </Link>
              </div>
            )}
            {/* 현재 경로가 /auth/login이 아닌 경우 로그인 버튼을 표시 */}
            {/* {pathname !== "/login" && (
              <div className="flex h-[40px] w-full items-end justify-end">
                <Link href="/login">
                  <Button variant={"ghost"}>로그인</Button>
                </Link>
              </div>
            )} */}
          </div>
          {/* 헤더 끝 */}
          {pathname.startsWith("/") && (
            <div className="flex w-full items-center justify-center">
              {/* 자식 컴포넌트를 렌더링 */}
              {children}
            </div>
          )}
          {/* 풋터 */}
          <div
            className="absolute bottom-0 right-0 flex max-h-[104px] min-h-[56px] w-full items-end justify-between px-8 pt-4"
            style={{ padding: "16px 32px 0px 32px" }}
          >
            {/* 빈 박스 */}
          </div>
          {/* 풋터 끝 */}
        </div>
      </div>
    </div>
  );
}
