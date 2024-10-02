import React from "react";
import HeaderAdmin from "../../components/Header/HeaderAdmin";
import Dashboard from "./Dashboard";
import { Footer } from "antd/es/layout/layout";

const AdminDashboard = () => {
  return (
    <div>
      <HeaderAdmin></HeaderAdmin>
      <div className="mt-2">
        <Dashboard></Dashboard>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default AdminDashboard;
