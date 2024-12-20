import { AllWidgetTypes, Arrow, ShellWidgetProps } from "@/types/type";

const offset = 8; // 위젯으로부터의 거리를 5px로 설정
const baseRadius = 15; // 곡선 반지름 기본값(최대값)
const headLength = 15; // 화살표 헤드 길이
const headAngle = Math.PI / 6; // 화살표 헤드 각도
const headOffset = -3; // 화살표 헤드를 선 끝에서 얼마나 떨어뜨릴지 설정

const arrowcontect = {
  left: 4,
  right: 4,
  top: 4,
  bottom: 4,
};

export const calculateArrowPoints = (
  fromWidget: ShellWidgetProps<AllWidgetTypes>,
  toWidget: ShellWidgetProps<AllWidgetTypes>
) => {
  const fromCenter = {
    x: fromWidget.x + fromWidget.width / 2,
    y: fromWidget.y + fromWidget.height / 2,
  };

  const toCenter = {
    x: toWidget.x + toWidget.width / 2,
    y: toWidget.y + toWidget.height / 2,
  };

  const dx = toCenter.x - fromCenter.x;
  const dy = toCenter.y - fromCenter.y;

  const fromCenters = [
    { x: fromCenter.x + arrowcontect.top, y: fromWidget.y }, // 상단 중앙
    {
      x: fromCenter.x + arrowcontect.bottom,
      y: fromWidget.y + fromWidget.height + offset,
    }, // 하단 중앙
    { x: fromWidget.x, y: fromCenter.y + arrowcontect.left }, // 좌측 중앙
    {
      x: fromWidget.x + fromWidget.width + offset,
      y: fromCenter.y + arrowcontect.right,
    }, // 우측 중앙
  ];

  const toCenters = [
    { x: toCenter.x + arrowcontect.top, y: toWidget.y }, // 상단 중앙
    {
      x: toCenter.x + arrowcontect.bottom,
      y: toWidget.y + toWidget.height + offset,
    }, // 하단 중앙
    { x: toWidget.x, y: toCenter.y + arrowcontect.left }, // 좌측 중앙
    {
      x: toWidget.x + toWidget.width + offset,
      y: toCenter.y + arrowcontect.right,
    }, // 우측 중앙
  ];

  let fromPoint, toPoint;

  const fromRight = fromWidget.x + fromWidget.width;
  const toLeft = toWidget.x;
  const isOverlappingX = !(
    fromRight < toLeft || fromWidget.x > toWidget.x + toWidget.width
  );

  if (!isOverlappingX) {
    if (dx > 0) {
      fromPoint = fromCenters[3];
      toPoint = toCenters[2];
    } else {
      fromPoint = fromCenters[2];
      toPoint = toCenters[3];
    }
  } else {
    if (dy > 0) {
      fromPoint = fromCenters[1];
      toPoint = toCenters[0];
    } else {
      fromPoint = fromCenters[0];
      toPoint = toCenters[1];
    }
  }

  const isAligned = fromPoint.x === toPoint.x || fromPoint.y === toPoint.y;
  let points: number[];

  if (isAligned) {
    points = [fromPoint.x, fromPoint.y, toPoint.x, toPoint.y];
  } else if (!isOverlappingX) {
    const centerX = (fromPoint.x + toPoint.x) / 2;
    points = [
      fromPoint.x,
      fromPoint.y,
      centerX,
      fromPoint.y,
      centerX,
      toPoint.y,
      toPoint.x,
      toPoint.y,
    ];
  } else {
    const centerY = (fromPoint.y + toPoint.y) / 2;
    points = [
      fromPoint.x,
      fromPoint.y,
      fromPoint.x,
      centerY,
      toPoint.x,
      centerY,
      toPoint.x,
      toPoint.y,
    ];
  }

  return {
    points,
    arrowTipX: toPoint.x,
    arrowTipY: toPoint.y,
  };
};

function dist(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

export const drawArrow = (
  ctx: CanvasRenderingContext2D,
  arrow: Arrow,
  scale: number,
  offset: { x: number; y: number },
  isSelected: boolean = false
) => {
  const { points } = arrow;

  if (points.length < 4) return;

  ctx.save();
  ctx.strokeStyle = isSelected ? "#FFB300" : "#000000";
  ctx.lineWidth = 3;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  // 새로운 경로 시작
  ctx.beginPath();
  ctx.moveTo(points[0], points[1]);

  // 점들을 2개씩 끊어 선분으로 보고, 선분 사이 모서리를 곡선 처리
  for (let i = 2; i < points.length - 2; i += 2) {
    const x1 = points[i - 2],
      y1 = points[i - 1];
    const x2 = points[i],
      y2 = points[i + 1];
    const x3 = points[i + 2],
      y3 = points[i + 3];

    // 들어오는 선분 길이
    const len1 = dist(x1, y1, x2, y2);
    // 나가는 선분 길이
    const len2 = dist(x2, y2, x3, y3);

    // 반지름 r을 구할 때, 두 선분 길이의 절반보다 큰 곡률은 적용하지 않는다.
    const r = Math.min(baseRadius, len1 / 2, len2 / 2);

    // 각 선분 방향 단위 벡터
    const ux1 = (x2 - x1) / len1;
    const uy1 = (y2 - y1) / len1;
    const ux2 = (x3 - x2) / len2;
    const uy2 = (y3 - y2) / len2;

    // 곡선 시작점(A): 모서리 점 x2,y2에서 들어오는 선분 방향으로 r만큼 뒤로 간 점
    const Ax = x2 - ux1 * r;
    const Ay = y2 - uy1 * r;

    // 곡선 끝점(B): 모서리 점 x2,y2에서 나가는 선분 방향으로 r만큼 간 점
    const Bx = x2 + ux2 * r;
    const By = y2 + uy2 * r;

    // 여기서 A->B를 quadraticCurveTo로 연결
    ctx.lineTo(Ax, Ay);
    ctx.quadraticCurveTo(x2, y2, Bx, By);
  }

  // 마지막 선분 연결
  ctx.lineTo(points[points.length - 2], points[points.length - 1]);
  ctx.stroke();

  // 화살표 헤드 그리기 (삼각형 형태로 복원)
  const endX = arrow.arrowTipX;
  const endY = arrow.arrowTipY;
  const angle = Math.atan2(
    endY - points[points.length - 3],
    endX - points[points.length - 4]
  );

  const adjustedEndX = endX - Math.cos(angle) * headOffset;
  const adjustedEndY = endY - Math.sin(angle) * headOffset;

  ctx.beginPath();
  ctx.moveTo(adjustedEndX, adjustedEndY);
  ctx.lineTo(
    adjustedEndX - headLength * Math.cos(angle - headAngle),
    adjustedEndY - headLength * Math.sin(angle - headAngle)
  );
  ctx.lineTo(
    adjustedEndX - headLength * Math.cos(angle + headAngle),
    adjustedEndY - headLength * Math.sin(angle + headAngle)
  );
  ctx.closePath();
  ctx.fillStyle = isSelected ? "#FFB300" : "#000000";
  ctx.fill();

  ctx.restore();
};
