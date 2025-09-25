import { Button, Container } from "@mui/material";
import React, { useState, useEffect } from "react";

const ProjectForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    projectName: "",
    projectId: "",
    projectType: "",
    projectDescription: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.form;
      const index = Array.from(form).indexOf(e.target);
      if (form.elements[index + 1]) {
        form.elements[index + 1].focus();
      }
    }
  };

  return (
    <Container maxWidth="sm" className="m-4">
      <h2 className="text-2xl font-extrabold mb-6 text-blue-700 dark:text-blue-400 text-center tracking-wide uppercase">
        Project Information
      </h2>
      <form
        className="max-w-2xl mx-auto w-full"
        onSubmit={handleSubmit}
        autoComplete="off"
        style={{ overflowY: "auto", maxHeight: "80vh" }}
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
          <div className="col-span-1 sm:col-span-2">
            <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-white">
              Project Name
            </label>
            <input
              type="text"
              placeholder="Enter Project Name"
              required
              className="w-full p-3 outline-none border border-gray-300 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90 transition focus:border-blue-500"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-white">
              Project ID
            </label>
            <input
              type="text"
              placeholder="Enter Project ID"
              required
              className="w-full p-3 outline-none border border-gray-300 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90 transition focus:border-blue-500"
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-white">
              Project Type
            </label>
            <select
              name="projectType"
              value={formData.projectType}
              required
              className="w-full p-3 outline-none border border-gray-300 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90 transition focus:border-blue-500"
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            >
              <option value="">Select Project Type</option>
              <option value="Process">Process</option>
              <option value="Instrumentation">Instrumentation</option>
              <option value="Piping">Piping</option>
              <option value="Civil">Civil</option>
            </select>
          </div>
          <div className="col-span-1 sm:col-span-2">
            <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-white">
              Project Description
            </label>
            <textarea
              placeholder="Enter Project Description"
              className="w-full p-3 outline-none border border-gray-300 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90 transition focus:border-blue-500"
              name="projectDescription"
              rows={3}
              value={formData.projectDescription}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            ></textarea>
          </div>
        </div>
        <div className="flex justify-end mt-8 gap-4">
          <Button type="submit" variant="contained" color="primary" size="large">
            Submit
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default ProjectForm;

