import { ShellWidgetProps, AllWidgetTypes } from '@/types/type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ArrowState {
  isArrowMode: boolean; // 화살표 모드 활성화 여부
}

const initialState: ArrowState = {
  isArrowMode: false,
};

const arrowSlice = createSlice({
  name: 'arrow',
  initialState,
  reducers: {
    setIsArrowMode: (state, action) => {
      state.isArrowMode = action.payload;
    },
  },
});

export const { setIsArrowMode } = arrowSlice.actions;
export default arrowSlice.reducer;
