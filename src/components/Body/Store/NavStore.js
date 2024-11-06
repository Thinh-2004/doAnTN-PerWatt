import React, { useCallback, useContext, useEffect, useState } from "react";
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
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ThemeModeContext } from "../../ThemeMode/ThemeModeProvider";

const Store = () => {
  const getIdBySlugStore = useParams();
  const [fill, setFill] = useState([]);
  const [search, setSearch] = useState("");
  const [fillCateInStore, setFillCateInStore] = useState([]);
  const [idCateProduct, setIdCateProduct] = useState(0);
  const [checkResetInputSearch, setCheckResetInputSearch] = useState(false);
  // const idStore = localStorage.getItem("idStore");
  const [valueMT, setValueMT] = useState(5); // value của magrin top
  const { mode } = useContext(ThemeModeContext);
  const [totalItems, setTotalItems] = useState(0); //Tổng số lượng sản phẩm

  // Hàm để xác định số lượng mục hiển thị dựa trên kích thước màn hình
  const updateItemsPerPage = () => {
    const width = window.innerWidth;
    // console.log(width);

    if (width >= 1900) {
      setValueMT(5);
    } else if (width >= 1800) {
      setValueMT(6);
    } else if (width >= 1700) {
      setValueMT(7);
    } else if (width >= 1500) {
      setValueMT(8);
    } else if (width >= 1400) {
      setValueMT(9);
    } else if (width >= 1300) {
      setValueMT(10);
    } else if (width >= 1200) {
      setValueMT(11);
    } else if (width >= 1100) {
      setValueMT(12);
    } else if (width >= 1000) {
      setValueMT(12);
    } else if (width >= 900) {
      setValueMT(12);
    } else {
      setValueMT(22);
    }
  };

  useEffect(() => {
    // Gọi hàm để xác định số lượng mục hiển thị ngay khi component mount
    updateItemsPerPage();

    // Lắng nghe sự thay đổi kích thước cửa sổ
    window.addEventListener("resize", updateItemsPerPage);

    // Cleanup listener khi component unmount
    return () => {
      window.removeEventListener("resize", updateItemsPerPage);
    };
  }, []);

  const geturlBgStore = (storeId, filename) => {
    return `${axios.defaults.baseURL}files/store/${storeId}/${filename}`;
  };
  const geturlAvtUser = (idUser, filename) => {
    return `${axios.defaults.baseURL}files/user/${idUser}/${filename}`;
  };

  const loadData = async () => {
    try {
      //Lấy data store by slug param
      const storeRes = await axios.get(
        `/productStore/${getIdBySlugStore.slugStore}`
      );

      setTotalItems(storeRes.data.totalItems);
      //Lấy infoStore by storeRes
      const res = await axios.get(
        `store/${storeRes.data.products[0].product.store.id}`
      );
      setFill(res.data);

      //Kiểm tra infoStore trước khi call API
      if (res.data && res.data.id) {
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
    loadData();
  }, [getIdBySlugStore]);

  useEffect(() => {
    if (checkResetInputSearch) {
      setSearch("");
      setIdCateProduct(0);
    }
  }, [checkResetInputSearch]);

  const handleTextSearch = useCallback((e) => {
    setSearch(e.target.value);
    setIdCateProduct(0);
  }, []);

  const handleClickIdCateProduct = (idCateProduct) => {
    setCheckResetInputSearch(false);
    setIdCateProduct(idCateProduct);
    setSearch("");
    // console.log(idCateProduct);
  };

  const calculateAccountDuration = (accountCreatedDate) => {
    //Khởi tạo ngày từ CSDL và ngày hiện tại
    const createdDate = new Date(accountCreatedDate);
    const now = new Date();

    const diffInMilliseconds = now - createdDate; //Tính khoảng cách (Tính bằng mili)
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24)); //Chuyển đổi kết quả mili giây thành ngày

    if (diffInDays <= 7) {
      //Nhỏ hơn 7 ngày
      return "Mới tham gia";
    }

    //Tính tổng số tháng
    const diffInMonths =
      (now.getFullYear() - createdDate.getFullYear()) * 12 +
      (now.getMonth() - createdDate.getMonth());

    if (diffInMonths >= 12) {
      //Kết quả lớn hơn 12 tháng
      const years = Math.floor(diffInMonths / 12);
      return years + (years === 1 ? " năm" : " năm");
    } else if (diffInMonths > 0) {
      //Kết quả số tháng lớn hơn 0 nhưng nhỏ hơn 12
      return diffInMonths + (diffInMonths === 1 ? " tháng" : " tháng");
    } else {
      //Ngược lại lấy số ngày
      return diffInDays + " ngày";
    }
  };

  return (
    <>
      <Header></Header>
      <div
        className={`mt-2 container-fluid ${
          mode === "light" ? "bg-white" : ""
        }`}
      >
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
                <label className=" d-flex align-items-end mx-4 fs-6 fw-bold">
                  {fill.namestore} &nbsp;&nbsp;
                  {fill?.taxcode && (
                    <img
                      src="/images/IconShopMall.png"
                      alt=""
                      className="rounded-circle"
                      id="logo-PerMall"
                    />
                  )}
                </label>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-4 align-content-end">
              <div className="d-flex p-2">
                <button className="btn" id="btn-follow">
                  <i className="bi bi-plus-lg"></i> <span htmlFor="">Theo dõi</span>
                </button>
                <button className="btn mx-2" id="btn-chatMess">
                  <i className="bi bi-chat"></i> Nhắn tin
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="container border rounded-3"
          style={{ marginTop: valueMT + "%" }}
        >
          <div className="row d-flex justify-content-between p-3">
            <div className="col-lg-2 col-md-2 col-sm-2">
              {" "}
              <span className="">
                <i className="bi bi-box-seam-fill"></i> Sản phẩm:{" "}
                <label htmlFor="">{totalItems}</label>{" "}
              </span>
            </div>
            <div className="col-lg-2 col-md-2 col-sm-2">
              {" "}
              <span>
                <i className="bi bi-star-fill text-warning"></i> Đánh giá:{" "}
                <label htmlFor="">900</label>{" "}
              </span>
            </div>
            <div className="col-lg-2 col-md-2 col-sm-2">
              <span>
                <i className="bi bi-node-plus"></i> Tham gia:
                <label htmlFor="">
                  &nbsp;{calculateAccountDuration(fill.createdtime)}
                </label>{" "}
              </span>
            </div>
            <div className="col-lg-2 col-md-2 col-sm-2">
              {" "}
              <span>
                <i className="bi bi-person-plus-fill"></i> Đang theo dõi:{" "}
                <label htmlFor="">900</label>{" "}
              </span>
            </div>
            <div className="col-lg-2 col-md-2 col-sm-2">
              {" "}
              <span>
                <i className="bi bi-person-lines-fill"></i> Người theo dõi:{" "}
                <label htmlFor="">900</label>{" "}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-5">
        <div className="row">
          <Box
            className="col-lg-3 col-md-3 col-sm-3 border-end  rounded-3"
            sx={{ height: "90%", bgcolor: "backgroundElement.children" }}
          >
            <form className="d-flex justify-content-center mt-3" role="search">
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
            <div className="border-bottom ">
              <h4 className="mt-3">Danh mục cửa hàng</h4>
              <div className="overflow-auto" style={{ height: "450px" }}>
                <Box
                  sx={{
                    width: "100%",
                  }}
                >
                  <Stack spacing={1}>
                    {fillCateInStore.map((fill, index) => (
                      <Button
                        key={fill.id}
                        value={fill.id}
                        onClick={() => handleClickIdCateProduct(fill.id)}
                        className="inherit-text"
                        sx={{
                          textDecoration: "inherit",
                          color: "inherit",
                          justifyContent: "flex-start", // Đảm bảo căn lề trái cho nội dung của Button
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
                <CardContent
                  className={`mt-2 ${mode === "light" ? "border" : "border"}`}
                >
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
                <CardContent
                  className={`mt-2 ${mode === "light" ? "border" : "border"}`}
                >
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
                <CardContent
                  className={`mt-2 ${mode === "light" ? "border" : "border"}`}
                >
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
          </Box>
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
