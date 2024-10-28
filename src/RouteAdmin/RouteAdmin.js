import React from "react";
import { Route, Routes } from "react-router-dom";
import MainDash from "../RouteAdmin/Admin/MainDash";
import UserInfo from "./Info/UserInfo";

const RouteAdmin = (props) => {
  return (
    <Routes>
      <Route path="/admin" element={<MainDash></MainDash>}></Route>
      <Route path="/admin/info" element={<UserInfo />} />
    </Routes>
  );
};

export default RouteAdmin;
