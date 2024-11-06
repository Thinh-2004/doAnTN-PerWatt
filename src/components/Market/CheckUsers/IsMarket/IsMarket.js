import React, { useEffect } from "react";
import HeaderMarket from "../../../Header/HeaderMarket";
import { Link, Route, Routes } from "react-router-dom";
import "./isMarketStyle.css";
import ListProduct from "./Product/List/ListProduct";
import FormProduct from "./Product/Form/FormProduct";
import axios from "../../../../Localhost/Custumize-axios";
import EditProduct from "./Product/Form/EditProduct";
import MainUserSeller from "./StatisticalOrders/MainUserSeller";
import ProfileShop from "./ProfileShop/ProfileShop";
import OrderSeller from "./Order/OrderSeller";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OrderDetailSeller from "./OrderDetail/OrderDetailSeller";
import Wallet from "../../../Wallet/Wallet";

const IsMarket = () => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  useEffect(() => {
    const searchIdStoreByIdUser = async () => {
      try {
        const res = await axios.get(`/searchStore/${user.id}`);
        sessionStorage.setItem("idStore", res.data.id);
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
  return (
    <>
      <HeaderMarket />
      <div className="row container-fluid ">
        <div
          className="col-lg-3 p-0 m-0 overflow-y-scroll"
          style={{ height: "800px" }}
        >
          <div className="">
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
                    <li>
                      <Link
                        style={{ textDecoration: "none" }}
                        to="/profileMarket/listStoreProduct"
                      >
                        Danh sách sản phẩm
                      </Link>
                    </li>
                    <li>
                      <Link
                        style={{ textDecoration: "none" }}
                        to="/profileMarket/FormStoreProduct"
                      >
                        Thêm sản phẩm
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
                        Tất cả
                      </Link>
                    </li>
                    <li>
                      <Link
                        style={{ textDecoration: "none" }}
                        to="/cancelledOrders"
                      >
                        Đang chờ duyệt
                      </Link>
                    </li>

                    <li>
                      <Link
                        style={{ textDecoration: "none" }}
                        to="/deliveredOrders"
                      >
                        Chờ giao hàng
                      </Link>
                    </li>
                    <li>
                      <Link
                        style={{ textDecoration: "none" }}
                        to="/pendingOrders"
                      >
                        Hoàn thành
                      </Link>
                    </li>
                    <li>
                      <Link
                        style={{ textDecoration: "none" }}
                        to="/readyForPickup"
                      >
                        Huỷ
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
                      <Link style={{ textDecoration: "none" }} to="/revenue">
                        Doanh thu
                      </Link>
                    </li>
                    <li>
                      <Link style={{ textDecoration: "none" }} to="/profileMarket/wallet/seller">
                        Số dư TK của tôi
                      </Link>
                    </li>
                    <li>
                      <Link
                        style={{ textDecoration: "none" }}
                        to="/bankAccounts"
                      >
                        Tài khoản ngân hàng
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
                        Hồ sơ shop
                      </Link>
                    </li>
                    <li>
                      <Link style={{ textDecoration: "none" }} to="/shopDecor">
                        Trang trí shop
                      </Link>
                    </li>
                    <li>
                      <Link
                        style={{ textDecoration: "none" }}
                        to="/shopSettings"
                      >
                        Thiết lập shop
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
                  <span className="mx-3">Khuyến mãi của shop</span>
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
                        to="/shopProfile"
                      >
                        Quản lý khuyến mãi
                      </Link>
                    </li>
                  </ul>
                </Typography>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
        <div className="col-lg-9">
          <Routes>
            <Route path="/" element={<MainUserSeller />} />
            <Route path="/listStoreProduct" element={<ListProduct />} />
            <Route path="/FormStoreProduct" element={<FormProduct />} />
            <Route path="updateProduct/:slug" element={<EditProduct />} />
            <Route path="/profileShop" element={<ProfileShop />} />
            <Route
              path="/orderDetailSeller/:id"
              element={<OrderDetailSeller />}
            />
            <Route
              path="/orderSeller/:id"
              element={<OrderSeller></OrderSeller>}
            />
            <Route
              path="/wallet/:status"
              element={<Wallet/>}
            />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default IsMarket;
