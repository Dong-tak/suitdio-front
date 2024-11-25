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
} from "./action";

export default function RecordView() {
  const [workspaceId, setWorkspaceId] = useState<string>("");
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    const initWorkspace = async () => {
      try {
        const id = await fetchWorkspace();
        setWorkspaceId(id);
      } catch (error) {
        console.error(error);
      }
    };

    initWorkspace();
  }, []);

  useEffect(() => {
    const loadBoards = async () => {
      if (!workspaceId) return;

      try {
        const boardsData = await fetchBoards(workspaceId);
        setBoards(boardsData);
      } catch (error) {
        console.error(error);
      }
    };

    loadBoards();
  }, [workspaceId]);

  const handleDeleteBoard = async (boardId: string) => {
    try {
      await deleteBoard(boardId);
      setBoards(boards.filter((board) => board.id !== boardId));
    } catch (error) {
      console.error(error);
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
              const newBoard = await createBoard("0HS78Z813DVX6");
              setBoards([...boards, newBoard]);
              console.log("보드가 생성되었습니다:", newBoard);
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
