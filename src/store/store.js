import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/auth/authSlice";
import themeReducer from "../redux/slices/theme/themeSlice";
import modalReducer from "../redux/slices/modal/modalSlice";
import sidebarReducer from "../redux/slices/sidebar/sidebarSlice";
import securityMiddleware from "../redux/middleware/securityMiddleware";
import snackBarReducer from "../redux/slices/shared/snackBarSlice";
import projectsReducer from "../redux/slices/create-projects/projectsSlice";
import fileUploadReducer from "../redux/slices/shared/fileUploadSlice";
import fileSelectionReducer from "../redux/slices/file-upload/fileSelectionSlice";
import notificationReducer from "../redux/slices/notification/notificationSlice";
import appReducer from "../redux/slices/apps/appSlices";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import fileStatusReducer from "../redux/slices/file-upload/fileStatusSlice";
import docSidebarReducer from "../redux/slices/doc-viewer/docSidebarSLice";
import annotationReducer from "../redux/slices/annotation/annotationSlice"; // <-- Add this import

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "app", "fileStatus", "annotation"], // Add "annotation" if you want to persist it
};

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  modal: modalReducer,
  sidebar: sidebarReducer,
  snackBar: snackBarReducer,
  app: appReducer,
  projects: projectsReducer,
  fileManagement: fileUploadReducer,
  fileSelection: fileSelectionReducer,
  notification: notificationReducer,
  fileStatus: fileStatusReducer,
  docSidebar: docSidebarReducer,
  annotation: annotationReducer, // <-- Add this line
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(securityMiddleware),
});

export const persistor = persistStore(store);
export default store;