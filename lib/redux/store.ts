import { configureStore } from '@reduxjs/toolkit';
import whiteboardReducer from './features/whiteboardSlice';
import arrowReducer from './features/arrowSlice';
import registerReducer from './features/registerSlice';
import { createWebSocketMiddleware } from './middleware/websocketMiddleware';

export const store = configureStore({
  reducer: {
    whiteboard: whiteboardReducer,
    arrow: arrowReducer,
    register: registerReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const socket = new WebSocket(
      'ws://192.168.219.128:8000/v1/play/board/0HW3057JC7TKW/'
    );
    return getDefaultMiddleware().concat(createWebSocketMiddleware(socket));
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
