import { createSlice } from "@reduxjs/toolkit";

const snackBarSlice = createSlice({
  name: "snackBar",
  initialState: {
    isOpen: false,
    message: "",
    severity: "info", // Can be "success", "error", "warning", "info"
  },
  reducers: {
    showSnackBar(state, action) {
      state.isOpen = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity || "info";
    },
    hideSnackBar(state) {
      state.isOpen = false;
      state.message = "";
      state.severity = "info";
    },
  },
});

export const { showSnackBar, hideSnackBar } = snackBarSlice.actions;
export default snackBarSlice.reducer;