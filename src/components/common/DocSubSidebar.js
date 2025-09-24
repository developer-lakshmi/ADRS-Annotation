import * as React from 'react';
import Switch from '@mui/material/Switch';
import { useSelector, useDispatch } from "react-redux";
import docConfig from "../../apps/app001/configs/docConfig";
import { toggleCategory } from "../../redux/slices/annotation/annotationSlice";

const categories = [
  { id: 1, name: "Instrument", color: "#1976d2" },
  { id: 2, name: "Valve", color: "#e53935" },
  { id: 3, name: "Equipment", color: "#43a047" },
  { id: 4, name: "Pipe", color: "#fbc02d" },
];

const DocSubSidebar = () => {
  const dispatch = useDispatch();
  const activeSidebar = useSelector((state) => state.docSidebar.activeSidebar);
  const isSubSidebarOpen = useSelector((state) => state.docSidebar.isSubSidebarOpen);
  const visibleCategories = useSelector((state) => state.annotation.visibleCategories) || [];

  if (!isSubSidebarOpen || !activeSidebar) return null;

  // Show annotation categories only for first icon
  if (activeSidebar === "doc-info") {
    return (
      <aside className="fixed top-[56px] left-[32px] h-[calc(100vh-56px)] w-[150px] p-2 bg-gray-100 dark:bg-darkTheme shadow-md border-r border-[rgb(230,231,232)] dark:border-gray-700 flex flex-col items-center py-4 transition-all duration-300">
        <div className="font-bold mb-2">Annotation Categories</div>
        {categories.map((cat) => (
          <div key={cat.id} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
            <span style={{ flex: 1 }}>{cat.name}</span>
            <Switch
              checked={visibleCategories.includes(cat.id)}
              onChange={() => dispatch(toggleCategory(cat.id))}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: cat.color,
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: cat.color,
                },
              }}
            />
          </div>
        ))}
      </aside>
    );
  }

  // For other icons, show docConfig content or a placeholder
  const items = docConfig[activeSidebar] || [];
  return (
    <aside className="fixed top-[56px] left-[32px] h-[calc(100vh-56px)] w-[150px] bg-gray-100 dark:bg-darkTheme shadow-md border-r border-[rgb(230,231,232)] dark:border-gray-700 flex flex-col items-center py-4 transition-all duration-300">
      <nav className="flex flex-col gap-2 w-full">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-start py-2 px-4 w-full rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            >
              <span className="text-sm font-semibold">{item.title}</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {item.actions.map((action) => (
                  <span
                    key={action}
                    className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-0.5 rounded"
                  >
                    {action}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-sm px-4 py-2">No data available.</div>
        )}
      </nav>
    </aside>
  );
};

export default DocSubSidebar;