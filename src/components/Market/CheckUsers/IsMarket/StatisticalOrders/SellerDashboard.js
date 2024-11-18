import React, { useState, useEffect, useContext } from "react";
import Slider from "react-slick";
import Chart from "react-apexcharts";
import axios from "axios";
import { Spin } from "antd";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SellerDashboard.css";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { ThemeModeContext } from "../../../../ThemeMode/ThemeModeProvider";
import { Link } from "react-router-dom";

// Format currency to VND
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
    .format(price)
    .replace("₫", "đ");
};

// Fetch Order Data
const fetchOrderData = async (
  idStore,
  setOrders,
  setPendingOrders,
  setProcessedOrders,
  setCompletedOrders,
  setPendingApprovalOrders
) => {
  const ordersResponse = await axios.get(
    `http://localhost:8080/count-orders/${idStore}`
  );
  const ordersData = ordersResponse.data;

  const pending =
    ordersData.find((item) => item.orderStatus === "Chờ giao hàng")?.count || 0;
  const completed =
    ordersData.find((item) => item.orderStatus === "Hoàn thành")?.count || 0;
  const processed =
    ordersData.find((item) => item.orderStatus === "Hủy")?.count || 0;
  const pendingApproval =
    ordersData.find((item) => item.orderStatus === "Đang chờ duyệt")?.count ||
    0;

  setOrders(pending + completed + processed + pendingApproval);
  setPendingOrders(pending);
  setProcessedOrders(processed);
  setCompletedOrders(completed);
  setPendingApprovalOrders(pendingApproval);
};

// Fetch Product Data
const fetchProductData = async (
  idStore,
  setTopProducts,
  setLoadingProducts
) => {
  setLoadingProducts(true);
  try {
    const productsResponse = await axios.get(
      `http://localhost:8080/top10-products/${idStore}`
    );
    const productsData = productsResponse.data;
    // console.log(productsResponse.data);

    const formattedProducts = productsData.map((product) => {
      const calculateRating = (sold) => {
        if (sold >= 1000) return "⭐⭐⭐⭐⭐";
        if (sold >= 500) return "⭐⭐⭐⭐";
        if (sold >= 200) return "⭐⭐⭐";
        if (sold >= 100) return "⭐⭐";
        if (sold >= 50) return "⭐";
        return "";
      };

      // Kiểm tra nếu không có nameDetail thì dùng productName, nếu không có imageNameDetail thì dùng productImage
      const productName = product.productName;
      const productImage = product.imageNameDetail
        ? `http://localhost:8080/files/detailProduct/${product.productDetailId}/${product.imageNameDetail}`
        : `http://localhost:8080/files/product-images/${product.productId}/${product.productImage}`;

      return {
        id: product.productId,
        name: productName,
        price: formatPrice(product.priceDetail),
        sold: product.sold,
        rating: calculateRating(product.sold),
        imgSrc: productImage || "https://via.placeholder.com/100",
        slugProduct : product.slugProduct
      };
    });

    setTopProducts(formattedProducts);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
  } finally {
    setLoadingProducts(false);
  }
};

// Fetch Revenue and Chart Data
const fetchChartData = async (
  idStore,
  setRevenueData,
  setPieChartData,
  setMixedChartData
) => {
  const revenueResponse = await axios.get(
    `http://localhost:8080/revenue/${idStore}?period=year`
  );
  setRevenueData(
    revenueResponse.data.map((item) => ({
      date: item.date,
      revenue: item.revenue,
    }))
  );

  const pieChartResponse = await axios.get(
    `http://localhost:8080/pie-chart/${idStore}`
  );
  setPieChartData(pieChartResponse.data);
  // console.log(pieChartResponse.data);

  const mixedChartResponse = await axios.get(
    `http://localhost:8080/mixed-chart/${idStore}`
  );
  setMixedChartData(mixedChartResponse.data);
};

const SellerDashboard = () => {
  const [orders, setOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [processedOrders, setProcessedOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [pendingApprovalOrders, setPendingApprovalOrders] = useState(0);
  const [topProducts, setTopProducts] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [mixedChartData, setMixedChartData] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const idStore = localStorage.getItem("idStore");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const { mode } = useContext(ThemeModeContext);

  useEffect(() => {
    if (!idStore) {
      console.error("Store ID is missing");
      return;
    }
    fetchOrderData(
      idStore,
      setOrders,
      setPendingOrders,
      setProcessedOrders,
      setCompletedOrders,
      setPendingApprovalOrders
    );
    fetchProductData(idStore, setTopProducts, setLoadingProducts);
    fetchChartData(idStore, setRevenueData, setPieChartData, setMixedChartData);
  }, [idStore]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    return hour < 12
      ? "Chào buổi sáng"
      : hour < 18
      ? "Chào buổi chiều"
      : "Chào buổi tối";
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
    arrows: true,
    centerMode: true,
    centerPadding: "10px",
  };

  const defaultChartData = {
    options: {
      chart: { id: "areaChart" },
      xaxis: {
        categories: revenueData.map((item) => item.date),
        title: {
          text: "Thời gian", // Title for the x-axis (optional)
          style: {
            color: mode === "light" ? "black" : "white",
          },
        },
        labels: {
          style: {
            colors: mode === "light" ? "black" : "white",
          },
        },
      },
      yaxis: {
        title: {
          text: "Doanh thu (đ)",
          style: {
            color: mode === "light" ? "black" : "white",
          },
        },
        labels: {
          formatter: function (value) {
            return formatPrice(value); // Format revenue values as currency
          },
          style: {
            colors: mode === "light" ? "black" : "white",
          },
        },
      },
      tooltip: {
        enabled: true,
        style: {
          fontSize: "12px", // Font size of tooltip
          fontFamily: "Arial, sans-serif",
        },
        onDatasetHover: {
          highlightDataSeries: true, // Highlight the data series when hovered
        },
        marker: {
          show: true, // Show marker on tooltip
          fillColors: mode === "light" ? "#000" : "#fff", // Change marker color on hover
        },
        x: {
          show: true, // Show value on the x-axis
        },
        y: {
          title: {
            formatter: (seriesName) => `${seriesName}:`,
          },
          formatter: function (value) {
            return formatPrice(value); // Format tooltip for each point
          },
          style: {
            colors: mode === "light" ? "#333" : "#fff", // Tooltip Y value color
          },
        },
        theme: mode === "light" ? "light" : "dark", // Theme for the tooltip
      },
      legend: {
        position: "top",
        horizontalAlign: "center",
        floating: true,
      },
    },
    series: [
      {
        name: "Doanh thu",
        data: revenueData.map((item) => item.revenue),
      },
    ],
  };

  const mixedChartConfig = {
    options: {
      chart: {
        type: "line",
        height: 350,
      },
      stroke: {
        width: [0, 4],
      },
      title: {
        text: "Doanh thu và số lượng đơn hàng theo tháng",
        style: {
          color: mode === "light" ? "#333" : "#fff", // Màu chữ tiêu đề
        },
      },
      xaxis: {
        categories: mixedChartData.map((item) => item.month),
        title: {
          text: "Tháng",
          style: {
            color: mode === "light" ? "#333" : "#fff", // Màu chữ trục X
          },
        },
        labels: {
          style: {
            colors: mode === "light" ? "black" : "white", // Màu chữ nhãn trục X
          },
        },
      },
      yaxis: [
        {
          title: {
            text: "Doanh thu (đ)",
            style: {
              color: mode === "light" ? "#333" : "#fff", // Màu chữ trục Y đầu tiên
            },
          },
          labels: {
            formatter: function (value) {
              return formatPrice(value); // Định dạng giá trị doanh thu
            },
            style: {
              colors: mode === "light" ? "#333" : "#fff", // Màu chữ nhãn trục Y đầu tiên
            },
          },
        },
        {
          opposite: true,
          title: {
            text: "Số lượng đơn hàng",
            style: {
              color: mode === "light" ? "#333" : "#fff", // Màu chữ trục Y thứ hai
            },
          },
          labels: {
            style: {
              colors: mode === "light" ? "black" : "white", // Màu chữ nhãn trục Y thứ hai
            },
          },
        },
      ],
      tooltip: {
        theme: mode === "light" ? "light" : "dark", // Chủ đề tooltip
        y: {
          title: {
            formatter: (seriesName) => `${seriesName}:`,
          },
          style: {
            color: mode === "light" ? "#333" : "#fff", // Màu chữ tooltip giá trị Y
          },
        },
      },
      legend: {
        labels: {
          colors: mode === "light" ? "#333" : "#fff", // Màu chữ cho nhãn series trong legend
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: "12px",
          fontWeight: "bold",
        },
      },
    },
    series: [
      {
        name: "Doanh thu",
        type: "column",
        data: mixedChartData.map((item) => item.revenue),
      },
      {
        name: "Số lượng đơn hàng",
        type: "line",
        data: mixedChartData.map((item) => item.orders),
      },
    ],
  };

  return (
    <Box
      sx={{ backgroundColor: "backgroundElement.children" }}
      className="sellerDashboardClass rounded-3"
    >
      <div className="header">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            {getGreeting()}, {user.fullname} 👋
          </h2>
          <p className="text-muted-foreground">
            Đây là những gì đang xảy ra trên cửa hàng của bạn ngày hôm nay. Xem
            số liệu thống kê cùng một lúc.
          </p>
        </div>
        <div className="notificationWrapperClass">
          <button className="buttonClass">🔔</button>
        </div>
      </div>

      <div className="gridContainerClass">
        <div className="orderCardClass">
          <h2 className="orderNumberClass">{orders}</h2>
          <p>Tổng đơn hàng</p>
        </div>
        <div className="pendingCardClass">
          <h2 className="orderNumberClass">{pendingOrders}</h2>
          <p>Chờ giao hàng</p>
        </div>
        <div className="pendingApprovalCardClass">
          <h2 className="orderNumberClass">{pendingApprovalOrders}</h2>
          <p>Đang chờ duyệt</p>
        </div>
        <div className="processedCardClass">
          <h2 className="orderNumberClass">{processedOrders}</h2>
          <p>Hủy</p>
        </div>
        <div className="completedCardClass">
          <h2 className="orderNumberClass">{completedOrders}</h2>
          <p>Hoàn thành</p>
        </div>
      </div>

      <div className="salesStatisticsClass">
        <div className="chartsContainer">
          <div className="areaChartClass">
            <Chart
              options={defaultChartData.options}
              series={defaultChartData.series}
              type="area"
              height={350}
            />
          </div>
          <div className="pieChartClass">
            <Chart
              options={{
                labels: pieChartData.map((item) =>
                  item.products.namedetail
                    ? item.products.namedetail.length > 20
                      ? item.products.namedetail.slice(0, 20) + "..."
                      : item.products.namedetail
                    : item.products.product.name.length > 20
                    ? item.products.product.name.slice(0, 20) + "..."
                    : item.products.product.name
                ),
                title: {
                  text: "Phân bổ doanh thu sản phẩm",
                  style: {
                    color: mode === "light" ? "black" : "white", // Title color based on mode
                  },
                },
                tooltip: {
                  y: {
                    formatter: function (value, { seriesIndex }) {
                      const productValue = pieChartData[seriesIndex].value;
                      return `${formatPrice(productValue)}`; // Format price for each product
                    },
                  },
                },
                legend: {
                  labels: {
                    colors: mode === "light" ? "black" : "white", // Change label color for legend
                  },
                },
                dataLabels: {
                  style: {
                    fontSize: "14px", // Adjust font size if needed
                    fontWeight: "bold", // Optional: Set font weight
                    colors: [mode === "light" ? "black" : "white"], // Change label text color
                  },
                },
              }}
              series={pieChartData.map((item) => item.value)} // Data values for the pie chart
              type="pie"
              height={350}
            />
          </div>
        </div>
      </div>

      <div className="mixedChartClass">
        <Chart
          options={mixedChartConfig.options}
          series={mixedChartConfig.series}
          type="line"
          height={350}
        />
      </div>

      <div className="topProductsClass">
        <h3 className="sectionTitleClass">Sản phẩm bán chạy</h3>
        {loadingProducts ? (
          <Spin spinning tip="Đang tải sản phẩm...">
            <div style={{ minHeight: "200px" }}></div>
          </Spin>
        ) : topProducts.length === 0 ? (
          <Spin spinning tip="Không có sản phẩm">
            <div style={{ minHeight: "200px" }}></div>
          </Spin>
        ) : (
          <Slider {...sliderSettings}>
            {topProducts.map((product) => (
              <Link to={`/detailProduct/${product.slugProduct}`}>
                <Card key={product.id} className="productCardClass rounded-3" sx={{backgroundColor :"backgroundElement.children"}}>
                  <CardContent>
                    <img
                      src={product.imgSrc}
                      alt={product.name}
                      className="productImageClass"
                    />
                    <h3 className="productNameClass">{product.name}</h3>
                    <span className="productPriceClass text-danger">
                      {product.price}
                    </span>
                    <br />
                    <span className="productSoldClass">
                      Đã bán: {product.sold}
                    </span>
                    <span className="productRatingClass">{product.rating}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </Slider>
        )}
      </div>
    </Box>
  );
};

export default SellerDashboard;
