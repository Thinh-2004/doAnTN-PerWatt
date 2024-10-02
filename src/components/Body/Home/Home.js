import React, { useState } from "react";
import Header from "../../Header/Header";
import "./HomeStyle.css";
import About from "./About/About";
import ProductItem from "./Product/ProductItem";
import Footer from "../../Footer/Footer";
import BannerMiddle from "./Banner/BannerMiddle";

const Home = () => {
  const [searchProduct, setSearchProduct] = useState("");
  const [resetSearch, setResetSearch] = useState(false);
  const [joinCate, setJoinCate] = useState("");

  //Truyền id xuống About
  const handleIdCate = (idCate) => {
    setJoinCate(idCate);
    setSearchProduct("");
    setResetSearch(false); // Giữ lại nội dung tìm kiếm
  };
  //Truyền dữ liệu xuống Header
  const handleSearch = (context) => {
    setSearchProduct(context);
    setJoinCate("");
    setResetSearch(false); // Giữ lại nội dung tìm kiếm
  };

  //Khi chọn hiển thị tất cả sản phẩm
  const handleReloadProduct = () => {
    setSearchProduct("");
    setJoinCate("");
    setResetSearch(true); // Đặt lại thanh tìm kiếm
  };
  return (
    <>
      <Header contextSearch={handleSearch} resetSearch={resetSearch}></Header>
      <About idCategory={handleIdCate}></About>
      <div className="container-fluid" style={{ marginTop: "12%" }}>
        <BannerMiddle />
      </div>
      <div className="container">
        <h4 className="text-center fw-bold mt-4">Sản phẩm dành cho bạn</h4>
        <div className="row d-flex justify-content-center">
          <ProductItem
            item={searchProduct}
            idCate={joinCate}
            handleReset={handleReloadProduct}
          ></ProductItem>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Home;
