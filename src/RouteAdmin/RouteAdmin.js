import React from "react";
import { Route, Routes } from "react-router-dom";
import Admin from "./Admin/Admin";

const RouteAdmin = (props) => {
  return (
    <Routes>
      <Route path="/admin" element={<Admin></Admin>}></Route>
    </Routes>
  );
};

export default RouteAdmin;
