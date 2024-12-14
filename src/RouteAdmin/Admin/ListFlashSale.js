import React, { useEffect, useState } from "react";
import axios from "../../Localhost/Custumize-axios";
import { Link } from "react-router-dom";
import { Card } from "@mui/material";
import Countdown from "./Countdown";

const ListFlashSale = ({ classNameCol, voucherAdminId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratings, setRatings] = useState({}); // Để lưu trữ số sao đánh giá của từng sản phẩm
  const [sales, setSales] = useState({}); // Để lưu trữ số lượt bán của từng sản phẩm

  // Hàm gọi API để lấy dữ liệu sản phẩm theo voucherAdminId
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/products");
        setData(response.data); // Lưu dữ liệu vào state
        // Lấy thông tin đánh giá và số lượt bán sau khi lấy sản phẩm
        await fetchRatings(response.data);
        await fetchSales(response.data);
      } catch (error) {
        setError("Có lỗi khi lấy dữ liệu.");
        console.error("Có lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false); // Kết thúc quá trình load
      }
    };

    fetchData();
  }, [voucherAdminId]);

  // Hàm gọi API để lấy số sao đánh giá cho mỗi sản phẩm
  const fetchRatings = async (products) => {
    try {
      const ratingsData = {};
      for (const product of products) {
        const response = await axios.get(`/comment/count/evaluate/${product.product.id}`);
        ratingsData[product.product.id] = response.data.rating; // Giả sử response trả về rating
      }
      setRatings(ratingsData);
    } catch (error) {
      console.error("Có lỗi khi lấy dữ liệu đánh giá:", error);
    }
  };

  // Hàm gọi API để lấy số lượt bán cho mỗi sản phẩm
  const fetchSales = async (products) => {
    try {
      const salesData = {};
      for (const product of products) {
        const response = await axios.get(`/product/quantity/${product.product.id}`);
        console.log("API response for product quantity:", response.data); // Kiểm tra giá trị trả về từ API
        salesData[product.product.id] = response.data; // Lưu giá trị trực tiếp
      }
      setSales(salesData);
    } catch (error) {
      console.error("Có lỗi khi lấy dữ liệu lượt bán:", error);
    }
  };
  

  const formatPrice = (value) => {
    return value ? Number(value).toLocaleString("vi-VN") : "Liên hệ";
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      {data.map((item) => {
        const firstIMG = item.product.images[0].imagename;
        const productId = item.product.id;
        const productRating = ratings[productId] || 0; // Lấy số sao của sản phẩm hoặc 0 nếu chưa có
        const productSales = sales[productId] || 0; // Lấy số lượt bán của sản phẩm hoặc 0 nếu chưa có

        return (
          <Card
  className={`${classNameCol} mb-3 mt-2 shadow rounded-3 p-2 d-flex flex-column`}
  sx={{
    bgcolor: "background.paper",
    width: "260px", // Chiều rộng Card
    height: "360px", // Chiều cao Card
    borderRadius: "12px", // Bo góc mượt
  }}
  key={productId}
  id="home-product-item"
>
  {/* Hình ảnh sản phẩm */}
  <Link
    to={`/detailProduct/${item.product.name}`}
    className="position-relative d-flex justify-content-center"
  >
    <img
      src={firstIMG}
      className="img-fluid rounded-3"
      alt="Product"
      style={{
        width: "100%",
        height: "150px",
        objectFit: "cover",
        padding: "4px",
      }}
      loading="lazy"
    />
    {/* Thời gian đếm ngược */}
    {item.discountEnd && (
      <div
        className="position-absolute top-0 start-0 bg-danger text-white p-1 rounded"
        style={{
          fontSize: "12px",
          zIndex: 1,
          margin: "5px",
        }}
      >
        Kết thúc: <Countdown endTime={item.discountEnd} />
      </div>
    )}
  </Link>

  {/* Thông tin sản phẩm */}
  <div
    className="mt-2 flex-grow-1 d-flex flex-column justify-content-between"
    style={{ padding: "5px" }}
  >
    <span
      className="fw-bold fst-italic mt-2"
      id="product-name"
      style={{ fontSize: "14px", lineHeight: "1.2" }}
    >
      {item.product.name}
    </span>
    <h5
      id="price-product"
      className="text-danger fw-bold"
      style={{ fontSize: "16px", margin: "8px 0" }}
    >
      {formatPrice(item.discountprice)} đ
    </h5>
    <hr className="m-0 p-0" />
  </div>

  {/* Đánh giá và lượt bán */}
  <div
    className="d-flex justify-content-between align-items-end"
    style={{
      fontSize: "12px",
      marginTop: "8px",
    }}
  >
    <div>
      <span>
        <i className="bi bi-star-fill text-warning"></i> {productRating}
      </span>
    </div>
    <div>
      <span>Đã bán: {productSales}</span>
    </div>
  </div>
</Card>

        );
      })}
    </>
  );
};

export default ListFlashSale;
