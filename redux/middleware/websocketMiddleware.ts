import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { store } from "@/redux/store";
import { debounce } from "lodash";
import { getTsid } from "tsid-ts";
import { Arrow } from "@/types/type";

interface RelationAction {
  type: "action";
  transactionId: null;
  actions: {
    action: "create" | "update" | "delete";
    type: "relation";
    data: {
      id: string;
      fromId: string;
      toId: string;
      relation: "forward" | "backward";
      property: Record<string, unknown>;
    };
  }[];
}

let socket: WebSocket | null = null;

// 전역 변수로 마지막 요청 정보를 저장
let lastArrowRequest = {
  fromId: "",
  toId: "",
  timestamp: 0,
};

// 웹소켓 연결 설정 함수
export const setWebSocket = (ws: WebSocket) => {
  socket = ws;
};

// 디바운스된 메시지 전송 함수
const debouncedSend = debounce((message: any) => {
  if (socket) {
    socket.send(JSON.stringify(message));
    console.log("웹소켓 업데이트 메시지 전송:", message);
  }
}, 300);

// 상태 변경 감지 및 메시지 전송
store.subscribe(() => {
  const state = store.getState();
  const action = state.lastAction; // lastAction을 저장하도록 reducer 수정 필요

  if (!socket || !action) return;

  switch (action.type) {
    case "whiteboard/addWidget":
      const addMessage = createAddWidgetMessage(action.payload);
      socket.send(JSON.stringify(addMessage));
      console.log("웹소켓 위젯 생성 메시지 전송:", addMessage);
      break;

    case "whiteboard/updateWidget":
      const updateMessage = createUpdateWidgetMessage(action.payload);
      debouncedSend(updateMessage);
      break;

    case "whiteboard/deleteWidget":
      const deleteMessage = createDeleteWidgetMessage(action.payload);
      socket.send(JSON.stringify(deleteMessage));
      console.log("웹소켓 위젯 삭제 메시지 전송:", deleteMessage);
      break;

    case "arrow/addArrow":
      const arrowMessage = createAddArrowMessage(action.payload);
      if (arrowMessage) {
        socket.send(JSON.stringify(arrowMessage));
        console.log("웹소켓 화살표 관계 생성 메시지 전송:", arrowMessage);
      }
      break;

    case "arrow/deleteArrow":
      const deleteArrowMessage = createDeleteArrowMessage(action.payload);
      socket.send(JSON.stringify(deleteArrowMessage));
      console.log("웹소켓 화살표 관계 삭제 메시지 전송:", deleteArrowMessage);
      break;

    case "arrow/conversionArrow":
      const conversionArrowMessage = createConversionArrowMessage(
        action.payload
      );
      socket.send(JSON.stringify(conversionArrowMessage));
      console.log(
        "웹소켓 화살표 관계 변환 메시지 전송:",
        conversionArrowMessage
      );
      break;
  }
});

// 메시지 생성 함수들
function createAddWidgetMessage(widget: any) {
  const baseMessage = {
    type: "action",
    transactionId: null,
    actions: [
      {
        action: "create",
        type: "widget",
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
          state: "default",
        },
      },
    ],
  };

  switch (widget.innerWidget.type) {
    case "text":
      baseMessage.actions[0].data = {
        ...baseMessage.actions[0].data,
        data: { content: widget.innerWidget.text },
      };
      break;
    case "url":
      baseMessage.actions[0].data = {
        ...baseMessage.actions[0].data,
        type: "embed_url",
        data: { src: widget.innerWidget.src },
      };
      break;
    case "image":
      baseMessage.actions[0].data = {
        ...baseMessage.actions[0].data,
        type: "embed_img",
        data: { src: widget.innerWidget.src },
      };
      break;
    case "pdf":
      baseMessage.actions[0].data = {
        ...baseMessage.actions[0].data,
        type: "embed_pdf",
        data: { src: widget.innerWidget.src },
      };
      break;
    // ... 다른 타입들에 대한 처리
  }

  return baseMessage;
}

function createUpdateWidgetMessage(widget: any) {
  const baseMessage = {
    type: "action",
    transactionId: null,
    actions: [
      {
        action: "update",
        type: "widget",
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
          state: "default",
        },
      },
    ],
  };

  switch (widget.innerWidget.type) {
    case "text":
      baseMessage.actions[0].data = {
        ...baseMessage.actions[0].data,
        data: { content: widget.innerWidget.text },
      };
      break;
    case "url":
      baseMessage.actions[0].data = {
        ...baseMessage.actions[0].data,
        type: "embed_url",
        data: { src: widget.innerWidget.src },
      };
      break;
    case "image":
      baseMessage.actions[0].data = {
        ...baseMessage.actions[0].data,
        type: "embed_img",
        data: { src: widget.innerWidget.src },
      };
      break;
    case "pdf":
      baseMessage.actions[0].data = {
        ...baseMessage.actions[0].data,
        type: "embed_pdf",
        data: { src: widget.innerWidget.src },
      };
      break;
    // ... 다른 타입들에 대한 처리
  }

  return baseMessage;
}

function createDeleteWidgetMessage(widgetId: string) {
  return {
    type: "action",
    transactionId: null,
    actions: [
      {
        action: "delete",
        type: "widget",
        data: { id: widgetId },
      },
    ],
  };
}

function createAddArrowMessage(arrow: {
  id: string;
  fromId: string;
  toId: string;
}) {
  const currentTime = Date.now();

  // 이전 요청과 동일한 fromId, toId를 가진 요청이 100ms 이내에 들어오면 무시
  if (
    lastArrowRequest.fromId === arrow.fromId &&
    lastArrowRequest.toId === arrow.toId &&
    currentTime - lastArrowRequest.timestamp < 100
  ) {
    console.log("중복 화살표 요청 무시:", {
      fromId: arrow.fromId,
      toId: arrow.toId,
      timeDiff: currentTime - lastArrowRequest.timestamp,
    });
    return null;
  }

  // 현재 요청 정보 저장
  lastArrowRequest = {
    fromId: arrow.fromId,
    toId: arrow.toId,
    timestamp: currentTime,
  };

  const relationData: RelationAction = {
    type: "action",
    transactionId: null,
    actions: [
      {
        action: "create",
        type: "relation",
        data: {
          id: arrow.id,
          fromId: arrow.fromId,
          toId: arrow.toId,
          relation: "forward",
          property: {},
        },
      },
    ],
  };

  return relationData;
}

function createDeleteArrowMessage(arrowData: any) {
  const arrow = Array.isArray(arrowData) ? arrowData[0] : arrowData;

  return {
    type: "action",
    actions: [
      {
        type: "relation",
        action: "delete",
        data: {
          id: arrow.id,
        },
      },
    ],
  };
}

function createConversionArrowMessage(arrow: {
  id: string;
  fromId: string;
  toId: string;
}): RelationAction {
  const relationData: RelationAction = {
    type: "action",
    transactionId: null,
    actions: [
      {
        action: "update",
        type: "relation",
        data: {
          id: arrow.id,
          fromId: arrow.fromId,
          toId: arrow.toId,
          relation: "backward",
          property: {},
        },
      },
    ],
  };

  return relationData;
}
