import React, { useState, useEffect, useContext } from "react";
import ApexCharts from "react-apexcharts";
import "./RevenueChart.css"; // Import the CSS file
import { FormControl, MenuItem, Select } from "@mui/material";
import { ThemeModeContext } from "../../components/ThemeMode/ThemeModeProvider";

const RevenueChart = () => {
  const currentYear = new Date().getFullYear();
  const { mode } = useContext(ThemeModeContext);

  const [chartData, setChartData] = useState({
    options: {
      chart: {
        type: "area", // Đổi kiểu biểu đồ thành 'area'
        height: 350,
      },
      title: {
        text: `Doanh thu theo năm ${currentYear}`,
        align: "left",
        style: {
          color: mode === "light" ? "black" : "white",
        },
      },
      xaxis: {
        categories: [], // Categories will be updated based on the selected period
        labels: {
          style: {
            colors: mode === "light" ? "black" : "white",
          },
        },
      },
      yaxis: {
        title: {
          text: "Doanh thu (VND)",
          style: {
            color: mode === "light" ? "black" : "white",
          },
        },
        labels: {
          formatter: function (value) {
            return new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(value);
          },
          style: {
            colors: mode === "light" ? "black" : "white",
          },
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "center",
        floating: true,
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
        enabled: true,
        style: {
          fontSize: "12px", // Kích thước font của tooltip
          fontFamily: "Arial, sans-serif",
        },
        onDatasetHover: {
          highlightDataSeries: true, // Để làm nổi bật series khi hover
        },
        marker: {
          show: true, // Hiển thị biểu tượng marker trên tooltip
        },
        theme: mode === "light" ? "light" : "dark", // Chọn theme cho tooltip
        x: {
          show: true, // Hiển thị giá trị trục X
        },
        y: {
          title: {
            formatter: (seriesName) => `${seriesName}:`,
          },
          formatter: (value) => {
            return new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(value);
          },
          style: {
            colors: mode === "light" ? "#333" : "#fff", // Màu sắc của giá trị y trong tooltip
          },
        },
        marker: {
          show: true, // Hiển thị marker trong tooltip
          fillColors: mode === "light" ? "#000" : "#fff", // Màu marker khi hover
        },
      },
    },
    series: [
      {
        name: "Doanh thu",
        data: [], // Data will be updated based on the selected period
      },
    ],
  });

  const [revenueByYear, setRevenueByYear] = useState({});
  const [revenueByMonth, setRevenueByMonth] = useState([]);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [yearsList, setYearsList] = useState([]);
  const [maxYear, setMaxYear] = useState(currentYear);

  // Hàm gọi API để lấy dữ liệu doanh thu
  const fetchRevenueData = async (period) => {
    let url;
    switch (period) {
      case "year":
        url = "http://localhost:8080/revenue-by-year";
        break;
      case "month":
        url = "http://localhost:8080/revenue-by-month";
        break;
      case "day":
        url = "http://localhost:8080/revenue-by-day";
        break;
      default:
        return;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (period === "year") {
        const yearData = {};
        const years = new Set();
        data.forEach((item) => {
          yearData[item.Year] = item.TotalRevenue;
          years.add(item.Year);
        });
        const yearsArray = [...years];
        setRevenueByYear(yearData);
        setYearsList(yearsArray); // Cập nhật danh sách năm để chọn
        const maxYear = Math.max(...yearsArray);
        setMaxYear(maxYear); // Lưu năm lớn nhất
        setSelectedYear(maxYear); // Cập nhật năm đã chọn

        // Cập nhật dữ liệu biểu đồ cho tất cả các năm
        setChartData({
          options: {
            ...chartData.options,
            xaxis: { categories: Object.keys(yearData) },
            title: { text: "Doanh thu tất cả các năm" }, // Cập nhật tiêu đề
          },
          series: [
            {
              name: "Doanh thu",
              data: Object.values(yearData),
            },
          ],
        });
      } else if (period === "month") {
        const monthlyRevenue = data.filter(
          (item) => item.Year === selectedYear
        );
        const categories = monthlyRevenue
          .filter((item) => item.Month && item.TotalVATCollected !== undefined)
          .map((item) => `${item.Month}/${item.Year}`);
        const seriesData = monthlyRevenue
          .filter((item) => item.Month && item.TotalVATCollected !== undefined)
          .map((item) => item.TotalVATCollected);

        setRevenueByMonth(monthlyRevenue);
        setChartData({
          options: {
            ...chartData.options,
            xaxis: { categories },
            title: { text: `Doanh thu theo tháng (${selectedYear})` },
          },
          series: [
            {
              name: "Doanh thu",
              data: seriesData,
            },
          ],
        });
      } else if (period === "day") {
        setChartData({
          options: {
            ...chartData.options,
            xaxis: {
              categories: data.map((item) => {
                // Chuyển đổi OrderDate sang định dạng DD/MM/YYYY
                const date = new Date(item.OrderDate);
                const day = String(date.getDate()).padStart(2, "0"); // Đảm bảo ngày luôn có 2 chữ số
                const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
              }),
            },
            title: { text: "Doanh thu theo ngày" },
          },
          series: [
            {
              name: "Doanh thu",
              data: data.map((item) => item.TotalRevenue), // Sử dụng TotalRevenue làm dữ liệu
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    }
  };

  // Gọi hàm fetchRevenueData khi component được mount với mặc định là năm hiện tại
  useEffect(() => {
    fetchRevenueData("year");
  }, []);

  // Cập nhật dữ liệu biểu đồ khi chọn khoảng thời gian
  const handlePeriodChange = (event) => {
    const period = event.target.value;
    fetchRevenueData(period);
  };

  // Cập nhật năm đã chọn và dữ liệu doanh thu theo tháng cho năm đó
  const handleYearChange = (event) => {
    const year = parseInt(event.target.value, 10);
    setSelectedYear(year);
  };

  // Theo dõi sự thay đổi của selectedYear và cập nhật dữ liệu doanh thu theo tháng cho năm được chọn
  useEffect(() => {
    if (chartData.options.title.text.includes("tháng")) {
      fetchRevenueData("month");
    }
  }, [selectedYear]);

  return (
    <div className="revenue-chart-container">
      <div className="toolbar">
        <label htmlFor="period-select">Chọn khoảng thời gian:</label>
        <FormControl size="small">
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            onChange={handlePeriodChange}
            defaultValue="year"
          >
            <MenuItem value="year">Theo năm</MenuItem>
            <MenuItem value="month">Theo tháng</MenuItem>
            <MenuItem value="day">Theo ngày</MenuItem>
          </Select>
        </FormControl>
        {/* <select
          id="period-select"
          onChange={handlePeriodChange}
          defaultValue="year"
        >
          <option value="year">Theo năm</option>
          <option value="month">Theo tháng</option>
          <option value="day">Theo ngày</option>
        </select> */}
        {chartData.options.title.text.includes("tháng") && (
          <div className="ms-2">
            <label htmlFor="year-select">Chọn năm:</label>
            <FormControl size="small">
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                onChange={handleYearChange}
                value={selectedYear}
              >
                {yearsList.map((year) => (
                  <MenuItem value={year} key={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* <select
              id="year-select"
              onChange={handleYearChange}
              value={selectedYear}
            >
              {yearsList.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select> */}
          </div>
        )}
      </div>
      <ApexCharts
        options={chartData.options}
        series={chartData.series}
        type="area" // Đổi kiểu biểu đồ thành 'area'
        height={350}
      />
    </div>
  );
};

export default RevenueChart;
