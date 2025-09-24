import { createSlice } from "@reduxjs/toolkit";

const fileStatusSlice = createSlice({
  name: "fileStatus",
  initialState: {},
  reducers: {
    setFileStatuses: (state, action) => {
      // action.payload should be an object: { [fileId]: "success" | "failure" }
      return { ...state, ...action.payload };
    },
    clearFileStatuses: () => {
      return {};
    }
  }
});

export const { setFileStatuses, clearFileStatuses } = fileStatusSlice.actions;
export default fileStatusSlice.reducer;