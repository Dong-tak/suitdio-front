"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CloudDownload, ExternalLink, Menu, Share2 } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { PostFeed } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setGroupedPosts } from "@/redux/features/postsDateSlice";
import { RootState } from "@/redux/store";
import { openSidebar } from "@/redux/features/sidebarSlice";

interface AccordionBtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  asChild?: boolean;
  size?: "sm" | "lg";
  url?: string;
}

function AccordionBtn({
  children,
  onClick,
  className,
  disabled,
  url,
  asChild = false,
}: AccordionBtnProps & { asChild?: boolean }) {
  const Comp = asChild ? Slot : Button;
  const [isShared, setIsShared] = useState(false);
  const handleShare = () => {
    setIsShared(!isShared);
  };
  return (
    <Comp
      variant={isShared ? "outline" : "default"}
      size="sm"
      className={cn("gap-2", className)}
      onClick={handleShare}
    >
      {children}
    </Comp>
  );
}

function LinkBtn({
  children,
  className,
  disabled,
  url,
  asChild = false,
}: AccordionBtnProps & { asChild?: boolean }) {
  const Comp = asChild ? Slot : Button;
  const onClick = () => {
    console.log(url);
  };
  return (
    <Comp
      size="sm"
      variant={"ghost"}
      onClick={onClick}
      className={cn("hidden md:inline-flex", className)}
      disabled={disabled}
    >
      {children}
    </Comp>
  );
}

const groupPostsByDate = (posts: PostFeed[]): Record<string, PostFeed[]> => {
  if (!Array.isArray(posts)) {
    console.error("posts is not an array");
    return {};
  }
  return posts.reduce((acc: Record<string, PostFeed[]>, post: PostFeed) => {
    const dateKey = post.date.split("T")[0]; // Extract date part (YYYY-MM-DD)
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(post);
    return acc;
  }, {});
};

const sortPostsByTime = (groupedPosts: Record<string, PostFeed[]>) => {
  Object.keys(groupedPosts).forEach((date) => {
    groupedPosts[date].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  });
  return groupedPosts;
};

export function OurAccordion({
  posts,
  userId,
}: {
  posts: PostFeed[];
  userId: string;
}) {
  const [isShared, setIsShared] = useState(false);
  const handleShare = () => {
    setIsShared(!isShared);
  };

  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.sidebar.isOpen); // Redux 상태에서 isOpen 값 가져옴

  const groupedPosts = sortPostsByTime(groupPostsByDate(posts));

  const handleSidebarToggle = () => {
    dispatch(openSidebar()); // 사이드바 열기
  };
  const sortedDateKeys = Object.keys(groupedPosts).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  useEffect(() => {
    dispatch(setGroupedPosts(groupedPosts));
  }, [groupedPosts, dispatch]);

  const router = useRouter();

  const handlePostClick = (postId: number) => {
    router.push(`/detail/${userId}/${postId}`);
  };

  return (
    <Accordion
      type="multiple"
      className={`accordion relative w-full ${isOpen ? "accordion-open" : "accordion-closed"}`} // isOpen에 따라 padding 전환
    >
      <Menu
        className={`absolute left-4 top-3 z-50 h-6 w-6 bg-background ${isOpen ? "hidden" : ""}`}
        onClick={handleSidebarToggle}
      />
      {sortedDateKeys.map((dateKey) => (
        <AccordionItem value={dateKey} key={dateKey}>
          <div className="sticky top-12 flex items-center justify-between border-b bg-background p-2 md:top-0">
            <AccordionTrigger>{dateKey.replace(/-/g, ".")}</AccordionTrigger>
          </div>
          <AccordionContent>
            <div className="flex flex-col">
              {groupedPosts[dateKey].map((post) => (
                <div
                  key={post.postId}
                  className="flex gap-4 rounded-md p-2 hover:cursor-pointer hover:bg-card"
                  onClick={() => handlePostClick(post.postId)}
                  id="accordion-content"
                >
                  <Image
                    src={post.thumbnail || "/netflex.jpg"}
                    alt={`${post.media} thumbnail`}
                    width={128}
                    height={128}
                    className="flex-shrink-0 rounded-sm"
                    style={{
                      objectFit: "cover",
                      width: "128px",
                      height: "128px",
                    }}
                  />

                  <div className="flex flex-col items-start gap-2">
                    <div className="flex gap-2">
                      <div className="accordhead others-medium-title">
                        {post.title || "제목 없음"}
                      </div>
                      {/* <SqBadge variant={"secondary"}>NEW</SqBadge> */}
                    </div>
                    <div className="accordbody body-normal-body-long-01">
                      {post.comments.length > 0
                        ? post.comments[0].comment
                        : "이 콘텐츠에 대한 설명이 없습니다."}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
