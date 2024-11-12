// features/postsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Posts 상태 인터페이스 정의
interface RegisterState {
  register: string;
}

// 초기 상태 정의
const initialState: RegisterState = {
  register: "",
};

// postsSlice 생성
const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setRegister(state, action: PayloadAction<string>) {
      state.register = action.payload;
    },
  },
});

// 액션과 리듀서 추출
export const { setRegister } = registerSlice.actions;
export default registerSlice.reducer;
