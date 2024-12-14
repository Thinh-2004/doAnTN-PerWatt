import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "../components/Body/Home/Home";
import Form from "../components/Login&Register/Form";
import Market from "../components/Market/Market";
import IsMarket from "../components/Market/CheckUsers/IsMarket/IsMarket";
import DetailProduct from "../components/Body/Home/ShowDetailProduct/ShowDetailProduct";
import CheckItemProduct from "../components/Market/CheckUsers/IsMarket/Product/CheckItemProduct/CheckItemProduct";
import Cart from "../components/Cart/Cart";
import ProfileUser from "../components/ProfileUser/ProfileUser";
import ForgotPassword from "../components/ForgotPasswordUser/ForgotPassword";
import OTP from "../components/ForgotPasswordUser/OTP";
import ResetPassword from "../components/ForgotPasswordUser/ResetPassword";
import Store from "../components/Body/Store/NavStore";
import Order from "../components/Order/OrderBuyer/OrderBuyer";
import OrderDetail from "../components/Order/OrderDetail/OrderDetail";
import PayBuyer from "../components/Order/PayBuyer/PayBuyer";
import Successful from "../components/Order/Successful/Successful";
import { GoogleOAuthProvider } from "@react-oauth/google";
import FindMoreProduct from "../components/Body/Home/FindMoreProduct/FindMoreProduct";
import FindMoreProductPerMall from "../components/Body/Home/FindMoreProductPerMall/FindMoreProductPerMall";
import NotFound from "../NotFound";
import SecurityRoutes from "../components/SecurityRoutes/SecurityRoutes";
import BuyerNotification from "../components/Notification&Message&Comment/Notification/BuyerNotification";
import NotificationCard from "../components/Notification&Message&Comment/Notification/SellerNotification";
import ListReportUser from "../components/Report/ListReportUser";
import axios from "../Localhost/Custumize-axios";

const RouteUsers = (props) => {
  //Khi vừa render trang web kiểm tra quyền
  const navigate = useNavigate();

  useEffect(() => {
    const loadCheck = async () => {
      try {
        const resUserInfo = await axios.get(`/userProFile/myInfo`);
        // Lưu trạng thái đã phân quyền vào sessionStorage
        sessionStorage.setItem("checkRenderWebsite", true);
        if (resUserInfo.data.rolePermission.role.namerole === "Admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking user role:", error);
      }
    };

    if (!sessionStorage.getItem("checkRenderWebsite")) {
      // Chỉ kiểm tra quyền lần đầu tiên
      loadCheck();
    }
  }, [navigate]);
  return (
    <Routes>
      {/* Các routes public */}
      <Route path="/" element={<Home></Home>}></Route>
      <Route
        path="login"
        element={
          <GoogleOAuthProvider clientId="175283151902-4ncr5sj18h9e9akpj72mmnjbcq1mqdkg.apps.googleusercontent.com">
            <Form></Form>
          </GoogleOAuthProvider>
        }
      ></Route>
      <Route path="forgotPass" element={<ForgotPassword />}></Route>
      <Route path="/otp" element={<OTP />}></Route>
      <Route path="/resetPassword" element={<ResetPassword />}></Route>
      <Route path="/pageStore/:slugStore" element={<Store />}></Route>
      <Route path="/OrderDetail" element={<OrderDetail />}></Route>
      <Route
        path="/findMoreProduct/:name"
        element={<FindMoreProduct />}
      ></Route>
      <Route
        path="/product/PerMall"
        element={<FindMoreProductPerMall />}
      ></Route>
      <Route path="detailProduct/:slug" element={<DetailProduct />}></Route>
      <Route path="/404/NotFound" element={<NotFound />}></Route>
      {/* ------------- */}
      {/* Các route cần security */}
      <Route
        path="/cart"
        element={
          <SecurityRoutes
            allowedRoles={[
              "Admin_All_Function",
              "Seller_Manage_Shop",
              "Buyer_Manage_Buyer",
            ]}
          >
            <Cart />
          </SecurityRoutes>
        }
      ></Route>
      <Route
        path="/user/*"
        element={
          <SecurityRoutes
            allowedRoles={[
              "Admin_All_Function",
              "Seller_Manage_Shop",
              "Buyer_Manage_Buyer",
            ]}
          >
            <ProfileUser />
          </SecurityRoutes>
        }
      ></Route>
      <Route
        path="/order"
        element={
          <SecurityRoutes
            allowedRoles={[
              "Admin_All_Function",
              "Seller_Manage_Shop",
              "Buyer_Manage_Buyer",
            ]}
          >
            <Order />
          </SecurityRoutes>
        }
      ></Route>
      <Route
        path="/paybuyer"
        element={
          <SecurityRoutes
            allowedRoles={[
              "Admin_All_Function",
              "Seller_Manage_Shop",
              "Buyer_Manage_Buyer",
            ]}
          >
            <PayBuyer />
          </SecurityRoutes>
        }
      />
      <Route
        path="/orderDetail/:id"
        element={
          <SecurityRoutes
            allowedRoles={[
              "Admin_All_Function",
              "Seller_Manage_Shop",
              "Buyer_Manage_Buyer",
            ]}
          >
            <OrderDetail />
          </SecurityRoutes>
        }
      />
      <Route
        path="/orderCreateVnPay"
        element={
          <SecurityRoutes
            allowedRoles={[
              "Admin_All_Function",
              "Seller_Manage_Shop",
              "Buyer_Manage_Buyer",
            ]}
          >
            <Successful />
          </SecurityRoutes>
        }
      />

      <Route
        path="/notifications"
        element={
          <SecurityRoutes
            allowedRoles={[
              "Admin_All_Function",
              "Seller_Manage_Shop",
              "Buyer_Manage_Buyer",
            ]}
          >
            <NotificationCard />
          </SecurityRoutes>
        }
      ></Route>
      <Route
        path="/profileMarket/notifications"
        element={
          <SecurityRoutes
            allowedRoles={["Admin_All_Function", "Seller_Manage_Shop"]}
          >
            <NotificationCard />
          </SecurityRoutes>
        }
      ></Route>
      <Route
        path="/buyerNotification"
        element={
          <SecurityRoutes
            allowedRoles={[
              "Admin_All_Function",
              "Seller_Manage_Shop",
              "Buyer_Manage_Buyer",
            ]}
          >
            <BuyerNotification />
          </SecurityRoutes>
        }
      ></Route>

      <Route
        path="/report"
        element={
          <SecurityRoutes
            allowedRoles={["Seller_Manage_Shop", "Buyer_Manage_Buyer"]}
          >
            <ListReportUser />
          </SecurityRoutes>
        }
      ></Route>

      {/* ------------- */}
      {/* Phân quyền Buyer */}
      <Route
        path="/market"
        element={
          <SecurityRoutes allowedRoles={["Buyer_Manage_Buyer"]}>
            <Market />
          </SecurityRoutes>
        }
      ></Route>
      {/* ------------- */}
      {/* Phân quyền Seller  */}
      <Route
        path="/profileMarket/*"
        element={
          <SecurityRoutes allowedRoles={["Seller_Manage_Shop"]}>
            <IsMarket />
          </SecurityRoutes>
        }
      ></Route>
      <Route
        path="profileMarket/checkItemProduct/:slug"
        element={
          <SecurityRoutes allowedRoles={["Seller_Manage_Shop"]}>
            <CheckItemProduct />
          </SecurityRoutes>
        }
      ></Route>
    </Routes>
  );
};

export default RouteUsers;
