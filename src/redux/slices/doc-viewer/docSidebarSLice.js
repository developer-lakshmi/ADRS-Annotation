import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: true,
  isSubSidebarOpen: false,
  activeSidebar: "doc-info",
  isMobileSidebarOpen: false, // <-- ADD THIS
};

const docSidebarSlice = createSlice({
  name: "docSidebar",
  initialState,
  reducers: {
    setDocSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    setDocSubSidebarOpen: (state, action) => {
      state.isSubSidebarOpen = action.payload;
    },
    setDocActiveSidebar: (state, action) => {
      state.activeSidebar = action.payload;
      state.isSubSidebarOpen = true;
    },
    closeDocSubSidebar: (state) => {
      state.isSubSidebarOpen = false;
    },
    toggleDocMobileSidebar: (state, action) => {
      if (typeof action.payload === "boolean") {
        state.isMobileSidebarOpen = action.payload;
      } else {
        state.isMobileSidebarOpen = !state.isMobileSidebarOpen;
      }
      // Optionally close subsidebar when closing mobile sidebar
      if (!state.isMobileSidebarOpen) {
        state.isSubSidebarOpen = false;
        state.activeSidebar = null;
      }
    },
  },
});

export const {
  setDocSidebarOpen,
  setDocSubSidebarOpen,
  setDocActiveSidebar,
  closeDocSubSidebar,
  toggleDocMobileSidebar, // <-- EXPORT THIS
} = docSidebarSlice.actions;

export default docSidebarSlice.reducer;