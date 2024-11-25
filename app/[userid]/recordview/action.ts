export interface Board {
  id: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  workspaceId: string;
  data: {
    focus: string;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const headers = {
  Authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzMwNjA3MTMsInN1YiI6IjBIUzc4WjgwSlJNQUYifQ.WLhXwgV_RtOXGALHUXpyPiTbPYeoTgw4YjU7bODrme8 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMEhTNzhaODBKUk1BRiIsImV4cCI6MTczMzA2MDcxM30.XV-WBWHQzpnJrb1VBO27PL-dncAYxvqx9zYzmnjpv5k",
};

export const fetchWorkspace = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}record/workspace/0HS78Z813DVX6/boards/`,
      {
        method: "GET",
        headers,
      }
    );

    if (!response.ok)
      throw new Error("워크스페이스 정보를 가져오는데 실패했습니다");
    const { boards } = await response.json();
    return boards[0].workspaceId;
  } catch (error) {
    console.error("워크스페이스 정보 로딩 중 오류:", error);
    throw error;
  }
};

export const fetchBoards = async (workspaceId: string) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}record/workspace/${workspaceId}/boards/`,
      {
        method: "GET",
        headers,
      }
    );

    if (!response.ok) throw new Error("보드 데이터를 가져오는데 실패했습니다");
    const { boards } = await response.json();
    return boards;
  } catch (error) {
    console.error("보드 데이터 로딩 중 오류:", error);
    throw error;
  }
};

export const deleteBoard = async (boardId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}record/board/${boardId}/`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      throw new Error("보드 삭제에 실패했습니다");
    }
    return true;
  } catch (error) {
    console.error("보드 삭제 중 오류 발생:", error);
    throw error;
  }
};

export const createBoard = async (workspaceId: string) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}record/board/create/${workspaceId}/`,
      {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            focus: "new board",
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("보드 생성에 실패했습니다");
    }

    return await response.json();
  } catch (error) {
    console.error("보드 생성 중 오류 발생:", error);
    throw error;
  }
};
