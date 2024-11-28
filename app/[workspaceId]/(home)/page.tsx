"use client";

import HomeView from "@/components/home/homeview";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  addMiddleWidget,
  addWidget,
  updateWidget,
} from "@/lib/redux/features/whiteboardSlice";
import { createBoard } from "./action";
import { ShellWidgetProps, AllWidgetTypes } from "@/types/type";

export default function Home() {
  const [contentTitle, setContentTitle] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContentTitle(e.target.value);
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

  const onOpenChange = (open: boolean) => {
    setOpen(open);
  };

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

  const handleHeightChange = (height: number) => {
    dispatch(
      updateWidget({
        height,
        type: "shell",
        x: 0,
        y: 0,
        width: 0,
        resizable: false,
        editable: true,
        draggable: false,
        innerWidget: {
          id: "",
          type: "center",
          titleBlock: "",
          width: 0,
          height: height,
          x: 0,
          y: 0,
          draggable: false,
          editable: true,
          resizeable: false,
          headerBar: true,
          footerBar: false,
          text: "",
        },
        from: [],
        to: [],
        id: "",
      })
    );
  };
  return (
    <div>
      <HomeView
        contentTitle={contentTitle}
        handleInputChange={handleInputChange}
        handleSaveClick={handleSaveClick}
        open={open}
        onOpenChange={onOpenChange}
      />
    </div>
  );
}
