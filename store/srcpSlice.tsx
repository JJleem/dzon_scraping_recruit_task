import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ApiCallResult {
  success: boolean;
  data?: any;
  error?: any;
  apiCd: string;
  mdulCustCd: string;
}

interface ScrapingState {
  results: ApiCallResult[]; // 여러 API 호출 결과를 저장
  currentRecord: ApiCallResult | null; // 현재 활성 데이터
}

const initialState: ScrapingState = {
  results: [],
  currentRecord: null,
};

const scrpSlice = createSlice({
  name: "scraping",
  initialState,
  reducers: {
    // 모든 호출 결과 추가
    addScrapingData(state, action: PayloadAction<ApiCallResult[]>) {
      state.results = action.payload;
    },
    // 특정 데이터를 현재 활성 데이터로 설정
    setCurrentScrapingData(
      state,
      action: PayloadAction<{ apiCd: string; mdulCustCd: string }>
    ) {
      state.currentRecord =
        state.results.find(
          (record) =>
            record.apiCd === action.payload.apiCd &&
            record.mdulCustCd === action.payload.mdulCustCd
        ) || null;
    },
    // 모든 데이터 초기화
    clearScrapingData(state) {
      state.results = [];
      state.currentRecord = null;
    },
  },
});

export const { addScrapingData, setCurrentScrapingData, clearScrapingData } =
  scrpSlice.actions;

export default scrpSlice.reducer;
