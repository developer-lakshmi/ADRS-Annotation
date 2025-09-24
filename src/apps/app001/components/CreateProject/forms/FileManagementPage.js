import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import { setSelectedFiles, clearSelectedFiles } from "../../../../../redux/slices/file-upload/fileSelectionSlice";
import { showNotification } from "../../../../../redux/slices/notification/notificationSlice";
import { fetchUploadedFiles,  saveNewFilesToDB } from "../../../../../redux/slices/shared/fileUploadSlice";
import BaseModal from "../../../../../components/ui/BaseModal";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import { setFileStatuses } from "../../../../../redux/slices/file-upload/fileStatusSlice";

const FileManagementPage = ({ projectId, onClose }) => {
  const dispatch = useDispatch();
  const files = useSelector((state) => state.fileManagement.files);
  const loading = useSelector((state) => state.fileManagement.loading); // Get loading state
  const selectedFiles = useSelector((state) => state.fileSelection.selectedFiles || []); // Fallback to an empty array
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const isSubSidebarOpen = useSelector((state) => state.sidebar.isSubSidebarOpen); // SubSidebar state
  const isMobileSidebarOpen = useSelector((state) => state.sidebar.isMobileSidebarOpen); // Add this line
  const fileStatuses = useSelector((state) => state.fileStatus);
  const appId = useSelector((state) => state.app.appId); // <-- get appId from redux

  // Set overflow-y: hidden on main layout only while this page is mounted
  useEffect(() => {
    const main = document.querySelector("main");
    if (main) {
      const prev = main.style.overflowY;
      main.style.overflowY = "hidden";
      return () => {
        main.style.overflowY = prev || "";
      };
    }
  }, []);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchUploadedFiles(projectId));
    }
  }, [dispatch, projectId]);

  const rows = files.map((file, index) => {
    // Extract number part before the first '-'
    let numberId = "";
    if (file.id && file.id.includes('-')) {
      numberId = file.id.split('-')[0];
    }
    return {
      id: file.id || file.name || index + 1, // Keep full id for internal use
      numberId, // Only the number part for display
      name: file.name || "N/A",
      type: file.type || "Unknown",
      size: file.size || 0,
      lastModified: file.lastModified
        ? new Date(file.lastModified).toISOString().split("T")[0]
        : "N/A",
      discipline: file.discipline || "N/A",
      uploadedPages: file.uploadedPages || 0,
      clearedPages: file.clearedPages || 0,
      approvedPages: file.approvedPages || 0,
    };
  });
console.log("lakappId:", appId, "lakprojectId:", projectId);
  const columns = [
    { field: "numberId", headerName: "ID", width: 100 }, // Show only number part
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        const cleanDocId = params.row.id.match(/^\d+/)?.[0];
        const status = fileStatuses[params.row.id];
        const isSuccess = status === "success";
        return isSuccess ? (
          <Link
            to={`/app/${appId}/dashboard/project/${projectId}/view/${cleanDocId}`}
            className="text-blue-500 hover:underline"
            state={{ projectId, fileId: params.row.id }}
          >
            {params.value}
          </Link>
        ) : (
          <span
            className="text-gray-400 cursor-not-allowed"
            title="Only successfully processed files can be viewed."
          >
            {params.value}
          </span>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 70,
      renderCell: (params) => {
        const status = fileStatuses[params.row.id];
        let dotColor = "bg-gray-400";
        let tooltipText = "Not processed";
        if (status === "success") {
          dotColor = "bg-green-500";
          tooltipText = "Success";
        } else if (status === "failure") {
          dotColor = "bg-red-500";
          tooltipText = "Error";
        }
        return (
          <div className="flex items-center justify-center w-full h-full">
            <Tooltip title={tooltipText} arrow>
              <span
                className={`inline-block w-[10px] h-[10px] rounded-full ${dotColor} cursor-pointer`}
                aria-label={tooltipText}
              />
            </Tooltip>
          </div>
        );
      }
    },
    { field: "size", headerName: "Size (bytes)", flex: 1, minWidth: 100 },
    { field: "lastModified", headerName: "Last Modified", flex: 1, minWidth: 150 },
    { field: "discipline", headerName: "Discipline", flex: 1, minWidth: 100 },
    { field: "uploadedPages", headerName: "Uploaded Pages", flex: 1, minWidth: 100 },
    { field: "clearedPages", headerName: "Cleared Pages", flex: 1, minWidth: 100 },
    { field: "approvedPages", headerName: "Approved Pages", flex: 1, minWidth: 100 },
  ];

 


  // Pass a callback to the modal to handle file uploads
  const handleFileUpload = (uploadedFiles) => {
    if (!uploadedFiles || uploadedFiles.length === 0) {
      dispatch(showNotification({message: "No files selected for upload.", type: "info" }));
      return;
    }
  
    dispatch(saveNewFilesToDB({ files: uploadedFiles, projectId }))
      .then(() => {
        dispatch(showNotification({message: `${uploadedFiles.length} file(s) uploaded successfully.`, type: "success" }));
      })
      .catch((error) => {
        dispatch(showNotification({message: "Failed to upload files to the server.", type: "error" }));
        console.error("Error uploading files:", error);
      });
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);

    // Dispatch action to save files to the backend
    dispatch(saveNewFilesToDB({ files: newFiles, projectId }))
      .then(() => {
        dispatch(showNotification({message: `${newFiles.length} file(s) uploaded successfully.`, type: "success" }));
      })
      .catch((error) => {
        dispatch(showNotification({message: "Failed to upload files to the server.", type: "error" }));
        console.error("Error uploading files:", error);
      });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files);

    // Dispatch action to save files to the backend
    dispatch(saveNewFilesToDB({ files: newFiles, projectId }))
      .then(() => {
        dispatch(showNotification({message: `${newFiles.length} file(s) uploaded successfully.`, type: "success" }));
      })
      .catch((error) => {
        dispatch(showNotification({message: "Failed to upload files to the server.", type: "error" }));
        console.error("Error uploading files:", error);
      });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRowSelection = (selectionModel) => {
    console.log("Selection Model:", selectionModel); // Debug log
  
    // Extract IDs from the Set
    const selectedIds = Array.from(selectionModel.ids || []);
    console.log("Selected IDs:", selectedIds); // Debug log
  
    // Filter rows based on selected IDs
    const selectedRows = rows.filter((row) => selectedIds.includes(row.id));
    console.log("Selected Rows:", selectedRows); // Debug log
  
    // Dispatch the selected rows to Redux
    dispatch(setSelectedFiles(selectedRows));
  };



 // Calculate dynamic width based on sidebar state
  const sidebarWidth = 32; // Sidebar width when open or closed
  const subSidebarWidth =2; // SubSidebar width
  const tableWidth = `calc(100% - ${subSidebarWidth}`; // Adjust table width dynamically
  return (
    <div
      className="px-0 w-full max-w-full mx-auto overflow-x-auto"
      style={{
        maxWidth: isMobileSidebarOpen
          ? "100vw" // Full width on mobile when sidebar is open
          : isSubSidebarOpen
            ? "calc(100vw - 32px - 150px)" // Desktop: Sidebar + SubSidebar
            : "calc(100vw - 32px)",        // Desktop: Only Sidebar
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
     
      {loading ? ( // Show loading indicator while files are being uploaded or fetched
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
          <p className="ml-4 text-gray-600">Loading files...</p>
        </div>
      ) : files.length > 0 ? (
                <>
          {/* <h2 className="text-2xl font-semibold my-2">Uploaded Files</h2> */}

        <div className="p-4 h-full w-full min-w-[350px]">
          <Paper
            sx={{
              width: "100%",
              maxWidth: "100%",
              height: "calc(100vh - 132px)",
              minHeight: 300,
              overflow: "auto",
            }}
          >
            <DataGrid
              rows={rows}
              columns={columns}
              checkboxSelection
              onRowSelectionModelChange={handleRowSelection}
              pageSizeOptions={[10, 20, 30, 100]}
              pagination
              sx={{
                width: "100%",
                minWidth: 350,
                "& .Mui-selected-row": {
                  backgroundColor: "rgba(25, 118, 210, 0.08)",
                  "&:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.16)",
                  },
                },
              }}
            />
          </Paper>
        </div>
                </>
      ) : (
        <div className="mt-4 flex justify-center">
  <div
    className="w-full max-w-sm sm:max-w-md lg:max-w-lg border-2 border-dashed border-gray-300 dark:border-gray-700 p-4 rounded-lg text-center"
    onDrop={handleDrop}
    onDragOver={handleDragOver}
  >
     <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-4">
      No files uploaded yet
    </p>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
      Drag and drop files here, or click the button below to upload.
    </p>
    <input
      type="file"
      multiple
      onChange={handleFileChange}
      className="hidden"
      id="file-upload-input"
    />
    <label htmlFor="file-upload-input" className="cursor-pointer text-blue-500">
      Browse Files
    </label>
  </div>
  <ul className="mt-4 text-sm">
    {files.length > 0 &&
      files.map((file, index) => (
        <li key={index} className="text-gray-600 dark:text-gray-300">
          {file.name}
        </li>
      ))}
  </ul>
</div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <BaseModal
          message="Upload Files"
          onCancel={() => setIsUploadModalOpen(false)}
          onOk={handleFileUpload}
          showFileUpload={true}
        />
      )}
    </div>
  );
};

export default FileManagementPage;