import { ArrowWidget } from '@/types/type';
import { useEffect } from 'react';

export default function WidgetArrow({ x, y, ...props }: ArrowWidget) {
  useEffect(() => {
    const canvas = document.getElementById('arrowCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x + 10, y);
      ctx.lineTo(x + 10, y + 180);
      ctx.lineTo(x, y + 180);
      ctx.lineTo(x + 10, y + 200);
      ctx.lineTo(x + 20, y + 180);
      ctx.lineTo(x + 10, y + 180);
      ctx.strokeStyle = '#666666';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [x, y]);

  return <canvas id='arrowCanvas' width='40' height='220' />;
}
