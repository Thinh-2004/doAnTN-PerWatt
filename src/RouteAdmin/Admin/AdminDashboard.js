import React from "react";
import Header from "../../components/Header/Header";
import Dashboard from "./Dashboard";

const AdminDashboard = () => {
  return (
    <div>
      <Header/>
      <div className="mt-2">
        <Dashboard></Dashboard>
      </div>

    </div>
  );
};

export default AdminDashboard;
