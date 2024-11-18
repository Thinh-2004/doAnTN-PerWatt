import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminDashboard from "../RouteAdmin/Admin/AdminDashboard";
import UserInfo from "./Info/UserInfo";
import UserBanner from "./Banner/UserBanner";
import Wallet from "../components/Wallet/Wallet";

const RouteAdmin = (props) => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminDashboard/>}></Route>
      <Route path="/admin/info" element={<UserInfo />} />
      <Route path="/admin/banner" element={<UserBanner />} />
      <Route path="/admin/wallet" element={<Wallet />} />
    </Routes>
  );
};

export default RouteAdmin;
