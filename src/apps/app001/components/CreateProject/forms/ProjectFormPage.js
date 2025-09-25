import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addProject, editProject } from "../../../../../redux/slices/create-projects/projectsSlice";
// import MultiStepForm from "./MultiStepForm";
import OneStepForm from './OneStepForm';
import { ArrowLeft } from "lucide-react";
import SkeletonForm from "../../../../../components/Loader/SkeletonForm";

const ProjectFormPage = () => {
  const { uniqueId } = useParams(); // Fetch uniqueId from the route
  const appId = useSelector((state) => state.app.appId); // Fetch appId from Redux
  const projects = useSelector((state) => state.projects.items); // Fetch all projects from Redux
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [initialData, setInitialData] = useState(null); // State to hold initial form data
  const [isEditMode, setIsEditMode] = useState(false); // State to track if it's edit mode
    const isMobileSidebarOpen = useSelector((state) => state.sidebar.isMobileSidebarOpen);
    const isSubSidebarOpen = useSelector((state) => state.sidebar.isSubSidebarOpen);
  
  const mobileTopMargin = isMobileSidebarOpen
    ? isSubSidebarOpen
      ? "mt-[1px]" // Navbar + Sidebar + SubSidebar
      : "mt-[2px]" // Navbar + Sidebar
    : "mt-[3px]";
  // Responsive top padding for mobile sidebar/subsidebar
  let contentPaddingTop = "pt-0";
  if (isMobileSidebarOpen && isSubSidebarOpen) {
    contentPaddingTop = "pt-[169px]"; 
  } else if (isMobileSidebarOpen) {
    contentPaddingTop = "pt-[104px]"; 
  } else {
    contentPaddingTop = "pt-[16px]"; 
  }
  useEffect(() => {
    // Check if the project exists in the Redux store
    const existingProject = projects.find((project) => project.id === uniqueId);
    if (existingProject) {
      setInitialData(existingProject); // Pre-fill the form with existing project data
      setIsEditMode(true); // Set to edit mode
    } else {
      setInitialData({}); // Initialize with empty data for create mode
      setIsEditMode(false); // Set to create mode
    }
  }, [uniqueId, projects]);

  const handleSubmit = (formData) => {
    const projectData = { id: uniqueId, ...formData }; // Include the unique ID
    if (isEditMode) {
      // Edit mode: Dispatch the editProject action
      dispatch(editProject({ id: uniqueId, updatedData: projectData }));
    } else {
      // Create mode: Dispatch the addProject action
      dispatch(addProject(projectData));
    }
    navigate(`/app/${appId}/dashboard`); // Redirect to the dashboard
  };

  if (initialData === null) {
     return <SkeletonForm />; // Show the custom loader while fetching initial data
  }

  return (
    <div
      className={`px-4 py-4 lg:mt-0 ${contentPaddingTop}`}
      // style={{ height: "calc(100vh - 56px )" }}
    >
     
       <div className="flex items-center mr-2 text-gray-600 dark:text-gray-400 ">
       <button
                onClick={() => navigate(`/app/${appId}/dashboard`)} // Navigate back to the dashboard
              >
                <ArrowLeft size={20} className="ml-2 mb-2" />
    
              </button>
       <h3 className="text-lg font-bold mb-2">
          {isEditMode ?`Edit Project - ${initialData.projectName}` : "Create Project"}
        </h3>
       </div>

        <hr className="border-gray-300 dark:border-gray-600" />        {/* Pass handleSubmit and initialData to MultiStepForm */}
        {/* <MultiStepForm onSubmit={handleSubmit} initialData={initialData} /> */}
                <OneStepForm onSubmit={handleSubmit} initialData={initialData} />

    </div>
  );
};

export default ProjectFormPage;