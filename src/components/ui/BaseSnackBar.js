import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import { hideSnackBar } from "../../redux/slices/shared/snackBarSlice";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const BaseSnackBar = () => {
  const dispatch = useDispatch();
  const snackBarState = useSelector((state) => state.snackBar);

  console.log("[BaseSnackBar] Redux State:", snackBarState); // Debugging log

  if (!snackBarState) {
    console.error("[BaseSnackBar] snackBar state is undefined."); // Debugging log
    return null; // Prevent rendering if state is undefined
  }

  const { isOpen, message, severity } = snackBarState;

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(hideSnackBar());
  };

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={handleClose} severity={severity || "info"}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default BaseSnackBar;