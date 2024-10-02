import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import Chart from 'react-apexcharts';
import axios from 'axios';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './SellerDashboard.css';

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price).replace('₫', 'đ');
};

const loadData = async (idStore, timePeriod, setOrders, setPendingOrders, setProcessedOrders, setCompletedOrders, setTopProducts, setRevenueData) => {
  if (!idStore) {
    console.error("Store ID is missing");
    return;
  }

  try {
    const ordersResponse = await axios.get(`http://localhost:8080/count-orders/${idStore}`);
    const ordersData = ordersResponse.data;

    const pending = ordersData.find(item => item.orderStatus === 'Chờ giao hàng')?.count || 0;
    const completed = ordersData.find(item => item.orderStatus === 'Hoàn thành')?.count || 0;
    const processed = ordersData.find(item => item.orderStatus === 'Hủy')?.count || 0;

    setOrders(pending + completed + processed);
    setPendingOrders(pending);
    setProcessedOrders(processed);
    setCompletedOrders(completed);

    const productsResponse = await axios.get(`http://localhost:8080/top10-products/${idStore}`);
    const productsData = productsResponse.data;

    const formattedProducts = productsData.map(product => {
      const calculateRating = (sold) => {
        if (sold >= 1000) return '⭐⭐⭐⭐⭐';
        if (sold >= 500) return '⭐⭐⭐⭐';
        if (sold >= 200) return '⭐⭐⭐';
        if (sold >= 100) return '⭐⭐';
        if (sold >= 50) return '⭐';
        return '';
      };
      
      return {
        id: product.idImage,
        name: product.name,
        price: formatPrice(product.price),
        sold: product.sold,
        rating: calculateRating(product.sold),
        imgSrc: product.imageName ? `http://localhost:8080/files/product-images/${product.idImage}/${product.imageName}` : 'https://via.placeholder.com/100'
      };
    });

    setTopProducts(formattedProducts);

    const revenueResponse = await axios.get(`http://localhost:8080/revenue/${idStore}?period=${timePeriod}`);
    const revenueData = revenueResponse.data;

    let formattedRevenue;
    if (timePeriod === 'day') {
      formattedRevenue = revenueData.map(item => ({
        date: item[0],
        revenue: item[1],
      })).filter(item => item.revenue > 0);
    } else {
      formattedRevenue = revenueData.map(item => ({
        date: item[0],
        revenue: item[1],
      }));
    }

    setRevenueData(formattedRevenue);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const SellerDashboard = () => {
  const [orders, setOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [processedOrders, setProcessedOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [topProducts, setTopProducts] = useState([]);
  const [timePeriod, setTimePeriod] = useState('day');
  const [revenueData, setRevenueData] = useState([]);

  // Lấy idStore và fullname từ localStorage
  const idStore = localStorage.getItem("idStore");
  const nameStore = localStorage.getItem("fullname");

  useEffect(() => {
    loadData(idStore, timePeriod, setOrders, setPendingOrders, setProcessedOrders, setCompletedOrders, setTopProducts, setRevenueData);
  }, [idStore, timePeriod]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Chào buổi sáng";
    } else if (hour < 18) {
      return "Chào buổi chiều";
    } else {
      return "Chào buổi tối";
    }
  };

  const handleTimePeriodChange = (event) => {
    setTimePeriod(event.target.value);
  };

  const currentChartData = {
    options: {
      xaxis: {
        categories: revenueData.map(item => {
          const date = new Date(item.date);
          if (timePeriod === 'day') {
            return date.toLocaleDateString('vi-VN');
          } else if (timePeriod === 'month') {
            return `${date.getMonth() + 1}/${date.getFullYear()}`;
          } else if (timePeriod === 'year') {
            return date.getFullYear();
          }
        }),
      },
      title: {
        text: 'Doanh thu theo thời gian',
      },
      yaxis: {
        title: {
          text: 'Doanh thu (đ)',
        },
      },
    },
    series: [{
      name: 'Doanh thu',
      data: revenueData.map(item => item.revenue),
    }],
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
    centerMode: true,
    centerPadding: '10px',
  };

  return (
    <div className="sellerDashboardClass">
      <div className="header">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">{getGreeting()}, {nameStore} 👋</h2>
          <p className="text-muted-foreground">Đây là những gì đang xảy ra trên cửa hàng của bạn ngày hôm nay. Xem số liệu thống kê cùng một lúc.</p>
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
        <h3 className="sectionTitleClass">Thống kê doanh số</h3>
        <div className="timePeriodSelectorClass">
          <select value={timePeriod} onChange={handleTimePeriodChange}>
            <option value="day">Ngày</option>
            <option value="month">Tháng</option>
            <option value="year">Năm</option>
          </select>
        </div>
        <Chart
          options={currentChartData.options}
          series={currentChartData.series}
          type="area"
          height={350}
        />
      </div>

      <div className="topProductsClass">
        <h3 className="sectionTitleClass">Sản phẩm bán chạy</h3>
        <Slider {...sliderSettings}>
          {topProducts.map((product) => (
            <div key={product.id} className="productCardClass">
              <img src={product.imgSrc} alt={product.name} className="productImageClass" />
              <div className="productInfoClass">
                <h4 className="productNameClass">{product.name}</h4>
                <p className="productPriceClass">{product.price}</p>
                <p className="productSoldClass">Đã bán: {product.sold}</p>
                <p className="productRatingClass">Xếp hạng: {product.rating}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default SellerDashboard;
