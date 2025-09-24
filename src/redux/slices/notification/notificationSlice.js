import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    message: "",
    visible: false,
    type: "info", // "success", "error", "info"
  },
  reducers: {
    showNotification: (state, action) => {
      state.message = action.payload.message;
      state.visible = true;
      state.type = action.payload.type || "info";
    },
    hideNotification: (state) => {
      state.message = "";
      state.visible = false;
    },
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;