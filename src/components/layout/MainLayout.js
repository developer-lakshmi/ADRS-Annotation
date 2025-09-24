import React from "react";

const MainLayout = ({ children }) => {
  return (
    <main className="bg-[#fff] dark:bg-darkTheme flex-1 p-0"
      style={{
        height: "calc(100vh - 56px)", // Adjust height to exclude Navbar
        overflowY: "auto", // Enable vertical scrolling
      }}
    >
      {children}
    </main>
  );
};

export default MainLayout;
