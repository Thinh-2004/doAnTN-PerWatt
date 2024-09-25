import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../Localhost/Custumize-axios";
import Header from "../../UI&UX/Header/HeaderMarket";
import moment from "moment";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import thư viện FontAwesome để sử dụng icon
import "./SellerNotification.css";

function NotificationCard() {
  const [orders, setOrders] = useState([]); // State để lưu danh sách đơn hàng mới
  const [deliveredOrders, setDeliveredOrders] = useState([]); // State để lưu danh sách đơn hàng đã giao
  const [canceledOrders, setCanceledOrders] = useState([]); // State để lưu danh sách đơn hàng đã hủy
  const [filter, setFilter] = useState("all"); // State để lưu bộ lọc, mặc định là 'tất cả'
  const idStore = sessionStorage.getItem("idStore"); // Lấy ID cửa hàng từ sessionStorage
  const navigate = useNavigate(); // Sử dụng hook useNavigate để điều hướng trang

  // Hàm load dữ liệu đơn hàng từ API
  const loadData = async (idStore) => {
    if (!idStore) {
      console.error("Store ID is missing"); // Báo lỗi nếu không có ID cửa hàng
      return;
    }
    try {
      // Gọi API để lấy danh sách đơn hàng mới, đã giao và đã hủy
      const [newOrdersRes, deliveredOrdersRes, canceledOrdersRes] =
        await Promise.all([
          axios.get(`/checkOrder/${idStore}`), // Lấy đơn hàng mới
          axios.get(`/deliveredOrders/${idStore}`), // Lấy đơn hàng đã giao
          axios.get(`/canceledOrders/${idStore}`), // Lấy đơn hàng đã hủy
        ]);
      setOrders(newOrdersRes.data); // Cập nhật state với danh sách đơn hàng mới
      setDeliveredOrders(deliveredOrdersRes.data); // Cập nhật state với đơn hàng đã giao
      setCanceledOrders(canceledOrdersRes.data); // Cập nhật state với đơn hàng đã hủy
    } catch (error) {
      console.log("Error fetching orders:", error); // Báo lỗi nếu gọi API thất bại
    }
  };

  // Hàm định dạng thời gian hiển thị
  const formatDate = (dateString) => {
    const date = moment(dateString); // Sử dụng thư viện moment để định dạng thời gian
    return date.isValid() ? date.format("HH:mm:ss DD/MM/YYYY") : "Invalid Date"; // Kiểm tra xem ngày có hợp lệ không
  };

  useEffect(() => {
    loadData(idStore); // Gọi hàm loadData khi component được render lần đầu
  }, [idStore]); // Phụ thuộc vào idStore, nếu thay đổi thì gọi lại

  // Hàm xử lý khi người dùng click vào đơn hàng
  const handleOrderClick = (orderId) => {
    navigate(`/profileMarket/orderSeller/${orderId}`); // Điều hướng đến trang chi tiết đơn hàng
  };

  // Hàm lọc các thông báo dựa trên bộ lọc đã chọn
  const filteredNotifications = () => {
    if (filter === "new") return orders; // Nếu lọc "new" thì chỉ hiển thị đơn hàng mới
    if (filter === "delivered") return deliveredOrders; // Nếu lọc "delivered" thì chỉ hiển thị đơn hàng đã giao
    if (filter === "canceled") return canceledOrders; // Nếu lọc "canceled" thì chỉ hiển thị đơn hàng đã hủy
    return [...orders, ...deliveredOrders, ...canceledOrders]; // Mặc định hiển thị tất cả các đơn hàng
  };

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <div className="row">
          {/* Cột bên trái với các tùy chọn bộ lọc */}
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <Link to={"#"} onClick={() => setFilter("all")}>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Tất cả thông báo
                      <span className="badge bg-primary rounded-pill">
                        {orders.length +
                          deliveredOrders.length +
                          canceledOrders.length}
                      </span>
                    </li>
                  </Link>
                  <Link to={"#"} onClick={() => setFilter("new")}>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Đơn hàng mới
                      <span className="badge bg-danger rounded-pill">
                        {orders.length}
                      </span>
                    </li>
                  </Link>
                  <Link to={"#"} onClick={() => setFilter("delivered")}>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Đơn hàng đã giao
                      <span className="badge bg-success rounded-pill">
                        {deliveredOrders.length}
                      </span>
                    </li>
                  </Link>
                  <Link to={"#"} onClick={() => setFilter("canceled")}>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Đơn hàng đã hủy
                      <span className="badge bg-warning rounded-pill">
                        {canceledOrders.length}
                      </span>
                    </li>
                  </Link>
                </ul>
              </div>
            </div>
          </div>

          {/* Danh sách thông báo */}
          {(orders.length > 0 ||
            deliveredOrders.length > 0 ||
            canceledOrders.length > 0) && (
            <div className="col-md-9">
              <div className="d-flex justify-content-between mb-3">
                <h5>Tất cả thông báo</h5>
                <button className="btn btn-outline-secondary btn-sm">
                  Đánh dấu đã đọc tất cả
                </button>
              </div>
              <hr />
              <div className="list-group">
                {/* Kiểm tra nếu không có thông báo */}
                {filteredNotifications().length === 0 ? (
                  <div className="text-center my-5">
                    {/* Thêm icon và thông báo khi không có đơn hàng */}
                    <i className="fa-regular fa-file-excel fa-3x mb-3"></i>
                    <h6>Không có đơn hàng nào.</h6>
                  </div>
                ) : (
                  filteredNotifications().map((order) => (
                    <div
                      key={order.id}
                      className="list-group-item d-flex"
                      onClick={() => handleOrderClick(order.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={
                          order.productImage || "https://via.placeholder.com/50"
                        }
                        className="me-4"
                        alt="thumbnail"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-1">
                          {orders.includes(order) && "Đơn hàng mới"}
                          {deliveredOrders.includes(order) &&
                            "Đơn hàng đã giao"}
                          {canceledOrders.includes(order) && "Đơn hàng đã hủy"}
                        </h6>
                        <p className="mb-1">
                          {order.user.fullname}{" "}
                          {orders.includes(order)
                            ? `đã đặt đơn hàng ${order.id}.`
                            : deliveredOrders.includes(order)
                            ? `đã xác nhận nhận hàng cho đơn hàng ${order.id}.`
                            : canceledOrders.includes(order)
                            ? `đã hủy đơn hàng ${order.id}.`
                            : `đã đặt, giao, hoặc hủy đơn hàng ${order.id}.`}
                        </p>
                        <p className="small-text">
                          {formatDate(
                            order.createdtime ||
                              order.updatedtime ||
                              order.canceledtime
                          )}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationCard;
