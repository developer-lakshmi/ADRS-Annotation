import { Pencil, Play, Trash2 } from 'lucide-react'
import React from 'react'

const SkeltProjectCard = () => {
  return (
 <div className="w-full max-w-[350px] bg-gray-200 dark:bg-gray-800 border rounded-lg shadow-lg animate-pulse p-4 flex flex-col justify-between">
      {/* Placeholder for project title */}
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>

      {/* Placeholder for client name */}
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>

      {/* Placeholder for action buttons */}
      <div className="flex justify-end space-x-2 mt-auto">
        <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
      </div>
    </div>  )
}

export default SkeltProjectCard