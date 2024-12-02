import { AllWidgetTypes, ShellWidgetProps } from "@/types/type";
import api from "@/lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_POST_API_URL || "";

const headers = {
  Authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzMwNjA3MTMsInN1YiI6IjBIUzc4WjgwSlJNQUYifQ.WLhXwgV_RtOXGALHUXpyPiTbPYeoTgw4YjU7bODrme8 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMEhTNzhaODBKUk1BRiIsImV4cCI6MTczMzA2MDcxM30.XV-WBWHQzpnJrb1VBO27PL-dncAYxvqx9zYzmnjpv5k",
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
