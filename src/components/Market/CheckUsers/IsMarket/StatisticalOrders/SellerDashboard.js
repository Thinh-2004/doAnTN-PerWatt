import React, { useState, useEffect, useContext } from "react";
import Slider from "react-slick";
import Chart from "react-apexcharts";
import axios from "../../../../../Localhost/Custumize-axios";
import { Spin, Modal, Table, DatePicker, Select } from "antd";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SellerDashboard.css";
import { ThemeModeContext } from "../../../../ThemeMode/ThemeModeProvider";
import { Box, Card, CardContent } from "@mui/material";

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
    .format(price)
    .replace("₫", "đ");
};

const fetchOrderData = async (
  idStore,
  setOrders,
  setPendingOrders,
  setProcessedOrders,
  setCompletedOrders,
  setPendingApprovalOrders
) => {
  const ordersResponse = await axios.get(`/count-orders/${idStore}`);
  const ordersData = ordersResponse.data;

  const pending =
    (ordersData &&
      ordersData.find((item) => item.orderStatus === "Chờ giao hàng")?.count) ||
    0;
  const completed =
    (ordersData &&
      ordersData.find((item) => item.orderStatus === "Hoàn thành")?.count) ||
    0;
  const processed =
    (ordersData &&
      ordersData.find((item) => item.orderStatus === "Hủy")?.count) ||
    0;
  const pendingApproval =
    (ordersData &&
      ordersData.find((item) => item.orderStatus === "Đang chờ duyệt")
        ?.count) ||
    0;

  setOrders(pending + completed + processed + pendingApproval);
  setPendingOrders(pending);
  setProcessedOrders(processed);
  setCompletedOrders(completed);
  setPendingApprovalOrders(pendingApproval);
};

const fetchProductData = async (
  idStore,
  setTopProducts,
  setLoadingProducts
) => {
  setLoadingProducts(true);
  try {
    const productsResponse = await axios.get(`/top10-products/${idStore}`);
    const productsData = productsResponse.data;

    const formattedProducts = productsData.map((product) => {
      const calculateRating = (sold) => {
        if (sold >= 1000) return "⭐⭐⭐⭐⭐";
        if (sold >= 500) return "⭐⭐⭐⭐";
        if (sold >= 200) return "⭐⭐⭐";
        if (sold >= 100) return "⭐⭐";
        if (sold >= 50) return "⭐";
        return "";
      };

      const productName = product.productName;
      const productImage = product.imageNameDetail
        ? product.imageNameDetail
        : product.productImage;

      return {
        id: product.productId,
        name: productName,
        price: formatPrice(product.priceDetail),
        sold: product.sold,
        rating: calculateRating(product.sold),
        imgSrc: productImage || "https://via.placeholder.com/100",
      };
    });

    setTopProducts(formattedProducts);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
  } finally {
    setLoadingProducts(false);
  }
};

const fetchChartData = async (
  idStore,
  setRevenueData,
  setPieChartData,
  setMixedChartData,
  dateRange, // Thêm tham số lọc ngày
  selectedQuarter // Thêm tham số lọc quý
) => {
  try {
    let dateQuery = "";

    if (dateRange && dateRange.length === 2) {
      // Đảm bảo rằng ngày có định dạng yyyy-MM-dd
      const startDate = new Date(dateRange[0]).toISOString().split("T")[0]; // Chuyển sang yyyy-MM-dd
      const endDate = new Date(dateRange[1]).toISOString().split("T")[0]; // Chuyển sang yyyy-MM-dd
      dateQuery = `?startDate=${startDate}&endDate=${endDate}`;
    } else if (selectedQuarter) {
      // Xử lý lọc theo quý và chuyển sang định dạng yyyy-MM-dd
      const quarterRanges = {
        1: ["2024-01-01", "2024-03-31"], // Quý 1
        2: ["2024-04-01", "2024-06-30"], // Quý 2
        3: ["2024-07-01", "2024-09-30"], // Quý 3
        4: ["2024-10-01", "2024-12-31"], // Quý 4
      };

      const [start, end] = quarterRanges[selectedQuarter];
      dateQuery = `?startDate=${start}&endDate=${end}`;
    }

    // Gọi API để lấy dữ liệu biểu đồ doanh thu theo năm (hoặc theo ngày/quý nếu có lọc)
    const revenueResponse = await axios.get(
      `http://localhost:8080/revenue/${idStore}?period=year${dateQuery}`
    );
    setRevenueData(
      revenueResponse.data.map((item) => ({
        date: item.date,
        revenue: item.revenue,
      }))
    );

    // Gọi API để lấy dữ liệu biểu đồ dạng bánh (pie chart)
    const pieChartResponse = await axios.get(
      `http://localhost:8080/pie-chart/${idStore}${dateQuery}`
    );
    setPieChartData(pieChartResponse.data);

    // Gọi API để lấy dữ liệu biểu đồ kết hợp (mixed chart)
    const response = await axios.get(
      `http://localhost:8080/mixed-chart/${idStore}${dateQuery}`
    );

    // Nhóm dữ liệu theo tháng với định dạng MM-yyyy
    const groupedData = response.data.reduce((acc, item) => {
      const {
        month,
        productDetailName,
        productName,
        revenue,
        orders,
        totalQuantity,
        totalProductRevenue,
      } = item;

      // Chuyển đổi tháng sang định dạng MM-yyyy
      const formattedMonth =
        month.substring(5, 7) + "-" + month.substring(0, 4); // Lấy MM-yyyy từ yyyy-MM-dd
      //
      const fullDate = new Date(month);
      //
      // Kiểm tra và lưu lại nhóm dữ liệu cho mỗi tháng
      if (!acc[formattedMonth]) {
        acc[formattedMonth] = {
          month: formattedMonth,
          revenue: 0,
          orders: 0,
          totalQuantity: 0,
          totalProductRevenue: 0,
          details: [],
          orderDate: fullDate, // Lưu lại ngày đặt
        };
      }
      //

      // Cộng dồn dữ liệu cho mỗi tháng
      acc[formattedMonth].revenue += revenue;
      acc[formattedMonth].orders += orders;
      acc[formattedMonth].totalQuantity += totalQuantity;
      acc[formattedMonth].totalProductRevenue += totalProductRevenue;

      // Thêm thông tin chi tiết sản phẩm vào mảng details của tháng tương ứng
      acc[formattedMonth].details.push({
        productDetailName: productDetailName || productName, // Dùng productName nếu productDetailName không có
        productName,
        revenue,
        orders,
        totalQuantity,
        totalProductRevenue,
        productDetailId: item.productDetailId,
        productId: item.productId,
        orderDetailId: item.orderDetailId,
        orderDate: fullDate, // Lưu lại ngày đặt cho mỗi chi tiết sản phẩm
      });

      return acc;
    }, {});
    //

    // Chuyển đổi dữ liệu từ object sang mảng
    const chartData = Object.values(groupedData);

    // Cập nhật state mixedChartData
    setMixedChartData(chartData);
  } catch (error) {
    console.error("Error fetching chart data:", error);
  }
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
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedColumnData, setSelectedColumnData] = useState([]);
  const idStore = localStorage.getItem("idStore");
  const nameStore = localStorage.getItem("fullName");
  const { RangePicker } = DatePicker;
  const [dateRange, setDateRange] = useState([]); // Khai báo state cho dateRange
  const [selectedQuarter, setSelectedQuarter] = useState(null);

  const { mode } = useContext(ThemeModeContext);

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      const startDate = dates[0].format("YYYY-MM-DD");
      const endDate = dates[1].format("YYYY-MM-DD");
      setSelectedDateRange([startDate, endDate]);

      // Gọi lại fetchChartData với khoảng ngày
      fetchChartData(
        idStore,
        setRevenueData,
        setPieChartData,
        setMixedChartData,
        [startDate, endDate]
      );
    } else {
      // Nếu không chọn ngày, gọi lại với toàn bộ dữ liệu
      setSelectedDateRange(null);
      fetchChartData(
        idStore,
        setRevenueData,
        setPieChartData,
        setMixedChartData
      );
    }
  };

  const handleQuarterChange = (value) => {
    setSelectedQuarter(value); // Lưu quý người dùng chọn
    fetchChartData(
      idStore,
      setRevenueData,
      setPieChartData,
      setMixedChartData,
      dateRange,
      value
    );
  };
  //
  useEffect(() => {
    // Lấy dữ liệu ban đầu khi không có dải ngày
    fetchChartData(idStore, setRevenueData, setPieChartData, setMixedChartData);
  }, [idStore]);

  //////
  const formatPrice = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };
  //
  const extractOrderDate = (date) => {
    return date.toLocaleDateString("vi-VN"); // Định dạng ngày theo kiểu VN
  };
  //
  const truncateProductName = (name, maxLength = 30) => {
    if (name.length > maxLength) {
      return name.substring(0, maxLength) + "..."; // Cắt tên và thêm dấu "..."
    }
    return name;
  };
  //
  const calculateTotalRevenue = () => {
    return selectedColumnData.reduce((total, item) => total + item.revenue, 0);
  };

  // Hiển thị tổng doanh thu
  const totalRevenue = calculateTotalRevenue();
  ////

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
    autoplaySpeed: 2000,
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
        },
      },
      yaxis: {
        title: {
          text: "Doanh thu (đ)",
        },
        labels: {
          formatter: function (value) {
            return formatPrice(value); // Format revenue values as currency
          },
        },
      },
      tooltip: {
        y: {
          formatter: function (value) {
            return formatPrice(value); // Format tooltip for each point
          },
        },
      },
    },
    series: [
      {
        name: "Doanh thu",
        data: revenueData.map((item) => item.revenue),
      },
    ],
  };

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault(); // Ngừng hành vi mặc định khi chuột phải
    };

    const handleMouseUp = (e) => {
      if (e.button === 2) {
        e.preventDefault(); // Ngừng hành vi mặc định khi thả chuột phải
      }
    };

    // Lắng nghe sự kiện khi chuột phải nhấn xuống và thả ra
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("mouseup", handleMouseUp);

    // Cleanup event listeners khi component bị unmount
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Sắp xếp mixedChartData theo tháng và năm
  mixedChartData.sort((a, b) => {
    // Giả sử a.month và b.month có định dạng "MM-YYYY" (ví dụ: "01-2023")
    const [monthA, yearA] = a.month.split("-").map(Number);
    const [monthB, yearB] = b.month.split("-").map(Number);

    // So sánh năm trước
    if (yearA !== yearB) {
      return yearA - yearB;
    }
    // Nếu năm giống nhau, so sánh tháng
    return monthA - monthB;
  });

  const mixedChartConfig = {
    options: {
      chart: {
        type: "line",
        height: 350,
        events: {
          // Sự kiện khi nhấn chuột phải vào điểm dữ liệu
          dataPointSelection: (event, chartContext, { dataPointIndex }) => {
            // Kiểm tra nếu đây là sự kiện chuột phải (button === 2)
            if (event.button !== 2) {
              return; // Nếu không phải chuột phải, không làm gì
            }

            // Ngừng hiển thị menu chuột phải mặc định
            event.preventDefault();

            // Kiểm tra dữ liệu và chart context
            if (!chartContext || dataPointIndex === undefined) {
              console.error("Chart context or data point index is undefined.");
              return;
            }

            const selectedMonthData = mixedChartData[dataPointIndex];
            if (!selectedMonthData) {
              console.error("No data found for selected point.");
              return;
            }

            // Đảm bảo rằng details tồn tại trước khi cập nhật state
            if (selectedMonthData.details) {
              setSelectedColumnData(selectedMonthData.details); // Cập nhật dữ liệu cho Modal
              setIsModalVisible(true); // Mở modal khi chuột phải vào điểm dữ liệu
            } else {
              console.error("No details available for this month.");
            }
          },

          // Ngừng menu chuột phải mặc định trên toàn bộ biểu đồ
          contextMenu: (event) => {
            event.preventDefault(); // Tắt hoàn toàn menu chuột phải trình duyệt
          },
        },
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
        shared: true,
        intersect: false,
        y: {
          formatter: function (value, { seriesIndex }) {
            return seriesIndex === 0
              ? formatPrice(value) + " đ" // Định dạng tooltip cho doanh thu
              : value + " đơn hàng"; // Định dạng tooltip cho số lượng đơn hàng
          },
          title: {
            formatter: (seriesName) => `${seriesName}:`,
          },
          style: {
            color: mode === "light" ? "#333" : "#fff", // Màu chữ tooltip giá trị Y
          },
        },
        legend: {
          labels: {
            colors: mode === "light" ? "#333" : "#fff", // Màu chữ cho nhãn series trong legend
          },
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
      className="sellerDashboardClass"
    >
      <div className="header">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            {getGreeting()}, {nameStore} 👋
          </h2>
          <p className="text-muted-foreground">
            Đây là những gì đang xảy ra trên cửa hàng của bạn ngày hôm nay. Xem
            số liệu thống kê cùng một lúc.
          </p>
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

      <div>
        <RangePicker
          onChange={handleDateChange}
          format="YYYY-MM-DD"
          style={{
            marginBottom: "20px",
            backgroundColor: mode === "light" ? "white" : "#363535",
          }}
        />
        <Select
          defaultValue={null}
          onChange={handleQuarterChange}
          style={{
            marginBottom: "20px",
            backgroundColor: mode === "light" ? "white" : "#363535",
          }}
          className="selectClass"
        >
          <Select.Option value={0}>Quý</Select.Option>
          <Select.Option value={1}>Quý 1</Select.Option>
          <Select.Option value={2}>Quý 2</Select.Option>
          <Select.Option value={3}>Quý 3</Select.Option>
          <Select.Option value={4}>Quý 4</Select.Option>
        </Select>
        <div
          className="mixedChartClass"
          onContextMenu={(e) => e.preventDefault()} // Ngăn menu chuột phải mặc định
        >
          <Chart
            options={mixedChartConfig.options}
            series={mixedChartConfig.series}
            type="line"
            height={350}
          />
        </div>
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
              <Card>
                <CardContent key={product.id} className="">
                  <img
                    src={product.imgSrc}
                    alt={product.name}
                    className="productImageClass"
                  />
                  <h3 className="productNameClass">{product.name}</h3>
                  <p className="productPriceClass text-danger">
                    {product.price}
                  </p>
                  <p className="productSoldClass">Đã bán: {product.sold}</p>
                  <p className="productRatingClass">{product.rating}</p>
                </CardContent>
              </Card>
            ))}
          </Slider>
        )}
      </div>

      <Modal
        title="Chi tiết sản phẩm đã đặt"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <div key="footer" style={{ textAlign: "right", fontWeight: "bold" }}>
            <span>Tổng doanh thu: </span>
            <span>{formatPrice(totalRevenue)}</span>{" "}
            {/* Sử dụng hàm formatPrice nếu có */}
          </div>,
        ]}
      >
        <Table
          dataSource={selectedColumnData}
          columns={[
            {
              title: "Tên sản phẩm",
              dataIndex: "productDetailName",
              key: "productDetailName",
              render: (value) => truncateProductName(value), // Hàm cắt ngắn tên sản phẩm
            },
            {
              title: "Ngày đặt",
              dataIndex: "orderDate", // Sử dụng orderDate trong chi tiết
              key: "orderDate",
              render: (value) => extractOrderDate(new Date(value)), // Chuyển đổi giá trị ngày
            },
            {
              title: "Số lượng đã bán",
              dataIndex: "totalQuantity",
              key: "totalQuantity",
            },
            {
              title: "Doanh thu",
              dataIndex: "revenue",
              key: "revenue",
              render: (value) => formatPrice(value), // Format doanh thu
            },
          ]}
          rowKey="orderDetailId"
        />
      </Modal>
    </Box>
  );
};

export default SellerDashboard;
