import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "",
  isVisible: false,
  source: null, // Tracks the origin of the modal
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    showModal(state, action) {
      console.log("Triggering modal with message:", action.payload.message, "Source:", action.payload.source);
      state.message = action.payload.message;
      state.isVisible = true;
      state.source = action.payload.source;
    },
    hideModal(state) {
      console.log("Hiding modal");
      state.message = "";
      state.isVisible = false;
      state.source = null;
    },
  },
});

export const { showModal, hideModal } = modalSlice.actions;
export default modalSlice.reducer;