import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  addWidget,
  updateWidget,
  deleteWidget,
} from "@/lib/redux/features/whiteboardSlice";

export const useWebSocket = (boardId: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!boardId) return;

    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WEBSOCKET_BASE_URL}/play/board/${boardId}/`
    );

    ws.onopen = () => {
      console.log("웹소켓 연결됨");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "widget:created":
          dispatch(addWidget(data.widget));
          break;
        case "widget:updated":
          dispatch(updateWidget(data.widget));
          break;
        case "widget:deleted":
          dispatch(deleteWidget(data.widgetId));
          break;
      }
    };

    ws.onclose = () => {
      console.log("웹소켓 연결 끊김");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [boardId, dispatch]);

  return socket;
};
