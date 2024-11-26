"use client";

import dynamic from "next/dynamic";
import { fetchBoardDetail } from "./action";
import { useState, useEffect } from "react";

export default function Board({ params }: { params: { boardId: string } }) {
  const Whiteboard = dynamic(() => import("@/components/board/whiteboard"), {
    ssr: false,
  });

  const [boardData, setBoardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchBoardDetail(params.boardId);
        setBoardData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.boardId]);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div>
      <Whiteboard data={boardData} />
    </div>
  );
}
