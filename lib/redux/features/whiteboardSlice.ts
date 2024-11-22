import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AllWidgetTypes, ShellWidgetProps } from '@/types/type';
import { Middleware } from 'redux';
import { Action } from '@reduxjs/toolkit';

// 액션 타입 정의
type ActionType =
  | 'CREATE_WIDGET'
  | 'DELETE_WIDGET'
  | 'EDIT_WIDGET'
  | 'RESIZE_WIDGET'
  | 'MOVE_WIDGET'
  | 'STATE_WIDGET';

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
  isReduced: false,
};

const whiteboardSlice = createSlice({
  name: 'whiteboard',
  initialState,
  reducers: {
    addWidget: (
      state,
      action: PayloadAction<ShellWidgetProps<AllWidgetTypes>>
    ) => {
      state.widgets.push(action.payload);
      state.history.past.push({
        type: 'CREATE_WIDGET',
        payload: action.payload,
        timestamp: Date.now(),
      });
      state.history.future = []; // 새 액션이 발생하면 future 초기화
      state.lastSavedState = [...state.widgets];
    },
    updateWidget: (
      state,
      action: PayloadAction<ShellWidgetProps<AllWidgetTypes>>
    ) => {
      const index = state.widgets.findIndex((w) => w.id === action.payload.id);
      if (index !== -1) {
        state.widgets[index] = action.payload;
      }
    },
    deleteWidget: (state, action: PayloadAction<string>) => {
      state.widgets = state.widgets.filter((w) => w.id !== action.payload);
      state.history.past.push({
        type: 'DELETE_WIDGET',
        payload: action.payload,
        timestamp: Date.now(),
      });
      state.history.future = [];
      state.lastSavedState = [...state.widgets];
    },

    // Undo 액션
    undo: (state) => {
      if (state.history.past.length === 0) return;

      const lastCommand = state.history.past[state.history.past.length - 1];
      state.history.past.pop();

      // 마지막 커맨드 되돌리기
      switch (lastCommand.type) {
        case 'CREATE_WIDGET':
          state.widgets = state.widgets.filter(
            (w) =>
              w.id !==
              (lastCommand.payload as ShellWidgetProps<AllWidgetTypes>).id
          );
          break;
      }

      state.history.future.push(lastCommand);
      state.lastSavedState = [...state.widgets];
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
  },
});

export const {
  addWidget,
  updateWidget,
  deleteWidget,
  setSelectedWidget,
  addSelectedWidget,
  deleteSelectedWidget,
  setEditModeWidgets,
  setIsReduced,
} = whiteboardSlice.actions;
export default whiteboardSlice.reducer;
