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
import { deleteBoard, createBoard, initializeWorkspaceData } from "./action";
import { useParams } from "next/navigation";
import CreateBoardDialog from "@/components/home/creatboard";
import { Spinner } from "@/components/ui/spinner";
import { AllWidgetTypes, ShellWidgetProps } from "@/types/type";
import { useDispatch } from "react-redux";
import { addMiddleWidget } from "@/lib/redux/features/whiteboardSlice";
import { useRouter } from "next/navigation";

export default function RecordView() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [data, setData] = useState<{
    workspaceId: string;
    boards: Board[];
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [contentTitle, setContentTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const [open, setOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContentTitle(e.target.value);
  };

  const onOpenChange = (open: boolean) => {
    setOpen(open);
  };

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;
    const initializeData = async (workspaceId: string) => {
      try {
        setIsLoading(true);
        const result = await initializeWorkspaceData(workspaceId);
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
    if (workspaceId) {
      console.log("workspaceId:", workspaceId);
      initializeData(workspaceId);
    } else {
      console.log("workspaceId 없음");
    }
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
      const newBoard = await createBoard(data.workspaceId, contentTitle);
      setContentTitle("");
      setIsDialogOpen(false);
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

  const handleSaveClick = async () => {
    if (contentTitle.trim() && !isLoading) {
      setIsLoading(true);

      try {
        const boardPosition = {
          x: window.innerWidth / 2 - 250,
          y: window.innerHeight / 2 - 250,
        };

        const newBoard = createBoardWithTitle(contentTitle, [], boardPosition);
        dispatch(addMiddleWidget(newBoard));

        const Board = await createBoard(workspaceId, contentTitle);
        console.log("보드가 생성되었습니다:", Board);

        localStorage.setItem("currentBoardId", Board.id);
        router.push(`/${workspaceId}/board/${Board.id}/`);
      } catch (error) {
        console.error("보드 생성 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size={32} />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!data) {
    return <div>데이터를 불러오는데 실패했습니다.</div>;
  }

  interface BoardPosition {
    x: number;
    y: number;
  }

  //중앙 위젯 생성 처리
  const createBoardWithTitle = (
    contentTitle: string,
    widgets: ShellWidgetProps<AllWidgetTypes>[],
    boardPosition: BoardPosition,
    initialHeight: number = 200
  ) => {
    const newBoard: ShellWidgetProps<AllWidgetTypes> = {
      id: `CenterWidget-${Date.now()}`, // 유니크한 ID 생성
      type: "shell",
      x: boardPosition.x,
      y: boardPosition.y,
      width: 750,
      height: initialHeight,
      resizable: true,
      editable: true,
      draggable: false,
      from: [],
      to: [],
      innerWidget: {
        id: `CenterWidget-${Date.now()}`,
        type: "center",
        titleBlock: contentTitle,
        width: 750,
        height: initialHeight,
        x: boardPosition.x,
        y: boardPosition.y,
        draggable: false,
        editable: true,
        resizeable: false,
        headerBar: true,
        footerBar: false,
        text: "",
      },
    };

    return newBoard;
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
          onClick={() => {
            setIsDialogOpen(true);
            setOpen(true);
          }}
          className="hover:bg-gradient-to-b hover:from-gray-300 hover:to-gray-300 bg-gradient-to-b from-[#ffb300] to-[#ff8f00] shadow-lg"
        >
          + Create new
        </Button>
      </div>
      <div className="flex items-center gap-2 px-6 justify-start mt-2">
        <FilterMenu label="최종 수정일" items={["수정일", "생성일", "버전"]} />
        <FilterMenu label="필터" items={["수정일", "생성일", "버전"]} />
      </div>
      <div className="flex flex-1 flex-col gap-4 px-6 mt-4">
        {data.boards.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            생성된 보드가 없습니다. 새 보드를 생성해주세요.
          </div>
        ) : (
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
        )}
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted md:min-h-min" />
      </div>
      <CreateBoardDialog
        contentTitle={contentTitle}
        handleInputChange={handleInputChange}
        handleSaveClick={handleSaveClick}
        handleCreateBoard={handleCreateBoard}
        open={open}
        onOpenChange={onOpenChange}
      />
    </SidebarInset>
  );
}
