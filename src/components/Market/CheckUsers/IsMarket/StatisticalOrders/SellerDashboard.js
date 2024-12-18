import React, { useState, useEffect, useContext } from "react";
import Chart from "react-apexcharts";
import { useInView } from "react-intersection-observer";
import axios from "../../../../../Localhost/Custumize-axios";
import { Spin, Modal, Table, DatePicker, Select, Pagination } from "antd";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SellerDashboard.css";
import { ThemeModeContext } from "../../../../ThemeMode/ThemeModeProvider";
import { Box, CardContent } from "@mui/material";
import { Link } from "react-router-dom";

const formatPrice = (value) => {
  if (value) {
    // Chuyển giá trị thành kiểu số thực
    const numberValue = parseFloat(value);

    // Đảm bảo không làm tròn và giữ hết chữ số thập phân
    const formattedValue = numberValue.toFixed(2); // Giữ 2 chữ số thập phân (bạn có thể thay đổi số lượng chữ số thập phân)

    // Định dạng số với dấu phân cách hàng nghìn và không làm tròn, thêm "đ" vào sau
    return parseFloat(formattedValue).toLocaleString("vi-VN") + " đ";
  }
  return "";
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
        slugProduct: product.slugProduct,
      };
    });

    setTopProducts(formattedProducts);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
  } finally {
    setLoadingProducts(false);
  }
};

const columns = [
  {
    title: "Hình ảnh",
    dataIndex: "imgSrc",
    key: "imgSrc",
    render: (imgSrc, record) => (
      <Link to={`/detailProduct/${record.slugProduct}`}>
        <img
          src={imgSrc}
          alt={record.name}
          className="productImageClass"
          style={{ width: "50px", height: "auto" }}
        />
      </Link>
    ),
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "name",
    key: "name",
  },

  {
    title: "Giá",
    dataIndex: "price",
    key: "price",
    render: (price) => <p className="text-dark">{price}</p>,
  },

  {
    title: "Đã bán",
    dataIndex: "sold",
    key: "sold",
    render: (sold) => <p className="productSoldClass">Đã bán: {sold}</p>,
  },
];

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
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const { RangePicker } = DatePicker;
  const [dateRange, setDateRange] = useState([]); // Khai báo state cho dateRange
  const [selectedQuarter, setSelectedQuarter] = useState(null);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Số lượng sản phẩm mỗi trang
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPageProducts, setCurrentPageProducts] = useState([]);

  useEffect(() => {
    // Cập nhật sản phẩm hiển thị khi chuyển trang
    const updatedProducts = topProducts.slice(startIndex, endIndex);
    setCurrentPageProducts(updatedProducts);
  }, [currentPage, topProducts]);

  // Tính toán chỉ số bắt đầu và kết thúc của sản phẩm trong trang hiện tại
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = currentPage * pageSize;
  const productsToShow = topProducts.slice(startIndex, endIndex);
  const { mode } = useContext(ThemeModeContext);
  const handleYearChange = (year) => {
    setSelectedYear(year); // Lưu trữ năm đã chọn
    fetchChartData(
      idStore,
      setRevenueData,
      setPieChartData,
      setMixedChartData,
      dateRange,
      selectedQuarter,
      year
    );
  };

  const fetchChartData = async (
    idStore,
    setRevenueData,
    setPieChartData,
    setMixedChartData,
    dateRange,
    selectedQuarter,
    selectedYear = currentYear // Mặc định là năm hiện tại
  ) => {
    try {
      let dateQuery = "";

      // Kiểm tra trường hợp lọc theo khoảng thời gian (dateRange)
      if (dateRange && dateRange.length === 2) {
        const startDate = new Date(dateRange[0]).toISOString().split("T")[0];
        const endDate = new Date(dateRange[1]).toISOString().split("T")[0];
        dateQuery = `?startDate=${startDate}&endDate=${endDate}`;
      } else if (selectedQuarter && selectedQuarter !== 0) {
        // Xử lý lọc theo quý khi selectedQuarter không phải là 0
        const quarterRanges = {
          1: [`${selectedYear}-01-01`, `${selectedYear}-03-31`],
          2: [`${selectedYear}-04-01`, `${selectedYear}-06-30`],
          3: [`${selectedYear}-07-01`, `${selectedYear}-09-30`],
          4: [`${selectedYear}-10-01`, `${selectedYear}-12-31`],
        };

        // Chọn khoảng thời gian của quý
        const selectedRange =
          quarterRanges[selectedQuarter] || quarterRanges[1];
        const [start, end] = selectedRange;
        dateQuery = `?startDate=${start}&endDate=${end}`;
      } else if (selectedQuarter === 0) {
        // Nếu quý là 0, không lọc theo quý mà chỉ trả về dữ liệu của năm hiện tại
        dateQuery = `?startDate=${selectedYear}-01-01&endDate=${selectedYear}-12-31`;
      } else {
        // Nếu không có giá trị filter quý hoặc ngày, trả về toàn bộ năm hiện tại
        dateQuery = `?startDate=${selectedYear}-01-01&endDate=${selectedYear}-12-31`;
      }

      // Lấy dữ liệu doanh thu
      const revenueResponse = await axios.get(
        `http://localhost:8080/revenue/${idStore}?period=year${dateQuery}`
      );

      // Gộp dữ liệu có cùng năm
      const groupedRevenueData = revenueResponse.data.reduce((acc, item) => {
        // Kiểm tra nếu năm đã tồn tại trong acc, thì cộng dồn revenue
        const existingItem = acc.find((entry) => entry.date === item.date);
        if (existingItem) {
          existingItem.revenue += item.revenue;
        } else {
          acc.push({
            date: item.date,
            revenue: item.revenue,
          });
        }
        return acc;
      }, []);

      // Cập nhật dữ liệu sau khi gộp
      setRevenueData(groupedRevenueData);

      // Lấy dữ liệu biểu đồ tròn (Pie Chart)
      const pieChartResponse = await axios.get(
        `http://localhost:8080/pie-chart/${idStore}${dateQuery}`
      );
      setPieChartData(pieChartResponse.data);

      // Lấy dữ liệu biểu đồ kết hợp (Mixed Chart)
      const response = await axios.get(
        `http://localhost:8080/mixed-chart/${idStore}${dateQuery}`
      );

      const groupedData = response.data.reduce((acc, item) => {
        const {
          month,
          productDetailName,
          productName,
          revenue,
          orders,
          totalQuantity,
          totalProductRevenue,
          voucherAdminId,
          voucherId, // Lấy voucherId
          discountPrice, // Lấy discountPrice (Số nguyên, ví dụ: 10 -> giảm 10%)
          productVAT,
        } = item;

        // Log voucherId và discountPrice
        console.log("voucherId:", voucherId);
        console.log("discountPrice:", discountPrice);

        const formattedMonth =
          month.substring(5, 7) + "-" + month.substring(0, 4);
        const fullDate = new Date(month);

        if (!acc[formattedMonth]) {
          acc[formattedMonth] = {
            month: formattedMonth,
            revenue: 0,
            orders: 0,
            totalQuantity: 0,
            totalProductRevenue: 0,
            details: [],
            orderDate: fullDate,
            voucherDiscount: 0, // Cột riêng cho giá trị giảm giá từ voucherId
          };
        }

        let calculatedTotalProductRevenue = totalQuantity * totalProductRevenue; // Doanh thu gốc
        let finalRevenue = calculatedTotalProductRevenue;
        let voucherDiscount = 0; // Cột riêng cho voucher discount

        // Áp dụng giảm giá nếu có voucher
        if (voucherId) {
          // Giảm giá từ discountPrice (Giả sử discountPrice là phần trăm giảm giá)
          voucherDiscount =
            calculatedTotalProductRevenue * (discountPrice / 100); // Ghi nhận giá trị giảm giá từ voucherId
          finalRevenue -= voucherDiscount; // Giảm doanh thu sau khi áp dụng voucher discount
        } else if (voucherAdminId) {
          // Áp dụng tỷ lệ giảm giá nếu voucherAdminId có giá trị
          finalRevenue -= finalRevenue * 0.01;
        }

        // Áp dụng VAT sau khi đã giảm giá
        finalRevenue -= finalRevenue * productVAT;

        // Doanh thu bị triết khấu: Sự khác biệt giữa doanh thu gốc và doanh thu sau khi đã trừ voucher discount
        let discountedRevenue =
          calculatedTotalProductRevenue - finalRevenue - voucherDiscount;

        console.log("Doanh thu gốc:", calculatedTotalProductRevenue);
        console.log("Doanh thu sau triết khấu:", finalRevenue);
        console.log("Doanh thu bị triết khấu:", discountedRevenue);
        console.log("Giảm giá từ voucherId:", voucherDiscount); // Log riêng cho giảm giá từ voucherId

        acc[formattedMonth].revenue += finalRevenue;
        acc[formattedMonth].orders += orders;
        acc[formattedMonth].totalQuantity += totalQuantity;
        acc[formattedMonth].totalProductRevenue +=
          calculatedTotalProductRevenue;

        // Thêm giá trị giảm giá từ voucherId vào cột riêng
        acc[formattedMonth].voucherDiscount += voucherDiscount;

        acc[formattedMonth].details.push({
          productDetailName: productDetailName || productName,
          productName,
          revenue: finalRevenue,
          orders,
          totalQuantity,
          totalProductRevenue: calculatedTotalProductRevenue,
          discountedRevenue, // Thêm discountedRevenue vào đây
          voucherDiscount, // Thêm giá trị giảm giá từ voucherId vào chi tiết
          productDetailId: item.productDetailId,
          productId: item.productId,
          orderDetailId: item.orderDetailId,
          orderDate: fullDate,
        });

        return acc;
      }, {});

      let chartData = Object.values(groupedData);

      // Nếu không có dateRange và selectedQuarter, lọc dữ liệu theo năm hiện tại
      if (!dateRange && selectedQuarter === 0) {
        chartData = chartData.filter((item) => {
          const itemYear = new Date(item.orderDate).getFullYear();
          return itemYear === selectedYear; // Sử dụng selectedYear thay vì currentYear
        });
      }

      // Log tổng doanh thu cho mỗi năm
      const totalRevenueByYear = chartData.reduce((acc, item) => {
        const year = new Date(item.orderDate).getFullYear();
        if (!acc[year]) {
          acc[year] = 0;
        }
        acc[year] += item.revenue;
        return acc;
      }, {});

      console.log("Tổng doanh thu theo từng năm:", totalRevenueByYear);

      setMixedChartData(chartData);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

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

  const handleQuarterChange = (quarter) => {
    setSelectedQuarter(quarter); // Lưu trữ quý đã chọn
    fetchChartData(
      idStore,
      setRevenueData,
      setPieChartData,
      setMixedChartData,
      dateRange,
      quarter,
      selectedYear
    );
  };
  //
  useEffect(() => {
    // Lấy dữ liệu ban đầu khi không có dải ngày
    fetchChartData(idStore, setRevenueData, setPieChartData, setMixedChartData);
  }, [idStore]);

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

  const calculateTotalProductRevenue = () => {
    return selectedColumnData.reduce(
      (total, item) => total + item.totalProductRevenue,
      0
    );
  };

  const calculateTotalDiscountedRevenue = () => {
    return selectedColumnData.reduce(
      (total, item) => total + item.discountedRevenue,
      0
    );
  };

  // Tính tổng doanh thu gốc, sau triết khấu và doanh thu bị triết khấu
  const totalRevenue = calculateTotalRevenue();
  const totalProductRevenue = calculateTotalProductRevenue();
  const totalDiscountedRevenue = calculateTotalDiscountedRevenue();
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
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          })
            .format(val)
            .replace("₫", "đ");
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
            formatter: function (value) {
              return value; // Chắc chắn giá trị được hiển thị đúng
            },
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
              ? formatPrice(value) // Định dạng tooltip cho doanh thu
              : value + " đơn hàng"; // Định dạng tooltip cho số lượng đơn hàng
          },
          title: {
            formatter: (seriesName) => `${seriesName}:`,
          },
          style: {
            color: mode === "light" ? "#333" : "#fff", // Màu chữ tooltip giá trị Y
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

  const handleSort = () => {
    const sortedProducts = [...productsToShow].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.sold - b.sold;
      }
      return b.sold - a.sold;
    });
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    // Cập nhật lại danh sách hiển thị
    setCurrentPageProducts(sortedProducts);
  };

  const { ref, inView } = useInView({
    triggerOnce: true, // Hiệu ứng chỉ kích hoạt 1 lần
    threshold: 0.1, // Kích hoạt khi phần tử xuất hiện 10% trên màn hình
  });
  // Hàm thay đổi trang
  const onPageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <Box
      sx={{ backgroundColor: "backgroundElement.children" }}
      className="sellerDashboardClass"
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
        <div className="chartsContainer"></div>
      </div>
      <div className="areaChartClass">
        <Chart
          options={defaultChartData.options}
          series={defaultChartData.series}
          type="bar"
          height={350}
        />
      </div>
      <div>
        <RangePicker
          onChange={handleDateChange}
          format="YYYY-MM-DD"
          style={{
            margin: "5px",
            marginBottom: "20px",
            backgroundColor: mode === "light" ? "white" : "#363535",
          }}
        />
        <Select
          defaultValue={currentYear}
          onChange={(value) => handleYearChange(value)}
          style={{
            margin: "5px",
            marginBottom: "20px",
            backgroundColor: mode === "light" ? "white" : "#363535",
          }}
          className="selectClass"
        >
          {[...Array(2)].map((_, index) => {
            const year = currentYear - index;
            return (
              <Select.Option key={year} value={year}>
                {year}
              </Select.Option>
            );
          })}
        </Select>

        <Select
          value={selectedQuarter}
          onChange={handleQuarterChange}
          style={{
            margin: "5px",
            marginBottom: "20px",
            backgroundColor: mode === "light" ? "white" : "#363535",
          }}
          className="selectClass"
        >
          <Select.Option value={0}>Toàn bộ năm</Select.Option>
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

      <div>
        <h3 className="">Sản phẩm bán chạy</h3>
        {loadingProducts ? (
          <Spin spinning tip="Đang tải sản phẩm...">
            <div style={{ minHeight: "200px" }}></div>
          </Spin>
        ) : topProducts.length === 0 ? (
          <Spin spinning tip="Không có sản phẩm">
            <div style={{ minHeight: "200px" }}></div>
          </Spin>
        ) : (
          <Table
            columns={columns}
            dataSource={currentPageProducts}
            rowKey="id"
            pagination={false}
          />
        )}

        {/* Phân trang */}
        <Pagination
          current={currentPage}
          total={topProducts.length}
          pageSize={pageSize}
          onChange={onPageChange}
          showSizeChanger={false}
          style={{ textAlign: "center", marginTop: "20px" }}
        />
      </div>

      <Modal
        title="Chi tiết sản phẩm đã đặt"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <div key="footer" style={{ textAlign: "right", fontWeight: "bold" }}>
            <div>
              <span>Tổng doanh thu gốc: </span>
              <span>{formatPrice(totalProductRevenue)}</span>
            </div>
            <div>
              <span>Tổng doanh thu bị triết khấu: </span>
              <span>{formatPrice(totalDiscountedRevenue)}</span>
            </div>
            <div>
              <span>Tổng doanh thu sau triết khấu: </span>
              <span>{formatPrice(totalRevenue)}</span>
            </div>
          </div>,
        ]}
        width={900} // Điều chỉnh chiều rộng của modal
      >
        <Table
          dataSource={selectedColumnData}
          columns={[
            {
              title: "Tên sản phẩm",
              dataIndex: "productDetailName",
              key: "productDetailName",
              render: (value) => truncateProductName(value),
            },
            {
              title: "Ngày đặt",
              dataIndex: "orderDate",
              key: "orderDate",
              render: (value) => extractOrderDate(new Date(value)),
            },
            {
              title: "Số lượng đã bán",
              dataIndex: "totalQuantity",
              key: "totalQuantity",
            },
            {
              title: "Doanh thu gốc",
              dataIndex: "totalProductRevenue",
              key: "totalProductRevenue",
              render: (value) => formatPrice(value),
            },
            {
              title: "Doanh thu sau triết khấu",
              dataIndex: "revenue",
              key: "revenue",
              render: (value) => formatPrice(value),
            },
            {
              title: "Doanh thu bị triết khấu",
              dataIndex: "discountedRevenue", // Cột này hiển thị doanh thu bị triết khấu
              key: "discountedRevenue",
              render: (value) => formatPrice(value),
            },
            {
              title: "Giảm giá từ Voucher", // Cột mới cho giảm giá từ voucherId
              dataIndex: "voucherDiscount", // Dữ liệu từ voucherDiscount
              key: "voucherDiscount",
              render: (value) => formatPrice(value), // Hiển thị giá trị giảm giá từ voucher
            },
          ]}
          rowKey="orderDetailId"
        />
      </Modal>
    </Box>
  );
};

export default SellerDashboard;
