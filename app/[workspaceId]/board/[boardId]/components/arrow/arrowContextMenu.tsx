import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Arrow, ShellWidgetProps, AllWidgetTypes } from "@/types/type";
import { conversionArrow, updateArrow } from "@/redux/features/arrowSlice";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight } from "lucide-react";
import { calculateArrowPoints } from "./drawArrow";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { updateWidget } from "@/redux/features/whiteboardSlice";

interface ArrowContextMenuProps {
  position: { x: number; y: number };
  arrow: Arrow;
  onClose: () => void;
}

export function ArrowContextMenu({
  position,
  arrow,
  onClose,
}: ArrowContextMenuProps) {
  const dispatch = useDispatch();
  const widgets = useSelector((state: RootState) => state.whiteboard.widgets);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".arrow-context-menu")) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleSwapDirection = () => {
    const fromWidget = widgets.find((w) => w.id === arrow.fromId);
    const toWidget = widgets.find((w) => w.id === arrow.toId);

    if (!fromWidget || !toWidget) return;

    // 새로운 화살표 포인트 계산 (방향 반대로)
    const newPoints = calculateArrowPoints(toWidget, fromWidget);

    // 화살표 업데이트 - fromId와 toId만 교환하고 id는 유지
    const updatedArrow = {
      ...arrow,
      fromId: arrow.toId,
      toId: arrow.fromId,
      points: newPoints.points,
      arrowTipX: newPoints.arrowTipX,
      arrowTipY: newPoints.arrowTipY,
    };

    // conversionArrow 액션 디스패치
    dispatch(conversionArrow(updatedArrow));

    // 디버깅을 위한 로그
    console.log("Direction swap:", {
      originalArrow: arrow,
      updatedArrow,
    });

    onClose();
  };

  return (
    <div
      className="arrow-context-menu fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -50%)",
      }}
    >
      <Button
        variant="ghost"
        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
        onClick={handleSwapDirection}
      >
        <ArrowLeftRight className="h-4 w-4" />
        <span>방향 전환</span>
      </Button>
    </div>
  );
}
