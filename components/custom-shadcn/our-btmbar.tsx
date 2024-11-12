"use client";

import {
  ArrowLeft,
  Calendar,
  Compass,
  Ghost,
  HeartHandshake,
  Pin,
  SquarePlus,
} from "lucide-react";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { DataFetchInClient } from "@/app/api/postdata-client";
import { RoutePage } from "../route-setting";
import { NavButton } from "./navigation-btn";
import { OurOption } from "../setting/our-option";
import ScrapDialog from "../sidebar/scrap";

export function OurBtmBar({ user_id }: { user_id: string }) {
  const pathname = usePathname();
  const [contentUrl, setContentUrl] = useState("");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContentUrl(e.target.value);
  };

  const handleSaveClick = async () => {
    const apiUrl = `${process.env.NEXT_PUBLIC_POST_API_URL}/feed/${user_id}/create/`;
    const bodyData = [
      {
        content_url: contentUrl,
        comment: "Comment를 입력하세요.",
      },
    ];
    const data = await DataFetchInClient({ apiUrl, bodyData, isReload: true });
  };

  return (
    <div className="btm-bar fixed bottom-0 z-50 flex w-full border-t bg-background">
      <NavButton
        onClick={RoutePage(`/home/${user_id}`)}
        isActive={pathname === "/"}
      >
        <Calendar className="size-6" />
      </NavButton>
      <NavButton onClick={RoutePage(`/home/${user_id}`)} disabled>
        <Compass className="size-6" />
      </NavButton>
      <ScrapDialog
        user_id={user_id}
        contentUrl={contentUrl}
        handleInputChange={handleInputChange}
        handleSaveClick={handleSaveClick}
        className="h-[340px]"
      />
      <NavButton
        onClick={RoutePage(`/home/${user_id}`)}
        isActive={pathname === "/group"}
        disabled
      >
        <HeartHandshake className="size-6" />
      </NavButton>
    </div>
  );
}
