import axios from "axios";

const API_BASE_URL = "http://localhost:3001"; // JSON Server URL

export const getSignupUsers = async () => {
  const response = await axios.get(`${API_BASE_URL}/signup`);
  console.log("API Response:", response.data);
  return response.data;
};

export const getLoginUsers = async () => {
  const response = await axios.get(`${API_BASE_URL}/login`);
  console.log("API Response:", response.data);
  return response.data;
};

/**
 * Update a user's password.
 * @param {string} userId - The ID of the user.
 * @param {string} password - The new password.
 * @returns {Promise<Object>} The response from the server.
 */
export const updatePassword = async (userId, password) => {
  try {
    // Update the password in the signup array
    const signupResponse = await axios.patch(`${API_BASE_URL}/signup/${userId}`, { password });
    console.log("Password updated in signup:", signupResponse.data);

    // Update the password in the login array
    const loginResponse = await axios.get(`${API_BASE_URL}/login`);
    const loginUser = loginResponse.data.find((user) => user.employeeId === signupResponse.data.employeeId);

    if (loginUser) {
      await axios.patch(`${API_BASE_URL}/login/${loginUser.id}`, { password });
      console.log("Password updated in login:", loginUser);
    } else {
      console.warn("No matching user found in login array for employeeId:", signupResponse.data.employeeId);
    }

    return signupResponse.data; // Return the updated user data
  } catch (error) {
    console.error("Error updating password:", error.response?.data || error.message);
    throw error;
  }
};

export const createUser = async (formData) => {
  try {
    // Save the user to the signup array
    const signupResponse = await axios.post(`${API_BASE_URL}/signup`, formData);
    console.log("User created successfully in signup:", signupResponse.data);

    // Add the user to the login array
    const loginUser = {
      id: signupResponse.data.id, // Use the same ID as in signup
      employeeId: signupResponse.data.employeeId,
      password: signupResponse.data.password, // Use the same password as in signup
    };
    await axios.post(`${API_BASE_URL}/login`, loginUser);
    console.log("User added successfully to login:", loginUser);

    return signupResponse.data;
  } catch (error) {
    console.error("Error creating user:", error.response?.data || error.message);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_BASE_URL}/login`, credentials);
  console.log("API Response:", response.data); // Debugging log
  return response.data;
};

// Fetch user details
export const getAppDetails = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/appDetails`);
    return response.data;
  } catch (error) {
    console.error("Error fetching app details:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch all projects
export const getProjects = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects`);
    console.log("Projects fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error.response?.data || error.message);
    throw error;
  }
};

// Create a new project
export const createProject = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/projects`, data);
    console.log("Project created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error.response?.data || error.message);
    throw error;
  }
};

// Update a project
export const updateProject = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/projects/${id}`, updatedData);
    console.log("Project updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating project:", error.response?.data || error.message);
    throw error;
  }
};

// Delete a project
export const deleteProject = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/projects/${id}`);
    console.log(`Project with ID ${id} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting project:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch uploaded files from db.json
export const getUploadedFiles = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/uploadedFiles`);
    console.log("Fetched uploaded files:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching uploaded files:", error);
    throw error;
  }
};

// Save new files by appending them (POST)
export const saveUploadedFiles = async (files) => {
  try {
    const responses = await Promise.all(
      files.map((file) =>
        axios.post(`${API_BASE_URL}/uploadedFiles`, file, {
          headers: { "Content-Type": "application/json" },
        })
      )
    );
    const result = responses.map((res) => res.data);
    console.log("Saved files to DB:", result);
    return result;
  } catch (error) {
    console.error("Error saving files:", error);
    throw error;
  }
};

// Overwrite all uploaded files (PUT)
export const overwriteUploadedFiles = async (files) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/uploadedFiles`, files, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Overwritten files in DB:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error overwriting files:", error);
    throw error;
  }
};