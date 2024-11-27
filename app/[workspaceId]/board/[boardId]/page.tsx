"use client";

import dynamic from "next/dynamic";

import { useState, useEffect } from "react";
import { ShellWidgetProps, AllWidgetTypes } from "@/types/type";

interface BoardData {
  widgets: ShellWidgetProps<AllWidgetTypes>[];
  // relations: any[]; // 관계 데이터 타입 정의 필요
}

export default function Board({ params }: { params: { boardId: string } }) {
  const Whiteboard = dynamic(() => import("@/components/board/whiteboard"), {
    ssr: false,
  });

  const [boardData, setBoardData] = useState<BoardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setIsLoading(true);
  //       setError(null);
  //       const data = await fetchBoardDetail(params.boardId); // 보드 데이터 가져오는 함수
  //       setBoardData(data);
  //     } catch (err) {
  //       setError(
  //         err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다"
  //       );
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [params.boardId]);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  // Whiteboard 컴포넌트에 boardData 전달
  return <div>{boardData && <Whiteboard />}</div>;
}
