import React from "react";

import "./MainDash.css";
import CardsAmin from "./CardsAdmin";
import TableAd from "./TableAd";
import { Footer } from "antd/es/layout/layout";
import Header from "../../components/Header/Header";

const MainDash = () => {
  return (
    <div className="MainDash">
      <Header></Header>
      <div className="container">
        <h1>Overview chart</h1>
        <CardsAmin></CardsAmin>
        <a className="bnt btn-primary mt-3" href="/wallet">Ví</a>
        <div className="" style={{ marginTop: "70px" }}>
          <TableAd></TableAd>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default MainDash;
