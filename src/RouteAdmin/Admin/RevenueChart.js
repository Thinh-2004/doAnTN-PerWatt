import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';
import './RevenueChart.css'; // Import the CSS file

const RevenueChart = () => {
  const currentYear = new Date().getFullYear();
  
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        type: 'area', // Đổi kiểu biểu đồ thành 'bar'
        height: 350,
      },
      title: {
        text: `Doanh thu theo năm ${currentYear}`,
        align: 'left',
      },
      xaxis: {
        categories: [], // Categories will be updated based on the selected period
      },
      yaxis: {
        title: {
          text: 'Doanh thu (VND)',
        },
        labels: {
          formatter: function(value) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
          }
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'center',
        floating: true,
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val).replace('₫', 'đ');
        }
      },
    },
    series: [{
      name: 'Doanh thu',
      data: [], // Data will be updated based on the selected period
    }],
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
      case 'year':
        url = 'http://localhost:8080/revenue-by-year';
        break;
      case 'month':
        url = 'http://localhost:8080/revenue-by-month';
        break;
      case 'day':
        url = 'http://localhost:8080/revenue-by-day';
        break;
      default:
        return;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (period === 'year') {
        const yearData = {};
        const years = new Set();
        data.forEach(item => {
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
            title: { text: 'Doanh thu tất cả các năm' }, // Cập nhật tiêu đề
          },
          series: [{
            name: 'Doanh thu',
            data: Object.values(yearData),
          }],
        });
      } else if (period === 'month') {
        const monthlyRevenue = data.filter(item => item.Year === selectedYear);
        const categories = monthlyRevenue
          .filter(item => item.Month && item.TotalRevenue !== undefined)
          .map(item => `${item.Month}/${item.Year}`);
        const seriesData = monthlyRevenue
          .filter(item => item.Month && item.TotalRevenue !== undefined)
          .map(item => item.TotalRevenue);

        setRevenueByMonth(monthlyRevenue);
        setChartData({
          options: {
            ...chartData.options,
            xaxis: { categories },
            title: { text: `Doanh thu theo tháng (${selectedYear})` },
          },
          series: [{
            name: 'Doanh thu',
            data: seriesData,
          }],
        });
      } else if (period === 'day') {
        setChartData({
          options: {
            ...chartData.options,
            xaxis: { categories: data.map(item => item.Day) },
            title: { text: 'Doanh thu theo ngày' },
          },
          series: [{
            name: 'Doanh thu',
            data: data.map(item => item.TotalRevenue),
          }],
        });
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }
  };

  // Gọi hàm fetchRevenueData khi component được mount với mặc định là năm hiện tại
  useEffect(() => {
    fetchRevenueData('year');
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
    if (chartData.options.title.text.includes('tháng')) {
      fetchRevenueData('month');
    }
  }, [selectedYear]);

  return (
    <div className="revenue-chart-container">
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
        {chartData.options.title.text.includes('tháng') && (
          <div>
            <label htmlFor="year-select">Chọn năm:</label>
            <select
              id="year-select"
              onChange={handleYearChange}
              value={selectedYear}
            >
              {yearsList.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      <ApexCharts
        options={chartData.options}
        series={chartData.series}
        type="area" // Đổi kiểu biểu đồ thành 'bar'
        height={350}
      />
    </div>
  );
};

export default RevenueChart;
