import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProjects, removeProject } from "../../../../redux/slices/create-projects/projectsSlice";
import { addFiles, fetchUploadedFiles, overwriteFilesInDB, saveNewFilesToDB } from "../../../../redux/slices/shared/fileUploadSlice";
import { showNotification } from "../../../../redux/slices/notification/notificationSlice";
import Topbar from "../../../../components/common/Topbar";
import { Plus, Upload, ArrowLeft, CpuIcon, ViewIcon, Pencil, Trash2 } from "lucide-react";
import { Button } from "@mui/material";
import FileManagementPage from "./forms/FileManagementPage";
import { BaseModal } from "../../../../components/ui";
import { clearSelectedFiles } from "../../../../redux/slices/file-upload/fileSelectionSlice";
import ProjectDashboard from "./ProjectDashboard";
import LoadingOverlay from "../../../../components/Loader/LoadingOverlay";
import { setFileStatuses } from "../../../../redux/slices/file-upload/fileStatusSlice";
import Tooltip from "@mui/material/Tooltip";
const CreateProjectPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projectId } = useParams(); // Always get IDs from URL
  const projects = useSelector((state) => state.projects.items);
  const loading = useSelector((state) => state.projects.loading);
    const appId = useSelector((state) => state.app.appId);
  const applications = useSelector((state) => state.app.applications);
const applicationName = applications.find((app) => app.appId === appId)?.name || "No Application Found";
  const uploadedFiles = useSelector((state) => state.fileManagement.files || []);
  const [activeProjectId, setActiveProjectId] = useState(projectId || null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const isSubSidebarOpen = useSelector((state) => state.sidebar.isSubSidebarOpen); // Get SubSidebar state
  const isSidebarOpen = useSelector((state) => state.sidebar.isSidebarOpen); // Get Sidebar state
  const selectedFiles = useSelector((state) => state.fileSelection.selectedFiles || []); // Fallback to an empty array
  console.log("Selected Files L", selectedFiles);
const fileStatuses = useSelector((state) => state.fileStatus);
  const iconButtonClass = "p-2 rounded text-white transition-colors";

   const sidebarWidth = isSidebarOpen ? 150 : 32; // Sidebar width when open or closed
  const subSidebarWidth = isSubSidebarOpen ? 150 : 0; // SubSidebar width
  const isMobileSidebarOpen = useSelector((state) => state.sidebar.isMobileSidebarOpen);

  // Calculate top position for Topbar (mobile)
  let topbarTop = "3.5rem"; // Only Navbar
  let contentPaddingTop = "56px"; // Default for desktop

  if (isMobileSidebarOpen && isSubSidebarOpen) {
    topbarTop = "13.5rem"; // Navbar + MobileSidebar + MobileSubSidebar
    contentPaddingTop = "216px"; // 56 + 48 + 112 (adjust if your heights differ)
  } else if (isMobileSidebarOpen) {
    topbarTop = "7.5rem"; // Navbar + MobileSidebar
    contentPaddingTop = "104px"; // 56 + 48
  }

  useEffect(() => {
    dispatch(fetchProjects());
    if (activeProjectId) {
      dispatch(fetchUploadedFiles(activeProjectId));
    }
  }, [dispatch, activeProjectId]);

  useEffect(() => {
    setActiveProjectId(projectId || null);
  }, [projectId]);

  const handleCreateProject = () => {
    const uniqueId = Math.random().toString(36).substr(2, 9);
    navigate(`/app/${appId}/dashboard/newprojectid/${uniqueId}`);
  };

  const handleDelete = (id) => {
    dispatch(removeProject(id));
  };

  const handleStart = (id) => {
    dispatch(clearSelectedFiles());
    navigate(`/app/${appId}/dashboard/project/${id}`);
  };

  const handleBackToDashboard = () => {
    navigate(`/app/${appId}/dashboard`);
    setActiveProjectId(null); // Clear active project
  };

  const handleFileUpload = (uploadedFiles) => {
    if (!uploadedFiles || uploadedFiles.length === 0) {
      dispatch(showNotification({ message:"No files selected for upload.",type:"info" }));
      return;
    }
    dispatch(saveNewFilesToDB({ files: uploadedFiles, projectId: activeProjectId }))
      .then(() => {
        dispatch(showNotification({message:`${uploadedFiles.length} file(s) uploaded successfully.`, type:"success"}));
      })
      .catch((error) => {
        dispatch(showNotification({message:"Failed to upload files to the server.", type:"error"}));
        console.error("Error uploading files:", error);
      });
  };

  const handleUploadFiles = () => {
    setIsUploadModalOpen(true);
  };

  const handleEdit = () => {
    if (selectedFiles.length === 1) {
      // Show edit modal or notification
      dispatch(showNotification({message:"Edit functionality not implemented yet.", type:"info"}));
    }
  };

  const handleDeleteFiles = () => {
    if (selectedFiles.length > 0) {
      const fileIds = selectedFiles.map(file => file.id);
      dispatch(overwriteFilesInDB(fileIds))
        .then(() => {
          dispatch(showNotification({message:`${selectedFiles.length} file(s) deleted successfully.`, type:"success"}));
          dispatch(clearSelectedFiles());
          dispatch(fetchUploadedFiles(activeProjectId));
        })
        .catch((error) => {
          dispatch(showNotification({message:"Failed to delete files.", type:"error"}));
          console.error("Error deleting files:", error);
        });
    }
  }; 

 // To update statuses after processing:
const handleProcess = () => {
  if (selectedFiles.length > 0) {
    setProcessing(true);
    setTimeout(() => {
      const newStatuses = {};
      let successCount = 0;
      let failureCount = 0;
      selectedFiles.forEach(file => {
        const status = Math.random() > 0.5 ? "success" : "failure";
        newStatuses[file.id] = status;
        if (status === "success") successCount++;
        else failureCount++;
      });
      dispatch(setFileStatuses(newStatuses));
      setProcessing(false);

      let message = "";
      let type = "";

      if (selectedFiles.length === 1) {
        if (failureCount === 1) {
          message = "Processing failed.";
          type = "error";
        } else {
          message = "Processing complete for 1 file.";
          type = "success";
        }
      } else {
        if (failureCount > 0) {
          message = `Processing completed: ${successCount} succeeded, ${failureCount} failed.`;
          type = "info";
        } else {
          message = `Processing complete for ${successCount} file(s).`;
          type = "success";
        }
      }

      dispatch(showNotification({ message, type }));
      dispatch(clearSelectedFiles());
    }, 1500);
  }
};

  const handleView = () => {
    if (
      selectedFiles.length === 1 &&
      fileStatuses[selectedFiles[0].id] === "success"
    ) {
      const file = uploadedFiles.find(f => f.id === selectedFiles[0].id);
      let cleanDocId = "";
      if (file && file.id) {
 const match = file.id.match(/^\d+/);
  cleanDocId = match ? match[0] : file.id;      }
      navigate(`/app/${appId}/dashboard/project/${projectId}/view/${cleanDocId}`, {
        state: { projectId: activeProjectId, fileId: file.id }
      });
    } else {
      dispatch(
        showNotification(
{  message:
        selectedFiles.length !== 1
          ? "Please select exactly one file to view."
          : "Only successfully processed files can be viewed.",
      type: "info",}
        )
      );
    }
  };

  useEffect(() => {
    console.log("Selected Files L", selectedFiles);
  }, [selectedFiles]);

  return (
    <div className="relative">
      {/* Fixed Topbar */}
      <div
        className="fixed max-sm:!left-0 md:left-8 right-0 z-40 bg-[#f8f9fa] dark:bg-darkTheme border-b border-[#dee2e6] dark:border-gray-700"
        style={{
          top: topbarTop,
          left: `${sidebarWidth + (isSubSidebarOpen ? 160 : 0)}px`,
          right: 0,
        }}
      >
        {activeProjectId === null ? (
          <Topbar
            leftContent={<h2 className="text-xl">{applicationName}</h2>}
            rightContent={
              <div className="flex items-center space-x-2" >
                <Button
                  onClick={handleCreateProject}
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<Plus fontSize="small" />}
                  sx={{ textTransform: "none" }}
                >
                  Create Project
                </Button>
              </div>
            }
          />
        ) : (
          <Topbar
            leftContent={
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button className="flex items-center mr-1 sm:mr-2" onClick={handleBackToDashboard}>
                  <ArrowLeft size={20} className="sm:mr-2" />
                  <h2 className="text-lg sm:text-xl hidden sm:block"> Uploaded Files</h2>
                  <h2 className="text-sm block sm:hidden"> Files</h2>
                </button>
              </div>
            }
            rightContent={
              <div className="flex items-center space-x-1 sm:space-x-2">
                {/* Action buttons - responsive layout */}
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Tooltip title="Edit" arrow>
                    <span>
                      <button
                        className={`${iconButtonClass} bg-blue-500 hover:bg-blue-600 ${selectedFiles.length !== 1 ? "opacity-50 cursor-not-allowed" : ""} p-1.5 sm:p-2`}
                        onClick={handleEdit}
                        disabled={selectedFiles.length !== 1}>
                        <Pencil size={12} className="sm:w-3.5 sm:h-3.5" />
                      </button>
                    </span>
                  </Tooltip>

                  <Tooltip title="Delete" arrow>
                    <span>
                      <button 
                        className={`${iconButtonClass} bg-red-500 hover:bg-red-600 ${selectedFiles.length === 0 ? "opacity-50 cursor-not-allowed" : ""} p-1.5 sm:p-2`}
                        onClick={handleDeleteFiles}
                        disabled={selectedFiles.length === 0}>
                        <Trash2 size={12} className="sm:w-3.5 sm:h-3.5" />
                      </button>
                    </span>
                  </Tooltip>

                  <Tooltip title="Process" arrow>
                    <span>
                      <button
                        className={`${iconButtonClass} bg-yellow-500 hover:bg-yellow-600 ${selectedFiles.length === 0 ? "opacity-50 cursor-not-allowed" : ""} p-1.5 sm:p-2`}
                        onClick={handleProcess}
                        disabled={selectedFiles.length === 0}>
                        <CpuIcon size={12} className="sm:w-3.5 sm:h-3.5" />
                      </button>
                    </span>
                  </Tooltip>

                  <Tooltip title="View" arrow>
                    <span>
                      <button
                        className={`${iconButtonClass} bg-green-500 hover:bg-green-600 ${selectedFiles.length !== 1 ? "opacity-50 cursor-not-allowed" : ""} p-1.5 sm:p-2`}
                        onClick={handleView}
                        disabled={selectedFiles.length !== 1}>
                        <ViewIcon size={12} className="sm:w-3.5 sm:h-3.5" />
                      </button>
                    </span>
                  </Tooltip>
                </div>

                {/* Upload button - responsive */}
                <Button
                  onClick={handleUploadFiles}
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<Upload size={16} className="hidden sm:inline" />}
                  sx={{ 
                    textTransform: "none",
                    minWidth: { xs: "auto", sm: "auto" },
                    px: { xs: 1, sm: 2 },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" }
                  }}
                >
                  <span className="hidden sm:inline">Upload Files</span>
                  <span className="sm:hidden">
                    <Upload size={16} className="my-[0.75px]" />
                  </span>
                </Button>
              </div>
            }
          />
        )}
      </div>

      {/* Content Below Topbar */}
      <div
        className="transition-all duration-300 ease-in-out"
        style={{
          paddingTop: contentPaddingTop,
        }}
      >
        {activeProjectId === null ? (
          <ProjectDashboard
            projects={projects}
            loading={loading}
            handleStart={handleStart}
            handleDelete={handleDelete}
            appId={appId}
          />
        ) : (
          <div className="p-0 transition-all duration-300 ease-in-out">
            <FileManagementPage
              projectId={activeProjectId}
              onClose={() => setActiveProjectId(null)}
              fileStatuses={fileStatuses}
              setFileStatuses={setFileStatuses}
            />
          </div>
        )}
      </div>
      {/* Upload Modal */}
   {isUploadModalOpen && (
  <BaseModal
    message="Upload Files"
    onCancel={() => setIsUploadModalOpen(false)}
    onOk={(uploadedFiles) => handleFileUpload(uploadedFiles)} // Pass the callback
    showFileUpload={true}
  />
)}
 <LoadingOverlay show={processing} message="Processing files..." />
    </div>
  );
};

export default CreateProjectPage;