import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../Localhost/Custumize-axios";
import Header from "../../Header/Header";
import moment from "moment";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import thư viện FontAwesome để sử dụng icon
import "./SellerNotification.css";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { ThemeModeContext } from "../../ThemeMode/ThemeModeProvider";

function BuyerNotification() {
  const [orders, setOrders] = useState([]); // State để lưu trữ tất cả đơn hàng (đang vận chuyển và đã hủy)
  const [filter, setFilter] = useState("all"); // State để lọc dữ liệu, mặc định là 'all' để hiển thị tất cả đơn hàng
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null; // Lấy id người dùng từ sessionStorage
  const navigate = useNavigate(); // Hook để điều hướng trang
  const { mode } = useContext(ThemeModeContext);

  // Hàm loadData để gọi API lấy dữ liệu đơn hàng từ server
  const loadData = async (userId) => {
    if (!userId) {
      console.error("User ID is missing"); // Log lỗi nếu không có userId
      return;
    }
    try {
      // Gọi API để lấy tất cả đơn hàng (đang vận chuyển và đã hủy)
      const response = await axios.get(`/checkOrderBuyer/${userId}`);
      setOrders(response.data); // Cập nhật state với danh sách đơn hàng nhận được từ server
    } catch (error) {
      console.log("Error fetching orders:", error); // Log lỗi nếu có vấn đề khi gọi API
    }
  };

  // Hàm formatDate để định dạng ngày tháng
  const formatDate = (dateString) => {
    const date = moment(dateString); // Sử dụng thư viện moment để định dạng ngày tháng
    return date.isValid() ? date.format("HH:mm:ss DD/MM/YYYY") : "Invalid Date"; // Kiểm tra tính hợp lệ của ngày tháng
  };

  // Hàm lọc và sắp xếp đơn hàng
  const filteredNotifications = () => {
    let filteredOrders = orders;

    // Lọc theo trạng thái nếu có filter
    if (filter === "inTransit") {
      filteredOrders =
        orders &&
        orders.filter((order) => order.orderstatus === "Đang vận chuyển");
    } else if (filter === "canceled") {
      filteredOrders =
        orders && orders.filter((order) => order.orderstatus === "Hủy");
    }

    // Sắp xếp theo ngày, đơn hàng mới nhất trước
    return (
      filteredOrders &&
      filteredOrders.sort((a, b) => {
        const dateA = new Date(a.paymentdate || a.updatedtime || a.createdtime);
        const dateB = new Date(b.paymentdate || b.updatedtime || b.createdtime);
        return dateB - dateA; // Giảm dần
      })
    );
  };

  // useEffect để gọi hàm loadData khi component được render lần đầu
  useEffect(() => {
    loadData(user.id); // Gọi hàm loadData khi component được mount
  }, [user.id]); // Chỉ chạy lại effect này nếu userId thay đổi

  // Hàm xử lý khi người dùng click vào đơn hàng
  const handleOrderClick = (orderId) => {
    navigate(`/order`); // Điều hướng sang trang chi tiết đơn hàng
  };

  return (
    <div>
      <Header />
      <div className="container-lg mt-5">
        <div className="row">
          {/* Sidebar với các tùy chọn lọc */}
          <div className="col-md-3">
            <Card className="">
              <CardContent className="">
                <ul className="list-group list-group-flush">
                  {/* Tùy chọn hiển thị tất cả thông báo */}
                  <Link
                    to={"#"}
                    onClick={() => setFilter("all")}
                    style={{
                      backgroundColor: mode === "light" ? "white" : "#212121",
                      color: mode === "light" ? "black" : "white",
                    }}
                    className="p-2 "
                  >
                    <li className=" d-flex justify-content-between align-items-center">
                      Tất cả thông báo
                      <span className="badge bg-primary rounded-pill">
                        {orders.length} {/* Hiển thị tổng số lượng thông báo */}
                      </span>
                    </li>
                  </Link>
                  {/* Tùy chọn hiển thị đơn hàng đang vận chuyển */}
                  <Link
                    to={"#"}
                    onClick={() => setFilter("inTransit")}
                    style={{
                      backgroundColor: mode === "light" ? "white" : "#212121",
                      color: mode === "light" ? "black" : "white",
                    }}
                    className="p-2 "
                  >
                    <li className=" d-flex justify-content-between align-items-center">
                      Đơn hàng đang vận chuyển
                      <span className="badge bg-success rounded-pill">
                        {
                          orders &&
                            orders.filter(
                              (order) => order.orderstatus === "Đang vận chuyển"
                            ).length // Hiển thị số lượng đơn hàng đang vận chuyển
                        }
                      </span>
                    </li>
                  </Link>
                  {/* Tùy chọn hiển thị đơn hàng đã hủy */}
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
                        {
                          orders &&
                            orders.filter(
                              (order) => order.orderstatus === "Hủy"
                            ).length // Hiển thị số lượng đơn hàng đã hủy
                        }
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
              <h5>
                {/* Hiển thị tiêu đề tùy thuộc vào filter */}
                {filter === "all"
                  ? "Tất cả thông báo"
                  : filter === "inTransit"
                  ? "Đơn hàng đang vận chuyển"
                  : "Đơn hàng đã hủy"}
              </h5>
              <button className="btn btn-outline-secondary btn-sm">
                Đánh dấu đã đọc tất cả{" "}
                {/* Nút đánh dấu tất cả thông báo đã đọc */}
              </button>
            </div>
            <hr />
            <Box className="list-group">
              {/* Kiểm tra nếu không có thông báo nào */}
              {filteredNotifications().length === 0 ? (
                <div className="text-center my-5">
                  {/* Hiển thị icon và thông báo khi không có đơn hàng */}
                  <i className="fa-regular fa-file-excel fa-3x mb-3"></i>
                  <h6>Không có đơn hàng nào.</h6>
                </div>
              ) : (
                // Hiển thị danh sách đơn hàng đã lọc
                filteredNotifications().map((order) => (
                  <Box
                    key={order.id}
                    className="list-group-item d-flex"
                    onClick={() => handleOrderClick(order.id)} // Xử lý khi click vào đơn hàng
                    sx={{
                      cursor: "pointer",
                      backgroundColor: "backgroundElement.children",
                    }}
                  >
                    <div className="flex-grow-1">
                      <Typography
                        className="mb-1"
                        variant="h6"
                        sx={{ color: "text.default" }}
                      >
                        {order.orderstatus === "Đang vận chuyển"
                          ? "Đơn hàng đang vận chuyển"
                          : "Đơn hàng đã hủy"}{" "}
                        {/* Hiển thị trạng thái đơn hàng */}
                      </Typography>
                      <Typography
                        variant="p"
                        className="mb-1"
                        sx={{ color: "text.default" }}
                      >
                        {order.orderstatus === "Đang vận chuyển"
                          ? `Đơn hàng ${order.id} đang vận chuyển.`
                          : `Đơn hàng ${order.id} đã bị hủy.`}{" "}
                        {/* Hiển thị mô tả đơn hàng */}
                      </Typography>
                      <p className="small-text">
                        {formatDate(
                          order.paymentdate ||
                            order.updatedtime ||
                            order.createdtime
                        )}{" "}
                        {/* Hiển thị ngày cập nhật, ngày hủy hoặc ngày tạo đơn hàng */}
                      </p>
                    </div>
                  </Box>
                ))
              )}
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyerNotification;
