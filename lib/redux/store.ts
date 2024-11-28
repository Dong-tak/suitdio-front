import { configureStore, Middleware } from '@reduxjs/toolkit';
import whiteboardReducer from './features/whiteboardSlice';
import arrowReducer from './features/arrowSlice';
import registerReducer from './features/registerSlice';
import { createWebSocketMiddleware } from './middleware/websocketMiddleware';

// 초기 store 생성 (웹소켓 미들웨어 없이)
export const createStore = (additionalMiddleware?: Middleware[]) => {
  return configureStore({
    reducer: {
      whiteboard: whiteboardReducer,
      arrow: arrowReducer,
      register: registerReducer,
    },
    middleware: (getDefaultMiddleware) =>
      additionalMiddleware
        ? getDefaultMiddleware().concat(additionalMiddleware)
        : getDefaultMiddleware(),
  });
};

// 초기 store 인스턴스 생성
export const store = createStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
