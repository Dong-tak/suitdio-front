import { useCallback } from 'react';

interface UseWhiteboardGridProps {
  scale: number;
  offset: { x: number; y: number };
  baseSpacing: number;
  basePointSize: number;
}

export const useWhiteboardGrid = ({
  scale,
  offset,
  baseSpacing,
  basePointSize,
}: UseWhiteboardGridProps) => {
  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      canvasWidth: number,
      canvasHeight: number
    ) => {
      ctx.save();

      // 줌 레벨에 따른 그리드 간격과 점 크기 조정
      const spacing = scale < 0.3 ? 60 : 48;

      ctx.strokeStyle = '#DBDBDB';
      ctx.lineWidth = basePointSize;

      // 화면에 보이는 영역의 좌표 계산
      const visibleStartX = -offset.x;
      const visibleEndX = canvasWidth / scale - offset.x;
      const visibleStartY = -offset.y;
      const visibleEndY = canvasHeight / scale - offset.y;

      // 그리드 시작점을 간격에 맞춰 조정
      const startX = Math.floor(visibleStartX / spacing) * spacing;
      const startY = Math.floor(visibleStartY / spacing) * spacing;

      // 화면에 보이는 영역만 그리드 그리기
      for (let x = startX; x < visibleEndX; x += spacing) {
        for (let y = startY; y < visibleEndY; y += spacing) {
          ctx.beginPath();
          ctx.arc(x, y, basePointSize * 0.25, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }
      ctx.restore();
    },
    [scale, offset, baseSpacing, basePointSize]
  );

  return { drawGrid };
};
