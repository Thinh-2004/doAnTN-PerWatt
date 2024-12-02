import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminDashboard from "../RouteAdmin/Admin/AdminDashboard";
import UserInfo from "./Info/UserInfo";
import UserBanner from "./Banner/UserBanner";
import Wallet from "../components/Wallet/Wallet";
import SecurityRoutes from "../components/SecurityRoutes/SecurityRoutes";
import PromotionInfoComponent from "./Admin/PromotionInfoComponent";
import ProductCategoryForm from "./Admin/ProductCategoryForm";
import ChangePass from "./Info/ChangePassword/ChangePass";

const RouteAdmin = (props) => {
  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <SecurityRoutes allowedRoles={["Admin"]}>
            <AdminDashboard />
          </SecurityRoutes>
        }
      ></Route>
      <Route
        path="/admin/info"
        element={
          <SecurityRoutes allowedRoles={["Admin"]}>
            <UserInfo />
          </SecurityRoutes>
        }
      />
      <Route
        path="/admin/banner"
        element={
          <SecurityRoutes allowedRoles={["Admin"]}>
            <UserBanner />
          </SecurityRoutes>
        }
      />
      <Route
        path="/admin/wallet"
        element={
          <SecurityRoutes allowedRoles={["Admin"]}>
            <Wallet />
          </SecurityRoutes>
        }
      />
      <Route
        path="/admin/voucher/website"
        element={
          <SecurityRoutes allowedRoles={["Admin"]}>
            <PromotionInfoComponent />
          </SecurityRoutes>
        }
      />
      <Route
        path="/admin/category"
        element={
          <SecurityRoutes allowedRoles={["Admin"]}>
            <ProductCategoryForm />
          </SecurityRoutes>
        }
      />
      <Route
        path="/admin/info/changePass"
        element={
          <SecurityRoutes allowedRoles={["Admin"]}>
            <ChangePass />
          </SecurityRoutes>
        }
      />
    </Routes>
  );
};

export default RouteAdmin;
