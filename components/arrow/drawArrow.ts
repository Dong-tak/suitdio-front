import { AllWidgetTypes, Arrow, ShellWidgetProps } from "@/types/type";

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

  // 두 도형의 x축 겹침 여부 확인
  const fromRight = fromWidget.x + fromWidget.width;
  const toLeft = toWidget.x;
  const isOverlappingX = !(
    fromRight < toLeft || fromWidget.x > toWidget.x + toWidget.width
  );

  if (!isOverlappingX) {
    // x축 겹치지 않을 때는 기존 로직대로
    if (dx > 0) {
      fromPoint = fromCenters[3]; // 출발 도형의 우측
      toPoint = toCenters[2]; // 도착 도형의 좌측
    } else {
      fromPoint = fromCenters[2]; // 출발 도형의 좌측
      toPoint = toCenters[3]; // 도착 도형의 우측
    }
  } else {
    // x축이 겹칠 때는 수직 방향으로
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
  const midY = (fromPoint.y + toPoint.y) / 2;

  // 수직 진입을 위한 오프셋 계산
  const verticalOffset =
    Math.abs(dx) > Math.abs(dy)
      ? Math.abs(toPoint.x - fromPoint.x) / 2
      : Math.abs(toPoint.y - fromPoint.y) / 2;

  let points;

  if (Math.abs(dx) > Math.abs(dy)) {
    // 수평 방향
    points = [
      fromPoint.x,
      fromPoint.y, // 시작점
      fromPoint.x + (dx > 0 ? verticalOffset : -verticalOffset),
      fromPoint.y, // 첫 번째 꺾임점
      midX,
      fromPoint.y, // 중간 수평점
      midX,
      toPoint.y, // 중간 수직점
      toPoint.x + (dx > 0 ? -verticalOffset : verticalOffset),
      toPoint.y, // 마지막 꺾임점
      toPoint.x,
      toPoint.y, // 끝점
    ];
  } else {
    // 수직 방향
    points = [
      fromPoint.x,
      fromPoint.y, // 시작점
      fromPoint.x,
      fromPoint.y + (dy > 0 ? verticalOffset : -verticalOffset), // 첫 번째 꺾임점
      fromPoint.x,
      midY, // 중간 수직점
      toPoint.x,
      midY, // 중간 수평점
      toPoint.x,
      toPoint.y + (dy > 0 ? -verticalOffset : verticalOffset), // 마지막 꺾임점
      toPoint.x,
      toPoint.y, // 끝점
    ];
  }

  return {
    points,
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
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2; // scale에 따라 선 굵기 조정
  ctx.lineJoin = "round";

  // 시작점
  ctx.moveTo(points[0], points[1]);

  // 각 꺾임 점을 순회하며 곡선 그리기
  for (let i = 0; i < points.length - 2; i += 2) {
    const x2a = points[i];
    const y2a = points[i + 1];

    if (i === 0) {
      ctx.moveTo(x2a, y2a);
      continue;
    }

    const radius = 15;
    ctx.font = "12px Arial";
    ctx.textAlign = "left";

    // arcTo 설명을 위한 디버깅 표시
    if (points.length >= 8) {
      // 최소 4개의 점이 필요
      const x2b = points[i + 2];
      const y2b = points[i + 3];

      // 포인트 표시
      // // 첫 번째 점 (빨간색)
      // ctx.fillStyle = "red";
      // ctx.beginPath();
      // ctx.arc(x2a, y2a, 3, 0, Math.PI * 2);
      // ctx.fill();
      // ctx.fillText("첫 번째 선분 제어점", x2a + 10, y2a - 10);

      // // 두 번째 점 (파란색)
      // ctx.fillStyle = "blue";
      // ctx.beginPath();
      // ctx.arc(x2b, y2b, 3, 0, Math.PI * 2);
      // ctx.fill();
      // ctx.fillText("두 번째 선분 제어점", x2b + 10, y2b + 20);

      // // 두 선분을 점선으로 표시 (arcTo의 제어선)
      // ctx.setLineDash([5, 5]);
      // ctx.strokeStyle = "gray";
      // ctx.beginPath();
      // ctx.moveTo(points[i - 2], points[i - 1]); // 이전 점
      // ctx.lineTo(x2a, y2a); // 첫 번째 제어점
      // ctx.lineTo(x2b, y2b); // 두 번째 제어점
      // ctx.stroke();

      // // radius 원호 표시
      // ctx.strokeStyle = "purple";
      // ctx.beginPath();
      // ctx.arc(x2a, y2a, radius, 0, Math.PI * 2);
      // ctx.stroke();

      // 실제 선 그리기
      ctx.setLineDash([]); // 점선 제거
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.moveTo(points[i - 2], points[i - 1]);
      ctx.arcTo(x2a, y2a, x2b, y2b, radius);
      ctx.lineTo(x2b, y2b);
      ctx.stroke();
    }
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
  ctx.fillStyle = "#000000";
  ctx.fill();

  ctx.restore();
};
