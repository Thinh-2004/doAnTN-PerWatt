import React, { useEffect, useState } from "react";
import Header from "../../Header/Header";
import "./StoreStyle.css";
import { useParams } from "react-router-dom";
import axios from "../../../Localhost/Custumize-axios";
import ProductStore from "./ProductStore";
import  Footer  from "../../Footer/Footer";

const Store = () => {
  const { idStore } = useParams();
  const [fill, setFill] = useState([]);
  const [search, setSearch] = useState("");
  const [countProductStore, setCountProductStore] = useState(0);
  const geturlBgStore = (storeId, filename) => {
    return `${axios.defaults.baseURL}files/store/${storeId}/${filename}`;
  };
  const geturlAvtUser = (idUser, filename) => {
    return `${axios.defaults.baseURL}files/user/${idUser}/${filename}`;
  };
  const loadData = async (idStore) => {
    try {
      const res = await axios.get(`store/${idStore}`);
      setFill(res.data);
      if (res.data && res.data.id) {
        const storeRes = await axios.get(`/productStore/${res.data.id}`);
        setCountProductStore(storeRes.data.length);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadData(idStore);
  }, [idStore]);
  const handleTextSearch = (e) =>{
    setSearch(e.target.value);
  }
  return (
    <>
      <Header></Header>
      <div className="container-fluid position-relative mt-2">
        <img
          src={geturlBgStore(fill.id, fill.imgbackgound)}
          alt=""
          className="rounded-4"
          id="backgound-img"
        />
        <div
          className="position-absolute translate-middle shadow rounded-1"
          style={{ left: "320px", top: "320px", width: "30%" }}
        >
          <div className="d-flex justify-content-start m-3">
            <img
              src={
                fill && fill.user && fill.user.avatar
                  ? geturlAvtUser(fill.user.id, fill.user.avatar)
                  : ""
              }
              alt=""
              id="logo-store"
            />
            <label className=" d-flex align-items-end mx-4 fs-6 fw-bold text-dark">
              {fill.namestore}
            </label>
          </div>
          <div className="d-flex justify-content-center p-2">
            <button className="btn btn-info  " id="btn-choose">
              <i class="bi bi-plus-lg"></i> <span htmlFor="">Theo dõi</span>
            </button>
            <button className="btn btn-light  mx-2" id="btn-choose">
              <i class="bi bi-chat"></i> Nhắn tin
            </button>
          </div>
        </div>
        <div className="offset-4 rounded-3 bg-white mt-3">
          <div className="d-flex justify-content-between p-4">
            <span>
              <i class="bi bi-box-seam-fill"></i> Sản phẩm:{" "}
              <label htmlFor="">{countProductStore}</label>{" "}
            </span>
            <span>
              <i class="bi bi-star-fill text-warning"></i> Đánh giá:{" "}
              <label htmlFor="">900</label>{" "}
            </span>
            <span>
              <i class="bi bi-node-plus"></i> Tham gia:{" "}
              <label htmlFor="">900</label>{" "}
            </span>
            <span>
              <i class="bi bi-person-plus-fill"></i> Đang theo dõi:{" "}
              <label htmlFor="">900</label>{" "}
            </span>
            <span>
              <i class="bi bi-person-lines-fill"></i> Người theo dõi:{" "}
              <label htmlFor="">900</label>{" "}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-5 container">
        <form className="d-flex" role="search">
          <input
            className="form-control rounded-4 bg-body-secondary"
            type="search"
            placeholder="Bạn cần tìm gì"
            aria-label="Search"
            style={{ width: "400px", border: "1px solid" }}
              value={search}
              onChange={handleTextSearch}
          />
        </form>
        <div className="mt-4">
          <ProductStore item={search}></ProductStore>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Store;
