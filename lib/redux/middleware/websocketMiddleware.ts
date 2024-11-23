// 소켓 미들웨어 타입 정의

import { isWhiteboardAction } from '@/types/type';
import { Middleware } from '@reduxjs/toolkit';
import debounce from 'lodash/debounce';

// 디바운스된 소켓 전송 함수 수정
const createDebouncedSend = (socket: WebSocket) => {
  return debounce((message: unknown) => {
    console.log('Debounced WebSocket message:', message);
    socket.send(JSON.stringify(message));
  }, 100);
};

export const createWebSocketMiddleware = (socket: WebSocket): Middleware => {
  const debouncedSend = createDebouncedSend(socket);

  return (store) => (next) => (action: unknown) => {
    const result = next(action);

    // 타입 가드 추가
    if (!isWhiteboardAction(action)) return result;

    switch (action.type) {
      case 'whiteboard/addWidget':
        let addMessage;
        switch (action.payload.innerWidget.type) {
          case 'text':
            addMessage = {
              type: 'action',
              transactionId: null,
              actions: [
                {
                  action: 'create',
                  type: 'widget',
                  data: {
                    id: action.payload.id,
                    workspaceId: '0HS78Z813DVX6',
                    type: action.payload.innerWidget.type,
                    data: {
                      content: action.payload.innerWidget.text,
                    },
                    position: {
                      x: action.payload.x,
                      y: action.payload.y,
                      z: 1,
                    },
                    size: {
                      width: action.payload.width,
                      height: action.payload.height,
                    },
                    state: 'default',
                  },
                },
              ],
            };
            break;
          case 'url':
            addMessage = {
              type: 'action',
              transactionId: null,
              actions: [
                {
                  action: 'create',
                  type: 'widget',
                  data: {
                    id: action.payload.id,
                    workspaceId: '0HS78Z813DVX6',
                    type: 'embed_url',
                    data: {
                      src: action.payload.innerWidget.src,
                    },
                    position: {
                      x: action.payload.x,
                      y: action.payload.y,
                      z: 1,
                    },
                    size: {
                      width: action.payload.width,
                      height: action.payload.height,
                    },
                    state: 'default',
                  },
                },
              ],
            };
            break;
          case 'pdf':
            addMessage = {
              type: 'action',
              transactionId: null,
              actions: [
                {
                  action: 'create',
                  type: 'widget',
                  data: {
                    id: action.payload.id,
                    workspaceId: '0HS78Z813DVX6',
                    type: 'embed_pdf',
                    data: {
                      src: action.payload.innerWidget.src,
                    },
                    position: {
                      x: action.payload.x,
                      y: action.payload.y,
                      z: 1,
                    },
                    size: {
                      width: action.payload.width,
                      height: action.payload.height,
                    },
                    state: 'default',
                  },
                },
              ],
            };
            break;
          case 'image':
            addMessage = {
              type: 'action',
              transactionId: null,
              actions: [
                {
                  action: 'create',
                  type: 'widget',
                  data: {
                    id: action.payload.id,
                    workspaceId: '0HS78Z813DVX6',
                    type: 'embed_img',
                    data: {
                      src: action.payload.innerWidget.src,
                    },
                    position: {
                      x: action.payload.x,
                      y: action.payload.y,
                      z: 1,
                    },
                    size: {
                      width: action.payload.width,
                      height: action.payload.height,
                    },
                    state: 'default',
                  },
                },
              ],
            };
            break;
        }
        console.log('WebSocket addWidget message:', addMessage);
        socket.send(JSON.stringify(addMessage));
        break;

      case 'whiteboard/updateWidget':
        // 업데이트는 디바운스 적용
        let updateMessage;
        switch (action.payload.innerWidget.type) {
          case 'text':
            updateMessage = debouncedSend({
              type: 'action',
              transactionId: null,
              actions: [
                {
                  action: 'update',
                  type: 'widget',
                  data: {
                    id: action.payload.id,
                    workspaceId: '0HS78Z813DVX6',
                    type: action.payload.innerWidget.type,
                    data: {
                      content: action.payload.innerWidget.text,
                    },
                    position: {
                      x: action.payload.x,
                      y: action.payload.y,
                      z: 1,
                    },
                    size: {
                      width: action.payload.width,
                      height: action.payload.height,
                    },
                    state: 'default',
                  },
                },
              ],
            });
            break;
          case 'url':
            updateMessage = debouncedSend({
              type: 'action',
              transactionId: null,
              actions: [
                {
                  action: 'update',
                  type: 'widget',
                  data: {
                    id: action.payload.id,
                    workspaceId: '0HS78Z813DVX6',
                    type: 'embed_url',
                    data: {
                      src: action.payload.innerWidget.src,
                    },
                    position: {
                      x: action.payload.x,
                      y: action.payload.y,
                      z: 1,
                    },
                    size: {
                      width: action.payload.width,
                      height: action.payload.height,
                    },
                    state: 'default',
                  },
                },
              ],
            });
            break;
          case 'pdf':
            updateMessage = debouncedSend({
              type: 'action',
              transactionId: null,
              actions: [
                {
                  action: 'update',
                  type: 'widget',
                  data: {
                    id: action.payload.id,
                    workspaceId: '0HS78Z813DVX6',
                    type: 'embed_pdf',
                    data: {
                      src: action.payload.innerWidget.src,
                    },
                    position: {
                      x: action.payload.x,
                      y: action.payload.y,
                      z: 1,
                    },
                    size: {
                      width: action.payload.width,
                      height: action.payload.height,
                    },
                    state: 'default',
                  },
                },
              ],
            });
            break;
          case 'image':
            updateMessage = debouncedSend({
              type: 'action',
              transactionId: null,
              actions: [
                {
                  action: 'update',
                  type: 'widget',
                  data: {
                    id: action.payload.id,
                    workspaceId: '0HS78Z813DVX6',
                    type: 'embed_img',
                    data: {
                      src: action.payload.innerWidget.src,
                    },
                    position: {
                      x: action.payload.x,
                      y: action.payload.y,
                      z: 1,
                    },
                    size: {
                      width: action.payload.width,
                      height: action.payload.height,
                    },
                    state: 'default',
                  },
                },
              ],
            });
            break;
        }
        break;

      case 'whiteboard/deleteWidget':
        const deleteMessage = {
          type: 'action',
          transactionId: null,
          actions: [
            {
              action: 'delete',
              type: 'widget',
              data: {
                id: action.payload,
              },
            },
          ],
        };
        console.log('WebSocket deleteWidget message:', deleteMessage);
        socket.send(JSON.stringify(deleteMessage));
        break;
    }

    return result;
  };
};
