import React, { useState } from "react";
import Header from "../../Header/Header";
import "./HomeStyle.css";
import About from "./About/About";
import ProductItem from "./Product/ProductItem";
import Footer from "../../Footer/Footer";

const Home = () => {
  const [searchProduct, setSearchProduct] = useState("");
  const [joinCate, setJoinCate] = useState("");

  //Truyền id xuống About
  const handleJoin = (idCate) =>{
    setJoinCate(idCate);
    setSearchProduct(null);
  }
  //Truyền dữ liệu xuống Header
  const handleSearch = (context) =>{
    setSearchProduct(context);
    setJoinCate(null);
  }
  return (
    <>
      <Header contextSearch={handleSearch}></Header>
      <div className="container">
        <About idCategory={handleJoin}></About>
        <div className="" style={{ marginTop: "300px" }}>
          <h4 className="text-center fw-bold">Sản phẩm dành cho bạn</h4>
          <div className="row">
            <ProductItem item={searchProduct} idCate={joinCate}></ProductItem>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};
  
export default Home;
