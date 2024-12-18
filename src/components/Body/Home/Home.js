import React, { useCallback, useEffect, useState } from "react";
import Header from "../../Header/Header";
import "./HomeStyle.css";
import About from "./About/About";
import ProductItem from "./Product/ProductAll/ProductItem";
import Footer from "../../Footer/Footer";
import BannerMiddle from "./Banner/BannerMiddle";
import ProductItemPerMall from "./Product/ProductPerMall/ProductItemPerMall";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { Link } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import axios from "../../../Localhost/Custumize-axios";
import dayjs from "dayjs";
import ListFlashSale from "../../../RouteAdmin/Admin/ListFlashSale";

const Home = () => {
  const [searchProduct, setSearchProduct] = useState(() => {
    const savedSearch = localStorage.getItem("textSearchHome");
    return savedSearch ? savedSearch : "";
  });
  const [resetSearch, setResetSearch] = useState(false);
  const [joinCate, setJoinCate] = useState(() => {
    const savedIdCate = localStorage.getItem("idCateSearchHome");
    return savedIdCate ? savedIdCate : "";
  });
  const [valueMT, setValueMT] = useState(15); // value của magrin top
  const [voucher, setVoucher] = useState(null);

  //State kiểm tra hiển thị bannerMid
  const [checkShowBannerMid, setCheckShowBannerMid] = useState([]);

  // Hàm để xác định số lượng mục hiển thị dựa trên kích thước màn hình
  const updateItemsPerPage = () => {
    const width = window.innerWidth;
    // console.log(width);

    if (width >= 1900) {
      setValueMT(15);
    } else if (width >= 1800) {
      setValueMT(16);
    } else if (width >= 1700) {
      setValueMT(17);
    } else if (width >= 1500) {
      setValueMT(18);
    } else if (width >= 1400) {
      setValueMT(19);
    } else if (width >= 1300) {
      setValueMT(20);
    } else if (width >= 1200) {
      setValueMT(21);
    } else if (width >= 1100) {
      setValueMT(22);
    } else if (width >= 1000) {
      setValueMT(22);
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

  //Truyền id xuống About
  const handleIdCate = (idCate) => {
    setJoinCate(idCate);
    setSearchProduct("");
    setResetSearch(true); // Đặt lại thanh tìm kiếm
    //Lưu vào localStorage
    localStorage.setItem("idCateSearchHome", idCate);
    //Xóa localSession textSearchHome
    localStorage.removeItem("textSearchHome");
  };

  //Truyền dữ liệu xuống Header
  const handleSearch = useCallback((context) => {
    setSearchProduct(context);
    setTimeout(() => {
      //Lưu vào localStorage
      localStorage.setItem("textSearchHome", context);
    }, 500);
    //Xóa localSession idCateSearchHome
    localStorage.removeItem("idCateSearchHome");
    setJoinCate("");
    setResetSearch(false); // Giữ lại nội dung tìm kiếm
  }, []);

  //Khi chọn hiển thị tất cả sản phẩm
  const handleReloadProduct = () => {
    setSearchProduct("");
    setJoinCate("");
    setResetSearch(true); // Đặt lại thanh tìm kiếm
    //Xóa localSession textSearchHome
    localStorage.removeItem("textSearchHome");
    //Xóa localSession idCateSearchHome
    localStorage.removeItem("idCateSearchHome");
  };

  //Hàm load api check bannerMid
  useEffect(() => {
    const loadBannerMid = async () => {
      const today = dayjs().format("YYYY-MM-DD");
      try {
        const res = await axios.get(`/banners/checkShowBannerMid`);

        // Lọc danh sách banner không có enddate bằng ngày hiện tại
        const filteredBanners = res.data.filter((banner) => {
          // Giả sử `enddate` là chuỗi ngày ở định dạng "YYYY-MM-DD"
          return banner.enddate !== today;
        });

        setCheckShowBannerMid(filteredBanners);
      } catch (error) {
        console.log(error);
      }
    };

    loadBannerMid();
  }, []);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await axios.get("/vouchersAdminInPgaeHome");
        const currentDate = new Date();
        const activeVoucher = res.data.find((v) => {
          const startDay = new Date(v.startday);
          const endDay = new Date(v.endday);
          return currentDate >= startDay && currentDate <= endDay;
        });
        setVoucher(activeVoucher);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };

    fetchVouchers();
  }, []);

  return (
    <>
      <Header contextSearch={handleSearch} resetSearch={resetSearch}></Header>
      <div>
        <About idCategory={handleIdCate} />
      </div>
      <label htmlFor="">&nbsp; </label>
      {checkShowBannerMid.length !== 0 ? (
        <div className="container-fluid" style={{ marginTop: valueMT + "%" }}>
          <h2 id="banner-title">Sự kiện shop</h2>
          <BannerMiddle />
        </div>
      ) : (
        <div style={{ marginTop: "10%" }}></div>
      )}
      <Container className="" maxWidth="xl">
        <Box
          className="border mt-4 rounded-3"
          sx={{
            backgroundColor: "background.default",
          }}
        >
          <Box
            className="rounded-3"
            sx={{
              backgroundColor: "backgroundElement.children",
            }}
          >
            <div className="d-flex justify-content-center p-2 border-bottom">
              <Link to={"/product/PerMall"} className="d-flex">
                <img
                  src="/images/IconShopMall.png"
                  alt=""
                  id="logo-iconPerMall"
                />
                <Typography
                  variant="h4"
                  className="text-center fst-italic mx-3"
                  sx={{ color: "text.default" }}
                >
                  PERWATT MALL
                </Typography>
              </Link>
            </div>
            <div className="row p-2">
              <div className="col-lg-6 col-md-6 col-sm-6">
                <Typography variant="label" htmlFor="">
                  <VerifiedUserIcon color="success" /> Uy tín
                </Typography>
                <Typography variant="label" htmlFor="" className="mx-3 me-3">
                  <LocalMallIcon color="success" /> Chính hãng
                </Typography>
                <Typography variant="label" htmlFor="" className="">
                  <DoneAllIcon color="success" /> Chất lượng luôn được đề cao
                </Typography>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-6">
                <div className="d-flex justify-content-end">
                  <Link to={"/product/PerMall"}>Xem tất cả sản phẩm</Link>
                </div>
              </div>
            </div>
          </Box>
          <Box className="row mb-3 mt-3">
            <ProductItemPerMall />
          </Box>
        </Box>

        {voucher ? (
          <>
            <h4 className="text-center fw-bold mt-4">
              Chương trình khuyến mãi: {voucher.vouchername}
            </h4>
            <div className="row d-flex justify-content-center">
              <ListFlashSale />
            </div>
          </>
        ) : (
          <h4 className="text-center fw-bold mt-4"></h4>
        )}

        <h4 className="text-center fw-bold mt-4">Sản phẩm dành cho bạn</h4>
        <div className="row d-flex justify-content-center">
          <ProductItem
            item={searchProduct}
            idCate={joinCate}
            handleReset={handleReloadProduct}
          />
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default Home;
