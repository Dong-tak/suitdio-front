"use client";

import * as React from "react";

import { SearchForm } from "@/components/sidebar/search-form";
import { VersionSwitcher } from "@/components/sidebar/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import {
  Box,
  Calendar,
  Disc2,
  Home,
  Inbox,
  LayoutGrid,
  Settings,
} from "lucide-react";
import { OnSidebarToggle } from "./onsidebar-toggle";
import { useParams } from "next/navigation";

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      items: [
        {
          title: "Installation",
          url: "#",
        },
        {
          title: "Project Structure",
          url: "#",
        },
      ],
    },
    {
      title: "Building Your Application",
      url: "#",
      items: [
        {
          title: "Routing",
          url: "#",
        },
        {
          title: "Data Fetching",
          url: "#",
          isActive: true,
        },
        {
          title: "Rendering",
          url: "#",
        },
        {
          title: "Caching",
          url: "#",
        },
        {
          title: "Styling",
          url: "#",
        },
        {
          title: "Optimizing",
          url: "#",
        },
        {
          title: "Configuring",
          url: "#",
        },
        {
          title: "Testing",
          url: "#",
        },
        {
          title: "Authentication",
          url: "#",
        },
        {
          title: "Deploying",
          url: "#",
        },
        {
          title: "Upgrading",
          url: "#",
        },
        {
          title: "Examples",
          url: "#",
        },
      ],
    },
    {
      title: "API Reference",
      url: "#",
      items: [
        {
          title: "Components",
          url: "#",
        },
        {
          title: "File Conventions",
          url: "#",
        },
        {
          title: "Functions",
          url: "#",
        },
        {
          title: "next.config.js Options",
          url: "#",
        },
        {
          title: "CLI",
          url: "#",
        },
        {
          title: "Edge Runtime",
          url: "#",
        },
      ],
    },
    {
      title: "Architecture",
      url: "#",
      items: [
        {
          title: "Accessibility",
          url: "#",
        },
        {
          title: "Fast Refresh",
          url: "#",
        },
        {
          title: "Next.js Compiler",
          url: "#",
        },
        {
          title: "Supported Browsers",
          url: "#",
        },
        {
          title: "Turbopack",
          url: "#",
        },
      ],
    },
  ],
};

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: (
      <div className="h-5 p-[3px] bg-gradient-to-b from-[#ffb300] to-[#ff8f00] rounded-md justify-start items-center gap-2.5 inline-flex">
        <Home className="text-white w-3.5 h-3.5 relative" />
      </div>
    ),
  },
  {
    title: "Records",
    url: "#",
    icon: (
      <div className="h-5 p-[3px] bg-gradient-to-b from-[#ffb300] to-[#ff8f00] rounded-md justify-start items-center gap-2.5 inline-flex">
        <Disc2 className="text-white w-3.5 h-3.5 relative" />
      </div>
    ),
  },
  {
    title: "Deck",
    url: "#",
    icon: (
      <div className="h-5 p-[3px] bg-gradient-to-b from-white to-slate-100 rounded-md justify-start items-center gap-2.5 inline-flex">
        <Box className="text-gray-500 w-3.5 h-3.5 relative" />
      </div>
    ),
  },
  {
    title: "Draw",
    url: "#",
    icon: (
      <div className="h-5 p-[3px] bg-gradient-to-b from-white to-slate-100 rounded-md justify-start items-center gap-2.5 inline-flex">
        <LayoutGrid className="text-gray-500 w-3.5 h-3.5 relative" />
      </div>
    ),
  },
  {
    title: "Callender",
    url: "#",
    icon: (
      <div className="h-5 p-[3px] bg-gradient-to-b from-white to-slate-100 rounded-md justify-start items-center gap-2.5 inline-flex">
        <Calendar className="text-gray-500 w-3.5 h-3.5 relative" />
      </div>
    ),
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const params = useParams();

  const workspaceId = params?.workspaceId as string;

  return (
    <Sidebar {...props}>
      <div
        className={`w-full h-11 p-2 flex items-center ${
          props.side === "right" ? "justify-start" : "justify-end"
        }`}
      >
        <Button
          variant="ghost"
          size="icon"
          className={`${props.side === "right" ? "hidden" : ""}`}
        >
          <Settings className="w-4 h-4" />
        </Button>
        <OnSidebarToggle />
      </div>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
        <SearchForm className="border-none" />
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a
                  href={
                    item.title === "Records" && workspaceId
                      ? `/${workspaceId}/record`
                      : item.url
                  }
                >
                  {item.icon}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
