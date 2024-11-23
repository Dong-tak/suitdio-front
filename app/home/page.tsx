"use client";

import { Input } from "@/components/ui/input";
import SvgIcon from "@/lib/utils/svgIcon";
import { sixBoltSvg, pauseSvg, recordSvg } from "@/lib/utils/svgBag";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
interface HomeViewProps {
  contentTitle: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveClick: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  open?: boolean; // open prop 추가
  onOpenChange?: (open: boolean) => void; // onOpenChange prop 추가
}

export default function HomeView({
  contentTitle,
  handleInputChange,
  handleSaveClick,
  className,
  open,
  onOpenChange,
}: HomeViewProps) {
  // Ctrl+Enter 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSaveClick();
    }
  };
  return (
    <div className="w-full flex flex-col items-center min-h-screen relative overflow-hidden">
      {/* 헤더 바 */}
      <div className="flex w-full items-center p-2 justify-end bg-background sticky top-0 z-10">
        <div className="p-2">
          <Ellipsis className="w-4 h-4 relative" />
        </div>
      </div>
      {/* 헤더 바 */}

      {/* 메인 컨텐츠 */}
      <div className="flex flex-col items-center justify-center flex-grow space-y-4">
        <div className="text-lg font-bold text-center">
          Focus, Make Better Choices
        </div>
        <div className="flex flex-col h-[106px] w-[560px] border rounded-lg">
          <div className="flex-grow grid w-full items-center gap-1.5">
            <Input
              id="title"
              value={contentTitle}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="w-full border-none"
              placeholder="Enter any focus"
              autoFocus
            />
          </div>
          {/* 푸터 바 */}
          <div className="w-full flex justify-between">
            <div className="flex items-center justify-between space-x-1  h-full pl-4">
              <div className="text-[12px] text-muted-foreground">v 3.26</div>
              <div className="w-[2px] h-[2px] bg-muted-foreground rounded-full" />
              <div className="text-[12px] text-muted-foreground">24.08.17</div>
              <div className="w-[2px] h-[2px] bg-muted-foreground rounded-full" />
              <div className="text-[12px] text-muted-foreground">08:28</div>
            </div>
            <div className="flex items-center">
              <Button size="icon" className=" rounded-none p-2 bg-white">
                <SvgIcon
                  fill="none"
                  width={8}
                  height={9}
                  className="flex items-center justify-center text-black"
                >
                  {sixBoltSvg}
                </SvgIcon>
              </Button>
              <Button size="icon" className=" rounded-none p-2 bg-white">
                <SvgIcon
                  fill="none"
                  width={8}
                  height={9}
                  className="flex items-center justify-center text-black"
                >
                  {pauseSvg}
                </SvgIcon>
              </Button>
              <Button size="icon" className=" rounded-none p-2 bg-white">
                <SvgIcon
                  fill="none"
                  width={8}
                  height={9}
                  className="flex items-center justify-center text-black"
                >
                  {recordSvg}
                </SvgIcon>
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* 메인 컨텐츠 끝 */}

      {/* 푸터 바 */}
      <div className="flex items-center justify-between gap-4 fixed bottom-[32px]">
        <div className="text-slate-400 text-sm font-normal font-['Pretendard'] leading-tight ">
          Price
        </div>
        <div className="text-slate-400 text-sm font-normal font-['Pretendard'] leading-tight">
          Blog
        </div>
        <div className="text-slate-400 text-sm font-normal font-['Pretendard'] leading-tight">
          Report
        </div>
        <div className="text-slate-400 text-sm font-normal font-['Pretendard'] leading-tight">
          Team
        </div>
        <div className="text-slate-400 text-sm font-normal font-['Pretendard'] leading-tight">
          Recruit
        </div>
        <div className="text-slate-400 text-sm font-normal font-['Pretendard'] leading-tight">
          Terms of Service
        </div>
        <div className="text-slate-400 text-sm font-normal font-['Pretendard'] leading-tight">
          Privacy Policy
        </div>
        <div className="text-slate-400 text-sm font-normal font-['Pretendard'] leading-tight">
          Business Info
        </div>
        <div className="flex items-center justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-slate-400"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          <select className="text-slate-400 text-sm font-normal font-['Pretendard'] leading-tight bg-transparent border-none cursor-pointer outline-none">
            <option value="ko">한국어</option>
            <option value="en">English</option>
            <option value="jp">日本語</option>
            <option value="cn">中文</option>
          </select>
        </div>
      </div>
      {/* 푸터 바 */}
    </div>
  );
}
