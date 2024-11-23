import { AllWidgetTypes, Arrow, ShellWidgetProps } from '@/types/type';

export const calculateArrowPoints = (
  fromWidget: ShellWidgetProps<AllWidgetTypes>,
  toWidget: ShellWidgetProps<AllWidgetTypes>
) => {
  // 출발 도형과 도착 도형의 중심점 계산
  const fromCenter = {
    x: fromWidget.x + fromWidget.width / 2,
    y: fromWidget.y + fromWidget.height / 2,
  };

  const toCenter = {
    x: toWidget.x + toWidget.width / 2,
    y: toWidget.y + toWidget.height / 2,
  };

  // x축과 y축의 차이 계산
  const dx = toCenter.x - fromCenter.x;
  const dy = toCenter.y - fromCenter.y;

  // 각 도형의 면 중심점 계산
  const fromCenters = [
    { x: fromCenter.x, y: fromWidget.y }, // 상단 중앙
    { x: fromCenter.x, y: fromWidget.y + fromWidget.height }, // 하단 중앙
    { x: fromWidget.x, y: fromCenter.y }, // 좌측 중앙
    { x: fromWidget.x + fromWidget.width, y: fromCenter.y }, // 우측 중앙
  ];

  const toCenters = [
    { x: toCenter.x, y: toWidget.y }, // 상단 중앙
    { x: toCenter.x, y: toWidget.y + toWidget.height }, // 하단 중앙
    { x: toWidget.x, y: toCenter.y }, // 좌측 중앙
    { x: toWidget.x + toWidget.width, y: toCenter.y }, // 우측 중앙
  ];

  let fromPoint, toPoint;

  // 방향에 따라 시작점과 끝점 결정
  if (Math.abs(dx) > Math.abs(dy)) {
    // 수평 방향
    if (dx > 0) {
      fromPoint = fromCenters[3]; // 출발 도형의 우측
      toPoint = toCenters[2]; // 도착 도형의 좌측
    } else {
      fromPoint = fromCenters[2]; // 출발 도형의 좌측
      toPoint = toCenters[3]; // 도착 도형의 우측
    }
  } else {
    // 수직 방향
    if (dy > 0) {
      fromPoint = fromCenters[1]; // 출발 도형의 하단
      toPoint = toCenters[0]; // 도착 도형의 상단
    } else {
      fromPoint = fromCenters[0]; // 출발 도형의 상단
      toPoint = toCenters[1]; // 도착 도형의 하단
    }
  }

  // 중간 지점 계산
  const midX = (fromPoint.x + toPoint.x) / 2;

  // 수직 진입을 위한 오프셋 계산
  const verticalOffset = 30; // 수직 진입 거리

  let startControlX, startControlY, endControlX, endControlY;

  if (Math.abs(dx) > Math.abs(dy)) {
    // 수평 방향
    startControlX = fromPoint.x + (dx > 0 ? verticalOffset : -verticalOffset);
    startControlY = fromPoint.y;
    endControlX = toPoint.x + (dx > 0 ? -verticalOffset : verticalOffset);
    endControlY = toPoint.y;
  } else {
    // 수직 방향
    startControlX = fromPoint.x;
    startControlY = fromPoint.y + (dy > 0 ? verticalOffset : -verticalOffset);
    endControlX = toPoint.x;
    endControlY = toPoint.y + (dy > 0 ? -verticalOffset : verticalOffset);
  }

  return {
    points: [
      fromPoint.x,
      fromPoint.y, // 시작점
      startControlX,
      startControlY, // 시작 제어점
      midX,
      startControlY, // 중간점 1
      midX,
      endControlY, // 중간점 2
      endControlX,
      endControlY, // 끝 제어점
      toPoint.x,
      toPoint.y, // 끝점
    ],
    arrowTipX: toPoint.x,
    arrowTipY: toPoint.y,
  };
};

export const drawArrow = (
  ctx: CanvasRenderingContext2D,
  arrow: Arrow,
  scale: number,
  offset: { x: number; y: number }
) => {
  const { points } = arrow;

  ctx.save();
  //   ctx.scale(scale, scale);
  //   ctx.translate(offset.x, offset.y);

  // 화살표 선 그리기
  ctx.beginPath();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2; // scale에 따라 선 굵기 조정
  ctx.lineJoin = 'round';

  // 시작점
  ctx.moveTo(points[0], points[1]);

  // 각 꺾임 점을 순회하며 곡선 그리기
  for (let i = 2; i < points.length - 2; i += 6) {
    const x2a = points[i];
    const y2a = points[i + 1];
    const x2 = points[i + 2];
    const y2 = points[i + 3];
    const x2b = points[i + 4];
    const y2b = points[i + 5];

    ctx.lineTo(x2a, y2a);

    // 꺾임 부분 곡선 처리
    // const radius = 15 / scale; // scale에 따라 곡률 반지름 조정
    // ctx.arcTo(x2, y2, x2b, y2b, radius);
  }

  // 마지막 선분
  ctx.lineTo(points[points.length - 2], points[points.length - 1]);
  ctx.stroke();

  // 화살표 헤드 그리기
  const endX = arrow.arrowTipX;
  const endY = arrow.arrowTipY;
  const angle = Math.atan2(
    endY - points[points.length - 3],
    endX - points[points.length - 4]
  );

  const headLength = 15; // scale에 따라 화살표 헤드 크기 조정
  const headAngle = Math.PI / 6;

  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - headLength * Math.cos(angle - headAngle),
    endY - headLength * Math.sin(angle - headAngle)
  );
  ctx.lineTo(
    endX - headLength * Math.cos(angle + headAngle),
    endY - headLength * Math.sin(angle + headAngle)
  );
  ctx.closePath();
  ctx.fillStyle = '#000000';
  ctx.fill();

  ctx.restore();
};
