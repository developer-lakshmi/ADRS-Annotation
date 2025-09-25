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
          {Array.from({ length: 8 }).map((_, index) => (
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
                className="w-full max-w-[375px] 2xl:max-w-[420px] h-44  bg-white/20 dark:bg.transparent border rounded-lg shadow-lg hover:scale-105 transition-transform cursor-pointer p-4 flex flex-col justify-between text-gray-600 dark:text-white/50 dark:hover:text-white/100 dark:hover:bg-white/10"
              >
                <h3 className="text-lg font-bold mb-2">{project.projectName}</h3>
                {/* <p className="text-sm mb-4">{project.clientName}</p> */}
                <p className="text-sm mb-4">{project.userId}</p>
                <div className="flex justify-end space-x-2 mt-auto">
                  <button
                    onClick={() => handleStart(project.id)}
                    className={`${iconButtonClass} bg-green-500 hover:bg-green-600`}
                    title="Start Project"
                  >
                    <Play size={16} />
                  </button>
                  <button
                    onClick={() => navigate(`/app/${appId}/dashboard/newprojectid/${project.id}`)}
                    className={`${iconButtonClass} bg-blue-500 hover:bg-blue-600`}
                    title="Edit Project"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className={`${iconButtonClass} bg-red-500 hover:bg-red-600`}
                    title="Delete Project"
                  >
                    <Trash2 size={16} />
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