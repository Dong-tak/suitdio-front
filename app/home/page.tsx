"use client";

import HomeView from "@/components/home/homeview";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addWidget } from "@/lib/redux/features/whiteboardSlice";
import { createBoardWithTitle } from "./action";

export default function Home() {
  const [contentTitle, setContentTitle] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContentTitle(e.target.value);
  };

  const handleSaveClick = () => {
    if (contentTitle.trim()) {
      const boardPosition = {
        x: window.innerWidth / 2 - 250,
        y: window.innerHeight / 2 - 250,
      };

      const newBoard = createBoardWithTitle(contentTitle, [], boardPosition);

      dispatch(addWidget(newBoard));

      localStorage.setItem("currentBoardId", "1");
      router.push("1/1");
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
