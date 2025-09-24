import React from "react";
import { Routes, Route } from "react-router-dom";
import { appRoutes } from "../configs/appRoutes";
export default function AppMainRoutes() {
  return (
    <div className="">
      <Routes>
        {appRoutes.map(({ path, element }, index) => (
          <Route key={index} path={path} element={element} />
        ))}
      </Routes>
    </div>
  );
}
