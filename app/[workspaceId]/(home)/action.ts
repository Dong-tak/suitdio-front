import { AllWidgetTypes, ShellWidgetProps } from "@/types/type";
import api from "@/lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_POST_API_URL || "";

interface BoardPosition {
  x: number;
  y: number;
}

const headers = {
  Authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzMwNjA3MTMsInN1YiI6IjBIUzc4WjgwSlJNQUYifQ.WLhXwgV_RtOXGALHUXpyPiTbPYeoTgw4YjU7bODrme8 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMEhTNzhaODBKUk1BRiIsImV4cCI6MTczMzA2MDcxM30.XV-WBWHQzpnJrb1VBO27PL-dncAYxvqx9zYzmnjpv5k",
};

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
    width: 750,
    height: 200,
    resizable: false,
    editable: true,
    draggable: false,
    from: [],
    to: [],
    innerWidget: {
      id: `CenterWidget-${Date.now()}`,
      type: "center",
      titleBlock: contentTitle,
      width: 750,
      height: 200,
      x: boardPosition.x,
      y: boardPosition.y,
      draggable: false,
      editable: true,
      resizeable: false,
      headerBar: true,
      footerBar: false,
      text: "",
    },
  };

  return newBoard;
};

// export const createBoard = async (workspaceId: string) => {
//   try {
//     const response = await fetch(
//       `${API_BASE_URL}record/board/create/${workspaceId}/`,
//       {
//         method: "POST",
//         headers: {
//           ...headers,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           data: {
//             focus: "new board",
//           },
//         }),
//       }
//     );

//     if (!response.ok) {
//       throw new Error("보드 생성에 실패했습니다");
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("보드 생성 중 오류 발생:", error);
//     throw error;
//   }
// };

export const createBoard = async (
  workspaceId: string,
  contentTitle: string
) => {
  try {
    const response = await api.post(`/record/board/create/${workspaceId}/`, {
      data: {
        focus: contentTitle,
      },
    });

    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("보드 생성 중 오류 발생:", error);
    throw error;
  }
};
