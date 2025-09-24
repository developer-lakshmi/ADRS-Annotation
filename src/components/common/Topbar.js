import React from "react";

const Topbar = ({ leftContent, centerContent, rightContent }) => {
  return (
    <div className="bg-[#f8f9fa] dark:bg-darkTheme px-2 sm:px-4 lg:px-6 py-[6px] border-b border-[#dee2e6] dark:border-gray-700 flex justify-between items-center">
      {/* Left Section */}
      <div className="flex items-center text-gray-700 dark:text-gray-300 font-semibold text-base sm:text-lg flex-shrink-0">
        {leftContent || (
          <>
            <span className="text-gray-500 dark:text-gray-400 mr-1 sm:mr-2">🌟</span>
            <h2 className="text-lg sm:text-2xl">IRadSystem</h2>
          </>
        )}
      </div>{/* Center Section */}
      <div className="items-center justify-center text-gray-700 dark:text-gray-300 px-2 hidden md:flex">
        {centerContent}
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-end text-gray-700 dark:text-gray-300 flex-shrink-0">
        {rightContent || <span className="text-sm sm:text-base">User</span>}
      </div>
    </div>
  );
};

export default Topbar;
