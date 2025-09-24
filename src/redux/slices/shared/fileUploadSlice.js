import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/* ============================================================================
   Thunks
============================================================================ */

// Fetch all uploaded files
export const fetchUploadedFiles = createAsyncThunk(
  "fileManagement/fetchUploadedFiles",
  async (projectId, { rejectWithValue }) => {
    try {
      const url = projectId
        ? `http://localhost:5000/files?projectId=${projectId}`
        : "http://localhost:5000/files";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch uploaded files from the server.");
      }
      const files = await response.json();
      return files;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Save new files by appending them (POST)
export const saveNewFilesToDB = createAsyncThunk(
  "fileManagement/saveNewFilesToDB",
  async ({ files, projectId }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      formData.append("projectId", projectId); // Attach projectId

      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload files to the server.");
      }

      const result = await response.json();
      return result.files;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Overwrite all uploaded files (DELETE)
export const overwriteFilesInDB = createAsyncThunk(
  "fileManagement/overwriteFilesInDB",
  async (fileIds, { rejectWithValue }) => {
    try {
      const deletePromises = fileIds.map((id) =>
        fetch(`http://localhost:5000/files/${id}`, { method: "DELETE" })
      );
      await Promise.all(deletePromises);
      return fileIds;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ============================================================================
   Slice
============================================================================ */

const fileUploadSlice = createSlice({
  name: "fileManagement",
  initialState: {
    files: [], // Store for uploaded files
    loading: false, // Loading state for file operations
    error: null,
  },
  reducers: {
    addFiles: (state, action) => {
      state.files = [...state.files, ...action.payload];
    },
    clearFiles: (state) => {
      state.files = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUploadedFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUploadedFiles.fulfilled, (state, action) => {
        state.files = action.payload; // Update the files in the Redux store
        state.loading = false;
      })
      .addCase(fetchUploadedFiles.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(saveNewFilesToDB.pending, (state) => {
        state.loading = true; // Set loading to true when uploading files
      })
      .addCase(saveNewFilesToDB.fulfilled, (state, action) => {
        state.files = [...state.files, ...action.payload]; // Append new files
        state.loading = false; // Set loading to false after upload
      })
      .addCase(saveNewFilesToDB.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false; // Set loading to false on error
      });
  },
});

export const { addFiles, clearFiles } = fileUploadSlice.actions;
export default fileUploadSlice.reducer;
