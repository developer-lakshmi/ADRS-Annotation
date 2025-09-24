import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { hideModal } from "../modal/modalSlice";

// Thunk for handling logout
export const logoutAsync = createAsyncThunk("auth/logoutAsync", async (_, { dispatch }) => {
  // Perform side effects
  localStorage.removeItem("authToken");
  localStorage.removeItem("tokenExpiry");
  localStorage.removeItem("currentUser"); // Clear currentUser from localStorage
  dispatch(hideModal()); // Reset modal state
});

const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing currentUser from localStorage:", error);
    return null;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    currentUser: getCurrentUser(),
    token: localStorage.getItem("authToken") || null,
  },
  reducers: {
    login(state, action) {
      const { user, token } = action.payload;
      state.currentUser = user;
      state.token = token;
      localStorage.setItem("authToken", token);
      localStorage.setItem("currentUser", JSON.stringify(user)); // Persist currentUser
      console.log("Login successful. Token and user set:", token, user); // Debugging log
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutAsync.fulfilled, (state) => {
      state.currentUser = null;
      state.token = null;
      console.log("Logout successful. State cleared."); // Debugging log
    });
  },
});

export const { login } = authSlice.actions;
export default authSlice.reducer;