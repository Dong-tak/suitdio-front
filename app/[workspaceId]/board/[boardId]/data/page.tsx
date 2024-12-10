'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { fetchBoardDetail } from './action';
import { useDispatch } from 'react-redux';
import { setInitialWidgets } from '@/redux/features/whiteboardSlice';
import { setWebSocket } from '@/redux/middleware/websocketMiddleware';
import { useWebSocket } from '@/hooks/use-socket';

export default function Board() {
  const params = useParams();
  const boardId = params.boardId as string;
  const dispatch = useDispatch();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initializeRef = useRef(false);

  const Whiteboard = dynamic(() => import('../components/whiteboard'), {
    ssr: false,
  });

  const [mounted, setMounted] = useState(true);

  // 데이터 로딩 로직
  useEffect(() => {
    if (initializeRef.current) return;
    initializeRef.current = true;

    const initializeBoard = async () => {
      try {
        console.log('보드 데이터 로딩 시작');
        const data = await fetchBoardDetail(boardId);
        console.log('보드 데이터 로딩 완료:', data);

        if (!mounted) return;
        dispatch(setInitialWidgets(data.widgets));
        console.log('초기 위젯 설정 완료');

        setIsDataLoaded(true);
        setIsLoading(false);
      } catch (err) {
        if (!mounted) return;
        console.error('초기화 중 에러:', err);
        setError(
          err instanceof Error
            ? err.message
            : '보드 데이터를 불러오는데 실패했습니다'
        );
        setIsLoading(false);
      }
    };

    initializeBoard();

    return () => {
      setMounted(false);
    };
  }, [boardId, dispatch, mounted]);

  const { isSocketConnected } = useWebSocket({
    boardId,
    isDataLoaded,
  });

  // 최종 렌더링 조건
  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Spinner size={32} />
        <span className='ml-2'>로딩중...</span>
      </div>
    );
  }

  // 데이터 로딩과 소켓 연결이 모두 완료된 경우에만 Whiteboard 렌더링
  return (
    <div>
      {isDataLoaded && isSocketConnected ? (
        <Whiteboard />
      ) : (
        <div>연결 중...</div>
      )}
    </div>
  );
}
