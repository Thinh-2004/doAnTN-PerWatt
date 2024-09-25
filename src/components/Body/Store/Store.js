import React, { useEffect, useState } from "react";
import Header from "../../Header/Header";
import "./StoreStyle.css";
import { useParams } from "react-router-dom";
import axios from "../../../Localhost/Custumize-axios";
import ProductStore from "./ProductStore";
import Footer from "../../Footer/Footer";
import {
  Box,
  Button,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Store = () => {
  const { idStore } = useParams();
  const [fill, setFill] = useState([]);
  const [search, setSearch] = useState("");
  const [countProductStore, setCountProductStore] = useState(0);
  const [fillCateInStore, setFillCateInStore] = useState([]);
  const [idCateProduct, setIdCateProduct] = useState(0);
  const [checkResetInputSearch, setCheckResetInputSearch] = useState(false);

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
        const cateProductByStore = await axios.get(
          `CateProductInStore/${res.data.id}`
        );
        setFillCateInStore(cateProductByStore.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadData(idStore);
  }, [idStore]);

  useEffect(() => {
    if (checkResetInputSearch) {
      setSearch("");
      setIdCateProduct(0);
    }
  }, [checkResetInputSearch]);

  const handleTextSearch = (e) => {
    setSearch(e.target.value);
    setIdCateProduct(0);
  };

  const handleClickIdCateProduct = (idCateProduct) => {
    setCheckResetInputSearch(false);
    setIdCateProduct(idCateProduct);
    setSearch("");
    // console.log(idCateProduct);
  };

  return (
    <>
      <Header></Header>
      <div className="bg-white mt-2 container-fluid">
        <div className="position-relative">
          <img
            src={geturlBgStore(fill.id, fill.imgbackgound)}
            alt=""
            id="background-img-filter"
          />
          <div className="container position-absolute top-50 start-50 translate-middle">
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
              <div className=" d-flex justify-content-start">
                <img
                  src={
                    fill && fill.user && fill.user.avatar
                      ? geturlAvtUser(fill.user.id, fill.user.avatar)
                      : null
                  }
                  alt=""
                  id="logo-store"
                />
                <label className=" d-flex align-items-end mx-4 fs-6 fw-bold text-dark">
                  {fill.namestore} &nbsp;&nbsp;&nbsp;
                  {fill?.taxcode && (
                    <img
                      src="/images/IconShopMall.png"
                      alt=""
                      className="rounded-circle"
                      style={{ width: "5%", height: "30%" }}
                    />
                  )}
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
      <div className="container mt-5">
        <div className="row">
          <div
            className="col-lg-3 col-md-3 col-sm-3 border-end bg-white rounded-3"
            style={{ height: "90%" }}
          >
            <form className="d-flex justify-content-center mt-3" role="search">
              {/* <input
                className="form-control rounded-3"
                type="search"
                placeholder="Bạn cần tìm gì"
                aria-label="Search"
                style={{ width: "400px", border: "1px solid" }}
                value={search}
                onChange={handleTextSearch}
              /> */}
              <Box
                sx={{ display: "flex", alignItems: "flex-end", width: "100%" }}
              >
                <SearchIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
                <TextField
                  id="standard-search"
                  label="Bạn cần tìm gì?"
                  type="search"
                  variant="standard"
                  size="small"
                  value={search}
                  onChange={handleTextSearch}
                  fullWidth
                />
              </Box>
            </form>
            {/* <FormControl variant="standard">
              <InputLabel htmlFor="input-with-icon-adornment">
                Bạn cần tìm gì?
              </InputLabel>
              <Input
                id="input-with-icon-adornment"
                startAdornment={
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                }
                fullWidth
              />
            </FormControl> */}
            <div className="border-bottom ">
              <h4 className="mt-3">Danh mục cửa hàng</h4>
              <div className="overflow-auto" style={{ height: "450px" }}>
                <Box sx={{ width: "100%" }}>
                  <Stack spacing={1}>
                    {fillCateInStore.map((fill, index) => (
                      <Button
                        value={fill.id}
                        onClick={() => handleClickIdCateProduct(fill.id)}
                        className="inherit-text"
                        style={{
                          textDecoration: "inherit",
                          color: "inherit",
                        }}
                      >
                        {fill.name}
                      </Button>
                    ))}
                  </Stack>
                </Box>
              </div>
            </div>
            <div className="border-bottom mb-5 ">
              <h4 className="mt-3">Mã khuyến mãi</h4>
              <div className="overflow-auto" style={{ height: "400px" }}>
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
          <div className="col-lg-9 col-md-9 col-sm-9 ">
            <ProductStore
              item={search}
              idCate={idCateProduct}
              resetSearch={setCheckResetInputSearch}
            ></ProductStore>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Store;
