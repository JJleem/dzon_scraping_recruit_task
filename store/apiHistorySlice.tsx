import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

// 클라이언트 환경인지 확인하는 함수
const isClient = typeof window !== "undefined";

// localStorage에서 상태를 복원하는 함수
const loadState = (): ApiCallHistory[] => {
  if (!isClient) return []; // SSR 환경에서는 빈 배열 반환
  try {
    const serializedState = localStorage.getItem("apiHistory");
    return serializedState ? JSON.parse(serializedState) : [];
  } catch (error) {
    console.error("Could not load state:", error);
    return [];
  }
};

// localStorage에 상태를 저장하는 함수
const saveState = (state: ApiCallHistory[]) => {
  if (!isClient) return; // SSR 환경에서는 저장하지 않음
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("apiHistory", serializedState);
  } catch (error) {
    console.error("Could not save state:", error);
  }
};

interface ApiCallHistory {
  id?: string;
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
  history: loadState(), // 클라이언트에서만 로드
};

const apiHistorySlice = createSlice({
  name: "apiHistory",
  initialState,
  reducers: {
    addApiCall(state, action: PayloadAction<ApiCallHistory>) {
      const newRecord = { ...action.payload, id: uuidv4() };
      state.history.push(newRecord);
      saveState(state.history); // 상태 변경 후 localStorage에 저장
    },
    toggleBookmark(state, action: PayloadAction<string>) {
      const item = state.history.find((record) => record.id === action.payload);
      if (item) {
        item.isBookmarked = !item.isBookmarked;
        saveState(state.history); // 상태 변경 후 localStorage에 저장
      }
    },
    deleteApiCall(state, action: PayloadAction<string>) {
      state.history = state.history.filter(
        (record) => record.id !== action.payload
      );
      saveState(state.history); // 상태 변경 후 localStorage에 저장
    },
  },
});

export const { addApiCall, toggleBookmark, deleteApiCall } =
  apiHistorySlice.actions;
export default apiHistorySlice.reducer;
