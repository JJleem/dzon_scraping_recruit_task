import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

interface ApiCallHistory {
  id?: string; // 고유 id 추가
  timestamp: string;
  apiName: string;
  apiCode: string;
  moduleCode: string;
  moduleName: string;
  isBookmarked?: boolean;
}

interface ApiHistoryState {
  history: ApiCallHistory[];
}

const initialState: ApiHistoryState = {
  history: [],
};

const apiHistorySlice = createSlice({
  name: "apiHistory",
  initialState,
  reducers: {
    addApiCall(state, action: PayloadAction<ApiCallHistory>) {
      state.history.push({
        ...action.payload,
        id: uuidv4(), // 고유 id 생성
      });
    },
    toggleBookmark(state, action: PayloadAction<string>) {
      const item = state.history.find((record) => record.id === action.payload);
      if (item) {
        item.isBookmarked = !item.isBookmarked;
      }
    },
  },
});

export const { addApiCall, toggleBookmark } = apiHistorySlice.actions;
export default apiHistorySlice.reducer;
