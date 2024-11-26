import api from "@/lib/api";

export async function fetchBoardDetail(boardId: string) {
  try {
    const response = await api.get(`/record/board/${boardId}/`);
    return response.data;
  } catch (error) {
    console.error("보드 상세 데이터 로딩 중 오류:", error);
    throw error;
  }
}
