import { useState, useEffect } from 'react';
import { setWebSocket } from '@/redux/middleware/websocketMiddleware';

interface UseWebSocketProps {
  boardId: string;
  isDataLoaded: boolean;
}

export const useWebSocket = ({ boardId, isDataLoaded }: UseWebSocketProps) => {
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  useEffect(() => {
    if (!isDataLoaded) return;

    const socket = new WebSocket(
      `${process.env.NEXT_PUBLIC_WEBSOCKET_BASE_URL}/play/board/${boardId}/`
    );

    socket.onopen = () => {
      console.log('웹소켓 연결 성공');
      setIsSocketConnected(true);
      setWebSocket(socket);
    };

    return () => {
      socket.close();
    };
  }, [isDataLoaded, boardId]);

  return { isSocketConnected };
};
