import React, { useEffect, useState } from "react";
import Header from "../../Header/Header";
import "./StoreStyle.css";
import { useParams } from "react-router-dom";
import axios from "../../../Localhost/Custumize-axios";
import ProductStore from "./ProductStore";
import Footer from "../../Footer/Footer";
import { Box, Button, CardContent, Stack, Typography } from "@mui/material";

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
  const handleTextSearch = (e) => {
    setSearch(e.target.value);
  };
  return (
    <>
      <Header></Header>
      <div className="bg-white mt-2">
        <div class="position-relative">
          <img
            src={geturlBgStore(fill.id, fill.imgbackgound)}
            alt=""
            id="background-img-filter"
          />
          <div class="container position-absolute top-50 start-50 translate-middle">
            <img
              src={geturlBgStore(fill.id, fill.imgbackgound)}
              alt=""
              className="rounded-4"
              id="background-img"
            />
          </div>
        </div>
        <div className="container position-absolute start-50 translate-middle mt-3">
          <div className="row">
            <div className="col-lg-8 col-md-8 col-sm-8">
              <div className=" d-flex justify-content-start m-3">
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
            </div>
            <div className="col-lg-4 col-md-4 col-sm-4 align-content-end">
              <div className="d-flex p-2">
                <button className="btn" id="btn-follow">
                  <i class="bi bi-plus-lg"></i> <span htmlFor="">Theo dõi</span>
                </button>
                <button className="btn mx-2" id="btn-chatMess">
                  <i class="bi bi-chat"></i> Nhắn tin
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="container border rounded-3" style={{ marginTop: "5%" }}>
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
      <div className="container-fluid mt-5">
        <div className="row">
          <div className="col-lg-3 col-md-3 col-sm-3 border-end">
            <form className="d-flex justify-content-center" role="search">
              <input
                className="form-control rounded-3 bg-body-secondary"
                type="search"
                placeholder="Bạn cần tìm gì"
                aria-label="Search"
                style={{ width: "400px", border: "1px solid" }}
                value={search}
                onChange={handleTextSearch}
              />
            </form>
            <div className="border-bottom">
              <h4 className="mt-3">Danh mục cửa hàng</h4>
              <Box sx={{ width: "100%" }}>
                <Stack spacing={2}>
                  <Button>Item 1</Button>
                  <Button>Item 2</Button>
                  <Button>Item 3</Button>
                  <Button>Item 6</Button>
                  <Button>Item 5</Button>
                </Stack>
              </Box>
            </div>
            <div className="border-bottom ">
              <h4 className="mt-3">Mã khuyến mãi</h4>
              <div className="overflow-auto" style={{ height: "330px" }}>
                <CardContent className="bg-white mt-2">
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    Giảm 20%
                  </Typography>
                  <Typography variant="h5" component="div">
                    Đơn tối thiểu 200k
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Hạn sử dụng : 27/08/2024
                  </Typography>
                  <div className="d-flex justify-content-end">
                    <button className="btn btn-danger">Nhận mã</button>
                  </div>
                </CardContent>
                <CardContent className="bg-white mt-2">
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    Giảm 20%
                  </Typography>
                  <Typography variant="h5" component="div">
                    Đơn tối thiểu 200k
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Hạn sử dụng : 27/08/2024
                  </Typography>
                  <div className="d-flex justify-content-end">
                    <button className="btn btn-danger">Nhận mã</button>
                  </div>
                </CardContent>
                <CardContent className="bg-white mt-2">
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    Giảm 20%
                  </Typography>
                  <Typography variant="h5" component="div">
                    Đơn tối thiểu 200k
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Hạn sử dụng : 27/08/2024
                  </Typography>
                  <div className="d-flex justify-content-end">
                    <button className="btn btn-danger">Nhận mã</button>
                  </div>
                </CardContent>
              </div>
            </div>
          </div>
          <div className="col-lg-9 col-md-9 col-sm-9">
            <div className="mt-4">
              <ProductStore item={search}></ProductStore>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Store;
