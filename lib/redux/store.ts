import { configureStore, Middleware } from '@reduxjs/toolkit';
import whiteboardReducer from './features/whiteboardSlice';
import arrowReducer from './features/arrowSlice';
import registerReducer from './features/registerSlice';

// lastAction을 저장할 리듀서
const lastActionReducer = (state = null, action: any) => {
  // 모든 액션을 저장
  return action;
};

export const store = configureStore({
  reducer: {
    whiteboard: whiteboardReducer,
    arrow: arrowReducer,
    register: registerReducer,
    lastAction: lastActionReducer, // lastAction 리듀서 추가
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
