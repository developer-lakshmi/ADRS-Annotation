import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import { setSelectedFiles } from "../../../../../redux/slices/file-upload/fileSelectionSlice";
import { showNotification } from "../../../../../redux/slices/notification/notificationSlice";
import { fetchUploadedFiles, saveNewFilesToDB } from "../../../../../redux/slices/shared/fileUploadSlice";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";

const formatSize = (size) => {
  if (!size) return "0 KB";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

const formatDate = (date) => {
  if (!date) return "N/A";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// Extract serial number as per new format: last "-" separated part before file extension
const getSerialNo = (fileName) => {
  if (!fileName) return "";
  const nameWithoutExt = fileName.split(".")[0];
  const parts = nameWithoutExt.split("-");
  return parts.length > 1 ? parts[parts.length - 2] : "";
};

const getType = (file) => {
  if (!file.type && file.name) {
    const ext = file.name.split(".").pop().toLowerCase();
    if (ext === "pdf") return "PDF";
    if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) return "Image";
  }
  if (file.type && file.type.toLowerCase().includes("pdf")) return "PDF";
  if (file.type && file.type.toLowerCase().includes("image")) return "Image";
  return "Other";
};

const getStatusLabel = (status) => {
  if (status === "approved") return "Approved";
  if (status === "success") return "Processed";
  if (status === "need_approve") return "Need to approve";
  return "Not processed";
};

const FileManagementPage = ({ projectId }) => {
  const dispatch = useDispatch();
  const files = useSelector((state) => state.fileManagement.files);
  const loading = useSelector((state) => state.fileManagement.loading);
  const fileStatuses = useSelector((state) => state.fileStatus);
  const appId = useSelector((state) => state.app.appId);
  const isSubSidebarOpen = useSelector((state) => state.sidebar.isSubSidebarOpen);
  const isMobileSidebarOpen = useSelector((state) => state.sidebar.isMobileSidebarOpen);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchUploadedFiles(projectId));
    }
  }, [dispatch, projectId]);

  const rows = files.map((file, index) => ({
    id: file.id || file.name || index + 1,
    serialNo: index + 1,
    name: file.name || "N/A",
    type: getType(file),
    size: formatSize(file.size),
    lastModified: formatDate(file.lastModified),
    status: getStatusLabel(fileStatuses[file.id]),
  }));

  const columns = [
    { field: "serialNo", headerName: "Serial No", width: 150, headerAlign: "center", align: "center" },
    {
      field: "name",
      headerName: "Drawing Title",
      minWidth: 280,
      renderCell: (params) => {
        const status = fileStatuses[params.row.id];
        const isSuccess = status === "success" || status === "approved" || status === "need_approve";
        return isSuccess ? (
          <Tooltip title={params.value} arrow>
            <Link
              to={`/app/${appId}/dashboard/project/${projectId}/view/${params.row.serialNo}`}
              className="text-blue-600 font-medium hover:underline truncate block max-w-[180px] sm:max-w-[240px] md:max-w-[320px] lg:max-w-[400px]"
              style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
              state={{ projectId, fileId: params.row.id }}
            >
              {params.value}
            </Link>
          </Tooltip>
        ) : (
          <Tooltip title={params.value} arrow>
            <span
              className="text-gray-400 cursor-not-allowed truncate block max-w-[180px] sm:max-w-[240px] md:max-w-[320px] lg:max-w-[400px]"
              style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
              title="Only successfully processed files can be viewed."
            >
              {params.value}
            </span>
          </Tooltip>
        );
      },
    },
    {
      field: "type",
      headerName: "Type",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <span>
          {params.value === "PDF" || params.value === "Image" ? params.value : ""}
        </span>
      ),
    },
    {
      field: "size",
      headerName: "Size",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "lastModified",
      headerName: "Last Modified",
      width: 180,
      headerAlign: "center",
      align: "center",
    },
    // Status column LAST
    {
      field: "status",
      headerName: "Status",
      width: 170,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        let color = "#9ca3af"; // gray
        if (params.value === "Processed") color = "#22c55e"; // green
        if (params.value === "Approved") color = "#0ea5e9"; // blue
        if (params.value === "Need to approve") color = "#f59e42"; // orange
        return (
          <span style={{
            color,
            fontWeight: 600,
            fontSize: 15,
            letterSpacing: 0.2,
          }}>
            {params.value}
          </span>
        );
      }
    },
  ];

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    dispatch(saveNewFilesToDB({ files: newFiles, projectId }))
      .then(() => {
        dispatch(showNotification({ message: `${newFiles.length} file(s) uploaded successfully.`, type: "success" }));
      })
      .catch((error) => {
        dispatch(showNotification({ message: "Failed to upload files to the server.", type: "error" }));
        console.error("Error uploading files:", error);
      });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files);
    dispatch(saveNewFilesToDB({ files: newFiles, projectId }))
      .then(() => {
        dispatch(showNotification({ message: `${newFiles.length} file(s) uploaded successfully.`, type: "success" }));
      })
      .catch((error) => {
        dispatch(showNotification({ message: "Failed to upload files to the server.", type: "error" }));
        console.error("Error uploading files:", error);
      });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRowSelection = (selectionModel) => {
    const selectedIds = Array.from(selectionModel.ids || []);
    const selectedRows = rows.filter((row) => selectedIds.includes(row.id));
    dispatch(setSelectedFiles(selectedRows));
  };

  return (
    <div
      className="w-full max-w-full mx-auto"
      style={{
        maxWidth: isMobileSidebarOpen
          ? "100vw"
          : isSubSidebarOpen
            ? "calc(100vw - 32px - 150px)"
            : "calc(100vw - 32px)",
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
          <p className="ml-4 text-gray-600">Loading files...</p>
        </div>
      ) : files.length > 0 ? (
        <div className="p-2 sm:p-4 h-full w-full min-w-[320px]">
          <Paper
            sx={{
              width: "100%",
              maxWidth: "100%",
              height: "calc(100vh - 160px)",
              minHeight: 300,
              overflow: "auto",
              boxShadow: 3,
              borderRadius: 3,
              border: "1px solid #e5e7eb",
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
                minWidth: 320,
                fontFamily: "inherit",
                fontSize: "1rem",
                "& .MuiDataGrid-columnHeaders": {
                  background: "#f3f4f6",
                  fontWeight: 700,
                  fontSize: "1rem",
                },
                "& .MuiDataGrid-row": {
                  background: "#fff",
                  "&:hover": {
                    background: "#f1f5f9",
                  },
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid #e5e7eb",
                  maxWidth: "100vw",
                },
                "& .MuiDataGrid-virtualScroller": {
                  overflowX: "auto !important",
                },
                "& .MuiDataGrid-cellContent": {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                },
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
        </div>
      )}
    </div>
  );
};

export default FileManagementPage;