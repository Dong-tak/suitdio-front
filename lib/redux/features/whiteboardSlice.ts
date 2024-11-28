import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AllWidgetTypes, ShellWidgetProps, TextWidget } from "@/types/type";

// 액션 타입 정의
type ActionType = "CREATE_WIDGET" | "DELETE_WIDGET" | "UPDATE_WIDGET";

// 커맨드 인터페이스 정의
interface Command {
  type: ActionType;
  payload: string | ShellWidgetProps<AllWidgetTypes>; //type 정의 필요
  timestamp: number;
}

interface WhiteboardState {
  widgets: ShellWidgetProps<AllWidgetTypes>[];
  selectedWidget: string[] | null;
  editModeWidgets: string | string[] | null;
  history: {
    past: Command[];
    future: Command[];
  };
  lastSavedState: ShellWidgetProps<AllWidgetTypes>[];
  deletedWidgets: ShellWidgetProps<AllWidgetTypes>[];
  isReduced: boolean;
}

const initialState: WhiteboardState = {
  widgets: [],
  selectedWidget: null,
  editModeWidgets: null,
  history: {
    past: [],
    future: [],
  },
  lastSavedState: [],
  deletedWidgets: [],
  isReduced: false,
};

const whiteboardSlice = createSlice({
  name: "whiteboard",
  initialState,
  reducers: {

    setInitialWidgets: (
      state,
      action: PayloadAction<ShellWidgetProps<AllWidgetTypes>>
    ) => {
      state.widgets.push(action.payload);
      state.selectedWidget = null;
      state.editModeWidgets = null;
      state.history = {
        past: [],
        future: [],
      };
    },
=======

    addWidget: (
      state,
      action: PayloadAction<ShellWidgetProps<AllWidgetTypes>>
    ) => {
      state.widgets.push(action.payload);
      state.history.past.push({
        type: "CREATE_WIDGET",
        payload: action.payload,
        timestamp: Date.now(),
      });
      state.history.future = []; // 새 액션이 발생하면 future 초기화
      state.lastSavedState = [...state.widgets];
    },
    addMiddleWidget: (
      state,
      action: PayloadAction<ShellWidgetProps<AllWidgetTypes>>
    ) => {
      state.widgets.push(action.payload);
    },
    updateWidget: (
      state,
      action: PayloadAction<ShellWidgetProps<AllWidgetTypes>>
    ) => {
      const index = state.widgets.findIndex((w) => w.id === action.payload.id);
      if (index !== -1) {
        const oldWidget = state.widgets[index];
        state.history.past.push({
          type: "UPDATE_WIDGET",
          payload: oldWidget, // 이전 상태를 저장
          timestamp: Date.now(),
        });
        state.widgets[index] = action.payload;
        state.history.future = []; // 새 액션이 발생하면 future 초기화
        state.lastSavedState = [...state.widgets];
      }
    },
    deleteWidget: (state, action: PayloadAction<string>) => {
      const deletedWidget = state.widgets.filter(
        (w) => w.id === action.payload
      );
      if (deletedWidget.length > 0) {
        deletedWidget.forEach((widget) => {
          state.deletedWidgets.push(widget);
        });
      }
      state.widgets = state.widgets.filter((w) => w.id !== action.payload);
      // history에 DELETE_WIDGET 액션 추가
      state.history.past.push({
        type: "DELETE_WIDGET",
        payload: action.payload,
        timestamp: Date.now(),
      });
      state.history.future = []; // 새 액션이 발생하면 future 초기화
      state.lastSavedState = [...state.widgets];
    },
    addWidgetFrom: (
      state,
      action: PayloadAction<{
        widgetId: string;
        fromWidget: ShellWidgetProps<AllWidgetTypes>;
      }>
    ) => {
      const index = state.widgets.findIndex(
        (w) => w.id === action.payload.widgetId
      );
      if (index !== -1) {
        state.widgets[index].from.push(action.payload.fromWidget);
      }
    },
    addWidgetTo: (
      state,
      action: PayloadAction<{
        widgetId: string;
        toWidget: ShellWidgetProps<AllWidgetTypes>;
      }>
    ) => {
      const index = state.widgets.findIndex(
        (w) => w.id === action.payload.widgetId
      );
      if (index !== -1) {
        state.widgets[index].to.push(action.payload.toWidget);
      }
    },

    setSelectedWidget: (state, action: PayloadAction<string[] | null>) => {
      state.selectedWidget = action.payload;
    },
    addSelectedWidget: (state, action: PayloadAction<string>) => {
      if (state.selectedWidget && Array.isArray(state.selectedWidget)) {
        state.selectedWidget.push(action.payload);
      }
    },
    deleteSelectedWidget: (state, action: PayloadAction<string>) => {
      if (state.selectedWidget && Array.isArray(state.selectedWidget)) {
        state.selectedWidget = state.selectedWidget.filter(
          (id) => id !== action.payload
        );
      }
    },
    setEditModeWidgets: (state, action: PayloadAction<string | null>) => {
      state.editModeWidgets = action.payload;
    },
    setIsReduced: (state, action: PayloadAction<boolean>) => {
      state.isReduced = action.payload;
    },

    // Undo 액션
    undo: (state) => {
      if (state.history.past.length === 0) return;

      const lastCommand = state.history.past[state.history.past.length - 1];
      const newPast = state.history.past.slice(0, -1);

      // 현재 상태를 future에 저장
      state.history.future = [lastCommand, ...state.history.future].slice(
        0,
        20
      );
      state.history.past = newPast.slice(-20); // 최대 20개까지만 저장

      // 마지막 명령 되돌리기
      switch (lastCommand.type) {
        case "CREATE_WIDGET":
          state.widgets = state.widgets.filter(
            (w) =>
              w.id !==
              (lastCommand.payload as ShellWidgetProps<AllWidgetTypes>).id
          );
          break;
        case "DELETE_WIDGET":
          if (typeof lastCommand.payload === "string") {
            const deletedWidget = state.deletedWidgets.filter(
              (w) => w.id === lastCommand.payload
            );
            if (deletedWidget) {
              deletedWidget.forEach((widget) => {
                state.widgets.push(widget);
              });
            }
          }
          break;
        case "UPDATE_WIDGET":
          const updatedWidgetIndex = state.lastSavedState.findIndex(
            (w) =>
              w.id ===
              (lastCommand.payload as ShellWidgetProps<AllWidgetTypes>).id
          );
          if (updatedWidgetIndex !== -1) {
            state.widgets[updatedWidgetIndex] =
              lastCommand.payload as ShellWidgetProps<AllWidgetTypes>;
          }
          break;
      }
    },
    redo: (state) => {
      if (state.history.future.length === 0) return;

      const nextCommand = state.history.future[0];
      const newFuture = state.history.future.slice(1);

      // 현재 상태를 past에 저장
      state.history.past = [...state.history.past, nextCommand].slice(-20);
      state.history.future = newFuture;

      // 다음 명령 재실행
      switch (nextCommand.type) {
        case "CREATE_WIDGET":
          if (typeof nextCommand.payload !== "string") {
            state.widgets.push(nextCommand.payload);
          }
          break;
        case "DELETE_WIDGET":
          if (typeof nextCommand.payload === "string") {
            state.widgets = state.widgets.filter(
              (w) => w.id !== nextCommand.payload
            );
          }
          break;
        case "UPDATE_WIDGET":
          const updatedWidgetIndex = state.lastSavedState.findIndex(
            (w) =>
              w.id ===
              (nextCommand.payload as ShellWidgetProps<AllWidgetTypes>).id
          );
          if (updatedWidgetIndex !== -1) {
            state.widgets[updatedWidgetIndex] =
              nextCommand.payload as ShellWidgetProps<AllWidgetTypes>;
          }
          break;
      }
    },
  },
});

export const {
  setInitialWidgets,
  addWidget,
  updateWidget,
  deleteWidget,
  addMiddleWidget,
  setSelectedWidget,
  addSelectedWidget,
  deleteSelectedWidget,
  setEditModeWidgets,
  setIsReduced,
  addWidgetFrom,
  addWidgetTo,
  undo,
  redo,
} = whiteboardSlice.actions;
export default whiteboardSlice.reducer;
