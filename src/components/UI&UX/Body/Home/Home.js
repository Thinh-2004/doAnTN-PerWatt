import React from "react";
import Header from "../../Header/Header";
import { Link } from "react-router-dom";
import "./HomeStyle.css";
import About from "./About/About";
import ProductItem from "./Product/ProductItem";
import Footer from "../../Footer/Footer";

const Home = () => {
  return (
<<<<<<< HEAD
    <div>
=======
    <>
>>>>>>> 7591cd823f2e0548846e9695ecac625e3538904d
      <Header></Header>
      <div className="container">
        <About></About>
        <div className="" style={{ marginTop: "300px" }}>
          <h4 className="text-center fw-bold">Sản phẩm dành cho bạn</h4>
          <div className="row">
            <ProductItem></ProductItem>
          </div>
        </div>
      </div>
      <Footer></Footer>
<<<<<<< HEAD
    </div>
=======
    </>
>>>>>>> 7591cd823f2e0548846e9695ecac625e3538904d
  );
};

export default Home;
