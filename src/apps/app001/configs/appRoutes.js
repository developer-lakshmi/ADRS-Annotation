import Dashboard from "../components/Dummy/Dashboard";  
import View from "../components/Dummy/View";
import Analytics from "../components//Dummy/Analytics";
import Overview from "../components/Dummy/Overview";
import Details from "../components/Dummy/Details";
import Summary from "../components/Dummy/Summary";
import UserList from "../components/Dummy/UserList";
import CreateUser from "../components/Dummy/CreateUser";
import Export from "../components/Dummy/Export";
import Manage from "../components/Dummy/Manage";
import Templates from "../components/Dummy/Templates";
import Preview from "../components/Dummy/Preview";
import Chart from "../components/Dummy/Chart";
import LineChart from "../components/Dummy/LineChart";
import Customize from "../components/Dummy/Customize";
import BarChart from "../components/Dummy/BarChart";
import Compare from "../components/Dummy/Compare";
import Report from "../components/Dummy/Report";
import SalesReport from "../components/Dummy/SalesReport";
import Share from "../components/Dummy/Share";
import AuditLogs from "../components/Dummy/AuditLogs";
import Filter from "../components/Dummy/Filter";
import PageNotFound from "../../../Pages/PageNotFound";
import CreateProjectPage from "../components/CreateProject/Page";
import ProjectFormPage from "../components/CreateProject/forms/ProjectFormPage";
// import PIDDiagramPage from "./components/3DModal/Page";

export const appRoutes = [
  // 3D Demo and Piping Code
// { path: "main", element: <PIDDiagramPage/> },
 { path: "dashboard", element: <CreateProjectPage /> },
 { path: "dashboard/project/:projectId", element: <CreateProjectPage /> },
 { path: "dashboard/newprojectid/:uniqueId", element: <ProjectFormPage /> },
  
  // Dashboard
  { path: "dummy", element: <Dashboard /> },
  { path: "dummy/overview", element: <View /> },
  { path: "dummy/analytics", element: <Analytics /> },

  // Overview
  { path: "overview", element: <Overview /> },
  { path: "overview/details", element: <Details /> },
  { path: "overview/summary", element: <Summary /> },

  // Users
  { path: "users", element: <UserList /> },
  { path: "users/create", element: <CreateUser /> },
  { path: "users/create/templates", element: <Templates /> },
  { path: "users/create/preview", element: <Preview /> },
  { path: "users/export", element: <Export /> },
  { path: "users/manage", element: <Manage /> },

  // Charts
  { path: "charts", element: <Chart /> },
  { path: "charts/line", element: <LineChart /> },
  { path: "charts/line/customize", element: <Customize /> },
  { path: "charts/line/download", element: <Export /> },
  { path: "charts/bar", element: <BarChart /> },
  { path: "charts/bar/compare", element: <Compare /> },
  { path: "charts/bar/export", element: <Export /> },

  // Reports
  { path: "reports", element: <Report /> },
  { path: "reports/sales", element: <SalesReport /> },
  { path: "reports/sales/share", element: <Share /> },
  { path: "reports/sales/export", element: <Export /> },
  { path: "reports/logs", element: <AuditLogs /> },
  { path: "reports/logs/filter", element: <Filter /> },
  { path: "reports/logs/download", element: <Export /> },

  // Catch-all
  { path: "*", element: <PageNotFound /> },
];
