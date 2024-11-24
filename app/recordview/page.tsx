"use client";

import FilterMenu from "@/components/record/filter-menu";
import RecordCard from "@/components/record/record-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ArrowLeft, ArrowRight, Ellipsis, Search } from "lucide-react";
import { useEffect, useState } from "react";

// 타입 정의
interface Board {
  id: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  workspaceId: string;
  data: {
    focus: string;
  };
}

export default function RecordView() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [workspaceId, setWorkspaceId] = useState<string>("");

  // workspace 정보 가져오기
  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}record/workspace/0HS78Z813DVX6/boards/`
        );

        if (!response.ok)
          throw new Error("워크스페이스 정보를 가져오는데 실패했습니다");
        const { boards } = await response.json();
        setWorkspaceId(boards[0].workspaceId);
      } catch (error) {
        console.error("워크스페이스 정보 로딩 중 오류:", error);
      }
    };

    fetchWorkspace();
  }, []);

  // boards 가져오기
  useEffect(() => {
    const fetchBoards = async () => {
      if (!workspaceId) return; // workspaceId가 없으면 요청하지 않음

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}record/workspace/${workspaceId}/boards/`
        );

        if (!response.ok)
          throw new Error("보드 데이터를 가져오는데 실패했습니다");
        const { boards } = await response.json();
        setBoards(boards);
      } catch (error) {
        console.error("보드 데이터 로딩 중 오류:", error);
      }
    };

    fetchBoards();
  }, [workspaceId]);

  const handleDeleteBoard = async (boardId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}record/board/${boardId}/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("보드 삭제에 실패했습니다");
      }

      // 삭제 성공 시 로컬 상태 업데이트
      setBoards(boards.filter((board) => board.id !== boardId));
    } catch (error) {
      console.error("보드 삭제 중 오류 발생:", error);
    }
  };

  return (
    <SidebarInset>
      <header className="flex h-11 shrink-0 items-center justify-between px-2">
        <div className="gap-2 flex items-center">
          <div className="flex items-center gap-1">
            <SidebarTrigger className="-ml-1" />
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-slate-200 w-7 h-7"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-slate-200 w-7 h-7"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <Separator orientation="vertical" className="mr-2 h-4 " />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-slate-200 w-7 h-7"
        >
          <Ellipsis className="w-4 h-4" />
        </Button>
      </header>
      <div className="flex items-center gap-2 px-6 w-full ">
        <Search className="w-4 h-4 absolute left-10 text-muted-foreground " />
        <Input
          type="text"
          placeholder="Search"
          className="w-full pl-10 bg-slate-100 border-none"
        />
        <Button
          onClick={async () => {
            try {
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}record/board/create/0HS78Z813DVX6/`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    data: {
                      focus: "new board",
                    },
                  }),
                }
              );

              if (!response.ok) {
                throw new Error("보드 생성에 실패했습니다");
              }

              const data = await response.json();
              setBoards([...boards, data]); // 새로운 보드를 boards 배열에 추가
              console.log("보드가 생성되었습니다:", data);
            } catch (error) {
              console.error("보드 생성 중 오류 발생:", error);
            }
          }}
          className="hover:bg-orange-300 bg-orange-500"
        >
          보드 생성
        </Button>
      </div>
      <div className="flex items-center gap-2 px-6 justify-start mt-2">
        <FilterMenu label="최종 수정일" items={["수정일", "생성일", "버전"]} />
        <FilterMenu label="필터" items={["수정일", "생성일", "버전"]} />
      </div>
      <div className="flex flex-1 flex-col gap-4 px-6 mt-4">
        <div className="grid gap-4 grid-cols-auto-fit">
          {boards.map((board) => (
            <RecordCard
              key={board.id}
              cardId={board.id}
              cardTitle={board.data.focus}
              cardConclusion={`최종 수정: ${new Date(
                board.updatedAt
              ).toLocaleDateString("ko-KR")}`}
              onDelete={handleDeleteBoard}
            />
          ))}
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted md:min-h-min" />
      </div>
    </SidebarInset>
  );
}
