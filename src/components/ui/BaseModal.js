import React, { useRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addFiles } from "../../redux/slices/shared/fileUploadSlice";

const BaseModal = ({ message, onCancel, showFileUpload = false, onOk }) => {
  const dispatch = useDispatch();
  const cancelRef = useRef(null);
  const confirmRef = useRef(null);
  const [focusedIndex, setFocusedIndex] = useState(0); // 0 = Cancel, 1 = Confirm
  const [files, setFiles] = useState([]); // Track uploaded files

  const buttons = [cancelRef, confirmRef];
  const splitMessage = message.split(/[!]/);

  // Focus first button when modal opens
  useEffect(() => {
    if (buttons[focusedIndex] && buttons[focusedIndex].current) {
      buttons[focusedIndex].current.focus();
    }
  }, [focusedIndex]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev === 0 ? 1 : 0));
    }
    if (e.key === "Enter") {
      if (focusedIndex === 0) onCancel();
      if (focusedIndex === 1) handleUpload();
    }
  };

  const handleFileChange = (e) => {
    setFiles([...files, ...e.target.files]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFiles([...files, ...e.dataTransfer.files]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = () => {
    if (files.length > 0) {
      console.log("Files to upload:", files); // Debug log
      onOk(files);
      setFiles([]);
      onCancel();
    } else {
      alert("No files selected for upload.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 w-full max-w-md p-6 rounded-2xl shadow-xl mx-4 sm:mx-0">
        <h2 className="text-lg font-semibold">{splitMessage[0]}!</h2>
        {splitMessage.length > 1 && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            {splitMessage[1]}
          </p>
        )}
        {showFileUpload ? (
          <>
            <div className="mt-4">
              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-700 p-4 rounded-lg text-center"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Drag and drop files here, or click to select files
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="fileInput"
                />
                <label
                  htmlFor="fileInput"
                  className="cursor-pointer text-blue-500"
                >
                  Browse Files
                </label>
              </div>
              <div className="mt-4 text-sm">
                {files.length > 0 ? (
                  <p className="text-gray-600 dark:text-gray-300">
                    {files.length} file(s) selected.
                  </p>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    No files selected yet.
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end mt-6 space-x-3">
              <button
                ref={cancelRef}
                onClick={onCancel}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                ref={confirmRef}
                onClick={handleUpload}
                className="px-4 py-2 text-sm rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Upload
              </button>
            </div>
          </>
        ) : (
          <div className="flex justify-end mt-6 space-x-3">
            <button
              ref={cancelRef}
              onClick={onCancel}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              ref={confirmRef}
              onClick={onOk}
              className="px-4 py-2 text-sm rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Ok
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default BaseModal;