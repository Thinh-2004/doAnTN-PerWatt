import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../Localhost/Custumize-axios";
import Header from "../../Header/Header";
import moment from "moment";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./SellerNotification.css";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { ThemeModeContext } from "../../ThemeMode/ThemeModeProvider";

function NotificationCard() {
  const [orders, setOrders] = useState([]); // Danh sách đơn hàng mới
  const [deliveredOrders, setDeliveredOrders] = useState([]); // Đơn hàng đã giao
  const [canceledOrders, setCanceledOrders] = useState([]); // Đơn hàng đã hủy
  const [filter, setFilter] = useState("all"); // Bộ lọc thông báo
  const idStore = sessionStorage.getItem("idStore"); // Lấy ID cửa hàng từ sessionStorage
  const navigate = useNavigate(); // Hook điều hướng trang
  //State change text title
  const [titleHeader, setTitleHeader] = useState("Tất cả thông báo");
  const { mode } = useContext(ThemeModeContext);

  // Hàm tải dữ liệu từ API
  const loadData = async (idStore) => {
    if (!idStore) {
      console.error("Store ID is missing");
      return;
    }
    try {
      // Gọi API đồng thời
      const [newOrdersRes, deliveredOrdersRes, canceledOrdersRes] =
        await Promise.all([
          axios.get(`/checkOrderSeller/${idStore}`), // API lấy đơn hàng mới
          axios.get(`/deliveredOrders/${idStore}`), // API lấy đơn hàng đã giao
          axios.get(`/canceledOrders/${idStore}`), // API lấy đơn hàng đã hủy
        ]);
      setOrders(newOrdersRes.data); // Cập nhật đơn hàng mới
      setDeliveredOrders(deliveredOrdersRes.data); // Cập nhật đơn hàng đã giao
      setCanceledOrders(canceledOrdersRes.data); // Cập nhật đơn hàng đã hủy
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Hàm định dạng thời gian
  const formatDate = (dateString) => {
    const date = moment(dateString); // Sử dụng moment để định dạng thời gian
    return date.isValid() ? date.format("HH:mm:ss DD/MM/YYYY") : "Invalid Date";
  };

  useEffect(() => {
    loadData(idStore); // Gọi loadData khi component render lần đầu
  }, [idStore]);

  //Render khi click vào
  useEffect(() => {
    if (filter === "new") {
      setTitleHeader("Đơn hàng mới");
    } else if (filter === "delivered") {
      setTitleHeader("Đơn hàng đã giao");
    } else if (filter === "canceled") {
      setTitleHeader("Đơn hàng đã hủy");
    } else {
      setTitleHeader("Tất cả thông báo");
    }
  }, [filter]);

  // Hàm xử lý khi click vào đơn hàng
  const handleOrderClick = (orderId) => {
    navigate(`/profileMarket/orderSeller/${orderId}`); // Điều hướng đến trang chi tiết đơn hàng
  };

  // Hàm lọc và sắp xếp các thông báo
  const filteredNotifications = () => {
    let notifications = [];
    if (filter === "new") {
      notifications = orders; // Lọc đơn hàng mới
    } else if (filter === "delivered") {
      notifications = deliveredOrders; // Lọc đơn hàng đã giao
    } else if (filter === "canceled") {
      notifications = canceledOrders; // Lọc đơn hàng đã hủy
    } else {
      notifications = [...orders, ...deliveredOrders, ...canceledOrders]; // Tất cả đơn hàng
    }

    // Sắp xếp thông báo theo thời gian giảm dần
    return (
      notifications &&
      notifications.sort((a, b) => {
        const dateA = new Date(
          a.paymentdate || a.updatedtime || a.canceledtime || a.createdtime
        );
        const dateB = new Date(
          b.paymentdate || b.updatedtime || b.canceledtime || b.createdtime
        );
        return dateB - dateA; // Sắp xếp giảm dần
      })
    );
  };

  return (
    <div>
      <Header />
      <div className="container-lg mt-5">
        <div className="row">
          {/* Bộ lọc thông báo */}
          <div className="col-md-3">
            <Card className="">
              <CardContent className="">
                <ul className="list-group list-group-flush">
                  <Link
                    to={"#"}
                    onClick={() => setFilter("all")}
                    style={{
                      backgroundColor: mode === "light" ? "white" : "#212121",
                      color: mode === "light" ? "black" : "white",
                    }}
                    className="p-2 "
                  >
                    <li className="d-flex justify-content-between align-items-center">
                      Tất cả thông báo
                      <span className="badge bg-primary rounded-pill">
                        {orders.length +
                          deliveredOrders.length +
                          canceledOrders.length}
                      </span>
                    </li>
                  </Link>
                  <Link
                    to={"#"}
                    onClick={() => setFilter("new")}
                    style={{
                      backgroundColor: mode === "light" ? "white" : "#212121",
                      color: mode === "light" ? "black" : "white",
                    }}
                    className="p-2 "
                  >
                    <li className=" d-flex justify-content-between align-items-center">
                      Đơn hàng mới
                      <span className="badge bg-danger rounded-pill">
                        {orders.length}
                      </span>
                    </li>
                  </Link>
                  <Link
                    to={"#"}
                    onClick={() => setFilter("delivered")}
                    style={{
                      backgroundColor: mode === "light" ? "white" : "#212121",
                      color: mode === "light" ? "black" : "white",
                    }}
                    className="p-2 "
                  >
                    <li className=" d-flex justify-content-between align-items-center">
                      Đơn hàng đã giao
                      <span className="badge bg-success rounded-pill">
                        {deliveredOrders.length}
                      </span>
                    </li>
                  </Link>
                  <Link
                    to={"#"}
                    onClick={() => setFilter("canceled")}
                    style={{
                      backgroundColor: mode === "light" ? "white" : "#212121",
                      color: mode === "light" ? "black" : "white",
                    }}
                    className="p-2 "
                  >
                    <li className=" d-flex justify-content-between align-items-center">
                      Đơn hàng đã hủy
                      <span className="badge bg-warning rounded-pill">
                        {canceledOrders.length}
                      </span>
                    </li>
                  </Link>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Danh sách thông báo */}
          <div className="col-md-9">
            <div className="d-flex justify-content-between mb-3">
              <h5>{titleHeader}</h5>
              <button className="btn btn-outline-secondary btn-sm">
                Đánh dấu đã đọc tất cả
              </button>
            </div>
            <hr />
            <div className="list-group">
              {filteredNotifications().length === 0 ? (
                <div className="text-center my-5">
                  <i className="fa-regular fa-file-excel fa-3x mb-3"></i>
                  <h6>Không có đơn hàng nào.</h6>
                </div>
              ) : (
                filteredNotifications().map((order) => (
                  <Box
                    key={order.id}
                    className="list-group-item d-flex align-items-center"
                    onClick={() => handleOrderClick(order.id)}
                    sx={{
                      cursor: "pointer",
                      backgroundColor: "backgroundElement.children",
                    }}
                  >
                    <img
                      src={
                        order.store.taxcode !== null ||
                        order.store.taxcode !== ""
                          ? "/images/IconShopMall.png"
                          : "public/images/logoWeb.png"
                      }
                      className="me-4"
                      alt="thumbnail"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                    <div className="flex-grow-1">
                      <Typography
                        className="mb-1"
                        variant="h6"
                        sx={{ color: "text.default" }}
                      >
                        {orders.includes(order) && "Đơn hàng mới"}
                        {deliveredOrders.includes(order) && "Đơn hàng đã giao"}
                        {canceledOrders.includes(order) && "Đơn hàng đã hủy"}
                      </Typography>
                      <Typography
                        variant="p"
                        className="mb-1"
                        sx={{ color: "text.default" }}
                      >
                        {order.user.fullname}{" "}
                        {orders.includes(order)
                          ? `đã đặt đơn hàng ${order.id}.`
                          : deliveredOrders.includes(order)
                          ? `đã xác nhận nhận hàng cho đơn hàng ${order.id}.`
                          : canceledOrders.includes(order)
                          ? `đã hủy đơn hàng ${order.id}.`
                          : ""}
                      </Typography>
                      <p className="small-text">
                        {formatDate(
                          order.paymentdate ||
                            order.createdtime ||
                            order.updatedtime ||
                            order.canceledtime
                        )}
                      </p>
                    </div>
                  </Box>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationCard;
