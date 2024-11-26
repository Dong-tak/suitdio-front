import { Circle, Play, Settings, Trash } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useParams, useRouter } from "next/navigation";

interface RecordCardProps {
  cardId: string;
  workspaceId: string; // 추가
  cardTitle: string;
  cardConclusion: string;
  onDelete: (id: string) => void;
}

export default function RecordCard({
  cardId,
  cardTitle,
  cardConclusion,
  onDelete,
}: RecordCardProps) {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.workspaceId;

  const handleCardClick = (e: React.MouseEvent) => {
    // 버튼들이 있는 액션 영역 클릭 시 라우팅 방지
    const actionArea = (e.target as HTMLElement).closest(".card-actions");
    if (actionArea) {
      e.stopPropagation();
      return;
    }
    router.push(`/${workspaceId}/${cardId}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 중지
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative group aspect-square rounded-xl w-full bg-muted h-full flex px-4 py-2 overflow-hidden hover:cursor-pointer"
    >
      <div className="flex flex-col gap-2 w-full group-hover:opacity-10">
        <div className="text-3xl font-bold w-full h-full flex items-start justify-center">
          {cardTitle}
        </div>
        <div className="text-md text-black w-full h-full flex items-center justify-center">
          {cardConclusion}
        </div>
      </div>
      <div className="card-actions absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden group-hover:block">
        <div className="flex space-x-4 items-center">
          <Button
            size="icon"
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-black hover:bg-slate-300 rounded-full shadow-lg w-6 h-6"
          >
            <Circle className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-black hover:bg-slate-300 rounded-full shadow-lg w-11 h-11"
          >
            <Play className="w-6 h-6" />
          </Button>
          <Button
            size="icon"
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-black hover:bg-slate-300 rounded-full shadow-lg w-6 h-6"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="icon"
                onClick={handleDeleteClick}
                className="bg-white text-black hover:bg-slate-300 rounded-full shadow-lg w-6 h-6"
              >
                <Trash className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent onClick={(e) => e.stopPropagation()}>
              <DialogHeader>
                <DialogTitle>정말로 삭제하시겠습니까?</DialogTitle>
                <DialogDescription>
                  이 작업은 되돌릴 수 없습니다.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(cardId);
                  }}
                >
                  예
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
