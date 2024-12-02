import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { store } from '@/lib/redux/store';
import { debounce } from 'lodash';

let socket: WebSocket | null = null;

// 웹소켓 연결 설정 함수
export const setWebSocket = (ws: WebSocket) => {
  socket = ws;
};

// 디바운스된 메시지 전송 함수
const debouncedSend = debounce((message: any) => {
  if (socket) {
    socket.send(JSON.stringify(message));
    console.log('웹소켓 업데이트 메시지 전송:', message);
  }
}, 300);

// 상태 변경 감지 및 메시지 전송
store.subscribe(() => {
  const state = store.getState();
  const action = state.lastAction; // lastAction을 저장하도록 reducer 수정 필요

  if (!socket || !action) return;

  switch (action.type) {
    case 'whiteboard/addWidget':
      const addMessage = createAddWidgetMessage(action.payload);
      socket.send(JSON.stringify(addMessage));
      console.log('웹소켓 위젯 생성 메시지 전송:', addMessage);
      break;

    case 'whiteboard/updateWidget':
      const updateMessage = createUpdateWidgetMessage(action.payload);
      debouncedSend(updateMessage);
      break;

    case 'whiteboard/deleteWidget':
      const deleteMessage = createDeleteWidgetMessage(action.payload);
      socket.send(JSON.stringify(deleteMessage));
      console.log('웹소켓 위젯 삭제 메시지 전송:', deleteMessage);
      break;
  }
});

// 메시지 생성 함수들
function createAddWidgetMessage(widget: any) {
  const baseMessage = {
    type: 'action',
    transactionId: null,
    actions: [
      {
        action: 'create',
        type: 'widget',
        data: {
          type: widget.innerWidget.type,
          id: widget.id,
          position: {
            x: widget.x,
            y: widget.y,
            z: 1,
          },
          data: {},
          size: {
            width: widget.width,
            height: widget.height,
          },
          state: 'default',
        },
      },
    ],
  };

  switch (widget.innerWidget.type) {
    case 'text':
      baseMessage.actions[0].data = {
        ...baseMessage.actions[0].data,
        data: { content: widget.innerWidget.text },
      };
      break;
    case 'url':
      baseMessage.actions[0].data = {
        ...baseMessage.actions[0].data,
        type: 'embed_url',
        data: { src: widget.innerWidget.src },
      };
      break;
    case 'image':
      baseMessage.actions[0].data = {
        ...baseMessage.actions[0].data,
        type: 'embed_img',
        data: { src: widget.innerWidget.src },
      };
      break;
    case 'pdf':
      baseMessage.actions[0].data = {
        ...baseMessage.actions[0].data,
        type: 'embed_pdf',
        data: { src: widget.innerWidget.src },
      };
      break;
    // ... 다른 타입들에 대한 처리
  }

  return baseMessage;
}

function createUpdateWidgetMessage(widget: any) {
  const baseMessage = {
    type: 'action',
    transactionId: null,
    actions: [
      {
        action: 'update',
        type: 'widget',
        data: {
          type: widget.innerWidget.type,
          id: widget.id,
          position: {
            x: widget.x,
            y: widget.y,
            z: 1,
          },
          data: {},
          size: {
            width: widget.width,
            height: widget.height,
          },
          state: 'default',
        },
      },
    ],
  };

  switch (widget.innerWidget.type) {
    case 'text':
      baseMessage.actions[0].data = {
        ...baseMessage.actions[0].data,
        data: { content: widget.innerWidget.text },
      };
      break;
    case 'url':
      baseMessage.actions[0].data = {
        ...baseMessage.actions[0].data,
        type: 'embed_url',
        data: { src: widget.innerWidget.src },
      };
      break;
    case 'image':
      baseMessage.actions[0].data = {
        ...baseMessage.actions[0].data,
        type: 'embed_img',
        data: { src: widget.innerWidget.src },
      };
      break;
    case 'pdf':
      baseMessage.actions[0].data = {
        ...baseMessage.actions[0].data,
        type: 'embed_pdf',
        data: { src: widget.innerWidget.src },
      };
      break;
    // ... 다른 타입들에 대한 처리
  }

  return baseMessage;
}

function createDeleteWidgetMessage(widgetId: string) {
  return {
    type: 'action',
    transactionId: null,
    actions: [
      {
        action: 'delete',
        type: 'widget',
        data: { id: widgetId },
      },
    ],
  };
}
