import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import generateAppConfig from "../../apps/app001/configs/appConfig";

const SubSidebar = () => {
  const navigate = useNavigate();
  const activeSidebar = useSelector((state) => state.sidebar.activeSidebar); // Get active Sidebar state
  const isSubSidebarOpen = useSelector((state) => state.sidebar.isSubSidebarOpen); // Check if Sub-sidebar is open
  const appId = useSelector((state) => state.app.appId); // Get appId from Redux

  const appConfig = generateAppConfig(appId); // Generate menu options dynamically

  // Debug logs
  console.log("SubSidebar activeSidebar:", activeSidebar);
  console.log("SubSidebar isSubSidebarOpen:", isSubSidebarOpen);

  // If Sub-sidebar is not open, do not render it
  if (!isSubSidebarOpen || !activeSidebar) {
    console.log("SubSidebar not rendering because it is closed or no activeSidebar");
    return null;
  }

  const handleSubSidebarClick = (path) => {
    console.log(`Navigating to: ${path}`); // Debug log for navigation
    const basePath = `/app/${appId}`; // Dynamic base path using appId
    navigate(`${basePath}${path}`); // Navigate dynamically
  };

  return (
    <aside className={`fixed top-[56px] left-8 h-[calc(100vh-56px)] w-40 bg-gray-100 dark:bg-darkSecondary p-4 shadow-md transition-all duration-300 border-r border-l border-[rgb(230,231,232)] dark:border-gray-700 ${isSubSidebarOpen ? 'border-l' : 'border-none'}`}>

      <nav className="flex flex-col gap-4">
        {appConfig.menus[activeSidebar]?.map((item) => (
          <button
            key={item.title}
            onClick={() => handleSubSidebarClick(item.path)}
            className="p-2 rounded text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors duration-200"
          >
            {item.title}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default SubSidebar;
