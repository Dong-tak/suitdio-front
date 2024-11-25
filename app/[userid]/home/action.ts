import { AllWidgetTypes, ShellWidgetProps } from "@/types/type";

interface BoardPosition {
  x: number;
  y: number;
}

export const createBoardWithTitle = (
  contentTitle: string,
  widgets: ShellWidgetProps<AllWidgetTypes>[],
  boardPosition: BoardPosition
) => {
  const newBoard: ShellWidgetProps<AllWidgetTypes> = {
    id: `CenterWidget-${Date.now()}`, // 유니크한 ID 생성
    type: "shell",
    x: boardPosition.x,
    y: boardPosition.y,
    width: 800,
    height: 300,
    resizable: false,
    editable: false,
    draggable: false,
    innerWidget: {
      id: `CenterWidget-${Date.now()}`,
      type: "center",
      titleBlock: contentTitle,
      width: 800,
      height: 300,
      x: boardPosition.x,
      y: boardPosition.y,
      draggable: false,
      editable: false,
      resizeable: false,
      headerBar: true,
      footerBar: true,
      text: "",
    },
  };

  return newBoard;
};
