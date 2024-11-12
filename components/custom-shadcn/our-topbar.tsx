"use client";

import { Bell, Settings } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

import { MilequeSmallLogo } from "@/public/svgBag";
import { NavButton } from "./navigation-btn";
import { SidebarDropdownBtn } from "./sidebar-dropdown";
import { RoutePage } from "../route-setting";
import { OurOption } from "../setting/our-option";

export function OurTopBar(user_id: { user_id: string }) {
  const router = useRouter();
  const navToSetting = () => {
    router.push("/setting");
  };

  return (
    <div className="top-bar fixed top-0 z-50 flex w-full justify-between border-b bg-background">
      <div className="flex">
        <NavButton
          onClick={RoutePage(`/home/${user_id.user_id}`)}
          className="p-3 hover:bg-background hover:text-current hover:opacity-100 focus:outline-none"
        >
          <MilequeSmallLogo />
        </NavButton>
        <SidebarDropdownBtn pos={"top"} />
      </div>
      <div className="flex">
        <NavButton className="relative">
          <Bell className="size-6" />
          <div className="absolute right-[14px] top-[10px] flex h-2 w-2 items-center justify-center rounded-full bg-destructive" />
        </NavButton>
        <OurOption
          button={
            <NavButton>
              <Settings className="size-6" />
            </NavButton>
          }
          user_id={user_id.user_id}
        />
      </div>
    </div>
  );
}
