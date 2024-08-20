import React from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../components/UI&UX/Body/Home/Home";
import Order from "../components/Order/OrderBuyer/OrderBuyer";
import Cart from "../components/Cart/Cart";
import Form from "../components/Login&Register/Form";
import PayBuyer from "../components/Order/PayBuyer/PayBuyer";
import OrderDetail from "../components/Order/OrderDetail/OrderDetail";
import OrderSeller from "../components/Order/OrderSeller/OrderSeller";
import OrderDetailSeller from "../components/Order/OrderDetailSeller/OrderDetailSeller";
const RouterUsers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home></Home>}></Route>
      <Route path="/login" element={<Form></Form>}></Route>
      <Route path="/cart/:id" element={<Cart></Cart>}></Route>
      <Route path="/order" element={<Order></Order>}></Route>
      <Route path="/orderDetail/:id" element={<OrderDetail></OrderDetail>}></Route>
      <Route path="/pay" element={<PayBuyer></PayBuyer>}></Route>
      <Route path="/orderSeller" element={<OrderSeller></OrderSeller>}></Route>
      <Route
        path="/orderDetailSeller"
        element={<OrderDetailSeller></OrderDetailSeller>}
      ></Route>
    </Routes>
  );
};

export default RouterUsers;
