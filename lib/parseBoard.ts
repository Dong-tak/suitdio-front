interface Widget {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  size?: {
    width: number;
    height: number;
  };
  content?: any;
  style?: any;
}

interface BoardData {
  id: string;
  data: {
    widgets?: Record<string, any>;
    // 다른 보드 관련 데이터들...
  };
}

export function parseData(boardData: BoardData): Widget[] {
  if (!boardData?.data?.widgets) {
    return [];
  }

  try {
    // 위젯 데이터를 배열로 변환
    return Object.entries(boardData.data.widgets).map(([id, widget]) => {
      return {
        id,
        type: widget.type || "default",
        position: {
          x: widget.position?.x || 0,
          y: widget.position?.y || 0,
        },
        size: widget.size && {
          width: widget.size.width || 100,
          height: widget.size.height || 100,
        },
        content: widget.content,
        style: widget.style,
      };
    });
  } catch (error) {
    console.error("보드 데이터 파싱 중 오류:", error);
    return [];
  }
}
