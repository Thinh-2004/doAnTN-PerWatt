import React, { useState, useEffect } from "react";
import "./ChooseProduct.css";
import axios from "../../../../../Localhost/Custumize-axios";
import { Pagination, Button } from "antd";
import { Typography } from "@mui/material";
import { CheckOutlined, ReloadOutlined } from "@ant-design/icons";

const ChooseProduct = ({ onClose, onSelectProduct, idStore }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedProductCategories, setSelectedProductCategories] = useState(
    []
  ); // Thêm trạng thái lưu danh mục
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả danh mục");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`/productDetails/store/${idStore}`);
        const productData = response.data;
        console.log(response.data);
        const groupedProducts = productData.reduce((acc, product) => {
          const existingProduct = acc.find((p) => p.id === product.productId);

          if (existingProduct) {
            existingProduct.sales += product.soldDetail;
            existingProduct.price = Math.max(
              existingProduct.price,
              product.priceDetail
            );
            existingProduct.stock += product.quantityRemainingDetail || 0;
            existingProduct.discount =
              product.discount || existingProduct.discount;
          } else {
            const imgSrc = product.imageName;
            acc.push({
              id: product.productId,
              name: product.productName,
              imgSrc,
              sales: product.soldDetail,
              price: parseFloat(product.priceDetail),
              stock: product.quantityRemainingDetail || 0,
              discount: product.discount || 0,
              category: product.nameCategory || "Chưa phân loại",
            });
          }

          return acc;
        }, []);

        const uniqueCategories = [
          "Tất cả danh mục",
          ...new Set(
            productData.map(
              (product) => product.nameCategory || "Chưa phân loại"
            )
          ),
        ];
        setCategories(uniqueCategories);
        setProducts(groupedProducts);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
      }
    };

    fetchProducts();
  }, [idStore]);

  const handleSelectProduct = (productDetailId, category) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productDetailId)
        ? prevSelected.filter((productId) => productId !== productDetailId)
        : [...prevSelected, productDetailId]
    );

    // Cập nhật danh mục sản phẩm đã chọn
    setSelectedProductCategories((prevCategories) => {
      const updatedCategories = [...prevCategories];
      if (!updatedCategories.includes(category)) {
        updatedCategories.push(category);
      }
      return updatedCategories;
    });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "Tất cả danh mục" ||
        product.category === selectedCategory)
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + pageSize
  );

  const handleConfirm = () => {
    const selectedProductDetails = products.filter((product) =>
      selectedProducts.includes(product.id)
    );

    const productCategories = selectedProductDetails.map(
      (product) => product.category
    );

    // Lưu danh mục tương ứng với sản phẩm đã chọn
    console.log("Danh mục sản phẩm đã chọn:", productCategories);

    onSelectProduct(selectedProductDetails);
    onClose(); // Đóng modal sau khi chọn sản phẩm
  };

  const handleClose = () => {
    setSelectedProducts([]); // Reset selectedProducts khi đóng modal
    setSelectedProductCategories([]); // Reset selectedProductCategories khi đóng modal
    onClose();
  };

  return (
    <div className="choose-product-modal">
      <div className="choose-product-container">
        <h2 className="choose-product-header">Chọn Sản Phẩm</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="mb-4">
          <label className="choose-product-form-label">Danh mục sản phẩm</label>
          <select
            className="choose-product-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="choose-product-form-label">Tìm</label>
          <input
            type="text"
            className="choose-product-input"
            placeholder="Tên sản phẩm"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="choose-product-buttons">
          <Button
            icon={<ReloadOutlined />}
            onClick={() => setSearchTerm("")}
            className="choose-product-reset-button"
          >
            Nhập Lại
          </Button>
        </div>
        <table className="choose-product-table">
          <thead>
            <tr>
              <th>Sản Phẩm</th>
              <th>Doanh số</th>
              <th>Giá</th>
              <th>Kho hàng</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan="4">Không có sản phẩm nào để hiển thị.</td>
              </tr>
            ) : (
              paginatedProducts.map((product) => (
                <tr key={product.id}>
                  <td className="text-start">
                    <input
                      type="checkbox"
                      className="choose-product-checkbox me-2"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() =>
                        handleSelectProduct(product.id, product.category)
                      } // Truyền category vào đây
                    />
                    <img
                      src={product.imgSrc}
                      alt={product.name}
                      className="choose-product-image"
                    />
                    <Typography
                      variant="label"
                      sx={{
                        display: "inline-block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        width: "300px",
                      }}
                    >
                      {product.name}
                    </Typography>
                  </td>
                  <td>{product.sales}</td>
                  <td>{product.price.toLocaleString()}₫</td>
                  <td>{product.stock.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredProducts.length}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
        <div className="choose-product-footer">
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={handleConfirm}
            className="choose-product-confirm-button"
          >
            Xác Nhận
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChooseProduct;
