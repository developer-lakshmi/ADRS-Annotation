import React from "react";

const StatusLayout = ({ children }) => {
  return (
    <main className="bg-[#fff] dark:bg-darkTheme flex-1"
      style={{
        height: "calc(100vh - 56px)", // Adjust height to exclude Navbar
        overflowY: "auto", // Enable vertical scrolling
      }}
    >
      {children}
    </main>
  );
};

export default StatusLayout;
