// 소켓 미들웨어 타입 정의

import { PayloadAction } from "@reduxjs/toolkit";
import { AllWidgetTypes, ShellWidgetProps } from "@/types/type";
import { Middleware } from "@reduxjs/toolkit";
import { update } from "lodash";
import debounce from "lodash/debounce";

// 디바운스된 소켓 전송 함수 수정
const createDebouncedSend = (socket: WebSocket) => {
  return debounce((message: unknown) => {
    console.log("Debounced WebSocket message:", message);
    socket.send(JSON.stringify(message));
  }, 100);
};

// 액션 타입 정의
interface WhiteboardAddWidgetAction
  extends PayloadAction<ShellWidgetProps<AllWidgetTypes>> {
  type: "whiteboard/addWidget";
}

interface WhiteboardUpdateWidgetAction
  extends PayloadAction<ShellWidgetProps<AllWidgetTypes>> {
  type: "whiteboard/updateWidget";
}

interface WhiteboardDeleteWidgetAction extends PayloadAction<string> {
  type: "whiteboard/deleteWidget";
}

type WhiteboardAction =
  | WhiteboardAddWidgetAction
  | WhiteboardUpdateWidgetAction
  | WhiteboardDeleteWidgetAction;

export const createWebSocketMiddleware = (socket: WebSocket): Middleware => {
  const debouncedSend = createDebouncedSend(socket);

  return (store) => (next) => (action: unknown) => {
    const result = next(action);

    // 타입 가드
    if (!isWhiteboardAction(action)) return result;

    // 타입 단언
    const whiteboardAction = action as WhiteboardAction;

    switch (whiteboardAction.type) {
      case "whiteboard/addWidget":
        let addMessage;
        switch (whiteboardAction.payload.innerWidget.type) {
          case "text":
            addMessage = {
              type: "action",
              transactionId: null,
              actions: [
                {
                  action: "create",
                  type: "widget",
                  data: {
                    id: whiteboardAction.payload.id,
                    type: whiteboardAction.payload.innerWidget.type,
                    data: {
                      content: whiteboardAction.payload.innerWidget.text,
                    },
                    position: {
                      x: whiteboardAction.payload.x,
                      y: whiteboardAction.payload.y,
                      z: 1,
                    },
                    size: {
                      width: whiteboardAction.payload.width,
                      height: whiteboardAction.payload.height,
                    },
                    state: "default",
                  },
                },
              ],
            };
            break;
          case "url":
            addMessage = {
              type: "action",
              transactionId: null,
              actions: [
                {
                  action: "create",
                  type: "widget",
                  data: {
                    id: whiteboardAction.payload.id,
                    type: "embed_url",
                    data: {
                      src: whiteboardAction.payload.innerWidget.src,
                    },
                    position: {
                      x: whiteboardAction.payload.x,
                      y: whiteboardAction.payload.y,
                      z: 1,
                    },
                    size: {
                      width: whiteboardAction.payload.width,
                      height: whiteboardAction.payload.height,
                    },
                    state: "default",
                  },
                },
              ],
            };
            break;
          case "pdf":
            addMessage = {
              type: "action",
              transactionId: null,
              actions: [
                {
                  action: "create",
                  type: "widget",
                  data: {
                    id: whiteboardAction.payload.id,
                    type: "embed_pdf",
                    data: {
                      src: whiteboardAction.payload.innerWidget.src,
                    },
                    position: {
                      x: whiteboardAction.payload.x,
                      y: whiteboardAction.payload.y,
                      z: 1,
                    },
                    size: {
                      width: whiteboardAction.payload.width,
                      height: whiteboardAction.payload.height,
                    },
                    state: "default",
                  },
                },
              ],
            };
            break;
          case "image":
            addMessage = {
              type: "action",
              transactionId: null,
              actions: [
                {
                  action: "create",
                  type: "widget",
                  data: {
                    id: whiteboardAction.payload.id,
                    type: "embed_img",
                    data: {
                      src: whiteboardAction.payload.innerWidget.src,
                    },
                    position: {
                      x: whiteboardAction.payload.x,
                      y: whiteboardAction.payload.y,
                      z: 1,
                    },
                    size: {
                      width: whiteboardAction.payload.width,
                      height: whiteboardAction.payload.height,
                    },
                    state: "default",
                  },
                },
              ],
            };
            break;
        }
        console.log("WebSocket addWidget message:", addMessage);
        socket.send(JSON.stringify(addMessage));
        break;

      case "whiteboard/updateWidget":
        // 업데이트는 디바운스 적용
        let updateMessage;
        switch (whiteboardAction.payload.innerWidget.type) {
          case "text":
            updateMessage = debouncedSend({
              type: "action",
              transactionId: null,
              actions: [
                {
                  action: "update",
                  type: "widget",
                  data: {
                    id: whiteboardAction.payload.id,
                    type: whiteboardAction.payload.innerWidget.type,
                    data: {
                      content: whiteboardAction.payload.innerWidget.text,
                    },
                    position: {
                      x: whiteboardAction.payload.x,
                      y: whiteboardAction.payload.y,
                      z: 1,
                    },
                    size: {
                      width: whiteboardAction.payload.width,
                      height: whiteboardAction.payload.height,
                    },
                    state: "default",
                  },
                },
              ],
            });
            break;
          case "url":
            updateMessage = debouncedSend({
              type: "action",
              transactionId: null,
              actions: [
                {
                  action: "update",
                  type: "widget",
                  data: {
                    id: whiteboardAction.payload.id,
                    type: "embed_url",
                    data: {
                      src: whiteboardAction.payload.innerWidget.src,
                    },
                    position: {
                      x: whiteboardAction.payload.x,
                      y: whiteboardAction.payload.y,
                      z: 1,
                    },
                    size: {
                      width: whiteboardAction.payload.width,
                      height: whiteboardAction.payload.height,
                    },
                    state: "default",
                  },
                },
              ],
            });
            break;
          case "pdf":
            updateMessage = debouncedSend({
              type: "action",
              transactionId: null,
              actions: [
                {
                  action: "update",
                  type: "widget",
                  data: {
                    id: whiteboardAction.payload.id,
                    type: "embed_pdf",
                    data: {
                      src: whiteboardAction.payload.innerWidget.src,
                    },
                    position: {
                      x: whiteboardAction.payload.x,
                      y: whiteboardAction.payload.y,
                      z: 1,
                    },
                    size: {
                      width: whiteboardAction.payload.width,
                      height: whiteboardAction.payload.height,
                    },
                    state: "default",
                  },
                },
              ],
            });
            break;
          case "image":
            updateMessage = debouncedSend({
              type: "action",
              transactionId: null,
              actions: [
                {
                  action: "update",
                  type: "widget",
                  data: {
                    id: whiteboardAction.payload.id,
                    type: "embed_img",
                    data: {
                      src: whiteboardAction.payload.innerWidget.src,
                    },
                    position: {
                      x: whiteboardAction.payload.x,
                      y: whiteboardAction.payload.y,
                      z: 1,
                    },
                    size: {
                      width: whiteboardAction.payload.width,
                      height: whiteboardAction.payload.height,
                    },
                    state: "default",
                  },
                },
              ],
            });
            break;
        }
        break;

      case "whiteboard/deleteWidget":
        const deleteMessage = {
          type: "action",
          transactionId: null,
          actions: [
            {
              action: "delete",
              type: "widget",
              data: {
                id: whiteboardAction.payload,
              },
            },
          ],
        };
        console.log("WebSocket deleteWidget message:", deleteMessage);
        socket.send(JSON.stringify(deleteMessage));

        break;
    }

    return result;
  };
};

// 타입 가드 함수 수정
function isWhiteboardAction(action: unknown): action is WhiteboardAction {
  if (typeof action !== "object" || action === null) return false;

  const { type } = action as { type: string };
  return (
    type === "whiteboard/addWidget" ||
    type === "whiteboard/updateWidget" ||
    type === "whiteboard/deleteWidget"
  );
}
