import React from 'react';

const SkeltProjectCard = () => {
  return (
    <div className="w-full max-w-[375px] 2xl:max-w-[420px] border rounded-lg overflow-hidden shadow-lg p-6 bg-gray-200 dark:bg-gray-800 animate-pulse flex flex-col justify-between">
      {/* Placeholder for image */}
      <div className="w-full h-auto bg-gray-300 dark:bg-gray-700 mb-4 rounded"></div>
      {/* Card content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="h-6 w-32 bg-gray-400 dark:bg-gray-600 rounded mb-2"></div>
          <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded mb-1"></div>
          <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeltProjectCard;