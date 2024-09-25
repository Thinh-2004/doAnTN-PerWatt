import React, { useEffect } from "react";
import HeaderMarket from "../../../UI&UX/Header/HeaderMarket";
import { Link, Route, Routes } from "react-router-dom";
import "./isMarketStyle.css";
import ListProduct from "./Product/List/ListProduct";
import FormProduct from "./Product/Form/FormProduct";
import useSession from "../../../../Session/useSession";
import axios from "../../../../Localhost/Custumize-axios";
import EditProduct from "./Product/Form/EditProduct";
import MainUserSeller from "./StatisticalOrders/MainUserSeller";
import ProfileShop from "./ProfileShop/ProfileShop";
import OrderSeller from "./Order/OrderSeller";
import OrderDetailBuyer from "./OrderDetail/OrderDetailBuyer";
import NotificationCard from "../../../Notification&Message&Comment/Notification/SellerNotification";

const IsMarket = () => {
  const [id] = useSession("id");
  useEffect(() => {
    const searchIdStoreByIdUser = async () => {
      try {
        const res = await axios.get(`/searchStore/${id}`);
        sessionStorage.setItem("idStore", res.data.id);
      } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Error fetching store data:", error);
      }
    };

    // Gọi hàm fetchData khi id thay đổi
    if (id) {
      searchIdStoreByIdUser();
    }
  }, [id]);
  return (
    <>
      <HeaderMarket />
      <div className="row container-fluid ">
        <div className="col-lg-3 p-0 m-0">
          <div
            className="accordion  overflow-y-scroll"
            style={{ height: "590px" }}
            id="accordionPanelsStayOpenExample"
          >
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseOne"
                  aria-expanded="true"
                  aria-controls="panelsStayOpen-collapseOne"
                >
                  <i className="bi bi-box fs-4"></i>
                  <span className="mx-3">Quản lý sản phẩm</span>
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseOne"
                className="accordion-collapse collapse show"
              >
                <div className="accordion-body">
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
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseTwo"
                  aria-expanded="false"
                  aria-controls="panelsStayOpen-collapseTwo"
                >
                  <i className="bi bi-clipboard fs-4"></i>
                  <span className="mx-3">Quản lý đơn hàng</span>
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseTwo"
                className="accordion-collapse collapse"
              >
                <div className="accordion-body">
                  <ul
                    style={{ listStyleType: "none", textDecoration: "none" }}
                    className="p-0 m-0"
                  >
                    <li>
                      <Link
                        style={{ textDecoration: "none" }}
                        to={`/profileMarket/orderSeller/${id}`}
                      >
                        Tất cả
                      </Link>
                    </li>
                    <li>
                      <Link
                        style={{ textDecoration: "none" }}
                        to="/cancelledOrders"
                      >
                        Đơn hủy
                      </Link>
                    </li>
                    <li>
                      <Link
                        style={{ textDecoration: "none" }}
                        to="/deliveredOrders"
                      >
                        Đã giao
                      </Link>
                    </li>
                    <li>
                      <Link
                        style={{ textDecoration: "none" }}
                        to="/pendingOrders"
                      >
                        Chờ xác nhận
                      </Link>
                    </li>
                    <li>
                      <Link
                        style={{ textDecoration: "none" }}
                        to="/readyForPickup"
                      >
                        Chờ lấy hàng
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseThree"
                  aria-expanded="false"
                  aria-controls="panelsStayOpen-collapseThree"
                >
                  <i className="bi bi-wallet2 fs-4"></i>
                  <span className="mx-3">Tài chính</span>
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseThree"
                className="accordion-collapse collapse"
              >
                <div className="accordion-body">
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
                      <Link style={{ textDecoration: "none" }} to="/myAccount">
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
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseFour"
                  aria-expanded="false"
                  aria-controls="panelsStayOpen-collapseFour"
                >
                  <i className="bi bi-shop-window fs-4"></i>
                  <span className="mx-3">Quản lý shop</span>
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseFour"
                className="accordion-collapse collapse"
              >
                <div className="accordion-body">
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
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseFive"
                  aria-expanded="false"
                  aria-controls="panelsStayOpen-collapseFive"
                >
                  <i class="bi bi-tag fs-4"></i>
                  <span className="mx-3">Khuyến mãi của shop</span>
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseFive"
                className="accordion-collapse collapse"
              >
                <div className="accordion-body">
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
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-9">
          <Routes>
            <Route path="/" element={<MainUserSeller />} />
            <Route path="/listStoreProduct" element={<ListProduct />} />
            <Route path="/FormStoreProduct" element={<FormProduct />} />
            <Route path="updateProduct/:id" element={<EditProduct />} />
            <Route path="/profileShop" element={<ProfileShop />} />
            <Route
              path="orderDetailSeller/:id"
              element={<OrderDetailBuyer />}
            />
            <Route
              path="/orderSeller/:id"
              element={<OrderSeller></OrderSeller>}
            ></Route>
          </Routes>
        </div>
      </div>
    </>
  );
};

export default IsMarket;
