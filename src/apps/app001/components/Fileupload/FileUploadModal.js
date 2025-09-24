import React, { useState } from "react";

const FileUploadModal = ({ isOpen, onClose, onUpload }) => {
  const [files, setFiles] = useState([]); // Track uploaded files

  const handleFileChange = (e) => {
    setFiles([...files, ...e.target.files]); // Add selected files to state
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFiles([...files, ...e.dataTransfer.files]); // Add dropped files to state
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = () => {
    onUpload(files); // Pass uploaded files to parent
    setFiles([]); // Clear files after upload
    onClose(); // Close the modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 w-full max-w-md p-6 rounded-2xl shadow-xl mx-4 sm:mx-0">
        <h2 className="text-lg font-semibold">Upload Files</h2>
        <div
          className="border-2 border-dashed border-gray-300 dark:border-gray-700 p-4 rounded-lg text-center mt-4"
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
          <label htmlFor="fileInput" className="cursor-pointer text-blue-500">
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
        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 text-sm rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;