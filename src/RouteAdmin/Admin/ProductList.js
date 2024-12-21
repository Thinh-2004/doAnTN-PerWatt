import React, { useContext, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Table, Spin, Alert, Pagination, Modal, Select } from "antd";
import { useSpring, animated } from "@react-spring/web";
import "./ProductList.css";
import axios from "../../Localhost/Custumize-axios";
import { CardContent } from "@mui/material";
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
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  return (
    <Link to={`/detailProduct/${slugProduct}`}>
      <div
        ref={ref}
        className={`product-card ${inView ? "visible" : "hidden"}`}
      >
        <CardContent>
          <img src={imageUrl} alt={altText} className="image" />
          <h3 className="title">{title}</h3>
          <span className="price text-danger">{price}</span>
          <br />
          <div className="d-flex justify-content-between">
            <span className="sold mt-3">Đã bán: {soldCount}</span>
            <span className="rating mt-3">Xếp hạng: {rating}</span>
          </div>
        </CardContent>
      </div>
    </Link>
  );
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortPriceOrder, setSortPriceOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1); // Trạng thái cho trang hiện tại
  const [pageSize] = useState(6); // Số sản phẩm trên mỗi trang
  const { mode } = useContext(ThemeModeContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalRevenueDetail, setModalRevenueDetail] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const filteredRevenueData = revenueData.filter(
    (item) => item.Year === selectedYear
  );

  //state nhận trạng thái lỗi
  const [error403, setError403] = useState();

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
      render: (value, record) => (
        <span
          onClick={() => handleShowRevenueDetail(record)}
          style={{ color: "blue", cursor: "pointer" }}
        >
          {new Intl.NumberFormat("vi-VN", {
            style: "decimal",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value)}{" "}
          đ
        </span>
      ),
    },
  ];

  const handleYearChange = (value) => {
    setSelectedYear(value);
  };

  const calculateRating = (soldCount) => {
    if (soldCount >= 500) return "⭐⭐⭐⭐⭐";
    if (soldCount >= 400) return "⭐⭐⭐⭐";
    if (soldCount >= 300) return "⭐⭐⭐";
    if (soldCount >= 200) return "⭐⭐";
    return "⭐";
  };

  const handleSort = () => {
    const sortedProducts = [...products].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.soldCount - b.soldCount;
      }
      return b.soldCount - a.soldCount;
    });
    setProducts(sortedProducts);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleSortByPrice = () => {
    const sortedProducts = [...products].sort((a, b) => {
      // Chuyển đổi giá từ chuỗi sang số thực để so sánh
      const priceA = parseFloat(a.price.replace(/[^\d]/g, ""));
      const priceB = parseFloat(b.price.replace(/[^\d]/g, ""));
      return sortPriceOrder === "asc" ? priceA - priceB : priceB - priceA;
    });
    setProducts(sortedProducts);
    setSortPriceOrder(sortPriceOrder === "asc" ? "desc" : "asc");
  };

  const filteredProducts = products.filter((product) => {
    // Lấy giá trị giá sản phẩm dưới dạng số
    const price = parseFloat(product.price.replace(/[^\d]/g, ""));

    // Kiểm tra điều kiện tìm kiếm
    return (
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      price.toString().includes(searchTerm)
    );
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/product-sales");
        const productData = response.data.map((product) => ({
          imageUrl: product.ImageNameDetail || product.ProductImage,
          altText: product.ProductName,
          title: product.ProductName,
          price: new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(product.ProductPriceDetail),
          soldCount: product.QuantitySoldDetail,
          rating: calculateRating(product.QuantitySoldDetail),
          slugProduct: product.slugProduct,
          slugStore: product.slugStore,
        }));
        setProducts(productData);
      } catch (error) {
        console.error("Error fetching product data:", error);
        if (error.response.status === 403) setError403(error.response.status);
        else setError("Không thể tải dữ liệu sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    const fetchRevenueData = async () => {
      try {
        const response = await axios.get(`/revenue/net-store-revenue`);
        const rawRevenueData = response.data;
    
        // Gộp dữ liệu theo năm và cửa hàng
        const groupedData = rawRevenueData.reduce((acc, curr) => {
          const { Year, NetRevenue, StoreName, slugStore, OrderCount } = curr;
    
          // Tạo khóa duy nhất dựa trên Year và slugStore
          const key = `${Year}-${slugStore}`;
    
          // Kiểm tra xem khóa đã tồn tại trong `acc` chưa
          if (!acc[key]) {
            acc[key] = {
              Year,
              StoreName,
              slugStore,
              NetRevenue: 0,
              OrderCount: 0,
            };
          }
    
          // Cộng dồn doanh thu và số lượng đơn hàng
          acc[key].NetRevenue += NetRevenue;
          acc[key].OrderCount += OrderCount;
    
          return acc;
        }, {});
    
        // Chuyển đổi đối tượng thành mảng
        const aggregatedRevenueData = Object.values(groupedData);
    
        // Cập nhật state với dữ liệu gộp
        setRevenueData(aggregatedRevenueData);
    
        // Lấy danh sách các năm có sẵn từ dữ liệu doanh thu
        const years = [
          ...new Set(aggregatedRevenueData.map((item) => item.Year)),
        ];
        setAvailableYears(years); // Cập nhật danh sách năm
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        if (error.response?.status === 403) setError403(error.response.status);
        else setError("Không thể tải dữ liệu doanh thu.");
      } finally {
        setLoading(false);
      }
    };
    

    fetchProducts();
    fetchRevenueData();
  }, []);

  const errorAnimation = useSpring({
    transform: error ? "translateY(0)" : "translateY(-100%)",
    opacity: error ? 1 : 0,
    config: { tension: 250, friction: 20 },
  });

  // Tính toán các sản phẩm hiển thị cho trang hiện tại
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleShowRevenueDetail = (store) => {
    setModalRevenueDetail(store);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalRevenueDetail(null);
  };

  return (
    <div className="product-list-container rounded-3 mt-3">
      <h3 className="header p-2">Sản phẩm bán chạy</h3>
      <div className="search-container">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm theo tên hoặc giá..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="sort-container">
        {error403 === 403 ? (
          <label>Quyền truy cập bị giới hạn</label>
        ) : (
          products.length > 0 && (
            <>
              <button onClick={handleSort} className="sort-button">
                Sắp xếp theo số lượng ({sortOrder === "asc" ? "↑" : "↓"})
              </button>
              <button onClick={handleSortByPrice} className="sort-button">
                Sắp xếp theo giá ({sortPriceOrder === "asc" ? "↑" : "↓"})
              </button>
            </>
          )
        )}
      </div>
      {loading ? (
        <div className="loading-container">
          <Spin size="large" tip="Đang tải..." />
        </div>
      ) : error ? (
        <animated.div style={errorAnimation}>
          <Alert message={error} type="error" showIcon />
        </animated.div>
      ) : filteredProducts.length === 0 && !error403 ? (
        <div className="no-data-message" style={{ minHeight: "200px" }}>
          Không có sản phẩm
        </div>
      ) : (
        <div className="product-grid">
          {currentProducts.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      )}
      <div className="pagination-container">
        <Pagination
          current={currentPage}
          total={filteredProducts.length}
          pageSize={pageSize}
          onChange={handlePageChange}
          style={{ textAlign: "center", marginTop: "20px" }}
        />
      </div>
      <h3 className="header p-1">Doanh thu Cửa Hàng</h3>
      <Select
        defaultValue={selectedYear}
        style={{ width: 120, marginBottom: 20 }}
        onChange={handleYearChange}
      >
        {availableYears.map((year) => (
          <Select.Option key={year} value={year}>
            {year}
          </Select.Option>
        ))}
      </Select>

      {/* Hiển thị bảng với dữ liệu doanh thu */}
      <Table
        columns={columns}
        dataSource={filteredRevenueData} // Sử dụng dữ liệu đã lọc theo năm
        loading={loading}
        rowKey="slugStore"
      />
      <Modal
        title="Chi tiết Doanh thu"
        visible={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        {modalRevenueDetail && (
          <div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Thông tin
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Giá trị
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Tên Cửa Hàng
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {modalRevenueDetail.StoreName}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Doanh thu
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "decimal",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(modalRevenueDetail.NetRevenue)}{" "}
                    đ
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Số đơn hàng
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {modalRevenueDetail.OrderCount}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductList;
