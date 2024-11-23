import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  addWidget,
  updateWidget,
  deleteWidget,
} from '@/lib/redux/features/whiteboardSlice';

export const useWebSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const ws = new WebSocket(
      'ws://192.168.219.128:8000/v1/play/board/0HW3057JC7TKW/'
    );

    ws.onopen = () => {
      console.log('웹소켓 연결됨');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'widget:created':
          dispatch(addWidget(data.widget));
          break;
        case 'widget:updated':
          dispatch(updateWidget(data.widget));
          break;
        case 'widget:deleted':
          dispatch(deleteWidget(data.widgetId));
          break;
      }
    };

    ws.onclose = () => {
      console.log('웹소켓 연결 끊김');
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [dispatch]);

  return socket;
};
