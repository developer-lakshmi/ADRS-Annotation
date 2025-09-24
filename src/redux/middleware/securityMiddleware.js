import { showSnackBar } from "../slices/shared/snackBarSlice";

const securityMiddleware = (store) => (next) => (action) => {
  console.log("Action received in middleware:", action); // Debugging log
  const state = store.getState();
  const token = state.auth.token;

  // Check if the action requires authentication
  if (action.meta?.requiresAuth) {
    console.log("Action requires authentication:", action.type); // Debugging log
    if (!token) {
      store.dispatch(
        showSnackBar({
          message: "Unauthorized action blocked.",
          severity: "warning",
        })
      );
      return; // Block the action if no token is present
    }

    // Validate token expiration
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    const currentTime = new Date().getTime();

    console.log("Token expiry check:", { tokenExpiry, currentTime }); // Debugging log

    if (tokenExpiry && Number(tokenExpiry) <= currentTime) {
      console.log("[Middleware] Token expired. Dispatching Snackbar and logout."); // Debugging log
      store.dispatch(
        showSnackBar({
          message: "Token expired. Logging out.",
          severity: "error",
        })
      );

      // setTimeout(() => {
        store.dispatch({ type: "auth/logout" });
      //}, 5000);  2-second delay
      return;
    }
  }

  return next(action); // Allow the action to proceed if no issues
};

export default securityMiddleware;