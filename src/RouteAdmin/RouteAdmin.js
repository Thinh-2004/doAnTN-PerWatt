import React from "react";
import { Route, Routes } from "react-router-dom";
import MainDash from "../RouteAdmin/Admin/MainDash";

const RouteAdmin = (props) => {
  return (
    <Routes>
      <Route path="/admin" element={<MainDash></MainDash>}></Route>
    </Routes>
  );
};

export default RouteAdmin;
