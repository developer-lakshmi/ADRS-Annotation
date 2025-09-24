// MobileSubSidebar.jsx
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import generateAppConfig from "../../apps/app001/configs/appConfig";

const MobileSubSidebar = () => {
  const activeSidebar = useSelector((state) => state.sidebar.activeSidebar);
  const appId = useSelector((state) => state.app.appId);
  const config = generateAppConfig(appId);
  const navigate = useNavigate();
  const isSubSidebarOpen = useSelector((state) => state.sidebar.isSubSidebarOpen);

  if (!activeSidebar || !isSubSidebarOpen) return null;

  return (
    <div
      className={`
        fixed left-0 w-full bg-gray-100 dark:bg-darkSecondary z-50 px-4 py-3 lg:hidden border-t
        transition-all duration-300 overflow-hidden
        max-h-[400px]
      `}
      style={{ top: "104px" }} // 56px Navbar + 48px MobileSidebar
    >
      <div className="flex flex-col gap-2">
        {config.menus[activeSidebar]?.map((item) => (
          <button
            key={item.title}
            onClick={() => navigate(`/app/${appId}${item.path}`)}
            className="block w-full text-left px-4 py-2 mb-1 rounded bg-white dark:bg-gray-800 text-sm dark:text-white shadow-sm"
          >
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileSubSidebar;