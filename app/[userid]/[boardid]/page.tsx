import dynamic from "next/dynamic";
import { fetchBoard } from "./action";

// 서버 컴포넌트에서 데이터 가져오기
async function getBoardData(boardId: string) {
  try {
    const data = await fetchBoard(boardId);
    return data;
  } catch (error) {
    console.error("보드 데이터 가져오기 실패:", error);
    return null;
  }
}

export default async function Home({
  params,
}: {
  params: { boardId: string };
}) {
  // 동적 import 유지
  const Whiteboard = dynamic(() => import("@/components/board/whiteboard"), {
    ssr: false,
  });

  console.log("params", params);

  // 보드 데이터 가져오기
  // const boardData = await getBoardData(params.boardId);

  return (
    <div>
      <Whiteboard />
    </div>
  );
}
