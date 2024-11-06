import React from "react";
import { Link, useMatch } from "react-router-dom";

const LeftHeader = () => {
  const matchSeller = useMatch("/profileMarket/*"); //Kiểm tra đường dẫn có chứa tham số động
  const matchAdmin = useMatch("/admin/*"); //Kiểm tra đường dẫn có chứa tham số động
  const matchPerMall = useMatch("/product/PerMall"); //Kiểm tra đường dẫn có chứa tham số động
  return (
    <>
      {matchSeller ? (
        <>
          <Link to={"/profileMarket"}>
            <img src="/images/logoWeb.png" alt="" className="" id="img-logo" />
          </Link>
          <h1
            id="title-web"
            className="fw-bold fst-italic mt-2 fs-3 p-1"
            style={{ marginLeft: "10px" }}
          >
            P E R W A T T - SHOP
          </h1>
        </>
      ) : matchAdmin ? (
        <>
          <Link to={"/admin"}>
            <img src="/images/logoWeb.png" alt="" className="" id="img-logo" />
          </Link>
          <h1
            id="title-web"
            className="fw-bold fst-italic mt-2 fs-3 p-1"
            style={{ marginLeft: "10px" }}
          >
            P E R W A T T - ADMIN
          </h1>
        </>
      ) : matchPerMall ? (
        <>
          <Link to={"/"}>
            <img
              src="/images/IconShopMall.png"
              alt=""
              className="rounded-circle"
              id="img-logo"
            />
          </Link>
          <h1
            id="title-web"
            className="fw-bold fst-italic mt-2 p-1"
            style={{ marginLeft: "10px" }}
          >
            P E R M A L L
          </h1>
        </>
      ) : (
        <>
          <Link to={"/"}>
            <img src="/images/logoWeb.png" alt="" className="" id="img-logo" />
          </Link>
          <h1
            id="title-web"
            className="fw-bold fst-italic mt-2 p-1"
            style={{ marginLeft: "10px" }}
          >
            P E R W A T T
          </h1>
        </>
      )}
    </>
  );
};

export default LeftHeader;
