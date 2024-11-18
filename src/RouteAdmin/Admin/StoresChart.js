// src/components/StoresChart.js

import React, { useState, useEffect, useContext } from "react";
import ApexCharts from "react-apexcharts";
import "./StoresChart.css"; // Import the CSS file
import { ThemeModeContext } from "../../components/ThemeMode/ThemeModeProvider";
import { FormControl, MenuItem, Select } from "@mui/material";

const StoresChart = () => {
  const currentYear = new Date().getFullYear();
  const { mode } = useContext(ThemeModeContext);

  const [chartData, setChartData] = useState({
    options: {
      chart: {
        type: "bar", // Đổi kiểu biểu đồ thành 'bar'
        height: 350,
      },
      title: {
        text: `Số cửa hàng theo năm ${currentYear}`,
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
          text: "Số lượng cửa hàng",
          style: {
            color: mode === "light" ? "black" : "white",
          },
        },
        labels: {
          formatter: function (value) {
            return value; // Không định dạng tiền tệ
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
        name: "Số cửa hàng",
        data: [], // Data will be updated based on the selected period
      },
    ],
  });

  const [storesByYear, setStoresByYear] = useState({});
  const [storesByMonth, setStoresByMonth] = useState([]);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [yearsList, setYearsList] = useState([]);

  // Hàm gọi API để lấy dữ liệu số cửa hàng
  const fetchStoresData = async (period) => {
    let url;
    switch (period) {
      case "year":
        url = "http://localhost:8080/stores-by-year";
        break;
      case "month":
        url = "http://localhost:8080/stores-by-month";
        break;
      case "day":
        url = "http://localhost:8080/stores-by-day";
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
          yearData[item.Year] = item.TotalStores;
          years.add(item.Year);
        });
        const yearsArray = [...years];
        const maxYear = Math.max(...yearsArray);

        setStoresByYear(yearData);
        setYearsList(yearsArray); // Cập nhật danh sách năm để chọn
        setSelectedYear(maxYear); // Đặt năm lớn nhất là năm mặc định

        // Cập nhật dữ liệu biểu đồ cho tất cả các năm
        setChartData({
          options: {
            ...chartData.options,
            xaxis: { categories: Object.keys(yearData) },
            title: { text: "Số cửa hàng tất cả các năm" }, // Cập nhật tiêu đề
          },
          series: [
            {
              name: "Số cửa hàng",
              data: Object.values(yearData),
            },
          ],
        });
      } else if (period === "month") {
        const monthlyStores = data.filter((item) => item.Year === selectedYear);
        const categories = monthlyStores
          .filter((item) => item.Month && item.TotalStores !== undefined)
          .map((item) => `${item.Month}/${item.Year}`);
        const seriesData = monthlyStores
          .filter((item) => item.Month && item.TotalStores !== undefined)
          .map((item) => item.TotalStores);

        setStoresByMonth(monthlyStores);
        setChartData({
          options: {
            ...chartData.options,
            xaxis: { categories },
            title: { text: `Số cửa hàng theo tháng (${selectedYear})` },
          },
          series: [
            {
              name: "Số cửa hàng",
              data: seriesData,
            },
          ],
        });
      } else if (period === "day") {
        const formattedData = data.map((item) => ({
          date: new Date(item.Date).toLocaleDateString("vi-VN"), // Định dạng ngày
          numberOfStores: item.NumberOfStores,
        }));

        setChartData({
          options: {
            ...chartData.options,
            xaxis: { categories: formattedData.map((item) => item.date) },
            title: { text: "Số cửa hàng theo ngày" },
          },
          series: [
            {
              name: "Số cửa hàng",
              data: formattedData.map((item) => item.numberOfStores),
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching stores data:", error);
    }
  };

  // Gọi hàm fetchStoresData khi component được mount với mặc định là năm hiện tại
  useEffect(() => {
    fetchStoresData("year");
  }, []);

  // Cập nhật dữ liệu biểu đồ khi chọn khoảng thời gian
  const handlePeriodChange = (event) => {
    const period = event.target.value;
    fetchStoresData(period);
  };

  // Cập nhật năm đã chọn và dữ liệu số cửa hàng theo tháng cho năm đó
  const handleYearChange = (event) => {
    const year = parseInt(event.target.value, 10);
    setSelectedYear(year);
  };

  // Theo dõi sự thay đổi của selectedYear và cập nhật dữ liệu số cửa hàng theo tháng cho năm được chọn
  useEffect(() => {
    if (chartData.options.title.text.includes("tháng")) {
      fetchStoresData("month");
    }
  }, [selectedYear]);

  return (
    <div className="stores-chart-container">
      <div className="toolbar">
        <label htmlFor="period-select">Chọn khoảng thời gian:</label>
        {/* <select
          id="period-select"
          onChange={handlePeriodChange}
          defaultValue="year"
        >
          <option value="year">Theo năm</option>
          <option value="month">Theo tháng</option>
          <option value="day">Theo ngày</option>
        </select> */}
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
        type="bar" // Đổi kiểu biểu đồ thành 'bar'
        height={350}
      />
    </div>
  );
};

export default StoresChart;
