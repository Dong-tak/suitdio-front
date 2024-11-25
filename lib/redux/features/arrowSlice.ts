import { calculateArrowPoints } from '@/components/arrow/drawArrow';
import { ShellWidgetProps, AllWidgetTypes, Arrow } from '@/types/type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ArrowState {
  isArrowMode: boolean; // 화살표 모드 활성화 여부
  linkWidgets: ShellWidgetProps<AllWidgetTypes>[]; // 화살표로 연결된 위젯들
  arrows: Arrow[]; // 화살표들
}

const initialState: ArrowState = {
  isArrowMode: false,
  linkWidgets: [],
  arrows: [],
};

const arrowSlice = createSlice({
  name: 'arrow',
  initialState,
  reducers: {
    setIsArrowMode: (state, action) => {
      state.isArrowMode = action.payload;
    },
    addLinkWidgets: (state, action) => {
      console.log('리듀서 내부 - 받은 widget.id:', action.payload);
      state.linkWidgets.push(action.payload);
    },
    deleteFirstLinkWidget: (state) => {
      state.linkWidgets.shift();
    },
    deleteLinkWidget: (state) => {
      state.linkWidgets = [];
    },
    addArrow: (state, action) => {
      state.arrows.push(action.payload);
    },
    updateArrow: (state, action: PayloadAction<Arrow>) => {
      const index = state.arrows.findIndex(
        (arrow) =>
          arrow.fromId === action.payload.fromId &&
          arrow.toId === action.payload.toId
      );
      if (index !== -1) {
        state.arrows[index] = action.payload;
      }
    },
    setArrows: (state, action: PayloadAction<Arrow[]>) => {
      state.arrows = action.payload;
    },
    deleteArrow: (state, action: PayloadAction<Arrow>) => {
      state.arrows = state.arrows.filter(
        (arrow) =>
          !(
            arrow.fromId === action.payload.fromId &&
            arrow.toId === action.payload.toId
          )
      );
    },
  },
});

export const {
  setIsArrowMode,
  addLinkWidgets,
  deleteFirstLinkWidget,
  deleteLinkWidget,
  addArrow,
  updateArrow,
  setArrows,
  deleteArrow,
} = arrowSlice.actions;
export default arrowSlice.reducer;
