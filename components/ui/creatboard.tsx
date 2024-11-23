import { ArrowLeft, Pin, SquarePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import FocusControlBar from "./FocusControlBar";
import SvgIcon from "@/lib/utils/svgIcon";
import { sixBoltSvg, pauseSvg, recordSvg } from "@/lib/utils/svgBag";

interface CreateBoardDialogProps {
  contentTitle: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveClick: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  open?: boolean; // open prop 추가
  onOpenChange?: (open: boolean) => void; // onOpenChange prop 추가
}

export default function CreateBoardDialog({
  contentTitle,
  handleInputChange,
  handleSaveClick,
  className,
  open,
  onOpenChange,
}: CreateBoardDialogProps) {
  // Ctrl+Enter 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSaveClick();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`w-full gap-5 rounded-md bg-popover p-6 ${className} bg-white flex flex-col`}
        style={{ minHeight: "250px" }}
      >
        <DialogHeader>
          <DialogTitle className="w-full pb-2 display-undefine-display-01">
            보드 주제를 입력하세요
          </DialogTitle>
        </DialogHeader>
        <div className="flex-grow grid w-full items-center gap-1.5">
          <Input
            id="title"
            value={contentTitle}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full border-none"
            placeholder="Enter your focus (Ctrl+Enter)"
            autoFocus
          />
        </div>
        {/* 푸터 바 */}
        <div className="footer-bar">
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
      </DialogContent>
    </Dialog>
  );
}
