import React from "react";

const LoadingOverlay = ({ message = "Processing...", show = false }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[9999] bg-white/60 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <span className="text-lg font-semibold text-gray-700">{message}</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;