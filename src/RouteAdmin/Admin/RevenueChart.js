import React, { useState, useEffect, useContext, useRef } from "react";
import ApexCharts from "react-apexcharts";
import "./RevenueChart.css"; // Import the CSS file
import { DatePicker, Select } from "antd";
import moment from "moment";
import { ThemeModeContext } from "../../components/ThemeMode/ThemeModeProvider";
import axios from "../../Localhost/Custumize-axios";

const { RangePicker, MonthPicker } = DatePicker;
const { Option } = Select;
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

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedDateRange, setSelectedDateRange] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedQuarter, setSelectedQuarter] = useState(null);
  const [availableMonths, setAvailableMonths] = useState({});
  const isFetching = useRef(false);

  const handleMonthChange = (date, dateString) => {
    if (date) {
      setSelectedMonth(dateString);
      setSelectedYear(date.year());

      const month = date.month() + 1; // Tháng 0-based
      const quarter = Math.ceil(month / 3); // Xác định quý
      setSelectedQuarter(`Q${quarter}`);

      fetchRevenueData("month", null, null, dateString);
    } else {
      setSelectedMonth(null);
      setSelectedQuarter(null);
      fetchRevenueData("month", null, null, null);
    }
  };

  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      const [startDate, endDate] = dates;
      setSelectedDateRange([startDate, endDate]);
      fetchRevenueData("day", startDate, endDate, null);
    } else {
      setSelectedDateRange([]);
      fetchRevenueData("day", null, null, null);
    }
  };

  const handleQuarterChange = (quarter) => {
    setSelectedQuarter(quarter);

    const year = selectedYear || currentYear;
    const quarterStartMonth = (parseInt(quarter.replace("Q", "")) - 1) * 3;
    const quarterEndMonth = quarterStartMonth + 2;

    // Tính toán ngày bắt đầu và ngày kết thúc cho quý
    const startDate = new Date(year, quarterStartMonth, 1);
    const endDate = new Date(year, quarterEndMonth + 1, 0);

    // Chuyển đổi thành định dạng ngày cho API
    const startFormatted = startDate.toISOString().split("T")[0];
    const endFormatted = endDate.toISOString().split("T")[0];

    // Gọi API để lấy dữ liệu theo quý
    fetchRevenueData("day", startFormatted, endFormatted, null);
  };
  // Hàm gọi API để lấy dữ liệu doanh thu
  const fetchRevenueData = async (period, startDate, endDate, month) => {
    if (isFetching.current) return;
  
    let url;
    let dateQuery = "";
  
    const currentYear = new Date().getFullYear();
  
    // Nếu là "Theo ngày" và không có startDate, endDate, lấy dữ liệu từ đầu năm nay đến ngày hiện tại
    if (period === "day" && !startDate && !endDate) {
      const startDate = new Date(currentYear, 0, 1); // Ngày đầu năm
      const endDate = new Date(); // Ngày hiện tại
      dateQuery = `?startDate=${startDate.toISOString().split("T")[0]}&endDate=${endDate.toISOString().split("T")[0]}`;
    } else if (period === "day" && startDate && endDate) {
      // Định dạng lại ngày bắt đầu và kết thúc
      const startFormatted = new Date(startDate).toISOString().split("T")[0];
      const endFormatted = new Date(endDate).toISOString().split("T")[0];
      dateQuery = `?startDate=${startFormatted}&endDate=${endFormatted}`;
    } else if (period === "month" && month) {
      // Tính toán ngày bắt đầu và kết thúc cho tháng đó
      const startDate = new Date(month);
      const endDate = new Date(month);
      startDate.setDate(1); // Đặt ngày đầu tháng
      endDate.setMonth(endDate.getMonth() + 1); // Đặt ngày cuối tháng
      endDate.setDate(0); // Đặt lại ngày cuối tháng
  
      const startFormatted = startDate.toISOString().split("T")[0];
      const endFormatted = endDate.toISOString().split("T")[0];
  
      dateQuery = `?startDate=${startFormatted}&endDate=${endFormatted}`;
    } else if (period === "year") {
      // Nếu là năm, sử dụng toàn bộ năm hiện tại
      const startDate = new Date(`${currentYear}-01-01`);
      const endDate = new Date(`${currentYear}-12-31`);
      dateQuery = `?startDate=${startDate.toISOString().split("T")[0]}&endDate=${endDate.toISOString().split("T")[0]}`;
    }
  
    // Construct the API URL based on period
    switch (period) {
      case "year":
        url = `/revenue-by-year${dateQuery}`;
        break;
      case "month":
        url = `/revenue-by-month${dateQuery}`;
        break;
      case "day":
        url = `/revenue-by-day${dateQuery}`;
        break;
      default:
        return;
    }
  
    isFetching.current = true;
  
    try {
      const response = await axios.get(url); // Changed axios usage to .get
      const data = response.data;
      updateChartData(data, period);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    } finally {
      isFetching.current = false;
    }
  };
  

  const updateChartData = (data, period) => {
    let categories = [];
    let seriesData = [];
    let title = "";
  
    if (period === "year") {
      // Nhóm dữ liệu theo năm và tính tổng doanh thu cho từng năm
      const groupedData = data.reduce((acc, item) => {
        const year = item.Year;
        if (!acc[year]) {
          acc[year] = 0;
        }
        acc[year] += item.TotalRevenue; // Cộng dồn tổng doanh thu cho cùng một năm
        return acc;
      }, {});
  
      // Lấy các năm từ dữ liệu đã nhóm
      categories = Object.keys(groupedData);
      seriesData = Object.values(groupedData);
      title = "Doanh thu theo năm";
    } else if (period === "month") {
      // Xử lý dữ liệu theo tháng tương tự như hiện tại
      const groupedData = data.reduce((acc, item) => {
        const key = `${item.Month}/${item.Year}`;
        if (!acc[key]) {
          acc[key] = 0;
        }
        acc[key] += item.TotalVATCollected; // Cộng tổng VATCollected
        return acc;
      }, {});
  
      const allYears = data.map((item) => item.Year);
      const latestYear = Math.max(...allYears);
  
      const filteredGroupedData = Object.keys(groupedData)
        .filter((key) => {
          const year = parseInt(key.split('/')[1], 10);
          return year === latestYear;
        })
        .reduce((acc, key) => {
          acc[key] = groupedData[key];
          return acc;
        }, {});
  
      categories = Object.keys(filteredGroupedData);
      seriesData = Object.values(filteredGroupedData);
      title = `Doanh thu theo tháng (${latestYear})`;
  
      // Lưu danh sách tháng khả dụng theo từng năm
      const monthsByYear = {};
      data.forEach((item) => {
        const year = item.Year;
        const month = `${item.Month}`;
        if (!monthsByYear[year]) {
          monthsByYear[year] = [];
        }
        if (item.TotalVATCollected > 0) {
          monthsByYear[year].push(month);
        }
      });
      setAvailableMonths(monthsByYear);
    } else if (period === "day") {
      // Xử lý dữ liệu theo ngày
      categories = data.map((item) => {
        const date = new Date(item.OrderDate);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      });
      seriesData = data.map((item) => item.TotalRevenue);
      title = "Doanh thu theo ngày";
    }
  
    setChartData({
      options: {
        ...chartData.options,
        xaxis: { categories },
        title: { text: title },
      },
      series: [{ name: "Doanh thu", data: seriesData }],
    });
  };
  
  
  
  useEffect(() => {
    if (selectedMonth) {
      fetchRevenueData("month", null, null, selectedMonth);
    } else if (selectedDateRange.length === 2) {
      fetchRevenueData("day", selectedDateRange[0], selectedDateRange[1], null);
    } else {
      fetchRevenueData("year");
    }
  }, [selectedMonth, selectedDateRange]);

  const handlePeriodChange = (event) => {
    const period = event.target.value;
    setSelectedMonth(null);
    setSelectedDateRange([]);
    setSelectedYear(currentYear);
    fetchRevenueData(period, null, null, null);
  };

  return (
    <div className="revenue-chart-container">
      <div className="toolbar">
        <label htmlFor="period-select">Chọn khoảng thời gian:</label>
        <select
          id="period-select"
          onChange={(e) => fetchRevenueData(e.target.value, null, null, null)}
          defaultValue="year"
        >
          <option value="year">Theo năm</option>
          <option value="month">Theo tháng</option>
          <option value="day">Theo ngày</option>
        </select>

        {chartData.options.title.text.includes("ngày") && (
          <div>
            <label>Chọn khoảng ngày:</label>
            <RangePicker
              onChange={handleDateRangeChange}
              format="DD/MM/YYYY"
              value={selectedDateRange}
            />
          </div>
        )}

        {chartData.options.title.text.includes("tháng") && (
          <div>
            <label>Chọn tháng:</label>
            <MonthPicker
              onChange={handleMonthChange}
              format="YYYY-MM"
              value={selectedMonth ? moment(selectedMonth, "YYYY-MM") : null}
              disabledDate={(current) => {
                const year = current.year();
                const month = `${current.month() + 1}`;
                // Vô hiệu hóa nếu năm không tồn tại hoặc tháng không có trong danh sách
                return !(
                  availableMonths[year] && availableMonths[year].includes(month)
                );
              }}
              placeholder="Tháng"
            />
          </div>
        )}

        {/* Hiển thị chọn quý ngay cả khi không chọn tháng */}
        {chartData.options.title.text.includes("tháng") && (
          <div className="mx-1">
            <label>Chọn quý:</label>
            <Select
              id="quarter-select"
              onChange={handleQuarterChange}
              value={selectedQuarter}
              placeholder="Chọn quý"
              style={{ width: 120 }}
            >
              <Option value="Q1">Quý 1</Option>
              <Option value="Q2">Quý 2</Option>
              <Option value="Q3">Quý 3</Option>
              <Option value="Q4">Quý 4</Option>
            </Select>
          </div>
        )}
      </div>

      <div className="chart">
        <ApexCharts
          options={chartData.options}
          series={chartData.series}
          type="area"
          height={350}
        />
      </div>
    </div>
  );
};

export default RevenueChart;
