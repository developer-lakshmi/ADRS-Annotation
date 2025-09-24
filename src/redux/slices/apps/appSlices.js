import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  appId: localStorage.getItem("appId") || null, // Retrieve appId from localStorage
  applications: JSON.parse(localStorage.getItem("applications")) || [], // Retrieve applications from localStorage
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppId(state, action) {
      state.appId = action.payload;
      localStorage.setItem("appId", action.payload); // Save appId to localStorage
    },
    setApplications(state, action) {
      state.applications = action.payload;
      localStorage.setItem("applications", JSON.stringify(action.payload)); // Save applications to localStorage
    },
  },
});

export const { setAppId, setApplications } = appSlice.actions;
export default appSlice.reducer;