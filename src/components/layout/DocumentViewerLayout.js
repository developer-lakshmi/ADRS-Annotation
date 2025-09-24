import React from "react";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import DocSidebar from "../common/DocSidebar";
import DocSubSidebar from "../common/DocSubSidebar";
import DocMobileSidebar from "../common/DocMobileSidebar";
import DocMobileSubSidebar from "../common/DocMobileSubsidebar";

const DocumentViewerLayout = ({ isScroll, children }) => {
 // Use Redux state for doc viewer sidebar/subsidebar
  const isSidebarOpen = useSelector((state) => state.docSidebar.isSidebarOpen);
  const isSubSidebarOpen = useSelector((state) => state.docSidebar.isSubSidebarOpen);
  const isMobileSidebarOpen = useSelector((state) => state.docSidebar.isMobileSidebarOpen);

  const sidebarWidth = isSidebarOpen ? 32 : 0;
  const subSidebarWidth = isSubSidebarOpen ? 150 : 0;
  const marginLeft = sidebarWidth + subSidebarWidth;

 // --- Add this for mobile paddingTop ---
  let mobilePaddingTop = 56; // Topbar height
  if (isMobileSidebarOpen && isSubSidebarOpen) {
    mobilePaddingTop += 48 + 64; // Topbar + MobileSidebar + MobileSubSidebar
  } else if (isMobileSidebarOpen) {
    mobilePaddingTop += 48; // Topbar + MobileSidebar
  }
  // --------------------------------------

  return (
    <div className="flex flex-1 relative h-full bg-[#fff] dark:bg-darkTheme transition-all duration-300">
      {/* Navbar */}
      <Navbar isScroll={isScroll} hasBorder={true} />

      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:block fixed top-[56px] left-0 h-full bg-white dark:bg-darkTheme transition-all duration-300 border-r border-[rgb(230,231,232)] dark:border-gray-700 z-20`}
      >
                  {/* Doc Sidebar */}
        <DocSidebar />
      </div>

      {/* Desktop SubSidebar */}
      {isSubSidebarOpen && (
        <div
          className="hidden lg:block fixed top-[56px] h-full bg-gray-100 dark:bg-darkTheme shadow-md transition-all duration-300 z-20"
          style={{
            left: `32px`,
            width: `${subSidebarWidth}px`,
          }}
        >
          <DocSubSidebar />
        </div>
      )}

      {/* Mobile Sidebar and SubSidebar */}
      {isMobileSidebarOpen && (
        <>
          <DocMobileSidebar />
          {isSubSidebarOpen && <DocMobileSubSidebar />}
        </>
      )}

      {/* Desktop Main Content */}
      <main
        className="flex-1 overflow-y-auto p-0 transition-all duration-300 hidden lg:block"
        style={{
          width: `calc(100vw - ${sidebarWidth + subSidebarWidth}px)`,
          marginLeft: `${marginLeft}px`,
          height: "calc(100vh - 56px)",
        }}
      >
        {children}
      </main>

      {/* Mobile Main Content */}
      <main
        className="flex-1 overflow-y-auto lg:hidden"
        style={{
          paddingTop: `${mobilePaddingTop}px`, // <-- This line fixes the layout!
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default DocumentViewerLayout;


