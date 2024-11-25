import React, { useState, useEffect, useContext } from "react";
import RevenueChart from "./RevenueChart"; // Đảm bảo đường dẫn đúng
import StoresChart from "./StoresChart";
import UserChart from "./UserChart";
import ProductList from "./ProductList"; // Nhập ProductList từ file tương ứng
import { UilTimes } from "@iconscout/react-unicons";
import axios from "../../Localhost/Custumize-axios";
import "./Dashboard.css";
import { Box, Button, Container, Typography } from "@mui/material";
import { ThemeModeContext } from "../../components/ThemeMode/ThemeModeProvider";
import { Link } from "react-router-dom";

const checkUserRole = (role) => {
  const token = localStorage.getItem("token");

  if (token) {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const roles = decodedToken.roles;
    return roles.includes(role);
  }
  return false;
};

// Sử dụng hàm để kiểm tra
if (checkUserRole("ROLE_ADMIN")) {
  console.log("User is Admin");
  // Logic cho Admin
} else {
  console.log("User is not Admin");
  // Logic cho user thông thường
}

// Hàm gọi API thực tế để lấy doanh thu của tháng lớn nhất trong năm lớn nhất
const fetchRevenueOfMaxMonth = async () => {
  try {
    const response = await axios.get("/revenue-by-month");
    const data = response.data;

    // Tìm năm lớn nhất
    const maxYear = Math.max(...data.map((item) => item.Year));

    // Lọc dữ liệu của năm lớn nhất
    const filteredData = data.filter((item) => item.Year === maxYear);

    // Tìm tháng lớn nhất trong năm lớn nhất
    const maxMonth = Math.max(...filteredData.map((item) => item.Month));

    // Lọc dữ liệu của tháng lớn nhất
    const maxMonthData = filteredData.filter((item) => item.Month === maxMonth);

    // Lấy dữ liệu của tháng gần nhất trong năm đó
    const latestMonthData = maxMonthData.reduce(
      (latest, item) =>
        new Date(item.Year, item.Month - 1) >
        new Date(latest.Year, latest.Month - 1)
          ? item
          : latest,
      maxMonthData[0]
    );

    return latestMonthData.TotalVATCollected; // Trả về tổng VAT đã thu
  } catch (error) {
    console.error("Error fetching revenue:", error);
    return 0; // Trả về 0 nếu có lỗi
  }
};

// Hàm gọi API để lấy số lượng cửa hàng
const fetchTotalStoresCount = async () => {
  try {
    const response = await axios.get("/total-stores-count");
    return response.data.totalStoresCount || 0; // Trả về số lượng cửa hàng hoặc 0 nếu không có dữ liệu
  } catch (error) {
    console.error("Error fetching total stores count:", error);
    return 0; // Trả về 0 nếu có lỗi
  }
};

// Hàm gọi API để lấy số lượng người dùng
const fetchTotalUsersCount = async () => {
  try {
    const response = await axios.get("/total-users");
    return response.data[0]?.TotalUsers || 0; // Trả về số lượng người dùng hoặc 0 nếu không có dữ liệu
  } catch (error) {
    console.error("Error fetching total users count:", error);
    return 0; // Trả về 0 nếu có lỗi
  }
};

// Hàm định dạng tiền tệ
const formatCurrencyVND = (amount) => {
  return Number(amount)
    .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
    .replace("₫", "đ");
};

// Thành phần hiển thị thông tin thẻ
const CardItem = ({ title, value, percentage, isIncrease, onClick }) => {
  const displayValue =
    title === "Số cửa hàng" || title === "Số người dùng"
      ? value
      : formatCurrencyVND(value);

  return (
    <div className="card-item" onClick={onClick}>
      <h2 className="card-item-title">{title}</h2>
      <p className="card-item-value">{displayValue}</p>
      <p className={isIncrease ? "increase" : "decrease"}>
        {isIncrease ? "+" : "-"}
        {percentage}% {isIncrease ? "Tăng" : "Giảm"} so với tháng trước
      </p>
    </div>
  );
};

const Dashboard = () => {
  const [revenue, setRevenue] = useState(0);
  const [totalStores, setTotalStores] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRevenueChart, setShowRevenueChart] = useState(false);
  const [showStoresChart, setShowStoresChart] = useState(false);
  const [showUserChart, setShowUserChart] = useState(false);
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const { mode } = useContext(ThemeModeContext);

  // Hàm lấy lời chào theo giờ hiện tại
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  // Hàm gọi API để lấy dữ liệu dashboard
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const revenue = await fetchRevenueOfMaxMonth(); // Cập nhật hàm gọi API
      const totalStoresCount = await fetchTotalStoresCount();
      const totalUsersCount = await fetchTotalUsersCount();

      setRevenue(revenue);
      setTotalStores(totalStoresCount);
      setTotalUsers(totalUsersCount);
    } catch (error) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="dashboard">
      <Container
        maxWidth="xl"
        className="rounded-3"
        sx={{ backgroundColor: "backgroundElement.children" }}
      >
        <div className="header">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              {getGreeting()}, {user.fullname} 👋
            </h2>
            <p className="text-muted-foreground">
              Đây là những gì đang xảy ra trên cửa hàng của bạn ngày hôm nay.
              Xem số liệu thống kê cùng một lúc.
            </p>
            <Button
              size="small"
              variant="outlined"
              LinkComponent={Link}
              to="/"
              sx={{
                textTransform: "inherit",
              }}
              className="me-2"
            >
              <img
                src="/images/logoWeb.png"
                alt=""
                className="rounded-circle img-fluid"
                style={{ width: "40px", aspectRatio: "1/1" }}
              />
              &nbsp;
              <Typography className="mx-2" sx={{ fontSize: "15px" }}>
                Trang chủ PerWatt
              </Typography>
            </Button>
            <Button
              size="small"
              variant="outlined"
              LinkComponent={Link}
              to="/admin/voucher/website"
              sx={{
                textTransform: "inherit",
              }}
              className="mx-2 me-2"
            >
              <Typography
                className="align-content-center"
                sx={{ fontSize: "15px", height: "40px" }}
              >
                Chương trình khuyến mãi
              </Typography>
            </Button>
            <Button
              size="small"
              variant="outlined"
              LinkComponent={Link}
              to="/admin/category"
              sx={{
                textTransform: "inherit",
              }}
            >
              <Typography
                className="align-content-center"
                sx={{ fontSize: "15px", height: "40px" }}
              >
                Quản lí danh mục sản phẩm
              </Typography>
            </Button>
          </div>
          <img
            className="img-header"
            src="https://png.pngtree.com/thumb_back/fh260/background/20231001/pngtree-3d-rendering-of-a-gaming-setup-with-video-game-accessories-image_13547441.png"
            alt=""
          />
        </div>

        <div className="grid-container p-3">
          <Box className="border rounded-3">
            <CardItem
              title="Doanh thu"
              value={revenue}
              percentage={10}
              isIncrease={true}
              onClick={() => setShowRevenueChart(!showRevenueChart)}
            />
          </Box>
          <Box className="border rounded-3">
            <CardItem
              title="Số cửa hàng"
              value={totalStores}
              percentage={2}
              isIncrease={true}
              onClick={() => setShowStoresChart(!showStoresChart)}
            />
          </Box>
          <Box className="border rounded-3">
            <CardItem
              title="Số người dùng"
              value={totalUsers}
              percentage={5}
              isIncrease={true}
            />
          </Box>
        </div>
      </Container>

      {showRevenueChart && (
        <Box
          className="chart-container"
          sx={{ backgroundColor: "backgroundElement.children" }}
        >
          <button
            className="close-button"
            style={{ color: mode === "light" ? "black" : "white" }}
            onClick={() => setShowRevenueChart(false)}
          >
            <UilTimes />
          </button>
          <h2 className="chart-title">Biểu đồ Doanh thu</h2>
          <RevenueChart onClose={() => setShowRevenueChart(false)} />
        </Box>
      )}

      {showStoresChart && (
        <Box
          className="chart-container"
          sx={{ backgroundColor: "backgroundElement.children" }}
        >
          <button
            className="close-button"
            onClick={() => setShowStoresChart(false)}
            style={{ color: mode === "light" ? "black" : "white" }}
          >
            <UilTimes />
          </button>
          <h2 className="chart-title">Biểu đồ số cửa hàng mới</h2>
          <StoresChart onClose={() => setShowStoresChart(false)} />
        </Box>
      )}

      {showUserChart && (
        <div className="chart-container">
          <button
            className="close-button"
            onClick={() => setShowUserChart(false)}
          >
            <UilTimes />
          </button>
          <h2 className="chart-title">Biểu đồ Số người dùng</h2>
          <UserChart onClose={() => setShowUserChart(false)} />
        </div>
      )}

      {/* Thêm ProductList vào đây */}
      <ProductList />
    </div>
  );
};

export default Dashboard;
