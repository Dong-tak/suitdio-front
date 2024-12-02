import { AllWidgetTypes, Arrow, MindMapWidget } from "@/types/type";

export interface FamilyBox {
  id: string;
  type: "familyBox";
  x: number;
  y: number;
  width: number;
  height: number;
  nodeId: string;
  childBoxes: FamilyBox[];
  isSelected?: boolean;
}

// 레이아웃 간격 상수
export const LAYOUT_CONSTANTS = {
  GEN_GAP: 48, // 세대 간 간격
  SIB_GAP: 24, // 형제 노드 간 간격
  NAV_GAP: 36, // 네비게이션 간격
};

function calculateFamilyBox(
  nodeId: string,
  nodes: Map<string, MindMapWidget>,
  level: number,
  levelFamilyBoxes: Map<number, FamilyBox[]>,
  visited: Set<string> = new Set()
): FamilyBox {
  if (visited.has(nodeId)) {
    return {
      id: nodeId,
      type: "familyBox" as const,
      nodeId,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      childBoxes: [],
    };
  }
  visited.add(nodeId);

  const node = nodes.get(nodeId);
  if (!node) {
    return {
      id: nodeId,
      type: "familyBox" as const,
      nodeId,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      childBoxes: [],
    };
  }

  // 리프 노드인 경우
  if (node.children.length === 0) {
    const familyBox: FamilyBox = {
      id: nodeId,
      type: "familyBox" as const,
      nodeId,
      width: node.width,
      height: node.height,
      x: node.x,
      y: node.y,
      childBoxes: [],
    };

    if (!levelFamilyBoxes.has(level)) {
      levelFamilyBoxes.set(level, []);
    }
    levelFamilyBoxes.get(level)!.push(familyBox);

    return familyBox;
  }

  // 자식 노드들의 FamilyBox 계산 (visited Set 전달)
  const childFamilyBoxes = node.children.map((childId) =>
    calculateFamilyBox(childId, nodes, level + 1, levelFamilyBoxes, visited)
  );

  // 자식 노드들의 총 높이 계산 (SIB_GAP 포함)
  const totalChildrenHeight = childFamilyBoxes.reduce((sum, box, index) => {
    // 형제 노드들 사이에는 SIB_GAP 적용
    const gap = index > 0 ? LAYOUT_CONSTANTS.SIB_GAP : 0;
    return sum + box.height + gap;
  }, 0);

  // FamilyBox의 높이는 자식들의 전체 높이로 설정
  const familyHeight = Math.max(totalChildrenHeight, node.height);

  // FamilyBox의 너비 계산
  const nextGenMaxWidth = Math.max(...childFamilyBoxes.map((box) => box.width));
  const totalWidth = node.width + LAYOUT_CONSTANTS.GEN_GAP + nextGenMaxWidth;

  const familyBox: FamilyBox = {
    id: nodeId,
    type: "familyBox" as const,
    nodeId,
    width: totalWidth,
    height: familyHeight,
    x: node.x,
    y: node.y,
    childBoxes: childFamilyBoxes,
  };

  if (!levelFamilyBoxes.has(level)) {
    levelFamilyBoxes.set(level, []);
  }
  levelFamilyBoxes.get(level)!.push(familyBox);

  return familyBox;
}

function calculateNodePositions(
  nodeId: string,
  x: number,
  y: number,
  nodes: Map<string, MindMapWidget>,
  familyBox: FamilyBox
): void {
  const node = nodes.get(nodeId);
  if (!node) return;

  // 현재 노드의 좌표 설정
  node.x = x;
  node.y = y;

  if (node.children.length === 0) return;

  // 자식 노드들의 X 좌표 계산 (GEN_GAP 적용)
  const childX = x + node.width + LAYOUT_CONSTANTS.GEN_GAP;

  // 자식 노드들의 시작 Y 좌표 계산
  let currentY = y - (familyBox.height - node.height) / 2;

  // 자식 노드들의 위치 계산
  node.children.forEach((childId, index) => {
    const childBox = familyBox.childBoxes[index];
    const childNode = nodes.get(childId);
    if (!childNode) return;

    // 형제 노드들 사이에는 SIB_GAP 적용
    if (index > 0) {
      currentY += LAYOUT_CONSTANTS.SIB_GAP;
    }

    calculateNodePositions(childId, childX, currentY, nodes, childBox);
    currentY += childBox.height;
  });
}

// levelFamilyBoxes를 사용하여 같은 레벨의 다른 부모를 가진 노드들 사이에 NAV_GAP 적용
function applyNavGapFromPosition(
  levelFamilyBoxes: Map<number, FamilyBox[]>,
  nodes: Map<string, MindMapWidget>,
  startY: number
) {
  levelFamilyBoxes.forEach((familyBoxes, level) => {
    let currentY = startY;
    familyBoxes.forEach((familyBox, index) => {
      if (index > 0) {
        currentY += LAYOUT_CONSTANTS.NAV_GAP;
      }
      const node = nodes.get(familyBox.nodeId);
      if (node) {
        node.y = currentY + (familyBox.height - node.height) / 2;
      }
      currentY += familyBox.height;
    });
  });
}

// Arrow 타입 가드 수정
function isArrow(widget: AllWidgetTypes | Arrow): widget is Arrow {
  return "fromId" in widget && "toId" in widget;
}

export const calculateMindMapLayout = (
  widgets: AllWidgetTypes[],
  rootId: string
) => {
  const nodes = new Map<string, MindMapWidget>();
  const familyBoxes = new Map<string, FamilyBox>();
  const relationshipMap = new Map<string, Set<string>>();
  const updatedArrows = new Map<string, Arrow>();

  // 1. 노드 초기화 및 관계 맵 구성
  let rootNode: MindMapWidget | undefined;

  widgets.forEach((widget) => {
    if (!isArrow(widget)) {
      const node: MindMapWidget = {
        id: widget.id,
        type: "mindmap" as const,
        children: [],
        level: 0,
        x: typeof widget.x === "number" ? widget.x : 0,
        y: typeof widget.y === "number" ? widget.y : 0,
        width: typeof widget.width === "number" ? widget.width : 100,
        height: typeof widget.height === "number" ? widget.height : 50,
        isSelected: widget.isSelected,
      };

      nodes.set(widget.id, node);
      if (widget.id === rootId) {
        rootNode = node;
      }
    } else {
      if (!relationshipMap.has(widget.fromId)) {
        relationshipMap.set(widget.fromId, new Set());
      }
      relationshipMap.get(widget.fromId)?.add(widget.toId);
      updatedArrows.set(widget.id, widget);
    }
  });

  if (!rootNode) return { nodes, updatedwidgets: widgets, mindMapGroup: null };

  // 2. 계층 구조 구성
  buildHierarchy(rootId, nodes, relationshipMap, new Set());

  // 3. FamilyBox 계산 및 레벨별 그룹화
  const levelFamilyBoxes = new Map<number, FamilyBox[]>();
  const rootFamilyBox = calculateFamilyBox(rootId, nodes, 0, levelFamilyBoxes);

  // 4. 노드 위치 계산 (루트 노드의 위치 기준)
  const rootX = rootNode.x;
  const rootY = rootNode.y;

  calculateNodePositions(rootId, rootX, rootY, nodes, rootFamilyBox);

  // 4-1. NAV_GAP 적용 (루트 노드의 Y 위치 유지)
  const initialY = rootY - (rootFamilyBox.height - rootNode.height) / 2;
  applyNavGapFromPosition(levelFamilyBoxes, nodes, initialY);

  // 5. 화살표 위치 업데이트
  widgets.forEach((widget) => {
    if (isArrow(widget)) {
      const fromNode = nodes.get(widget.fromId);
      const toNode = nodes.get(widget.toId);

      if (fromNode && toNode) {
        // 시작점은 항상 오른쪽, 끝점은 항상 왼쪽에 연결
        const fromX = fromNode.x + fromNode.width;
        const fromY = fromNode.y + fromNode.height / 2;
        const toX = toNode.x;
        const toY = toNode.y + toNode.height / 2;

        // 중간 꺾임점 계산
        const middleX = (fromX + toX) / 2;

        // 화살표의 points 배열 생성 (시작점, 중간점1, 중간점2, 끝점)
        const points = [
          fromX,
          fromY, // 시작점 (오른쪽 중앙)
          middleX,
          fromY, // 첫 번째 꺾임점
          middleX,
          toY, // 두 번째 꺾임점
          toX,
          toY, // 끝점 (왼쪽 중앙)
        ];

        // 화살표 업데이트
        const updatedArrow = {
          ...widget,
          points,
          arrowTipX: toX,
          arrowTipY: toY,
        };

        updatedArrows.set(widget.id, updatedArrow);
      }
    }
  });

  // 7. 업데이트된 도형들 반환
  return {
    nodes,
    updatedwidgets: widgets.map((widget) => {
      if (isArrow(widget)) {
        return updatedArrows.get(widget.id) || widget;
      }
      const node = nodes.get(widget.id);
      if (node) {
        return {
          ...widget,
          x: node.x,
          y: node.y,
        };
      }
      return widget;
    }),
  };
};
function buildHierarchy(
  rootId: string,
  nodes: Map<string, MindMapWidget>,
  relationshipMap: Map<string, Set<string>>,
  visited: Set<string>,
  level: number = 0
): void {
  if (visited.has(rootId)) return;
  visited.add(rootId);

  const node = nodes.get(rootId);
  if (!node) return;

  node.level = level;

  const childrenSet = relationshipMap.get(rootId) || new Set<string>();
  const childrenIds: string[] = Array.from(childrenSet).map((id) => String(id));
  node.children = childrenIds;

  childrenIds.forEach((childId) => {
    const childNode = nodes.get(childId);
    if (childNode) {
      childNode.parentId = rootId;
      buildHierarchy(childId, nodes, relationshipMap, visited, level + 1);
    }
  });
}
