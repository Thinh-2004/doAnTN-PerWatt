import React, { useEffect, useState } from "react";
import "./OrderStyle.css";
<<<<<<< HEAD
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import axios from "../../../Localhost/Custumize-axios";
import { Link } from "react-router-dom";
import useSession from "../../../Session/useSession";
import { format } from "date-fns";
import { confirmAlert } from "react-confirm-alert";

const Order = () => {
  const [fill, setFill] = useState([]);
  const [idUser] = useSession("id");
  const [activeTab, setActiveTab] = useState("pills-home");
  const [isCancelButtonHidden, setIsCancelButtonHidden] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`orderFill/${idUser}`);
=======
import Header from "../../UI&UX/Header/Header";
import Footer from "../../UI&UX/Footer/Footer";
import axios from "../../../Localhost/Custumize-axios";

const Order = () => {
  const [fill, setFill] = useState([]);
  const [orderProduct, setOrderProduct] = useState([]);
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("order");
>>>>>>> a4a2c76a2188eff27aed7a2ceb5503475a5fc9ca
        setFill(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    load();
<<<<<<< HEAD
  }, [idUser]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "HH:mm:ss dd/MM/yyyy");
  };

  const handleCancelOrder = (orderId) => {
    confirmAlert({
      title : "Hủy đơn hàng",
      message : "Bạn có muốn hủy đơn không?",
      buttons : [
        {
          label : "Có",
          onClick : async () =>{
            try {
              await axios.put(`/order/${orderId}/status`, { status: "Hủy" });
              setIsCancelButtonHidden(true);
              setFill(
                fill.map((order) =>
                  order.id === orderId ? { ...order, orderstatus: "Hủy" } : order
                )
              );
            } catch (error) {
              console.log(error);
            }
          },
        },
        {
          label : "Không"
        }
      ]
    })
    
  };

  const handleMarkAsReceived = async (orderId) => {
    try {
      await axios.put(`/order/${orderId}/status`, { status: "Hoàn thành" });
      setFill(
        fill.map((order) =>
          order.id === orderId ? { ...order, orderstatus: "Hoàn thành" } : order
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const isCancelButtonVisible = (order) => {
    return (
      (activeTab === "pills-home" &&
        order.orderstatus !== "Chờ giao hàng" &&
        order.orderstatus !== "Hoàn thành") ||
      (activeTab === "pills-profile" &&
        order.orderstatus === "Đang chờ duyệt") ||
      (activeTab === "pills-contact" &&
        order.orderstatus === "Chờ giao hàng") ||
      (activeTab === "pills-cancelled" && order.orderstatus === "Hủy")
    );
=======
  }, []);

  const loadOrderDetail = async (id) => {
    try {
      const res = await axios.get(`orderDetail/${id}`);
      setOrderProduct(res.data);
      console.log(res.data);
    } catch (error) {}
>>>>>>> a4a2c76a2188eff27aed7a2ceb5503475a5fc9ca
  };

  return (
    <div>
<<<<<<< HEAD
      <Header />
      <h1 className="text-center mt-4 mb-4">Đơn hàng của bạn</h1>
=======
      <Header></Header>
>>>>>>> a4a2c76a2188eff27aed7a2ceb5503475a5fc9ca
      <div className="container">
        <div className="card mt-3">
          <div className="card-body">
            <ul
<<<<<<< HEAD
              className="nav nav-pills mb-3 sticky-top"
              id="pills-tab"
              role="tablist"
            >
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
=======
              class="nav nav-pills mb-3 sticky-top"
              id="pills-tab"
              role="tablist"
            >
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link active"
>>>>>>> a4a2c76a2188eff27aed7a2ceb5503475a5fc9ca
                  id="pills-home-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-home"
                  type="button"
                  role="tab"
                  aria-controls="pills-home"
                  aria-selected="true"
<<<<<<< HEAD
                  onClick={() => setActiveTab("pills-home")}
=======
>>>>>>> a4a2c76a2188eff27aed7a2ceb5503475a5fc9ca
                >
                  Tất cả
                </button>
              </li>
<<<<<<< HEAD
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
=======
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
>>>>>>> a4a2c76a2188eff27aed7a2ceb5503475a5fc9ca
                  id="pills-profile-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-profile"
                  type="button"
                  role="tab"
                  aria-controls="pills-profile"
                  aria-selected="false"
<<<<<<< HEAD
                  onClick={() => setActiveTab("pills-profile")}
                >
                  Đang chờ duyệt
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
=======
                >
                  Chờ thanh toán
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
>>>>>>> a4a2c76a2188eff27aed7a2ceb5503475a5fc9ca
                  id="pills-contact-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-contact"
                  type="button"
                  role="tab"
                  aria-controls="pills-contact"
                  aria-selected="false"
<<<<<<< HEAD
                  onClick={() => setActiveTab("pills-contact")}
=======
                >
                  Vận chuyển
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
                  id="pills-123-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-12"
                  type="button"
                  role="tab"
                  aria-controls="pills-12"
                  aria-selected="false"
>>>>>>> a4a2c76a2188eff27aed7a2ceb5503475a5fc9ca
                >
                  Chờ giao hàng
                </button>
              </li>
<<<<<<< HEAD
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="pills-completed-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-completed"
                  type="button"
                  role="tab"
                  aria-controls="pills-completed"
                  aria-selected="false"
                  onClick={() => setActiveTab("pills-completed")}
                >
                  Hoàn thành
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="pills-cancelled-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-cancelled"
                  type="button"
                  role="tab"
                  aria-controls="pills-cancelled"
                  aria-selected="false"
                  onClick={() => setActiveTab("pills-cancelled")}
                >
                  Hủy
                </button>
              </li>
            </ul>
            <div className="tab-content" id="pills-tabContent">
              {/* Tab: Tất cả */}
              <div
                className="tab-pane fade show active"
                id="pills-home"
                role="tabpanel"
                aria-labelledby="pills-home-tab"
                tabIndex="0"
              >
                <div className="card rounded-3 sticky-top" id="cartTitle">
                  <div className="card-body">
                    <div className="d-flex">
                      <div className="col-3">Trạng thái</div>
                      <div className="col-3">Ngày đặt hàng</div>
                      <div className="col-3">Phương thức thanh toán</div>
                      <div className="col-2">Chi tiết</div>
                      <div className="col-2">Hành động</div>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  {fill.length === 0 ? (
                    <div className="text-center">
                      <h4>Chưa có đơn hàng nào</h4>
                    </div>
                  ) : (
                    fill.map((order) => (
                      <div
                        className="card rounded-3 mt-3"
                        id="cartItem"
                        key={order.id}
                      >
                        <div className="card-body">
                          <div className="d-flex">
                            <div className="col-3">{order.orderstatus}</div>
                            <div className="col-3">
                              {formatDate(order.paymentdate)}
                            </div>
                            <div className="col-3">
                              {order.paymentmethod.type}
                            </div>
                            <div className="col-2">
                              <Link to={`/orderDetail/${order.id}`}>
                                <button className="btn btn-primary">
                                  <i className="bi bi-eye-fill"></i>
                                </button>
                              </Link>
                            </div>
                            <div className="col-2">
                              {isCancelButtonVisible(order) && (
                                <button
                                  className="btn btn-danger me-2"
                                  onClick={() => handleCancelOrder(order.id)}
                                  style={{ display:  order.orderstatus === "Hủy" ? "none" : "inline" }}
                                >
                                  Hủy
                                </button>
                              )}

                              {order.orderstatus === "Chờ giao hàng" && (
                                <button
                                  className="btn btn-success me-2"
                                  onClick={() => handleMarkAsReceived(order.id)}
                                >
                                  Đã nhận hàng
                                </button>
                              )}
=======
            </ul>
            <div class="tab-content" id="pills-tabContent">
              <div
                class="tab-pane fade show active"
                id="pills-home"
                role="tabpanel"
                aria-labelledby="pills-home-tab"
                tabindex="0"
              >
                {/* đầu */}
                {fill.map((order, index) => (
                  <a href={`/orderDetail/${order.id}`} key={order.id}>
                    <div className="card rounded-3 mb-3" id="cartItem">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <input
                            className="form-check-input mb-1"
                            type="checkbox"
                            id="checkBox"
                          />
                          <img
                            src={order.user.avatar}
                            id="imgShop"
                            className="mx-3"
                            alt="Shop Logo"
                            style={{ height: "120%" }}
                          />
                          <h5 id="nameShop" className="mb-0">
                            {order.store.namestore}
                          </h5>
                          <button className="btn btn-danger  ms-auto">
                            Mua lại
                          </button>
                        </div>
                        <hr />
                        <div className="col-8">
                          <div className="d-flex">
                            <img
                              src="https://imagor.owtg.one/unsafe/fit-in/1000x1000/filters:quality(100)/https://media-api-beta.thinkpro.vn/media/core/products/2022/12/23/lenovo-thinkpad-x1-carbon-gen-11-thinkpro-01.png"
                              id="img"
                            />
                            <div className="col-8 mt-3">
                              <div id="fontSizeTitle"></div>
                              <div id="fontSize">
                                i7 1365U, 16GB, 256GB, FHD+ Touch, Black,
                                Outlet, Nhập khẩu
                              </div>
                            </div>
                            <div className="col-8 mt-4">
                              <h5 className="mt-3" id="price">
                                Thành tiền: 1.000.000VNĐ{" "}
                              </h5>
>>>>>>> a4a2c76a2188eff27aed7a2ceb5503475a5fc9ca
                            </div>
                          </div>
                        </div>
                      </div>
<<<<<<< HEAD
                    ))
                  )}
                </div>
              </div>
              {/* Tab: Đang chờ duyệt */}
              <div
                className="tab-pane fade"
                id="pills-profile"
                role="tabpanel"
                aria-labelledby="pills-profile-tab"
                tabIndex="0"
              >
                <div className="card rounded-3 sticky-top" id="cartTitle">
                  <div className="card-body">
                    <div className="d-flex">
                      <div className="col-3">Trạng thái</div>
                      <div className="col-3">Ngày đặt hàng</div>
                      <div className="col-3">Phương thức thanh toán</div>
                      <div className="col-2">Chi tiết</div>
                      <div className="col-2">Hành động</div>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  {fill.length === 0 ? (
                    <div className="text-center">
                      <h4>Chưa có đơn hàng nào</h4>
                    </div>
                  ) : (
                    fill
                      .filter((order) => order.orderstatus === "Đang chờ duyệt")
                      .map((order) => (
                        <div
                          className="card rounded-3 mt-3"
                          id="cartItem"
                          key={order.id}
                        >
                          <div className="card-body">
                            <div className="d-flex">
                              <div className="col-3">{order.orderstatus}</div>
                              <div className="col-3">
                                {formatDate(order.paymentdate)}
                              </div>
                              <div className="col-3">
                                {order.paymentmethod.type}
                              </div>
                              <div className="col-2">
                                <Link to={`/orderDetail/${order.id}`}>
                                  <button className="btn btn-primary">
                                    <i className="bi bi-eye-fill"></i>
                                  </button>
                                </Link>
                              </div>
                              <div className="col-2">
                                <button
                                  className="btn btn-danger me-2"
                                  onClick={() => handleCancelOrder(order.id)}
                                >
                                  Hủy
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
              {/* Tab: Chờ giao hàng */}
              <div
                className="tab-pane fade"
                id="pills-contact"
                role="tabpanel"
                aria-labelledby="pills-contact-tab"
                tabIndex="0"
              >
                <div className="card rounded-3 sticky-top" id="cartTitle">
                  <div className="card-body">
                    <div className="d-flex">
                      <div className="col-3">Trạng thái</div>
                      <div className="col-3">Ngày đặt hàng</div>
                      <div className="col-3">Phương thức thanh toán</div>
                      <div className="col-2">Chi tiết</div>
                      <div className="col-2">Hành động</div>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  {fill.length === 0 ? (
                    <div className="text-center">
                      <h4>Chưa có đơn hàng nào</h4>
                    </div>
                  ) : (
                    fill
                      .filter((order) => order.orderstatus === "Chờ giao hàng")
                      .map((order) => (
                        <div
                          className="card rounded-3 mt-3"
                          id="cartItem"
                          key={order.id}
                        >
                          <div className="card-body">
                            <div className="d-flex">
                              <div className="col-3">{order.orderstatus}</div>
                              <div className="col-3">
                                {formatDate(order.paymentdate)}
                              </div>
                              <div className="col-3">
                                {order.paymentmethod.type}
                              </div>
                              <div className="col-2">
                                <Link to={`/orderDetail/${order.id}`}>
                                  <button className="btn btn-primary">
                                    <i className="bi bi-eye-fill"></i>
                                  </button>
                                </Link>
                              </div>
                              <div className="col-2">
                                <button
                                  className="btn btn-success me-2"
                                  onClick={() => handleMarkAsReceived(order.id)}
                                >
                                  Đã nhận hàng
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
              {/* Tab: Hoàn thành */}
              <div
                className="tab-pane fade"
                id="pills-completed"
                role="tabpanel"
                aria-labelledby="pills-completed-tab"
                tabIndex="0"
              >
                <div className="card rounded-3 sticky-top" id="cartTitle">
                  <div className="card-body">
                    <div className="d-flex">
                      <div className="col-3">Trạng thái</div>
                      <div className="col-3">Ngày đặt hàng</div>
                      <div className="col-3">Phương thức thanh toán</div>
                      <div className="col-3">Chi tiết</div>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  {fill.length === 0 ? (
                    <div className="text-center">
                      <h4>Chưa có đơn hàng nào</h4>
                    </div>
                  ) : (
                    fill
                      .filter((order) => order.orderstatus === "Hoàn thành")
                      .map((order) => (
                        <div
                          className="card rounded-3 mt-3"
                          id="cartItem"
                          key={order.id}
                        >
                          <div className="card-body">
                            <div className="d-flex">
                              <div className="col-3">{order.orderstatus}</div>
                              <div className="col-3">
                                {formatDate(order.paymentdate)}
                              </div>
                              <div className="col-3">
                                {order.paymentmethod.type}
                              </div>
                              <div className="col-3">
                                <Link to={`/orderDetail/${order.id}`}>
                                  <button className="btn btn-primary">
                                    <i className="bi bi-eye-fill"></i>
                                  </button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
              {/* Tab: Hủy */}
              <div
                className="tab-pane fade"
                id="pills-cancelled"
                role="tabpanel"
                aria-labelledby="pills-cancelled-tab"
                tabIndex="0"
              >
                <div className="card rounded-3 sticky-top" id="cartTitle">
                  <div className="card-body">
                    <div className="d-flex">
                      <div className="col-3">Trạng thái</div>
                      <div className="col-3">Ngày đặt hàng</div>
                      <div className="col-3">Phương thức thanh toán</div>
                      <div className="col-3">Chi tiết</div>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  {fill.length === 0 ? (
                    <div className="text-center">
                      <h4>Chưa có đơn hàng nào</h4>
                    </div>
                  ) : (
                    fill
                      .filter((order) => order.orderstatus === "Hủy")
                      .map((order) => (
                        <div
                          className="card rounded-3 mt-3"
                          id="cartItem"
                          key={order.id}
                        >
                          <div className="card-body">
                            <div className="d-flex">
                              <div className="col-3">{order.orderstatus}</div>
                              <div className="col-3">
                                {formatDate(order.paymentdate)}
                              </div>
                              <div className="col-3">
                                {order.paymentmethod.type}
                              </div>
                              <div className="col-3">
                                <Link to={`/orderDetail/${order.id}`}>
                                  <button className="btn btn-primary">
                                    <i className="bi bi-eye-fill"></i>
                                  </button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
=======
                    </div>
                  </a>
                ))}
                {/* cuoi */}
              </div>
              <div
                class="tab-pane fade"
                id="pills-profile"
                role="tabpanel"
                aria-labelledby="pills-profile-tab"
                tabindex="0"
              ></div>
              <div
                class="tab-pane fade"
                id="pills-12"
                role="tabpanel"
                aria-labelledby="pills-12"
                tabindex="0"
              ></div>
>>>>>>> a4a2c76a2188eff27aed7a2ceb5503475a5fc9ca
            </div>
          </div>
        </div>
      </div>
<<<<<<< HEAD
      <Footer />
=======
      <Footer></Footer>
>>>>>>> a4a2c76a2188eff27aed7a2ceb5503475a5fc9ca
    </div>
  );
};

export default Order;
