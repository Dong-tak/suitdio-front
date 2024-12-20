import { ShellWidgetProps, AllWidgetTypes, Arrow } from "@/types/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { deleteWidget } from "./whiteboardSlice";

interface ArrowState {
  isArrowMode: boolean; // 화살표 모드 활성화 여부
  linkWidgets: ShellWidgetProps<AllWidgetTypes>[]; // 화살표로 연결된 위젯들
  arrows: Arrow[]; // 화살표들
  selectedArrows: Arrow[]; // 선택된 화살표들
}

const initialState: ArrowState = {
  isArrowMode: false,
  linkWidgets: [],
  arrows: [],
  selectedArrows: [],
};

const arrowSlice = createSlice({
  name: "arrow",
  initialState,
  reducers: {
    setIsArrowMode: (state, action) => {
      state.isArrowMode = action.payload;
    },
    addLinkWidgets: (state, action) => {
      console.log("리듀서 내부 - 받은 widget.id:", action.payload);
      state.linkWidgets.push(action.payload);
    },
    deleteFirstLinkWidget: (state) => {
      state.linkWidgets.shift();
    },
    deleteLinkWidget: (state) => {
      state.linkWidgets = [];
    },
    addArrow: (state, action) => {
      // 중복 체크
      const isDuplicate = state.arrows.some(
        (arrow) =>
          (arrow.fromId === action.payload.fromId &&
            arrow.toId === action.payload.toId) ||
          (arrow.fromId === action.payload.toId &&
            arrow.toId === action.payload.fromId)
      );

      if (!isDuplicate) {
        state.arrows.push(action.payload);
      } else {
        console.log("중복된 화살표 생성 시도 무시");
      }
    },
    conversionArrow: (state, action: PayloadAction<Arrow>) => {
      const index = state.arrows.findIndex(
        (arrow) => arrow.id === action.payload.id
      );
      if (index !== -1) {
        // 화살표 객체 전체를 새로운 값으로 교체
        state.arrows[index] = {
          id: action.payload.id,
          fromId: action.payload.fromId, // 새로운 fromId (이전의 toId)
          toId: action.payload.toId, // 새로운 toId (이전의 fromId)
          points: action.payload.points,
          arrowTipX: action.payload.arrowTipX,
          arrowTipY: action.payload.arrowTipY,
        };

        // 선택된 화살표도 업데이트
        const selectedIndex = state.selectedArrows.findIndex(
          (arrow) => arrow.id === action.payload.id
        );
        if (selectedIndex !== -1) {
          state.selectedArrows[selectedIndex] = state.arrows[index];
        }

        // 콘솔에 로그 추가
        console.log("화살표 방향 전환:", {
          before: {
            fromId: state.arrows[index].fromId,
            toId: state.arrows[index].toId,
          },
          after: {
            fromId: action.payload.fromId,
            toId: action.payload.toId,
          },
        });
      }
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
    deleteArrow: (state, action: PayloadAction<Arrow[]>) => {
      state.arrows = state.arrows.filter(
        (arrow) =>
          !action.payload.some((selectedArrow) => selectedArrow.id === arrow.id)
      );
    },

    setSelectedArrows: (state, action: PayloadAction<Arrow[]>) => {
      state.selectedArrows = action.payload;
    },
    addSelectedArrow: (state, action: PayloadAction<Arrow>) => {
      state.selectedArrows.push(action.payload);
    },
    deleteSelectedArrow: (state, action: PayloadAction<Arrow>) => {
      state.selectedArrows = state.selectedArrows.filter(
        (arrow) => arrow.id !== action.payload.id
      );
    },
  },
  //위젯삭제시 관련된 화살표들도 삭제 처리
  extraReducers: (builder) => {
    builder.addCase(deleteWidget, (state, action) => {
      const widgetId = action.payload;
      // 삭제된 위젯과 연결된 모든 화살표 제거
      state.arrows = state.arrows.filter(
        (arrow: Arrow) => arrow.fromId !== widgetId && arrow.toId !== widgetId
      );
      // 선택된 화살표들도 업데이트
      state.selectedArrows = state.selectedArrows.filter(
        (arrow: Arrow) => arrow.fromId !== widgetId && arrow.toId !== widgetId
      );
      // 연결 위젯 목록도 초기화
      state.linkWidgets = state.linkWidgets.filter(
        (widget) => widget.id !== widgetId
      );
    });
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
  setSelectedArrows,
  addSelectedArrow,
  deleteSelectedArrow,
  conversionArrow,
} = arrowSlice.actions;
export default arrowSlice.reducer;
