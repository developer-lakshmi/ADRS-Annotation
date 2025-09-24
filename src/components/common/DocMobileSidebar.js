import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDocActiveSidebar, setDocSubSidebarOpen } from "../../redux/slices/doc-viewer/docSidebarSLice";
import { FileText, Layers, Wand2, BookOpen } from "lucide-react";

const docMenus = [
  { key: "doc-info", icon: <FileText size={20} /> },
  { key: "pages", icon: <Layers size={20} /> },
  { key: "ai-tools", icon: <Wand2 size={20} /> },
  { key: "history", icon: <BookOpen size={20} /> },
];

const DocMobileSidebar = () => {
  const dispatch = useDispatch();
  const activeSidebar = useSelector((state) => state.docSidebar.activeSidebar);
  const isSubSidebarOpen = useSelector((state) => state.docSidebar.isSubSidebarOpen);

  const handleClick = (menuId) => {
    if (activeSidebar === menuId && isSubSidebarOpen) {
      dispatch(setDocSubSidebarOpen(false));
    } else {
      dispatch(setDocActiveSidebar(menuId));
      dispatch(setDocSubSidebarOpen(true));
    }
  };

  return (
    <div className="fixed top-14 left-0 w-full bg-white dark:bg-darkTheme border-b z-40 flex items-center justify-around py-2 shadow-md lg:hidden">
      {docMenus.map(({ key, icon }) => (
        <button
          key={key}
          className={`p-2 rounded-full ${activeSidebar === key ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
          onClick={() => handleClick(key)}
        >
          {icon}
        </button>
      ))}
    </div>
  );
};

export default DocMobileSidebar;