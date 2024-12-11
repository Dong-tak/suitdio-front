'use client';

import { useParams } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { useWebSocket } from '../hooks/use-socket';
import { useBoardInitialization } from '../hooks/use-initBordData';

import dynamic from 'next/dynamic';

const Whiteboard = dynamic(
  () => import('../components/whiteboard/whiteboard'),
  {
    ssr: false,
  }
);

export default function Board() {
  const params = useParams();
  const boardId = params.boardId as string;

  const { isDataLoaded, isLoading, error } = useBoardInitialization(boardId);

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
