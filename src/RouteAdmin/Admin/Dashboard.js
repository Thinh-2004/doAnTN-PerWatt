import React, { useState, useEffect } from "react";
import RevenueChart from "./RevenueChart"; // Đảm bảo đường dẫn đúng
import StoresChart from "./StoresChart";
import UserChart from "./UserChart";
import { UilTimes } from "@iconscout/react-unicons";
import axios from "axios";
import "./Dashboard.css";
import StoreVat from "./StoreVat";
import { EyeOutlined } from "@ant-design/icons";

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

const fetchInitialProducts = async () => {
  try {
    const response = await axios.get("http://localhost:8080/top-selling");
    console.log(response.data); // Kiểm tra dữ liệu
    return response.data.map((product) => ({
      id: product.idImage, // Sử dụng idImage
      name: product.productName,
      price: `${product.totalRevenue}đ`, // Hiển thị doanh thu
      sold: product.totalQuantitySold, // Số lượng đã bán
      image: product.imageName
        ? `http://localhost:8080/files/product-images/${product.idImage}/${product.imageName}` // Sử dụng idImage
        : "https://via.placeholder.com/50", // Hình ảnh dự phòng
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Hàm gọi API thực tế để tải thêm sản phẩm
const fetchMoreProducts = async (currentProducts) => {
  try {
    const response = await axios.get("http://localhost:8080/more-products"); // Endpoint giả định để lấy sản phẩm thêm
    const newProducts = response.data.map((item) => ({
      name: item[0],
      price: item[1],
      sold: item[2],
      image: `https://via.placeholder.com/50?text=${item[3]}`, // Sử dụng placeholder image với tên tệp từ API
      status: "Còn hàng", // Hoặc bạn có thể lấy thông tin trạng thái nếu có từ API
    }));
    return [...currentProducts, ...newProducts];
  } catch (error) {
    console.error("Error fetching more products:", error);
    return currentProducts;
  }
};

// Hàm gọi API thực tế để lấy danh sách cửa hàng ban đầu

// Hàm gọi API thực tế để lấy danh sách voucher ban đầu

// Hàm gọi API thực tế để lấy doanh thu của tháng lớn nhất trong năm lớn nhất
const fetchRevenueOfMaxMonth = async () => {
  try {
    const response = await axios.get("http://localhost:8080/revenue-by-month");
    const data = response.data;

    // Tìm năm lớn nhất
    const maxYear = Math.max(...data.map((item) => item.Year));

    // Lọc dữ liệu của năm lớn nhất
    const filteredData = data.filter((item) => item.Year === maxYear);

    // Tìm tháng lớn nhất trong năm lớn nhất
    const maxMonth = Math.max(...filteredData.map((item) => item.Month));

    // Lọc dữ liệu của tháng lớn nhất
    const maxMonthData = filteredData.filter((item) => item.Month === maxMonth);

    // Lấy doanh thu của tháng gần nhất trong năm đó
    const latestMonthData = maxMonthData.reduce(
      (latest, item) =>
        new Date(item.Year, item.Month - 1) >
        new Date(latest.Year, latest.Month - 1)
          ? item
          : latest,
      maxMonthData[0]
    );

    return latestMonthData.TotalRevenue; // Trả về tổng doanh thu của tháng gần nhất
  } catch (error) {
    console.error("Error fetching revenue:", error);
    return 0; // Trả về 0 nếu có lỗi
  }
};

// Hàm gọi API để lấy số lượng cửa hàng
const fetchTotalStoresCount = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/total-stores-count"
    );
    return response.data.totalStoresCount || 0; // Trả về số lượng cửa hàng hoặc 0 nếu không có dữ liệu
  } catch (error) {
    console.error("Error fetching total stores count:", error);
    return 0; // Trả về 0 nếu có lỗi
  }
};

// Hàm gọi API để lấy số lượng người dùng
const fetchTotalUsersCount = async () => {
  try {
    const response = await axios.get("http://localhost:8080/total-users");
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

const TopSellingProductsTable = ({ products }) => {
  const [visibleProducts, setVisibleProducts] = useState(products.slice(0, 4));

  useEffect(() => {
    setVisibleProducts(products.slice(0, 4));
  }, [products]);

  const truncateName = (name) => {
    return name.length > 40 ? `${name.slice(0, 40)}...` : name;
  };

  return (
    <div className="table-container">
      <h2 className="table-title">Sản phẩm bán chạy nhất</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Tên sản phẩm</th>
            <th>Hình ảnh</th>
            <th>Giá</th>
            <th>Số lượng bán</th>
            <th>Trạng thái</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {visibleProducts.map((product) => (
            <tr key={product.id}>
              <td >{truncateName(product.name)}</td>
              <td>
                <img
                  src={product.image}
                  alt={product.name}
                  className="productImageClassDa"
                />
              </td>
              <td>{formatCurrencyVND(parseFloat(product.price))}</td>
              <td>{product.sold}</td>
              <td>
                <a href="/profileMarket">
                  <EyeOutlined />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [totalStores, setTotalStores] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRevenueChart, setShowRevenueChart] = useState(false);
  const [showStoresChart, setShowStoresChart] = useState(false);
  const [showUserChart, setShowUserChart] = useState(false);
  const nameStore = sessionStorage.getItem("fullname");
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
      const initialProducts = await fetchInitialProducts();
      const revenue = await fetchRevenueOfMaxMonth(); // Cập nhật hàm gọi API
      const totalStoresCount = await fetchTotalStoresCount();
      const totalUsersCount = await fetchTotalUsersCount();

      setProducts(initialProducts);
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
      <div className="card-container">
        <div className="header">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              {getGreeting()}, {nameStore} 👋
            </h2>
            <p className="text-muted-foreground">
              Đây là những gì đang xảy ra trên cửa hàng của bạn ngày hôm nay.
              Xem số liệu thống kê cùng một lúc.
            </p>
          </div>
          <img
            className="img-header"
            src="https://png.pngtree.com/thumb_back/fh260/background/20231001/pngtree-3d-rendering-of-a-gaming-setup-with-video-game-accessories-image_13547441.png"
            alt=""
          />
        </div>

        <div className="grid-container">
          <CardItem
            title="Doanh thu"
            value={revenue}
            percentage={10}
            isIncrease={true}
            onClick={() => setShowRevenueChart(!showRevenueChart)}
          />
          <CardItem
            title="Số cửa hàng"
            value={totalStores}
            percentage={2}
            isIncrease={true}
            onClick={() => setShowStoresChart(!showStoresChart)}
          />
          <CardItem
            title="Số người dùng"
            value={totalUsers}
            percentage={5}
            isIncrease={true}
          />
        </div>
      </div>

      {showRevenueChart && (
        <div className="chart-container">
          <button
            className="close-button"
            onClick={() => setShowRevenueChart(false)}
          >
            <UilTimes />
          </button>
          <h2 className="chart-title">Biểu đồ Doanh thu</h2>
          <RevenueChart onClose={() => setShowRevenueChart(false)} />
        </div>
      )}

      {showStoresChart && (
        <div className="chart-container">
          <button
            className="close-button"
            onClick={() => setShowStoresChart(false)}
          >
            <UilTimes />
          </button>
          <h2 className="chart-title">Biểu đồ Số cửa hàng mới</h2>
          <StoresChart onClose={() => setShowStoresChart(false)} />
        </div>
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
      <TopSellingProductsTable
        products={products}
        loadMore={fetchMoreProducts}
      />
      <StoreVat></StoreVat>
    </div>
  );
};

export default Dashboard;
