import React from "react";
import { Menu, Home, Users, ChartColumnIncreasing, ChartLine } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveSidebar, closeSubSidebar } from "../../redux/slices/sidebar/sidebarSlice";

const Sidebar = ({ isScroll }) => {
  const dispatch = useDispatch();
  const activeSidebar = useSelector((state) => state.sidebar.activeSidebar);
  const isSubSidebarOpen = useSelector((state) => state.sidebar.isSubSidebarOpen);

  const handleMenuItemClick = (menu) => {
    // No redirect to dashboard, just open/close subsidebar
    if (activeSidebar === menu && isSubSidebarOpen) {
      dispatch(closeSubSidebar());
    } else {
      dispatch(setActiveSidebar(menu));
    }
  };

  return (
    <aside
      className={`fixed top-[56px] left-0 h-[calc(100vh-56px)] bg-transparent/10 !border-none dark:bg-darkPrimary text-black dark:text-white transition-all duration-300
        w-8
        ${isScroll ? "bg-opacity-50 backdrop-blur-lg shadow-sm dark:shadow-white/20 border-1 border-black" : ""}`}
    >
      {/* Menu Icon */}
      {/* <button
        className="p-2 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
      >
        <Menu size={20} />
      </button> */}

      {/* Sidebar Menu */}
      <nav className="flex flex-col gap-2 p-0">
        <div
          onClick={() => handleMenuItemClick("home")}
          className={`menu-item cursor-pointer flex items-center justify-center p-2 rounded transition-all duration-200 ${
            activeSidebar === "home"
              ? "bg-blue-500 text-white dark:bg-blue-700"
              : "hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          <Home size={15} />
        </div>
        <div
          onClick={() => handleMenuItemClick("users")}
          className={`menu-item cursor-pointer flex items-center justify-center p-2 rounded transition-all duration-200 ${
            activeSidebar === "users"
              ? "bg-blue-500 text-white dark:bg-blue-700"
              : "hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          <Users size={15} />
        </div>
        <div
          onClick={() => handleMenuItemClick("charts")}
          className={`menu-item cursor-pointer flex items-center justify-center p-2 rounded transition-all duration-200 ${
            activeSidebar === "charts"
              ? "bg-blue-500 text-white dark:bg-blue-700"
              : "hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          <ChartColumnIncreasing size={15} />
        </div>
        <div
          onClick={() => handleMenuItemClick("reports")}
          className={`menu-item cursor-pointer flex items-center justify-center p-2 rounded transition-all duration-200 ${
            activeSidebar === "reports"
              ? "bg-blue-500 text-white dark:bg-blue-700"
              : "hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          <ChartLine size={15} />
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
