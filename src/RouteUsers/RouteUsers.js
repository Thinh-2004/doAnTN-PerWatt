import React from "react";
import { Routes, Route } from "react-router-dom";
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
import ShippingCreate from "../components/Shipping/ShippingCreate";
import NotificationCard from "../components/Notification&Message&Comment/Notification/SellerNotification";
import Successful from "../components/Order/Successful/Successful";
import { GoogleOAuthProvider } from "@react-oauth/google";
import FindMoreProduct from "../components/Body/Home/FindMoreProduct/FindMoreProduct";
import FindMoreProductPerMall from "../components/Body/Home/FindMoreProductPerMall/FindMoreProductPerMall";
import Wallet from "../components/Wallet/Wallet";
import Transaction from "../components/Wallet/Transaction";
import NotFound from "../NotFound";
import SecurityRoutes from "../components/SecurityRoutes/SecurityRoutes";

const RouteUsers = (props) => {
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
          <SecurityRoutes allowedRoles={["Admin", "Seller", "Buyer"]}>
            <Cart />
          </SecurityRoutes>
        }
      ></Route>
      <Route
        path="/user/*"
        element={
          <SecurityRoutes allowedRoles={["Admin", "Seller", "Buyer"]}>
            <ProfileUser />
          </SecurityRoutes>
        }
      ></Route>
      <Route
        path="/order"
        element={
          <SecurityRoutes allowedRoles={["Admin", "Seller", "Buyer"]}>
            <Order />
          </SecurityRoutes>
        }
      ></Route>
      <Route
        path="/paybuyer"
        element={
          <SecurityRoutes allowedRoles={["Admin", "Seller", "Buyer"]}>
            <PayBuyer />
          </SecurityRoutes>
        }
      />
      <Route
        path="/orderDetail/:id"
        element={
          <SecurityRoutes allowedRoles={["Admin", "Seller", "Buyer"]}>
            <OrderDetail />
          </SecurityRoutes>
        }
      />
      <Route
        path="/shippingCreate"
        element={
          <SecurityRoutes allowedRoles={["Admin", "Seller", "Buyer"]}>
            <ShippingCreate />
          </SecurityRoutes>
        }
      />
      <Route
        path="/orderCreateVnPay"
        element={
          <SecurityRoutes allowedRoles={["Admin", "Seller", "Buyer"]}>
            <Successful />
          </SecurityRoutes>
        }
      />

      <Route
        path="/notifications"
        element={
          <SecurityRoutes allowedRoles={["Admin", "Seller", "Buyer"]}>
            <NotificationCard />
          </SecurityRoutes>
        }
      ></Route>

      <Route
        path="/wallet/:role"
        element={
          <SecurityRoutes allowedRoles={["Admin", "Seller", "Buyer"]}>
            <Wallet />
          </SecurityRoutes>
        }
      ></Route>
      <Route
        path="/transaction"
        element={
          <SecurityRoutes allowedRoles={["Admin", "Seller", "Buyer"]}>
            <Transaction />
          </SecurityRoutes>
        }
      />
      {/* ------------- */}
      {/* Phân quyền Buyer */}
      <Route
        path="/market"
        element={
          <SecurityRoutes allowedRoles={["Buyer"]}>
            <Market />
          </SecurityRoutes>
        }
      ></Route>
      {/* ------------- */}
      {/* Phân quyền Seller  */}
      <Route
        path="/profileMarket/*"
        element={
          <SecurityRoutes allowedRoles={["Seller"]}>
            <IsMarket />
          </SecurityRoutes>
        }
      ></Route>
      <Route
        path="profileMarket/checkItemProduct/:slug"
        element={
          <SecurityRoutes allowedRoles={["Seller"]}>
            <CheckItemProduct />
          </SecurityRoutes>
        }
      ></Route>
    </Routes>
  );
};

export default RouteUsers;
