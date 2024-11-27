import api from "@/lib/api";
import { parseBoardData } from "@/lib/parseBoard";

export async function fetchBoardDetail(boardId: string) {
  try {
    const response = await api.get(`/record/board/${boardId}/`);
    console.log("보드 상세 데이터:", response.data);
    return parseBoardData(response.data);
  } catch (error) {
    console.error("보드 상세 데이터 로딩 중 오류:", error);
    throw error;
  }
}
