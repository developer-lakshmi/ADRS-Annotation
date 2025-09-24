// MobileSidebar.jsx
import React from "react";
import { Home, Users, ChartColumnIncreasing, ChartLine } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveSidebar, closeSubSidebar } from "../../redux/slices/sidebar/sidebarSlice";

const MobileSidebar = () => {
  const dispatch = useDispatch();
  const { activeSidebar, isSubSidebarOpen } = useSelector((state) => state.sidebar);
  const menus = [
    { id: "home", icon: <Home size={20} /> },
    { id: "users", icon: <Users size={20} /> },
    { id: "charts", icon: <ChartColumnIncreasing size={20} /> },
    { id: "reports", icon: <ChartLine size={20} /> },
  ];

 const handleClick = (menuId) => {
  if (activeSidebar === menuId && isSubSidebarOpen) {
    dispatch(closeSubSidebar());
  } else {
    dispatch(setActiveSidebar(menuId));
  }
};

  return (
    <div className="fixed top-14 left-0 w-full bg-white dark:bg-darkTheme border-b z-40 flex items-center justify-around py-2 shadow-md lg:hidden">
      {menus.map(({ id, icon }) => (
        <button
          key={id}
          className={`p-2 rounded-full ${activeSidebar === id ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
          onClick={() => handleClick(id)}
        >
          {icon}
        </button>
      ))}
    </div>
  );
};

export default MobileSidebar;