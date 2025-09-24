import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: false,
  isSubSidebarOpen: false, // Sub-sidebar is closed by default
  activeSidebar: null,
  activeSubSidebar: null,
  isMobileSidebarOpen: false, // NEW
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setActiveSidebar(state, action) {
      console.log("setActiveSidebar called with:", action.payload); // Debug log
      state.activeSidebar = action.payload; // Update the active Sidebar menu
      state.isSubSidebarOpen = true; // Open the Sub-sidebar
    },

    closeSubSidebar(state) {
      console.log("closeSubSidebar called"); // Debug log
      state.isSubSidebarOpen = false; // Close the Sub-sidebar
      state.activeSubSidebar = null; // Reset the active Sub-sidebar menu
    },

    resetSidebarState(state) {
      console.log("resetSidebarState called"); // Debug log
      return initialState; // Reset the state to its initial values
    },
    toggleMobileSidebar(state, action) {
      if (typeof action.payload === "boolean") {
        state.isMobileSidebarOpen = action.payload;
      } else {
        state.isMobileSidebarOpen = !state.isMobileSidebarOpen;
      }
      // If closing mobile sidebar, also close subsidebar
      if (!state.isMobileSidebarOpen) {
        state.isSubSidebarOpen = false;
        state.activeSubSidebar = null;
      }
    },
  },
});

export const { setActiveSidebar, closeSubSidebar, resetSidebarState, toggleMobileSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;