import React from "react";
import { Pencil, Play, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SkeletonCard from "../../../../components/Loader/SkeltonCard";
import SkeltProjectCard from "../../../../components/Loader/SkeltProjectCard";
import { useSelector } from "react-redux"; // Import useSelector for Redux state
const ProjectDashboard = ({ projects, loading, handleStart, handleDelete, appId }) => {
  const iconButtonClass = "p-2 rounded text-white transition-colors";
  const navigate = useNavigate();
  const isMobileSidebarOpen = useSelector((state) => state.sidebar.isMobileSidebarOpen);
  const isSubSidebarOpen = useSelector((state) => state.sidebar.isSubSidebarOpen);

  // Remove or ignore mobileTopMargin here, as it's handled by parent
  return (
    <div
      className={`px-0 py-0 sm:py-0 lg:mt-0 ${
        isMobileSidebarOpen && !isSubSidebarOpen ? "py-1.5" : ""
      }`}
    >
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 justify-items-center">
          {Array.from({ length: projects.length || 8 }).map((_, index) => (
            <SkeltProjectCard key={index} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center text-gray-600 mt-10">
          <p className="text-lg">No projects created yet.</p>
          <p className="text-sm">Click "Create Project" to add a new project.</p>
        </div>
      ) : (
        <div className={`p-4 ${isSubSidebarOpen ? "pl-6 pr-0" : ""}`}>
          <div className="flex flex-wrap justify-start items-center gap-4">
            {projects.map((project) => (
               <div
                key={project.id}
                className="w-full max-w-[375px] 2xl:max-w-[420px] min-h-[200px] bg-white dark:bg-[#232a36] border border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 p-6 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 truncate">
                    {project.projectName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300 mb-1">
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Project ID:</span>{" "}
                    {project.projectId}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-300 mb-3">
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Project Type:</span>{" "}
                    {project.projectType}
                  </p>
                  {/* {project.projectDescription && (
                    <p className="text-xs text-gray-400 dark:text-gray-400 line-clamp-2">
                      {project.projectDescription}
                    </p>
                  )} */}
                </div>
               <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => handleStart(project.id)}
                    className={`${iconButtonClass} bg-green-500 hover:bg-green-600`}
                    title="Start Project"
                  >
                    <Play size={18} />
                  </button>
                  <button
                    onClick={() => navigate(`/app/${appId}/dashboard/newprojectid/${project.id}`)}
                    className={`${iconButtonClass} bg-blue-500 hover:bg-blue-600`}
                    title="Edit Project"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className={`${iconButtonClass} bg-red-500 hover:bg-red-600`}
                    title="Delete Project"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDashboard;