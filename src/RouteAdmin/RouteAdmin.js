import React from "react";
import { Route, Routes } from "react-router-dom";

import UserInfo from "./Info/UserInfo";
import Dashboard from "./Admin/Dashboard";
import AdminDashboard from "./Admin/AdminDashboard";

const RouteAdmin = (props) => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/info" element={<UserInfo />} />
    </Routes>
  );
};

export default RouteAdmin;
