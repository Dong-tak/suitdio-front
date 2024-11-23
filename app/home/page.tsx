"use client";

import HomeView from "@/components/home/homeview";
import { useState } from "react";

export default function Home() {
  const [contentTitle, setContentTitle] = useState("");
  const [open, setOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContentTitle(e.target.value);
  };

  const handleSaveClick = () => {
    setOpen(true);
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
