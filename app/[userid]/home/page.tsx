"use client";

import HomeView from "@/components/home/homeview";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  addMiddleWidget,
  addWidget,
} from "@/lib/redux/features/whiteboardSlice";
import { createBoardWithTitle, createBoard } from "./action";

export default function Home() {
  const [contentTitle, setContentTitle] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContentTitle(e.target.value);
  };

  const handleSaveClick = async () => {
    if (contentTitle.trim()) {
      const boardPosition = {
        x: window.innerWidth / 2 - 250,
        y: window.innerHeight / 2 - 250,
      };

      const newBoard = createBoardWithTitle(contentTitle, [], boardPosition);
      dispatch(addMiddleWidget(newBoard));

      try {
        const createdBoard = await createBoard("0HS78Z813DVX6");
        console.log("보드가 생성되었습니다:", createdBoard);

        localStorage.setItem("currentBoardId", createdBoard.id);
        router.push(`${createdBoard.id}/`);
      } catch (error) {
        console.error("보드 생성 중 오류 발생:", error);
      }
    }
  };

  const onOpenChange = (open: boolean) => {
    setOpen(open);
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
