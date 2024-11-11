import { ShellWidgetProps, AllWidgetTypes, SectionWidget } from "@/lib/type";
import { snap } from "./snapping";

// 섹션 내부에 객체가 완전히 포함되어 있는지 확인
export const isCompletelyContained = (
  shape: ShellWidgetProps<AllWidgetTypes>,
  section: ShellWidgetProps<AllWidgetTypes>,
  scale: number = 1,
  offset: { x: number; y: number } = { x: 0, y: 0 }
): boolean => {
  if (shape.id === section.id || shape.innerWidget.type === "section") {
    return false;
  }

  // 스케일과 오프셋을 적용한 좌표 계산
  const shapeLeft = (shape.x + offset.x) * scale;
  const shapeRight = (shape.x + shape.width + offset.x) * scale;
  const shapeTop = (shape.y + offset.y) * scale;
  const shapeBottom = (shape.y + shape.height + offset.y) * scale;

  const sectionLeft = (section.x + offset.x) * scale;
  const sectionRight = (section.x + section.width + offset.x) * scale;
  const sectionTop = (section.y + offset.y) * scale;
  const sectionBottom = (section.y + section.height + offset.y) * scale;

  const isContained =
    shapeLeft >= sectionLeft &&
    shapeRight <= sectionRight &&
    shapeTop >= sectionTop &&
    shapeBottom <= sectionBottom;

  // 디버깅 로그 추가
  console.log("Containment Check:", {
    shapeId: shape.id,
    isContained,
    shapeBounds: {
      left: shapeLeft,
      right: shapeRight,
      top: shapeTop,
      bottom: shapeBottom,
    },
    sectionBounds: {
      left: sectionLeft,
      right: sectionRight,
      top: sectionTop,
      bottom: sectionBottom,
    },
  });

  return isContained;
};

// 객체가 여유 공간 내에 있는지 확인
export const isWithinBounds = (
  shape: ShellWidgetProps<AllWidgetTypes>,
  bounds: { x: number; y: number; width: number; height: number }
): boolean => {
  const isWithin =
    shape.x >= bounds.x &&
    shape.y >= bounds.y &&
    shape.x + shape.width <= bounds.x + bounds.width &&
    shape.y + shape.height <= bounds.y + bounds.height;

  console.log("Margin Check:", {
    shapeId: shape.id,
    shapeBounds: {
      x: shape.x,
      y: shape.y,
      width: shape.width,
      height: shape.height,
    },
    marginBounds: bounds,
    isWithin,
    distances: {
      left: shape.x - bounds.x,
      right: bounds.x + bounds.width - (shape.x + shape.width),
      top: shape.y - bounds.y,
      bottom: bounds.y + bounds.height - (shape.y + shape.height),
    },
  });

  return isWithin;
};

// 섹션과 멤버 객체들의 위치 업데이트(섹션 크기 조절 시에도 멤버의 위치와 크기는 유지)
export const updateSectionAndMembers = (
  section: ShellWidgetProps<AllWidgetTypes>,
  dx: number,
  dy: number,
  shapes: ShellWidgetProps<AllWidgetTypes>[]
): ShellWidgetProps<AllWidgetTypes>[] => {
  return shapes.map((shape) => {
    if (shape.id === section.id) {
      return {
        ...shape,
        x: snap(section.x + dx),
        y: snap(section.y + dy),
      };
    } else if (
      section.innerWidget.type === "section" &&
      (section.innerWidget as SectionWidget).memberIds.includes(shape.id)
    ) {
      return {
        ...shape,
        x: snap(shape.x + dx),
        y: snap(shape.y + dy),
      };
    }
    return shape;
  });
};

// 섹션 크기 변경 시 멤버 객체들의 위치와 크기 조정
export const updateSectionResize = (
  section: ShellWidgetProps<AllWidgetTypes>,
  newWidth: number,
  newHeight: number,
  newX: number,
  newY: number,
  widgets: ShellWidgetProps<AllWidgetTypes>[]
) => {
  const updatedShapes = widgets.map((widget) => {
    // 섹션 자체만 업데이트
    if (widget.id === section.id) {
      return {
        ...widget,
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      };
    }

    // 나머지 위젯들(멤버 포함)은 변경하지 않음
    return widget;
  });

  return updatedShapes;
};

// 객체의 이동을 섹션 내부로 제한
export const limitShapeToSection = (
  shape: ShellWidgetProps<AllWidgetTypes>,
  section: ShellWidgetProps<AllWidgetTypes>,
  newX: number,
  newY: number,
  margin: number = 20
): { x: number; y: number } => {
  return {
    x: Math.max(
      section.x - margin,
      Math.min(newX, section.x + section.width - shape.width + margin)
    ),
    y: Math.max(
      section.y - margin,
      Math.min(newY, section.y + section.height - shape.height + margin)
    ),
  };
};

// 섹션 내부에서 객체의 이동을 제한하는 함수 수정
export const limitMovementInSection = (
  shape: ShellWidgetProps<AllWidgetTypes>,
  section: ShellWidgetProps<AllWidgetTypes>,
  newX: number,
  newY: number,
  margin: number = 20
): { x: number; y: number } => {
  // 이전 위치와 새 위치의 차이가 작으면 무시
  const minChange = 1; // 1px 미만의 변화는 무시
  const dx = Math.abs(newX - shape.x);
  const dy = Math.abs(newY - shape.y);

  if (dx < minChange && dy < minChange) {
    return { x: shape.x, y: shape.y };
  }

  // 섹션 경계 내부로 제한
  const limitedX = Math.max(
    section.x + margin,
    Math.min(newX, section.x + section.width - shape.width - margin)
  );
  const limitedY = Math.max(
    section.y + margin,
    Math.min(newY, section.y + section.height - shape.height - margin)
  );

  // 객체가 섹션 경계를 크게 벗어났는지 확인
  const isSignificantlyOutside =
    newX > section.x + section.width + 150 ||
    newX + shape.width < section.x - 150 ||
    newY > section.y + section.height + 150 ||
    newY + shape.height < section.y - 150;

  // 크게 벗어난 경우 로그만 출력
  if (isSignificantlyOutside) {
    console.log("Object significantly outside section:", {
      shapeId: shape.id,
      sectionId: section.id,
      distances: {
        right: newX - (section.x + section.width),
        left: section.x - (newX + shape.width),
        bottom: newY - (section.y + section.height),
        top: section.y - (newY + shape.height),
      },
    });
  }

  // 위치가 실제로 변경될 때만 로그 출력
  if (limitedX !== shape.x || limitedY !== shape.y) {
    console.log("Movement Limit:", {
      shapeId: shape.id,
      sectionId: section.id,
      proposed: { x: newX, y: newY },
      limited: { x: limitedX, y: limitedY },
      bounds: {
        minX: section.x + margin,
        maxX: section.x + section.width - shape.width - margin,
        minY: section.y + margin,
        maxY: section.y + section.height - shape.height - margin,
      },
    });
  }

  return { x: limitedX, y: limitedY };
};

// 객체가 섹션 내부에서 이동 가능한지 확인하는 함수 수정
export const canMoveInSection = (
  shape: ShellWidgetProps<AllWidgetTypes>,
  section: ShellWidgetProps<AllWidgetTypes>,
  newX: number,
  newY: number,
  margin: number = 0
): boolean => {
  const isWithinX =
    newX >= section.x + margin &&
    newX + shape.width <= section.x + section.width - margin;
  const isWithinY =
    newY >= section.y + margin &&
    newY + shape.height <= section.y + section.height - margin;

  // 이동 가능 여부 로그 추가
  console.log("Movement Check:", {
    shapeId: shape.id,
    sectionId: section.id,
    position: { x: newX, y: newY },
    isWithinX,
    isWithinY,
    margins: {
      left: newX - section.x,
      right: section.x + section.width - (newX + shape.width),
      top: newY - section.y,
      bottom: section.y + section.height - (newY + shape.height),
    },
    isMember:
      section.innerWidget.type === "section" &&
      (section.innerWidget as SectionWidget).memberIds.includes(shape.id),
  });

  return isWithinX && isWithinY;
};
