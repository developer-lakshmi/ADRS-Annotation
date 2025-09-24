const SkeletonCard = () => {
  return (
    <div className="w-full max-w-[350px] sm:max-w-[300px] xs:max-w-full relative border rounded-lg overflow-hidden shadow-lg animate-pulse">
      {/* Placeholder for image */}
      <div className="h-48 bg-gray-300 dark:bg-gray-700 w-full"></div>

      {/* Bottom overlay area*/}
      <div className="absolute bottom-0 w-full bg-black bg-opacity-30 text-white p-4 flex justify-between items-center">
        <div className="h-4 w-24 bg-gray-400 dark:bg-gray-500 rounded"></div>
        <div className="h-3 w-16 bg-gray-500 dark:bg-gray-600 rounded"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;