import { useState, useEffect, RefObject } from 'react';

interface UseWhiteboardZoomProps {
  containerRef: RefObject<HTMLDivElement>;
  ZOOM_SPEED: number;
}

export const useWhiteboardZoom = ({
  containerRef,
  ZOOM_SPEED,
}: UseWhiteboardZoomProps) => {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 브라우저 기본 줌 동작 방지
    const preventDefault = (e: WheelEvent) => {
      e.preventDefault();
    };

    container.addEventListener('wheel', preventDefault, { passive: false });

    return () => {
      container.removeEventListener('wheel', preventDefault);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isZooming) {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();

        if (!isZooming) {
          setIsZooming(true);
          setMousePosition({ x: e.clientX, y: e.clientY });
        }

        const delta = e.deltaY;
        const zoomFactor = Math.exp(-delta * ZOOM_SPEED);
        const newScale = Math.min(Math.max(scale * zoomFactor, 0.1), 5);

        if (mousePosition) {
          const rect = containerRef.current?.getBoundingClientRect();
          if (!rect) return;

          const pointX = (mousePosition.x - rect.left) / scale;
          const pointY = (mousePosition.y - rect.top) / scale;

          setScale(newScale);
          setOffset({
            x: offset.x + (pointX * (scale - newScale)) / newScale,
            y: offset.y + (pointY * (scale - newScale)) / newScale,
          });
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Meta' || e.key === 'Control') {
        setIsZooming(false);
        setMousePosition(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [scale, offset, isZooming, mousePosition, ZOOM_SPEED]);

  return {
    scale,
    setScale,
    offset,
    setOffset,
    isZooming,
  };
};
