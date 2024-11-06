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
import NotFound from "../NotFound";

const RouteUsers = (props) => {
  return (
    <Routes>
    <Route path="/" element={<Home></Home>}></Route>
    <Route
      path="login"
      element={
        <GoogleOAuthProvider clientId="175283151902-4ncr5sj18h9e9akpj72mmnjbcq1mqdkg.apps.googleusercontent.com">
          <Form></Form>
        </GoogleOAuthProvider>
      }
    ></Route>
    <Route path="/cart" element={<Cart></Cart>}></Route>
    <Route path="/market" element={<Market></Market>}></Route>
    <Route path="/profileMarket/*" element={<IsMarket></IsMarket>}></Route>
    <Route
      path="detailProduct/:slug"
      element={<DetailProduct></DetailProduct>}
    ></Route>
    <Route
      path="profileMarket/checkItemProduct/:slug"
      element={<CheckItemProduct></CheckItemProduct>}
    ></Route>
    <Route path="/user/*" element={<ProfileUser></ProfileUser>}></Route>
    <Route
      path="forgotPass"
      element={<ForgotPassword></ForgotPassword>}
    ></Route>
    <Route path="/otp" element={<OTP />}></Route>
    <Route path="/resetPassword" element={<ResetPassword />}></Route>
    <Route path="/pageStore/:slugStore" element={<Store />}></Route>

    <Route path="/order" element={<Order></Order>}></Route>
    <Route
      path="/OrderDetail"
      element={<OrderDetail></OrderDetail>}
    ></Route>
    <Route path="/paybuyer" element={<PayBuyer />} />
    <Route path="/orderDetail/:id" element={<OrderDetail />} />
    <Route path="/shippingCreate" element={<ShippingCreate />} />
    <Route path="/orderCreateVnPay" element={<Successful />} />

    <Route
      path="/notifications"
      element={<NotificationCard></NotificationCard>}
    ></Route>
    <Route
      path="/findMoreProduct/:name"
      element={<FindMoreProduct />}
    ></Route>
    <Route
      path="/product/PerMall"
      element={<FindMoreProductPerMall />}
    ></Route>
    <Route path="/404/NotFound" element={<NotFound/>}></Route>
  </Routes>
  );
};

export default RouteUsers;
