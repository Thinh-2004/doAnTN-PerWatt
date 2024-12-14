import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminDashboard from "../RouteAdmin/Admin/AdminDashboard";
import UserInfo from "./Info/UserInfo";
import UserBanner from "./Banner/UserBanner";
import SecurityRoutes from "../components/SecurityRoutes/SecurityRoutes";
import PromotionInfoComponent from "./Admin/PromotionInfoComponent";
import ProductCategoryForm from "./Admin/ProductCategoryForm";
import ChangePass from "./Info/ChangePassword/ChangePass";
import ManageUsers from "./ManageUsers/ManageUsers";

const RouteAdmin = (props) => {
  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <SecurityRoutes
            allowedRoles={[
              "Admin_All_Function",
              "Admin_Manage_Category",
              "Admin_Manage_Banner",
              "Admin_Manage_Revenue",
              "Admin_Manage_Support",
              "Admin_Manage_Promotion",
            ]}
          >
            <AdminDashboard />
          </SecurityRoutes>
        }
      ></Route>
      <Route
        path="/admin/info"
        element={
          <SecurityRoutes
            allowedRoles={[
              "Admin_All_Function",
              "Admin_Manage_Category",
              "Admin_Manage_Banner",
              "Admin_Manage_Revenue",
              "Admin_Manage_Support",
              "Admin_Manage_Promotion",
            ]}
          >
            <UserInfo />
          </SecurityRoutes>
        }
      />
      <Route
        path="/admin/banner"
        element={
          <SecurityRoutes
            allowedRoles={["Admin_All_Function", "Admin_Manage_Banner"]}
          >
            <UserBanner />
          </SecurityRoutes>
        }
      />

      <Route
        path="/admin/voucher/website"
        element={
          <SecurityRoutes
            allowedRoles={["Admin_All_Function", "Admin_Manage_Promotion"]}
          >
            <PromotionInfoComponent />
          </SecurityRoutes>
        }
      />
      <Route
        path="/admin/category"
        element={
          <SecurityRoutes
            allowedRoles={["Admin_All_Function", "Admin_Manage_Category"]}
          >
            <ProductCategoryForm />
          </SecurityRoutes>
        }
      />
      <Route
        path="/admin/info/changePass"
        element={
          <SecurityRoutes
            allowedRoles={[
              "Admin_All_Function",
              "Admin_Manage_Category",
              "Admin_Manage_Banner",
              "Admin_Manage_Revenue",
              "Admin_Manage_Support",
              "Admin_Manage_Promotion",
            ]}
          >
            <ChangePass />
          </SecurityRoutes>
        }
      />

      <Route
        path="/admin/manage/user"
        element={
          <SecurityRoutes
            allowedRoles={["Admin_All_Function", "Admin_Manage_Support"]}
          >
            <ManageUsers />
          </SecurityRoutes>
        }
      />
    </Routes>
  );
};

export default RouteAdmin;
