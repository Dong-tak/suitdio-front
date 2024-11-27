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
import { Board } from "./action";
import {
  fetchWorkspace,
  fetchBoards,
  deleteBoard,
  createBoard,
  initializeWorkspaceData,
} from "./action";

export default function RecordView() {
  const [data, setData] = useState<{
    workspaceId: string;
    boards: Board[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;

    const initializeData = async () => {
      try {
        setIsLoading(true);
        const result = await initializeWorkspaceData();
        if (mounted && !controller.signal.aborted) {
          setData(result);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted && !controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    initializeData();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  const handleDeleteBoard = async (boardId: string) => {
    try {
      await deleteBoard(boardId);
      setData((prev) =>
        prev
          ? {
              ...prev,
              boards: prev.boards.filter((board) => board.id !== boardId),
            }
          : null
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateBoard = async () => {
    if (!data?.workspaceId) return;

    try {
      const newBoard = await createBoard(data.workspaceId);
      setData((prev) =>
        prev
          ? {
              ...prev,
              boards: [...prev.boards, newBoard],
            }
          : null
      );
    } catch (error) {
      console.error("보드 생성 중 오류 발생:", error);
    }
  };

  if (isLoading || !data) {
    return <div>로딩 중...</div>;
  }

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
          onClick={handleCreateBoard}
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
          {data.boards.map((board) => (
            <RecordCard
              key={board.id}
              cardId={board.id}
              workspaceId={data.workspaceId}
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
