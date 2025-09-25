import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Topbar from "../../../../components/common/Topbar";
import { useSelector, useDispatch } from "react-redux";
import PdfViewer from "./PdfViewer";
import ImageViewer from "./ImageViewer";
import { ArrowLeft, Download, ZoomIn, ZoomOut, Pencil, RefreshCw, Maximize2, Minimize2 } from "lucide-react";
import Tooltip from "@mui/material/Tooltip";
import { fetchUploadedFiles } from "../../../../redux/slices/shared/fileUploadSlice";
import { setSelectedCategory } from "../../../../redux/slices/annotation/annotationSlice";
import CircularProgress from "@mui/material/CircularProgress";
import { PencilIcon, SquareDashedBottom, PencilLine } from "lucide-react";
import ActionButtons from "./ActionButtons";
import { updateFileStatus } from "../../../../redux/slices/file-upload/fileStatusSlice";

const categories = [
  { id: 1, name: "Instrument", color: "#1976d2" },
  { id: 2, name: "Valve", color: "#e53935" },
  { id: 3, name: "Equipment", color: "#43a047" },
  { id: 4, name: "Pipe", color: "#fbc02d" },
  { id: 5, name: "Specialty Item", color: "#8e24aa" },
  { id: 6, name: "Package", color: "#00838f" },
  { id: 7, name: "Miscellaneous", color: "#6d4c41" },
];

const DocViewPage = () => {
  const navigate = useNavigate();
  const { id: appId, projectId, docId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const fileId = location.state?.fileId || docId;
  const files = useSelector((state) => state.fileManagement.files);
  const filesLoading = useSelector((state) => state.fileManagement.loading);
  const isSidebarOpen = useSelector((state) => state.docSidebar.isSidebarOpen);
  const isSubSidebarOpen = useSelector((state) => state.docSidebar.isSubSidebarOpen);
  const isMobileSidebarOpen = useSelector((state) => state.docSidebar.isMobileSidebarOpen);

  // --- MOBILE LOGIC (like CreateProject) ---
  let topbarTop = "3.5rem"; // Only Navbar
  let contentPaddingTop = "10px"; // Default for desktop
  if (window.innerWidth < 1024) {
    if (isMobileSidebarOpen && isSubSidebarOpen) {
      topbarTop = "21.5rem";
      contentPaddingTop = "216px";
    } else if (isMobileSidebarOpen) {
      topbarTop = "6.8rem";
      contentPaddingTop = "104px";
    }
  }

  const selectedCategoryId = useSelector(state => state.annotation.selectedCategoryId);
  const file = files.find(f => f.id === fileId || f.id.startsWith(docId));
  const fileExtension = file?.name.split('.').pop().toLowerCase();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [annotateMode, setAnnotateMode] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [annotations, setAnnotations] = useState([]);
  const [annotationMode, setAnnotationMode] = useState(false); // "box" or "free"
  const [showMenu, setShowMenu] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const iconRef = useRef();
  const pdfViewerRef = useRef();
  const imageViewerRef = useRef();

  const iconButtonClass = "p-1.5 sm:p-2 rounded text-white transition-colors";
  const fileUrl = file?.url || "";
  const imageTypes = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];

  const handleBackToTable = () => {
    if (projectId) {
      navigate(`/app/${appId}/dashboard/project/${projectId}`);
    } else {
      navigate(`/app/${appId}/dashboard`);
    }
  };
  const handleFullscreen = () => setIsFullscreen(f => !f);
  const handleZoomIn = () => setZoom(z => Math.min(z + 0.1, 5));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.1, 0.2));
  const handleReset = () => setZoom(1);
  const handleDownload = async () => {
    setDownloadLoading(true);
    try {
      const response = await fetch(fileUrl, { mode: "cors" });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert("Failed to download image.");
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleReprocess = () => {
    // Implement your process logic here
    alert("Process action triggered!");
  };

  const handleApprove = async () => {
    setApproveLoading(true);
    // Simulate async (replace with real API call in future)
    await new Promise(res => setTimeout(res, 1000));
    if (fileId) {
      dispatch(updateFileStatus({ fileId, status: "approved" }));
    }
    setApproveLoading(false);
  };

  const handleDownloadAnnotatedPdf = () => {
    if (pdfViewerRef.current) {
      pdfViewerRef.current.download();
    }
  };

  const handleDownloadAnnotatedImage = () => {
    if (imageViewerRef.current) {
      imageViewerRef.current.download();
    }
  };

  const handleDownloadAnnotated = () => {
    if (fileExtension === "pdf") {
      handleDownloadAnnotatedPdf();
    } else if (imageTypes.includes(fileExtension)) {
      handleDownloadAnnotatedImage();
    } else {
      handleDownload(); // fallback to original download
    }
  };

  useEffect(() => {
    if ((!files || files.length === 0) && projectId) {
      dispatch(fetchUploadedFiles(projectId));
    }
  }, [dispatch, files, projectId]);

  // Calculate left offset for desktop (sidebars)
  let desktopLeft = 0;
  if (window.innerWidth >= 1024) {
    if (isSidebarOpen && isSubSidebarOpen) {
      desktopLeft = 32 + 150;
    } else if (isSidebarOpen) {
      desktopLeft = 32;
    }
  }

  // Find selected category name for dialog
  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId)?.name || "";

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (iconRef.current && !iconRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div
      className="relative"
      style={{
        marginLeft: window.innerWidth >= 1024 ? `${desktopLeft}px` : 0,
        maxWidth: "100vw",
        overflowX: "auto",
      }}
    >
      {/* Fixed Topbar */}
      <div
        className="fixed right-0 z-40 bg-[#f8f9fa] dark:bg-darkTheme border-b border-[#dee2e6] dark:border-gray-700 w-full"
        style={{
          top: topbarTop,
          left: window.innerWidth >= 1024 ? `${desktopLeft}px` : 0,
          right: 0,
          width: window.innerWidth >= 1024
            ? `calc(100vw - ${desktopLeft}px)`
            : "100vw"
        }}
      >
        <Topbar
          leftContent={
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button className="flex items-center mr-1 sm:mr-2" onClick={handleBackToTable}>
                <ArrowLeft size={20} className="sm:mr-2" />
                <h2 className="text-lg sm:text-xl hidden sm:block"> Doc Viewer</h2>
                <h2 className="text-sm block sm:hidden"> Doc</h2>
              </button>
            </div>
          }
          rightContent={
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Annotation icon button */}
              <Tooltip title="Annotation Tool" arrow>
                <span>
                  <button
                    ref={iconRef}
                    className={`${iconButtonClass} ${annotateMode ? "bg-blue-700" : "bg-blue-500"} hover:bg-blue-600`}
                    onClick={() => setAnnotateMode(a => !a)}
                    aria-pressed={annotateMode}
                    title="Annotation Tool"
                    style={{ display: "flex", alignItems: "center", fontWeight: 600 }}
                  >
                    <Pencil size={16} className="sm:w-4 sm:h-4" />
                  </button>
                </span>
              </Tooltip>

              {annotateMode && (
                <>
                  {/* Draw Box: icon-only, no bg, square/bounding box style */}
                  <Tooltip title="Draw Box" arrow>
                    <span>
                      <button
                        onClick={() => setAnnotationMode("box")}
                        className={`p-2 rounded border transition
                          ${annotationMode === "box" ? "border-blue-700" : "border-gray-300"}
                          bg-transparent text-blue-700 hover:border-blue-400`}
                        aria-pressed={annotationMode === "box"}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "none",
                          color: annotationMode === "box" ? "#1976d2" : "#666",
                        }}
                      >
                        {/* Square/bounding box icon */}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={annotationMode === "box" ? "#1976d2" : "#666"} strokeWidth="2" strokeDasharray="4 2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="4" y="4" width="16" height="16" rx="2" />
                        </svg>
                      </button>
                    </span>
                  </Tooltip>
                  {/* Free Draw: icon-only, no bg, squiggle/handdraw style */}
                  <Tooltip title="Free Draw" arrow>
                    <span>
                      <button
                        onClick={() => setAnnotationMode("free")}
                        className={`p-2 rounded border transition
                          ${annotationMode === "free" ? "border-green-700" : "border-gray-300"}
                          bg-transparent text-green-700 hover:border-green-400`}
                        aria-pressed={annotationMode === "free"}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "none",
                          color: annotationMode === "free" ? "#43a047" : "#666",
                        }}
                      >
                        {/* Hand-drawn squiggle icon */}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={annotationMode === "free" ? "#43a047" : "#666"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 18c2-4 6-4 8 0s6 4 8 0" />
                        </svg>
                      </button>
                    </span>
                  </Tooltip>
                </>
              )}

              {/* Divider for clarity */}
              <div className="mx-2 border-l h-6 border-gray-300" />

              {/* Only show these for images */}
              {imageTypes.includes(fileExtension) && (
                <>
                  <Tooltip title="Zoom In" arrow>
                    <span>
                      <button
                        className={`${iconButtonClass} bg-green-500 hover:bg-green-600`}
                        onClick={handleZoomIn}
                      >
                        <ZoomIn size={12} className="sm:w-3.5 sm:h-3.5" />
                      </button>
                    </span>
                  </Tooltip>
                  <Tooltip title="Zoom Out" arrow>
                    <span>
                      <button
                        className={`${iconButtonClass} bg-yellow-500 hover:bg-yellow-600`}
                        onClick={handleZoomOut}
                      >
                        <ZoomOut size={12} className="sm:w-3.5 sm:h-3.5" />
                      </button>
                    </span>
                  </Tooltip>
                  <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"} arrow>
                    <span>
                      <button
                        className={`${iconButtonClass} bg-purple-500 hover:bg-purple-600`}
                        onClick={handleFullscreen}
                      >
                        {isFullscreen ? <Minimize2 size={12} className="sm:w-3.5 sm:h-3.5" /> : <Maximize2 size={12} className="sm:w-3.5 sm:h-3.5" />}
                      </button>
                    </span>
                  </Tooltip>
                </>
              )}
              {/* <Tooltip title="Reset" arrow>
                <span>
                  <button
                    className={`${iconButtonClass} bg-gray-500 hover:bg-gray-600`}
                    onClick={handleReset}
                  >
                    <RefreshCw size={12} className="sm:w-3.5 sm:h-3.5" />
                  </button>
                </span>
              </Tooltip> */}
              {/* <Tooltip title="Download" arrow>
                <span>
                  <button
                    className={`${iconButtonClass} bg-gray-500 hover:bg-gray-600`}
                    onClick={handleDownload}
                  >
                    <Download size={12} className="sm:w-3.5 sm:h-3.5" />
                  </button>
                </span>
              </Tooltip> */}
              <select
                value={selectedCategoryId || ""}
                onChange={e => dispatch(setSelectedCategory(Number(e.target.value)))}
                className="border border-gray-300 rounded px-2 py-1 bg-white text-gray-800 text-xs sm:text-sm max-w-full focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100 disabled:text-gray-400 transition w-full"
                disabled={!annotateMode}
                style={{ minWidth: 120 }}
              >
                <option value="" disabled>Select category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id} style={{ color: cat.color }}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          }
        />
      </div>

      {/* Action Buttons: place here, after Topbar */}
      <div style={{ height: "50px" }} />
      <ActionButtons
        onProcess={handleReprocess}
        onApprove={handleApprove}
        onDownload={handleDownload}
        approveLoading={approveLoading}
        downloadLoading={downloadLoading}
      />

      {/* Content Below Topbar */}
      <div
        className="transition-all duration-300 ease-in-out"
        style={{
          paddingTop: contentPaddingTop,
          maxWidth: "100vw",
          overflowX: "auto",
        }}
      >

        <div>
          {filesLoading ? (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "300px"
            }}>
              <CircularProgress color="primary" size={40} />
              <div style={{ marginTop: 16, color: "#666", fontSize: 16 }}>Loading document...</div>
            </div>
          ) : file && file.name ? (
            fileExtension === "pdf" ? (
              <PdfViewer
                fileUrl={fileUrl}
                annotateMode={annotateMode}
                annotationCategory={selectedCategory}
                annotations={annotations}
                setAnnotations={setAnnotations}
                annotationMode={annotationMode}
                setAnnotationMode={setAnnotationMode}
                ref={pdfViewerRef}
                onDownload={handleDownloadAnnotatedPdf}
              />
            ) : imageTypes.includes(fileExtension) ? (
              <ImageViewer
                fileUrl={fileUrl}
                fileName={file.name}
                zoom={zoom}
                setZoom={setZoom}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onReset={handleReset}
                annotateMode={annotateMode}
                setAnnotateMode={setAnnotateMode}
                isFullscreen={isFullscreen}
                onFullscreen={handleFullscreen}
                annotationCategory={selectedCategory}
                annotations={annotations}
                setAnnotations={setAnnotations}
                annotationMode={annotationMode}
                setAnnotationMode={setAnnotationMode}
                ref={imageViewerRef}
                onDownload={handleDownloadAnnotatedImage}
              />
            ) : (
              <div className="text-gray-500">Unsupported file type.</div>
            )
          ) : (
            <div className="text-gray-500">No document found.</div>
          )}
        </div>
      </div>

     
    </div>
  );
};

export default DocViewPage;
