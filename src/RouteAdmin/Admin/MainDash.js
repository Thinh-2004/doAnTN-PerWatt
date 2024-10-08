import React from "react";

import "./MainDash.css";
import CardsAmin from "./CardsAdmin";
import TableAd from "./TableAd";
import { Footer } from "antd/es/layout/layout";
import HeaderAdmin from "../../components/Header/HeaderAdmin";

const MainDash = () => {
  return (
    <div className="MainDash">
      <HeaderAdmin></HeaderAdmin>
      <div className="container">
        <h1>Overview chart</h1>
        <CardsAmin></CardsAmin>
        <div className="" style={{ marginTop: "70px" }}>
          <TableAd></TableAd>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default MainDash;
