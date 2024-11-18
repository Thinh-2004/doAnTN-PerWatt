import React, { useState, useEffect, useContext } from "react";
import ApexCharts from "react-apexcharts";
import "./UserChart.css"; // Import the CSS file
import { ThemeModeContext } from "../../components/ThemeMode/ThemeModeProvider";

const UserChart = () => {
  const currentYear = new Date().getFullYear();
  const { mode } = useContext(ThemeModeContext);

  const [chartData, setChartData] = useState({
    options: {
      chart: {
        type: "area",
        height: 350,
      },
      title: {
        text: `Số lượng người dùng theo năm ${currentYear}`,
        align: "left",
        style: {
          color: mode === "light" ? "black" : "white",
        },
      },
      xaxis: {
        categories: [], // Categories sẽ được cập nhật dựa trên khoảng thời gian đã chọn
        label: {
          style: {
            colors: mode === "light" ? "black" : "white",
          },
        },
      },
      yaxis: {
        title: {
          text: "Số lượng người dùng",
          style: {
            color: mode === "light" ? "black" : "white",
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
          return val.toLocaleString(); // Format số lượng người dùng
        },
      },
    },
    series: [
      {
        name: "Người dùng",
        data: [], // Dữ liệu sẽ được cập nhật dựa trên khoảng thời gian đã chọn
      },
    ],
  });

  const [usersByYear, setUsersByYear] = useState({});
  const [usersByMonth, setUsersByMonth] = useState([]);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [yearsList, setYearsList] = useState([]);
  const [maxYear, setMaxYear] = useState(currentYear);

  // Hàm gọi API để lấy dữ liệu người dùng
  const fetchUserData = async (period) => {
    let url;
    switch (period) {
      case "year":
        url = "http://localhost:8080/users-by-year";
        break;
      case "month":
        url = "http://localhost:8080/users-by-month";
        break;
      case "day":
        url = "http://localhost:8080/users-by-day";
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
          yearData[item.Year] = item.TotalUsers;
          years.add(item.Year);
        });
        const yearsArray = [...years];
        setUsersByYear(yearData);
        setYearsList(yearsArray); // Cập nhật danh sách năm để chọn
        const maxYear = Math.max(...yearsArray);
        setMaxYear(maxYear); // Lưu năm lớn nhất
        setSelectedYear(maxYear); // Cập nhật năm đã chọn

        // Cập nhật dữ liệu biểu đồ cho tất cả các năm
        setChartData({
          options: {
            ...chartData.options,
            xaxis: { categories: Object.keys(yearData) },
            title: { text: "Số lượng người dùng tất cả các năm" }, // Cập nhật tiêu đề
          },
          series: [
            {
              name: "Người dùng",
              data: Object.values(yearData),
            },
          ],
        });
      } else if (period === "month") {
        const monthlyUsers = data.filter((item) => item.Year === selectedYear);
        const categories = monthlyUsers
          .filter((item) => item.Month && item.TotalUsers !== undefined)
          .map((item) => `${item.Month}/${item.Year}`);
        const seriesData = monthlyUsers
          .filter((item) => item.Month && item.TotalUsers !== undefined)
          .map((item) => item.TotalUsers);

        setUsersByMonth(monthlyUsers);
        setChartData({
          options: {
            ...chartData.options,
            xaxis: { categories },
            title: { text: `Số lượng người dùng theo tháng (${selectedYear})` },
          },
          series: [
            {
              name: "Người dùng",
              data: seriesData,
            },
          ],
        });
      } else if (period === "day") {
        setChartData({
          options: {
            ...chartData.options,
            xaxis: { categories: data.map((item) => item.Day) },
            title: { text: "Số lượng người dùng theo ngày" },
          },
          series: [
            {
              name: "Người dùng",
              data: data.map((item) => item.TotalUsers),
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Gọi hàm fetchUserData khi component được mount với mặc định là năm hiện tại
  useEffect(() => {
    fetchUserData("year");
  }, []);

  // Cập nhật dữ liệu biểu đồ khi chọn khoảng thời gian
  const handlePeriodChange = (event) => {
    const period = event.target.value;
    fetchUserData(period);
  };

  // Cập nhật năm đã chọn và dữ liệu người dùng theo tháng cho năm đó
  const handleYearChange = (event) => {
    const year = parseInt(event.target.value, 10);
    setSelectedYear(year);
  };

  // Theo dõi sự thay đổi của selectedYear và cập nhật dữ liệu người dùng theo tháng cho năm được chọn
  useEffect(() => {
    if (chartData.options.title.text.includes("tháng")) {
      fetchUserData("month");
    }
  }, [selectedYear]);

  return (
    <div className="user-chart-container">
      <div className="toolbar">
        <label htmlFor="period-select">Chọn khoảng thời gian:</label>
        <select
          id="period-select"
          onChange={handlePeriodChange}
          defaultValue="year"
        >
          <option value="year">Theo năm</option>
          <option value="month">Theo tháng</option>
          <option value="day">Theo ngày</option>
        </select>
        {chartData.options.title.text.includes("tháng") && (
          <div>
            <label htmlFor="year-select">Chọn năm:</label>
            <select
              id="year-select"
              onChange={handleYearChange}
              value={selectedYear}
            >
              {yearsList.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <ApexCharts
        options={chartData.options}
        series={chartData.series}
        type="area" // Bạn có thể thay đổi kiểu biểu đồ tại đây
        height={350}
      />
    </div>
  );
};

export default UserChart;
