import React from "react";
import { useSelector } from "react-redux";
import Sidebar from "../common/Sidebar";
import SubSidebar from "../common/SubSidebar";
import Navbar from "./Navbar";
import MobileSidebar from "../common/MobileSidebar";
import MobileSubSidebar from "../common/MobileSubSidebar";

const AppLayout = ({ isScroll, children }) => {
const { isSubSidebarOpen, isSidebarOpen } = useSelector((state) => state.sidebar);
  const isMobileSidebarOpen = useSelector((state) => state.sidebar.isMobileSidebarOpen);

  const sidebarWidth = isSidebarOpen ? 150 : 32;
  const subSidebarWidth = isSubSidebarOpen ? 150 : 0;
  const marginLeft = sidebarWidth + subSidebarWidth;

  return (
    <div className="flex flex-1 relative h-full bg-[#fff] dark:bg-darkTheme transition-all duration-300">
      {/* Navbar */}
      <Navbar isScroll={isScroll} hasBorder={true} />

      {/* Sidebar */}
      <div
        className={`hidden lg:block fixed top-[56px] left-0 h-full bg-white dark:bg-darkTheme transition-all duration-300 border-r border-[rgb(230,231,232)] dark:border-gray-700`}
      >
        <Sidebar />
      </div>

      {/* SubSidebar */}
      {isSubSidebarOpen && (
        <div
          className="hidden lg:block fixed top-[56px] h-full bg-gray-100 dark:bg-darkTheme shadow-md transition-all duration-300"
          style={{
            left: `${sidebarWidth}px`,
            width: `${subSidebarWidth}px`,
          }}
        >
          <SubSidebar />
        </div>
      )}
       {isMobileSidebarOpen && (
  <>
    <MobileSidebar />
    {isSubSidebarOpen && <MobileSubSidebar />}
  </>
)}

        {/* Desktop View */}
      <main
        className="flex-1 overflow-y-auto p-0 transition-all duration-300 hidden lg:block"
        style={{
          marginLeft: `${marginLeft}px`, // Dynamically calculated margin
          height: "calc(100vh - 56px)", // Adjust height to exclude Navbar
        }}
      >
        {children}
      </main>

       {/* Mobile View */}
        <main className="flex-1 overflow-y-auto  lg:hidden">
          {children}
        </main>
    </div>
  );
};

export default AppLayout;


