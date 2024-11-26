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

export const initializeWorkspaceData = async () => {
  try {
    const boards = await fetchBoards("0HS78Z813DVX6");
    return {
      workspaceId: boards[0].workspaceId,
      boards: boards,
    };
  } catch (error) {
    console.error("데이터 로딩 중 오류:", error);
    throw error;
  }
};

export const fetchWorkspace = async () => {
  try {
    const response = await fetch(
      `/api/proxy/record/workspace/0HS78Z813DVX6/boards/`,
      {
        method: "GET",
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
      `/api/proxy/record/workspace/${workspaceId}/boards/`,
      {
        method: "GET",
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
    const response = await fetch(`/api/proxy/record/board/${boardId}/`, {
      method: "DELETE",
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
      `/api/proxy/record/board/create/${workspaceId}/`,
      {
        method: "POST",
        headers: {
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
