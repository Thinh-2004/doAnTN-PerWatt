import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../components/UI&UX/Body/Home/Home";
import Form from "../components/Login&Register/Form";
import Market from "../components/Market/Market";
import IsMarket from "../components/Market/CheckUsers/IsMarket/IsMarket";
import { ToastContainer } from "react-toastify";
import DetailProduct from "../components/UI&UX/Body/Home/DetailProduct/DetailProduct";
import CheckItemProduct from "../components/Market/CheckUsers/IsMarket/Product/CheckItemProduct/CheckItemProduct";
import Cart from "../components/Cart/Cart";
import ProfileUser from "../components/ProfileUser/ProfileUser";

const RouteUsers = (props) => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="login" element={<Form></Form>}></Route>
        <Route path="/cart" element={<Cart></Cart>}></Route>
        <Route path="/market" element={<Market></Market>}></Route>
        <Route path="/profileMarket/*" element={<IsMarket></IsMarket>}></Route>
        <Route
          path="detailProduct/:id"
          element={<DetailProduct></DetailProduct>}
        ></Route>
        <Route
          path="profileMarket/checkItemProduct/:id"
          element={<CheckItemProduct></CheckItemProduct>}
        ></Route>
        <Route path="/profileUser" element={<ProfileUser></ProfileUser>}></Route>
        <Route path="*">404 Not Found</Route>
      </Routes>
      <ToastContainer />
    </>
  );
};

export default RouteUsers;
