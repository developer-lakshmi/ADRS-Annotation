import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AppMainRoutes from "../apps/app001/components/AppMainRoutes";

const DynamicAppPage = () => {
  const { id } = useParams();
  const appId = useSelector((state) => state.app.appId);

  if (!id || id === "null") {
    return <Navigate to="/Home" replace />;
  }

  return (
    <div>
      <AppMainRoutes appId={appId || id} />
    </div>
  );
};

export default DynamicAppPage;
