import React, { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import { Table, Spin, Alert } from "antd"; // Import Alert từ Ant Design
import { useSpring, animated } from "@react-spring/web"; // Import react-spring
import "./ProductList.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "../../Localhost/Custumize-axios";
import { Card, CardContent, Container } from "@mui/material";
import { Link } from "react-router-dom";
import { ThemeModeContext } from "../../components/ThemeMode/ThemeModeProvider";

const ProductCard = ({
  imageUrl,
  altText,
  title,
  price,
  soldCount,
  rating,
  slugProduct,
}) => {
  return (
    <Link to={`/detailProduct/${slugProduct}`}>
      <Card className="">
        <CardContent>
          <img src={imageUrl} alt={altText} className="image" />
          <h3 className="title">{title}</h3>
          <span className="price text-danger">{price}</span>
          <br />
          <div className="d-flex justify-content-between">
            <span className="sold">Đã bán: {soldCount}</span>
            <span className="rating">Xếp hạng: {rating}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Thêm trạng thái error
  const { mode } = useContext(ThemeModeContext);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    focusOnSelect: true,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const columns = [
    {
      title: "Tên Cửa Hàng",
      dataIndex: "StoreName",
      key: "storeName",
      render: (StoreName, record) => (
        <Link
          to={`/pageStore/${record.slugStore}`}
          style={{ color: mode === "light" ? "black" : "white" }}
        >
          {StoreName}
        </Link>
      ),
    },
    {
      title: "Doanh Thu",
      dataIndex: "NetRevenue",
      key: "netRevenue",
      render: (value) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(value),
    },
  ];

  const calculateRating = (soldCount) => {
    if (soldCount >= 500) return "⭐⭐⭐⭐⭐";
    if (soldCount >= 400) return "⭐⭐⭐⭐";
    if (soldCount >= 300) return "⭐⭐⭐";
    if (soldCount >= 200) return "⭐⭐";
    return "⭐";
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/product-sales");
        console.log(response.data);
        const productData = response.data.map((product) => {
          const productName = product.ProductName;
          const imageUrl = product.ImageNameDetail
            ? product.ImageNameDetail
            : product.ProductImage;

          return {
            imageUrl: imageUrl,
            altText: productName,
            title: productName,
            price: new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(product.ProductPriceDetail),
            soldCount: product.QuantitySoldDetail,
            rating: calculateRating(product.QuantitySoldDetail),
            slugProduct: product.slugProduct,
            slugStore: product.slugStore,
          };
        });
        setProducts(productData);
      } catch (error) {
        console.error("Error fetching product data:", error);
        setError("Không thể tải dữ liệu sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    const fetchRevenueData = async () => {
      try {
        const response = await axios.get("/revenue/net-store-revenue");
        setRevenueData(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        setError("Không thể tải dữ liệu doanh thu.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    fetchRevenueData();
  }, []);

  // Hiệu ứng slide-in cho thông báo lỗi
  const errorAnimation = useSpring({
    transform: error ? "translateY(0)" : "translateY(-100%)", // Trượt từ trên xuống
    opacity: error ? 1 : 0,
    config: { tension: 250, friction: 20 },
  });

  return (
    <Container
      className="rounded-3 mt-3"
      sx={{ backgroundColor: "backgroundElement.children" }}
    >
    
      <h3 className="header p-2">Sản phẩm bán chạy</h3>
      {loading ? (
        <div className="loading-container">
          <Spin size="large" tip="Đang tải..." />
        </div>
      ) : error ? (
        <animated.div style={errorAnimation}>
          <Alert message={error} type="error" showIcon />{" "}
          {/* Hiển thị thông báo lỗi với hiệu ứng */}
        </animated.div>
      ) : products.length === 0 ? (
        <div className="no-data-message" style={{ minHeight: "200px" }}>
          Không có sản phẩm
        </div>
      ) : (
        <Slider {...sliderSettings}>
          {products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </Slider>
      )}
      <h3 className="header p-4">Doanh thu Cửa Hàng</h3>
      <Table
        dataSource={revenueData}
        columns={columns}
        pagination={{ pageSize: 3 }}
        rowKey="storeName"
        className={mode === "light" ? "light-mode-table" : "dark-mode-table"}
      />
    </Container>
  );
};

export default ProductList;
