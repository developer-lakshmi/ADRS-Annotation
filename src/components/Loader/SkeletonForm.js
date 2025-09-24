const SkeletonForm = () => {
  return (
    <div className="mx-auto animate-pulse p-4" >
      {/* Back Button and Title */}
      <div className="flex items-center mb-4">
        
        <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Divider */}
      <div className="h-[1px] bg-gray-300 dark:bg-gray-700 mb-6"></div>
<div className="max-w-4xl mx-auto animate-pulse p-4">
      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-10 bg-gray-300 dark:bg-gray-700 rounded"
          ></div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
    </div>
  );
};

export default SkeletonForm;