import React, { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import "./isMarketStyle.css";
import ListProduct from "./Product/List/ListProduct";
import FormProduct from "./Product/Form/FormProduct";
import axios from "../../../../Localhost/Custumize-axios";
import EditProduct from "./Product/Form/EditProduct";
import SellerDashboard from "./StatisticalOrders/SellerDashboard";
import ProfileShop from "./ProfileShop/ProfileShop";
import OrderSeller from "./Order/OrderSeller";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Header from "../../../Header/Header";
import FormAddVoucher from "./Voucher/FromAddVoucher";
import FillVoucher from "./Voucher/FillVoucher";
import EditVoucher from "./Voucher/UpdateVoucher";
import OrderDetailSeller from "./OrderDetail/OrderDetailSeller";
import PromotionalCard from "./StatisticalOrders/PromotionalCard";
import Widget from "./StatisticalOrders/Widget";
import { Alert, AlertTitle } from "@mui/material";
import ViewListSharpIcon from "@mui/icons-material/ViewListSharp";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import ManageHistoryOutlinedIcon from "@mui/icons-material/ManageHistoryOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ShopOutlinedIcon from "@mui/icons-material/ShopOutlined";
import dayjs from "dayjs";

const IsMarket = () => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const [infoStore, setInfoStore] = useState(null);
  const [checkBan, setCheckBan] = useState(0);

  const checkban = async (idStore) => {
    try {
      const res = await axios.get(`check/ban/shop/${idStore}`);
      setCheckBan(res.data);
      // console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const searchIdStoreByIdUser = async () => {
      try {
        const res = await axios.get(`/searchStore/${user.id}`);
        sessionStorage.setItem("idStore", res.data.id);
        setInfoStore(res.data);
        // console.log(res.data);
      } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Error fetching store data:", error);
      }
    };

    // Gọi hàm fetchData khi id thay đổi
    if (user.id) {
      searchIdStoreByIdUser();
    }
  }, [user.id]);

  useEffect(() => {
    if (infoStore) {
      checkban(infoStore.id);
    }
  }, [infoStore]);

  //Hàm xử lý tính toán ngày
  const calculateDifference = (startDay, endDay) => {
    const start = dayjs(startDay);
    const end = dayjs(endDay);

    // Tính số năm
    const years = end.diff(start, "year");
    if (years >= 1) {
      return `${years} năm`;
    }

    // Tính số tháng
    const months = end.diff(start, "month");
    if (months >= 1) {
      return `${months} tháng`;
    }

    // Tính số ngày
    const days = end.diff(start, "day");
    return `${days} ngày`;
  };

  return (
    <>
      <Header />
      <div className="row container-fluid ">
        <div className="col-lg-3 p-0 m-0 ">
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography>
                <i className="bi bi-box fs-4"></i>
                <span className="mx-3">Quản lý sản phẩm</span>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <ul
                  style={{ listStyleType: "none", textDecoration: "none" }}
                  className="p-0 m-0"
                >
                  <li className="">
                    <Link
                      style={{ textDecoration: "none" }}
                      to="/profileMarket/listStoreProduct"
                    >
                      <Typography sx={{ color: "text.default" }}>
                        <ViewListSharpIcon /> Danh sách sản phẩm
                      </Typography>
                    </Link>
                  </li>
                  <hr />
                  <li>
                    <Link
                      style={{ textDecoration: "none" }}
                      to="/profileMarket/FormStoreProduct"
                    >
                      <Typography sx={{ color: "text.default" }}>
                        <AddCircleOutlineRoundedIcon /> Thêm sản phẩm
                      </Typography>
                    </Link>
                  </li>
                </ul>
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography>
                <i className="bi bi-clipboard fs-4"></i>
                <span className="mx-3">Quản lý đơn hàng</span>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <ul
                  style={{ listStyleType: "none", textDecoration: "none" }}
                  className="p-0 m-0"
                >
                  <li>
                    <Link
                      style={{ textDecoration: "none" }}
                      to={`/profileMarket/orderSeller/${user.id}`}
                    >
                      <Typography sx={{ color: "text.default" }}>
                        <ReceiptLongOutlinedIcon /> Đơn hàng
                      </Typography>
                    </Link>
                  </li>
                </ul>
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography>
                <i className="bi bi-wallet2 fs-4"></i>
                <span className="mx-3">Tài chính</span>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <ul
                  style={{ listStyleType: "none", textDecoration: "none" }}
                  className="p-0 m-0"
                >
                  <li>
                    <Link
                      style={{ textDecoration: "none" }}
                      to="/profileMarket"
                    >
                      <Typography sx={{ color: "text.default" }}>
                        <PaymentsOutlinedIcon /> Doanh thu
                      </Typography>
                    </Link>
                  </li>
                </ul>
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography>
                <i className="bi bi-shop-window fs-4"></i>
                <span className="mx-3">Quản lý shop</span>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <ul
                  style={{ listStyleType: "none", textDecoration: "none" }}
                  className="p-0 m-0"
                >
                  <li>
                    <Link
                      style={{ textDecoration: "none" }}
                      to="/profileMarket/profileShop"
                    >
                      <Typography sx={{ color: "text.default" }}>
                        <StoreOutlinedIcon /> Hồ sơ shop
                      </Typography>
                    </Link>
                  </li>
                </ul>
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography>
                <i class="bi bi-tag fs-4"></i>
                <span className="mx-3">Chương trình khuyến mãi</span>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <ul
                  style={{ listStyleType: "none", textDecoration: "none" }}
                  className="p-0 m-0"
                >
                  <li>
                    <Link
                      style={{ textDecoration: "none" }}
                      to="/profileMarket/addVoucher"
                    >
                      <Typography sx={{ color: "text.default" }}>
                        <AddCircleOutlineRoundedIcon />
                        Thêm khuyến mãi
                      </Typography>
                    </Link>
                  </li>
                  <hr />
                  <li>
                    <Link
                      style={{ textDecoration: "none" }}
                      to="/profileMarket/fillVoucher"
                    >
                      <Typography sx={{ color: "text.default" }}>
                        {" "}
                        <ManageHistoryOutlinedIcon /> Quản lý khuyến mãi
                      </Typography>
                    </Link>
                  </li>
                  <hr />
                  <li>
                    <Link
                      style={{ textDecoration: "none" }}
                      to="/profileMarket/voucher/webite"
                    >
                      <Typography sx={{ color: "text.default" }}>
                        {" "}
                        <ShopOutlinedIcon /> Chương trình PerWatt
                      </Typography>
                    </Link>
                  </li>
                </ul>
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
        <div className="col-lg-9">
          {infoStore?.block && (
            <div className="mt-3 mb-3">
              <Alert severity="error">
                <AlertTitle>Cảnh báo cửa hàng</AlertTitle>
                <div className="w-100">{infoStore.reason}</div>
                <div className="d-flex justify-content-between">
                  <div className="">
                    Thời gian:{" "}
                    {infoStore.startday
                      ? dayjs(infoStore.startday).format("DD/MM/YYYY")
                      : "Vĩnh viễn"}
                    &nbsp;-&nbsp;
                    {infoStore.endday
                      ? dayjs(infoStore.endday).format("DD/MM/YYYY")
                      : "Vĩnh viễn"}
                  </div>
                  <div className="mx-3">
                    Hiệu lực(
                    {infoStore.endday && infoStore.startday
                      ? calculateDifference(
                          infoStore.startday,
                          infoStore.endday
                        )
                      : "Không giới hạn"}
                    )
                  </div>
                </div>
              </Alert>
            </div>
          )}
          {checkBan > 0 && (
            <div className="mt-3 mb-3">
              <Alert severity="error">
                <AlertTitle>Cảnh báo sản phẩm</AlertTitle>
                Quản trị website thấy rằng sản phẩm cửa hàng của bạn vi phạm
                điều khoản và dịch vụ của website vui lòng kiểm tra và thay đổi
                lại sản phẩm của cửa hàng.
              </Alert>
            </div>
          )}

          <Routes>
            <Route path="/" element={<SellerDashboard />} />
            <Route path="/listStoreProduct" element={<ListProduct />} />
            <Route path="/FormStoreProduct" element={<FormProduct />} />
            <Route path="updateProduct/:slug" element={<EditProduct />} />
            <Route path="/profileShop" element={<ProfileShop />} />
            <Route path="/addVoucher" element={<FormAddVoucher />} />
            <Route path="/fillVoucher" element={<FillVoucher />} />
            <Route path="editVoucher/:slug" element={<EditVoucher />} />​
            <Route
              path="/orderDetailSeller/:id"
              element={<OrderDetailSeller />}
            />
            <Route
              path="/orderSeller/:id"
              element={<OrderSeller></OrderSeller>}
            />
            <Route path="/voucher/webite" element={<PromotionalCard />} />
            <Route path="/Widget/:id" element={<Widget />} />
            {/* <Route path="/" element={<ChooseProduct />} /> */}
          </Routes>
        </div>
      </div>
    </>
  );
};

export default IsMarket;
