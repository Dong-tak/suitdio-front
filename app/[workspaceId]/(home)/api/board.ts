import api from '@/lib/api';
import { Board, CreateBoardRequest } from './types';

export const boardApi = {
  create: async ({ workspaceId, contentTitle }: CreateBoardRequest) => {
    try {
      const response = await api.post<Board>(
        `/record/board/create/${workspaceId}/`,
        {
          data: {
            focus: contentTitle,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('보드 생성 중 오류 발생:', error);
      throw error;
    }
  },

  // 추가 API 메서드들...
};
