import { RootState } from "@/lib/redux/store";
import { useSelector } from "react-redux";
import { ShellWidgetProps, AllWidgetTypes, Arrow } from "@/types/type";

interface WidgetHierarchy {
  widget: ShellWidgetProps<AllWidgetTypes>;
  children: WidgetHierarchy[];
  level: number;
}

// 재귀적으로 자식 위젯들을 찾는 함수
const findChildWidgets = (
  parentId: string,
  widgets: ShellWidgetProps<AllWidgetTypes>[],
  arrows: Arrow[],
  level: number = 0,
  visited: Set<string> = new Set()
): WidgetHierarchy[] => {
  // 이미 방문한 노드는 건너뛰기 (순환 참조 방지)
  if (visited.has(parentId)) {
    return [];
  }
  visited.add(parentId);

  // 현재 부모에서 시작하는 화살표들 찾기
  const childArrows = arrows.filter((arrow) => arrow.fromId === parentId);

  // 각 화살표의 도착점에 해당하는 위젯들 찾기
  const childWidgets: WidgetHierarchy[] = childArrows
    .map((arrow) => {
      const childWidget = widgets.find((widget) => widget.id === arrow.toId);
      if (childWidget) {
        // 재귀적으로 자식의 자식들 찾기 (다음 레벨로 전달)
        const grandChildren: WidgetHierarchy[] = findChildWidgets(
          childWidget.id,
          widgets,
          arrows,
          level + 1,
          visited
        );
        return {
          widget: childWidget,
          children: grandChildren,
          level: level + 1,
        };
      }
      return null;
    })
    .filter((result): result is WidgetHierarchy => result !== null);

  return childWidgets;
};

interface WidgetInfo {
  root: {
    id: string;
    type: string;
    position: {
      x: number;
      y: number;
    };
  };
  children: WidgetHierarchy[];
}

interface JsonWidgetStructure {
  id: string;
  type: string;
  level: number;
  position: {
    x: number;
    y: number;
  };
  parentId?: string;
  children: JsonWidgetStructure[];
}

interface JsonStructure {
  root: JsonWidgetStructure;
}

// 계층 구조를 JSON 형태로 변환하는 함수
const convertToJsonStructure = (
  root: { id: string; type: string; position: { x: number; y: number } },
  children: WidgetHierarchy[]
): JsonStructure => {
  const convertWidget = (
    widget: WidgetHierarchy,
    parentId?: string
  ): JsonWidgetStructure => {
    return {
      id: widget.widget.id,
      type: widget.widget.innerWidget.type,
      level: widget.level,
      position: {
        x: widget.widget.x,
        y: widget.widget.y,
      },
      parentId: parentId,
      children: widget.children.map(
        (child: WidgetHierarchy): JsonWidgetStructure =>
          convertWidget(child, widget.widget.id)
      ),
    };
  };

  return {
    root: {
      id: root.id,
      type: root.type,
      level: 0,
      position: root.position,
      children: children.map(
        (child: WidgetHierarchy): JsonWidgetStructure =>
          convertWidget(child, root.id)
      ),
    },
  };
};

export const getSelectedWidgetInfo = (state: RootState): WidgetInfo | null => {
  const selectedWidgetIds = state.whiteboard.selectedWidget;
  const widgets = state.whiteboard.widgets;
  const arrows = state.arrow.arrows;

  console.log("-------------------------------------------");
  console.log("현재 선택된 위젯 IDs:", selectedWidgetIds);
  console.log("전체 위젯 목록:", widgets);
  console.log("전체 화살표 목록:", arrows);

  if (!selectedWidgetIds || selectedWidgetIds.length === 0) {
    console.log("선택된 위젯이 없습니다.");
    return null;
  }

  // 선택된 첫 번째 위젯 정보 가져오기 (root widget)
  const rootWidget = widgets.find(
    (widget) => widget.id === selectedWidgetIds[0]
  );

  if (!rootWidget) {
    console.log(
      "선택된 ID에 해당하는 위젯을 찾을 수 없습니다:",
      selectedWidgetIds[0]
    );
    return null;
  }

  // root widget에서 시작하는 화살표들 찾기
  const childArrows = arrows.filter((arrow) => arrow.fromId === rootWidget.id);

  console.log(
    "Root 위젯에서 시작하는 화살표들:",
    childArrows.map((arrow) => ({
      fromId: arrow.fromId,
      toId: arrow.toId,
    }))
  );

  // 모든 자식 위젯들 찾기 (재귀적)
  const allChildWidgets = findChildWidgets(rootWidget.id, widgets, arrows);

  // 전체 계층 구조 로깅
  const logHierarchy = (widgets: WidgetHierarchy[], level = 0): void => {
    widgets.forEach((item) => {
      if (item.children && item.children.length > 0) {
        logHierarchy(item.children, level + 1);
      }
    });
  };

  console.log("위젯 계층 구조:");
  logHierarchy(allChildWidgets);

  // JSON 형태로 변환하여 출력
  const jsonStructure = convertToJsonStructure(
    {
      id: rootWidget.id,
      type: rootWidget.innerWidget.type,
      position: {
        x: rootWidget.x,
        y: rootWidget.y,
      },
    },
    allChildWidgets
  );

  console.log("위젯 계층 구조 (JSON):");
  console.log(JSON.stringify(jsonStructure, null, 2));

  return {
    root: {
      id: rootWidget.id,
      type: rootWidget.innerWidget.type,
      position: {
        x: rootWidget.x,
        y: rootWidget.y,
      },
    },
    children: allChildWidgets,
  };
};
