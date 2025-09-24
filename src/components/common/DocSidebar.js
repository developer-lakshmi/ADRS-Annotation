import React from "react";
import { Tag, Layers, Wand2, BookOpen,FileText } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setDocActiveSidebar,
  setDocSidebarOpen,
  setDocSubSidebarOpen,
} from "../../redux/slices/doc-viewer/docSidebarSLice";
import { useNavigate } from "react-router-dom";

const docMenus = [
  { key: "annotation-categories", icon: <Tag size={20} />, label: "Annotation Categories" },
  { key: "pages", icon: <Layers size={20} />, label: "Pages" },
  { key: "ai-tools", icon: <Wand2 size={20} />, label: "AI Tools" },
  { key: "history", icon: <BookOpen size={20} />, label: "History" },
];

const categories = [
  { id: 1, name: "Instrument", color: "#1976d2" },
  { id: 2, name: "Valve", color: "#e53935" },
  { id: 3, name: "Equipment", color: "#43a047" },
  { id: 4, name: "Pipe", color: "#fbc02d" },
];

const DocSidebar = ({ active, onSelect, isScroll }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activeSidebar = useSelector((state) => state.docSidebar.activeSidebar);
  const isSubSidebarOpen = useSelector((state) => state.docSidebar.isSubSidebarOpen);
  const appId = useSelector((state) => state.app.appId); // Get appId from Redux
  const basePath = `/app/${appId}`; // Dynamic base path using appId
  const visibleCategories = useSelector((state) => state.annotation.visibleCategories) || [];

  const handleMenuItemClick = (menu) => {
    if (menu === "home") {
      dispatch(setDocSubSidebarOpen(false));
      navigate(`${basePath}/dashboard`);
      return;
    }
    if (activeSidebar === menu && isSubSidebarOpen) {
      dispatch(setDocSubSidebarOpen(false));
    } else {
      dispatch(setDocActiveSidebar(menu));
      dispatch(setDocSubSidebarOpen(true));
    }
  };

  return (
    <aside
      className={`fixed top-[56px] left-0 h-[calc(100vh-56px)]  bg-transparent/10 !border-none dark:bg-darkPrimary text-black dark:text-white transition-all duration-300
        w-8
        ${isScroll ? "bg-opacity-50 backdrop-blur-lg shadow-sm dark:shadow-white/20 border-1 border-black" : ""}`}
    >
      <nav className="flex flex-col gap-2 p-0">
        {/* <div
          onClick={() => handleMenuItemClick("home")}
          className={`menu-item cursor-pointer flex items-center justify-center p-2 rounded transition-all duration-200 ${
            activeSidebar === "home"
              ? "bg-blue-500 text-white dark:bg-blue-700"
              : "hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          <Home size={15} />
        </div> */}
        <div
          onClick={() => handleMenuItemClick("doc-info")}
          className={`menu-item cursor-pointer flex items-center justify-center p-2 rounded transition-all duration-200 ${
            activeSidebar === "doc-info"
              ? "bg-blue-500 text-white dark:bg-blue-700"
              : "hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          <FileText size={15} />
        </div>
        <div
          onClick={() => handleMenuItemClick("pages")}
          className={`menu-item cursor-pointer flex items-center justify-center p-2 rounded transition-all duration-200 ${
            activeSidebar === "pages"
              ? "bg-blue-500 text-white dark:bg-blue-700"
              : "hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          <Layers size={15} />
        </div>
        <div
          onClick={() => handleMenuItemClick("ai-tools")}
          className={`menu-item cursor-pointer flex items-center justify-center p-2 rounded transition-all duration-200 ${
            activeSidebar === "ai-tools"
              ? "bg-blue-500 text-white dark:bg-blue-700"
              : "hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          <Wand2 size={15} />
        </div>
        <div
          onClick={() => handleMenuItemClick("history")}
          className={`menu-item cursor-pointer flex items-center justify-center p-2 rounded transition-all duration-200 ${
            activeSidebar === "history"
              ? "bg-blue-500 text-white dark:bg-blue-700"
              : "hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          <BookOpen size={15} />
        </div>
      </nav>
    
    </aside>
  );
};

export default DocSidebar;