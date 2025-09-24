import { createSlice } from "@reduxjs/toolkit";

const fileSelectionSlice = createSlice({
  name: "fileSelection",
  initialState: {
    selectedFiles: [],
  },
  reducers: {
    setSelectedFiles: (state, action) => {
      state.selectedFiles = action.payload;
    },
    clearSelectedFiles: (state) => {
      state.selectedFiles = [];
    },
  },
});

export const { setSelectedFiles, clearSelectedFiles } = fileSelectionSlice.actions;
export default fileSelectionSlice.reducer;