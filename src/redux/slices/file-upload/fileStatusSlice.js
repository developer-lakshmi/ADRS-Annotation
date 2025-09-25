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
    },
    updateFileStatus: (state, action) => {
      // action.payload: { fileId, status }
      const { fileId, status } = action.payload;
      if (fileId) {
        state[fileId] = status;
      }
    }
  }
});

export const { setFileStatuses, clearFileStatuses, updateFileStatus } = fileStatusSlice.actions;
export default fileStatusSlice.reducer;