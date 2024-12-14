import React, { useEffect } from "react";
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
                      Đơn hàng
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
                      Doanh thu
                    </Link>
                  </li>
                  <li>
                    <Link
                      style={{ textDecoration: "none" }}
                      to="/profileMarket/wallet/seller"
                    >
                      Số dư TK của tôi
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
                      Thêm khuyến mãi
                    </Link>
                  </li>
                  <li>
                    <Link
                      style={{ textDecoration: "none" }}
                      to="/profileMarket/fillVoucher"
                    >
                      Quản lý khuyến mãi
                    </Link>
                  </li>
                  <li>
                    <Link
                      style={{ textDecoration: "none" }}
                      to="/profileMarket/voucher/webite"
                    >
                      Chương trình PerWatt
                    </Link>
                  </li>
                </ul>
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
        <div className="col-lg-9">
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
