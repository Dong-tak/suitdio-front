import api from '@/lib/api';
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
export const initializeWorkspaceData = async (workspaceId: string) => {
  try {
    const boards = await fetchBoards(workspaceId);
    console.log('boards:', boards);
    return {
      workspaceId: workspaceId,
      boards: boards,
    };
  } catch (error) {
    console.error('데이터 로딩 중 오류:', error);
    throw error;
  }
};

export const fetchBoards = async (workspaceId: string) => {
  try {
    const response = await api.get(`/record/workspace/${workspaceId}/boards/`);
    const { boards } = response.data;
    return boards;
  } catch (error) {
    console.error('보드 데이터 로딩 중 오류:', error);
    throw error;
  }
};
export const deleteBoard = async (boardId: string) => {
  try {
    await api.delete(`/record/board/${boardId}/`);
    return true;
  } catch (error) {
    console.error('보드 삭제 중 오류 발생:', error);
    throw error;
  }
};
export const createBoard = async (workspaceId: string, focus: string) => {
  try {
    const response = await api.post(`/record/board/create/${workspaceId}/`, {
      data: {
        focus: focus,
      },
    });
    return response.data;
  } catch (error) {
    console.error('보드 생성 중 오류 발생:', error);
    throw error;
  }
};
