const generateAppConfig = (appId) => {
  const basePath = `/app/${appId}`; // Use appId dynamically in the base path

  return {
    defaultRoutes: {
      home: `${basePath}/dummy`, // Default to Dashboard
      users: `${basePath}/users`, // Default to User List
      charts: `${basePath}/charts`, // Default to Charts
      reports: `${basePath}/reports`, // Default to Reports
    },
    menus: {
      home: [
        { title: "Dashboard", path: `${basePath}/dummy`, actions: ["Overview", "Analytics"] },
        { title: "Overview", path: `${basePath}/overview`, actions: ["Details", "Summary"] },
      ],
      users: [
        { title: "User List", path: `${basePath}/users`, actions: ["Export", "Manage"] },
        { title: "Create User", path: `${basePath}/users/create`, actions: ["Templates", "Preview"] },
      ],
      charts: [
        { title: "Line Chart", path: `${basePath}/charts/line`, actions: ["Customize", "Download"] },
        { title: "Bar Chart", path: `${basePath}/charts/bar`, actions: ["Export", "Compare"] },
      ],
      reports: [
        { title: "Sales Report", path: `${basePath}/reports/sales`, actions: ["Export", "Share"] },
        { title: "Audit Logs", path: `${basePath}/reports/logs`, actions: ["Filter", "Download"] },
      ],
    },
  };
};

export default generateAppConfig;
