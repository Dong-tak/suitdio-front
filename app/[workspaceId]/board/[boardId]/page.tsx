'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { ShellWidgetProps, AllWidgetTypes } from '@/types/type';
import { useWebSocket } from '@/hooks/use-socket';
import { useParams } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';

interface BoardData {
  widgets: ShellWidgetProps<AllWidgetTypes>[];
}

export default function Board() {
  const params = useParams();
  const boardId = params.boardId as string;
  const socket = useWebSocket(boardId);

  const Whiteboard = dynamic(() => import('./components/whiteboard'), {
    ssr: false,
  });

  const [boardData, setBoardData] = useState<BoardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    // 웹소켓 연결이 완료되면 로딩 상태 해제
    socket.onopen = () => {
      setBoardData({ widgets: [] });
      setIsLoading(false);
    };

    socket.onerror = (error) => {
      setError('웹소켓 연결에 실패했습니다.');
      setIsLoading(false);
    };

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Spinner size={32} />
        <span className='ml-2'>Loading...</span>
      </div>
    );
  }

  if (error) return <div>에러: {error}</div>;

  return <div>{boardData && <Whiteboard />}</div>;
}
