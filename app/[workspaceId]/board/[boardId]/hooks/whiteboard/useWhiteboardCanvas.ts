import { useCallback, useEffect, RefObject } from 'react';
import { Arrow, SelectArea } from '@/types/type';
import { drawArrow } from '../../components/arrow/drawArrow';

interface UseWhiteboardCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  scale: number;
  offset: { x: number; y: number };
  arrows: Arrow[];
  selectedArrow: Arrow[];
  sectionDraft: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  selectArea: SelectArea | null;
  drawGrid: (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => void;
}

export const useWhiteboardCanvas = ({
  canvasRef,
  scale,
  offset,
  arrows,
  selectedArrow,
  sectionDraft,
  selectArea,
  drawGrid,
}: UseWhiteboardCanvasProps) => {
  const drawArrows = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      arrows.forEach((arrow) => {
        const isSelected = selectedArrow.includes(arrow);
        drawArrow(ctx, arrow, scale, offset);

        if (isSelected) {
          ctx.beginPath();
          ctx.fillStyle = '#00A3FF';
          ctx.arc(arrow.points[0], arrow.points[1], 5 / scale, 0, 2 * Math.PI);
          ctx.arc(arrow.points[8], arrow.points[9], 5 / scale, 0, 2 * Math.PI);
          ctx.fill();
        }
      });
    },
    [arrows, selectedArrow, scale, offset]
  );

  const drawSectionDraft = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!sectionDraft) return;

      ctx.fillStyle = 'rgba(200, 200, 200, 0.2)';
      ctx.strokeStyle = '#00A3FF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.rect(
        sectionDraft.x,
        sectionDraft.y,
        sectionDraft.width,
        sectionDraft.height
      );
      ctx.fill();
      ctx.stroke();
    },
    [sectionDraft]
  );

  const drawSelectionArea = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!selectArea) return;

      ctx.strokeStyle = '#d97706';
      ctx.fillStyle = '#fffbeb50';
      ctx.lineWidth = 1 / scale;
      ctx.beginPath();
      ctx.rect(
        selectArea.startX,
        selectArea.startY,
        selectArea.width,
        selectArea.height
      );
      ctx.fill();
      ctx.stroke();
    },
    [selectArea, scale]
  );

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and setup canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(scale, scale);
    ctx.translate(offset.x, offset.y);

    // Draw all elements
    drawGrid(ctx, canvas.width, canvas.height);
    drawArrows(ctx);
    drawSectionDraft(ctx);
    drawSelectionArea(ctx);

    ctx.restore();
  }, [
    scale,
    offset,
    drawGrid,
    drawArrows,
    drawSectionDraft,
    drawSelectionArea,
  ]);

  // Redraw when scale or offset changes
  useEffect(() => {
    redraw();
  }, [scale, offset, redraw]);

  return { redraw };
};
