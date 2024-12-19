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
  // 시작점과 끝점이 수직 또는 수평으로 정렬되어 있는지 확인
  const isAligned = fromPoint.x === toPoint.x || fromPoint.y === toPoint.y;

  if (isAligned) {
    // 직선으로 연결
    points = [
      fromPoint.x,
      fromPoint.y, // 시작점
      toPoint.x,
      toPoint.y, // 끝점
    ];
  } else if (!isOverlappingX) {
    // 수평 방향일 때
    const centerX = (fromPoint.x + toPoint.x) / 2;
    points = [
      fromPoint.x,
      fromPoint.y, // 시작점
      centerX,
      fromPoint.y, // 첫 번째 꺾임점
      centerX,
      toPoint.y, // 두 번째 꺾임점
      toPoint.x,
      toPoint.y, // 끝점
    ];
  } else {
    // 수직 방향일 때
    const centerY = (fromPoint.y + toPoint.y) / 2;
    points = [
      fromPoint.x,
      fromPoint.y, // 시작점
      fromPoint.x,
      centerY, // 첫 번째 꺾임점
      toPoint.x,
      centerY, // 두 번째 꺾임점
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
  ctx.beginPath();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 3;
  ctx.lineJoin = "round";

  if (points.length < 4) return;

  // 시작점으로 이동
  ctx.moveTo(points[0], points[1]);

  // 곡선 반지름
  const radius = 15;

  // 각 꺾임점을 순회하며 둥근 모서리 그리기
  for (let i = 2; i < points.length - 2; i += 2) {
    const x1 = points[i - 2];
    const y1 = points[i - 1];
    const x2 = points[i];
    const y2 = points[i + 1];
    const x3 = points[i + 2];
    const y3 = points[i + 3];

    // 현재 선분과 다음 선분의 방향이 다를 때만 곡선 처리
    if ((x1 !== x2 || x2 !== x3) && (y1 !== y2 || y2 !== y3)) {
      const r = radius;

      // 곡선의 시작점
      const startX = x2 - Math.sign(x2 - x1) * r;
      const startY = y2 - Math.sign(y2 - y1) * r;

      // 곡선의 끝점
      const endX = x2 + Math.sign(x3 - x2) * r;
      const endY = y2 + Math.sign(y3 - y2) * r;

      ctx.lineTo(startX, startY);
      ctx.quadraticCurveTo(x2, y2, endX, endY);
    } else {
      ctx.lineTo(x2, y2);
    }
  }

  // 마지막 점까지 선 그리기
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
