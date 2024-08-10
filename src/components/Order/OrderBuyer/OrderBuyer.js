import React, { useEffect, useState } from "react";
import "./OrderStyle.css";
import Header from "../../UI&UX/Header/Header";
import Footer from "../../UI&UX/Footer/Footer";
import axios from "../../../Localhost/Custumize-axios";
import { Link } from "react-router-dom";
import useSession from "../../../Session/useSession";
import { format } from "date-fns";

const Order = () => {
  const [fill, setFill] = useState([]);
  const [idUser] = useSession("id");
  const [activeTab, setActiveTab] = useState("pills-home");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`orderFill/${idUser}`);
        setFill(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    load();
  }, [idUser]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "HH:mm:ss dd/MM/yyyy");
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.put(`/order/${orderId}/status`, { status: "Hủy" });
      setFill(
        fill.map((order) =>
          order.id === orderId ? { ...order, orderstatus: "Hủy" } : order
        )
      );
    } catch (error) {
      console.log(error);
    }
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
  };

  return (
    <div>
      <Header />
      <div className="container">
        <div className="card mt-3">
          <div className="card-body">
            <ul
              className="nav nav-pills mb-3 sticky-top"
              id="pills-tab"
              role="tablist"
            >
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="pills-home-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-home"
                  type="button"
                  role="tab"
                  aria-controls="pills-home"
                  aria-selected="true"
                  onClick={() => setActiveTab("pills-home")}
                >
                  Tất cả
                </button>
              </li>
              <li className="nav-item" role="presentation">
<button
                  className="nav-link"
                  id="pills-profile-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-profile"
                  type="button"
                  role="tab"
                  aria-controls="pills-profile"
                  aria-selected="false"
                  onClick={() => setActiveTab("pills-profile")}
                >
                  Đang chờ duyệt
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="pills-contact-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-contact"
                  type="button"
                  role="tab"
                  aria-controls="pills-contact"
                  aria-selected="false"
                  onClick={() => setActiveTab("pills-contact")}
                >
                  Chờ giao hàng
                </button>
              </li>
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
                            </div>
                          </div>
                        </div>
                      </div>
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
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Order; 