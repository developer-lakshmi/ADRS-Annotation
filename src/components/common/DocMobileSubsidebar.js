import React from "react";
import Switch from "@mui/material/Switch";
import { useSelector, useDispatch } from "react-redux";
import { toggleCategory } from "../../redux/slices/annotation/annotationSlice";

const categories = [
  { id: 1, name: "Instrument", color: "#1976d2" },
  { id: 2, name: "Valve", color: "#e53935" },
  { id: 3, name: "Equipment", color: "#43a047" },
  { id: 4, name: "Pipe", color: "#fbc02d" },
];

const DocMobileSubSidebar = () => {
  const dispatch = useDispatch();
  const { isSubSidebarOpen, activeSidebar } = useSelector((state) => state.docSidebar);
  const visibleCategories = useSelector((state) => state.annotation.visibleCategories) || [];

  if (!isSubSidebarOpen || !activeSidebar) return null;

  if (activeSidebar === "doc-info") {
    return (
      <div className="fixed left-0 w-full bg-gray-100 dark:bg-darkTheme z-50 px-4 py-3 lg:hidden border-t transition-all duration-300 overflow-hidden max-h-[400px]" style={{ top: "104px" }}>
        <div className="font-bold mb-2">Annotation Categories</div>
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center mb-2">
            <span className="flex-1">{cat.name}</span>
            <Switch
              checked={visibleCategories.includes(cat.id)}
              onChange={() => dispatch(toggleCategory(cat.id))}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': { color: cat.color },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: cat.color },
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  // For other sidebars, you can add more logic here as needed
  return (
    <div className="fixed left-0 w-full bg-gray-100 dark:bg-darkTheme z-50 px-4 py-3 lg:hidden border-t transition-all duration-300 overflow-hidden max-h-[400px]" style={{ top: "104px" }}>
      <div className="text-gray-400 text-sm px-4 py-2">No data available.</div>
    </div>
  );
};

export default DocMobileSubSidebar;