import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createProject, updateProject, deleteProject, getProjects } from "../../../services/api";

// Async thunk to fetch projects
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async () => {
    const response = await getProjects(); // Use getProjects API
    return response; // Return the list of projects
  }
);

// Async thunk to create a project
export const addProject = createAsyncThunk(
  "projects/addProject",
  async (projectData) => {
    const response = await createProject(projectData); // Use createProject API
    return response; // Return the newly created project
  }
);

// Async thunk to update a project
export const editProject = createAsyncThunk(
  "projects/editProject",
  async ({ id, updatedData }) => {
    const response = await updateProject(id, updatedData); // Use updateProject API
    return response; // Return the updated project
  }
);

// Async thunk to delete a project
export const removeProject = createAsyncThunk(
  "projects/removeProject",
  async (projectId) => {
    await deleteProject(projectId); // Use deleteProject API
    return projectId; // Return the ID of the deleted project
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload; // Update the state with the fetched projects
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Store the error message
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.items.push(action.payload); // Add the new project to the state
      })
      .addCase(editProject.fulfilled, (state, action) => {
        const index = state.items.findIndex((project) => project.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload; // Update the project in the state
        }
      })
      .addCase(removeProject.fulfilled, (state, action) => {
        state.items = state.items.filter((project) => project.id !== action.payload); // Remove the project from the state
      });
  },
});

export default projectsSlice.reducer;