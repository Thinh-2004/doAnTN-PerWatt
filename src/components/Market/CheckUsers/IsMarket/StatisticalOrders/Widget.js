import React, { useState, useEffect } from "react";
import "./Widget.css";
import ChooseProduct from "./ChooseProduct";
import { Checkbox, Pagination, Button, Table, Empty, notification } from "antd";
import BasicInfoComponent from "./BasicInfoComponent";
import { useLocation, useParams } from "react-router-dom";
import axios from "../../../../../Localhost/Custumize-axios";
import {
  DeleteOutlined,
  CloseOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";

const Widget = () => {
  const [showChooseProduct, setShowChooseProduct] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [discounts, setDiscounts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const location = useLocation();
  const [savedProducts, setSavedProducts] = useState([]);
  const queryParams = new URLSearchParams(location.search);
  const id = useParams();

  // Lấy idStore từ localStorage
  const idStore = localStorage.getItem("idStore");

  useEffect(() => {
    if (!idStore) {
      console.error("Store ID is missing in localStorage");
    }
  }, [idStore]);

  // Hàm lấy sản phẩm đã chọn từ ChooseProduct
  const handleSelectProduct = (products) => {
    const updatedProducts = [...selectedProducts];

    products.forEach((product) => {
      const existingProductIndex = updatedProducts.findIndex(
        (item) => item.id === product.id
      );

      if (existingProductIndex === -1) {
        updatedProducts.push({ ...product, isChecked: false });
      }
    });

    setSelectedProducts(updatedProducts);
  };

  const handleToggleProduct = (product) => {
    const updatedProducts = selectedProducts.map((item) => {
      if (item.id === product.id) {
        return { ...item, isChecked: !item.isChecked };
      }
      return item;
    });
    setSelectedProducts(updatedProducts);
  };

  const handleDiscountChange = (id, discount) => {
    const updatedDiscounts = {
      ...discounts,
      [id]: Math.max(0, Math.min(100, discount)),
    };
    setDiscounts(updatedDiscounts);
  };

  const handleDeleteProduct = (productId) => {
    const updatedProducts = selectedProducts.filter(
      (product) => product.id !== productId
    );
    setSelectedProducts(updatedProducts);
  };

  // Hàm phân loại sản phẩm theo category
  const categorizeProducts = (products) => {
    return products.reduce((acc, product) => {
      const { category } = product;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});
  };

  // Hàm lấy sản phẩm đã chọn và tính giá giảm
  const getDiscountedProducts = () => {
    return selectedProducts
      .filter((product) => product.isChecked)
      .map((product) => {
        const discountValue = discounts[product.id] || 0;
        const discountedPrice =
          product.price - product.price * (discountValue / 100);
        return {
          productDetail: {
            id: product.id,
            name: product.name,
            imgSrc: product.imgSrc,
            category: product.category || "Không xác định", // Lưu category của sản phẩm
          },
          discountPrice: discountedPrice,
          discount: discountValue,
          name: product.name,
          originalPrice: product.price,
          imgSrc: product.imgSrc,
          category: product.category || "Không xác định", // Đảm bảo category được lưu
        };
      });
  };
  

const handleSavePromotion = async () => {
  const voucherAdminDetails = getDiscountedProducts();

  if (voucherAdminDetails.length === 0) {
    notification.error({
      message: "Lỗi",
      description: "Vui lòng chọn ít nhất một sản phẩm trước khi lưu!",
    });
    return;
  }

  // Chuẩn bị dữ liệu gửi lên backend
  const dataToSave = voucherAdminDetails.map((detail) => ({
    voucherAdmin: { id: parseInt(id.id) }, // ID voucherAdmin từ params
    product: { id: detail.productDetail.id }, // ID sản phẩm từ dữ liệu đã chọn
    discountprice: detail.discountPrice, // Giá sau khi giảm
  }));

  try {
    const response = await axios.post(
      "api/voucherAdminDetails/create",
      dataToSave,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    notification.success({
      message: "Thành công",
      description: response.data,
    });

    // Lưu lại sản phẩm đã chọn vào localStorage với category
    const existingProducts =
      JSON.parse(localStorage.getItem(`savedProducts_${id.id}`)) || [];
    const updatedSavedProducts = [
      ...existingProducts,
      ...voucherAdminDetails.map((detail) => ({
        id: detail.productDetail.id,
        name: detail.name,
        imgSrc: detail.imgSrc,
        originalPrice: detail.originalPrice,
        discountPrice: detail.discountPrice,
        discount: detail.discount,
        category: detail.category || "Không xác định", // Kiểm tra và thêm category
      })),
    ];

    // Lưu sản phẩm vào localStorage
    localStorage.setItem(
      `savedProducts_${id.id}`,
      JSON.stringify(updatedSavedProducts)
    );

    // Cập nhật lại danh sách sản phẩm đã lưu vào state
    setSavedProducts(updatedSavedProducts);

    // Cập nhật lại danh sách sản phẩm đã chọn
    setSelectedProducts([]);
    setDiscounts({});
  } catch (error) {
    console.error(
      "Lỗi khi lưu dữ liệu sản phẩm:",
      error.response ? error.response.data : error.message
    );
    notification.error({
      message: "Lỗi",
      description: `Đã xảy ra lỗi khi lưu sản phẩm! Chi tiết: ${
        error.response ? error.response.data : error.message
      }`,
    });
  }
};


  useEffect(() => {
    // Khi component được render lại, lấy savedProducts từ localStorage
    const savedProductsFromLocalStorage =
      JSON.parse(localStorage.getItem(`savedProducts_${id.id}`)) || [];
    setSavedProducts(savedProductsFromLocalStorage);
  }, [id.id]);

  ///// Render UI
  const categorizedProducts = categorizeProducts(selectedProducts);
// Hàm xóa sản phẩm khỏi localStorage và cập nhật lại state savedProducts
const handleDeleteProductFromLocalStorage = (productId) => {
  // Lấy sản phẩm đã lưu từ localStorage
  const savedProductsFromLocalStorage =
    JSON.parse(localStorage.getItem(`savedProducts_${id.id}`)) || [];

  // Lọc bỏ sản phẩm cần xóa
  const updatedSavedProducts = savedProductsFromLocalStorage.filter(
    (product) => product.id !== productId
  );

  // Cập nhật lại localStorage và state savedProducts
  localStorage.setItem(
    `savedProducts_${id.id}`,
    JSON.stringify(updatedSavedProducts)
  );
  setSavedProducts(updatedSavedProducts);
};

  return (
    <div className="container">
      <div className="p-6 bg-card rounded-lg shadow-md mt-6">
        <h2 className="text-lg font-semibold mb-4">Sản phẩm khuyến mãi</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowChooseProduct(!showChooseProduct)}
        >
          Thêm sản phẩm
        </Button>

        {Object.keys(categorizedProducts).length === 0 ? (
          <Empty description={<span>Không có sản phẩm nào</span>} />
        ) : (
          Object.entries(categorizedProducts).map(([category, products]) => (
            <div key={category}>
              <h5 className="mt-3">{category}</h5>
              <Table
                dataSource={products.slice(
                  (currentPage - 1) * pageSize,
                  currentPage * pageSize
                )}
                columns={[
                  {
                    title: "Tên sản phẩm",
                    dataIndex: "name",
                    render: (text, record) => (
                      <span className="flex items-center">
                        <Checkbox
                          checked={record.isChecked}
                          onChange={() => handleToggleProduct(record)}
                          className="mr-2"
                        />
                        <img
                          src={record.imgSrc}
                          alt={record.name}
                          className="inline-block mr-2 rounded-3"
                          style={{ width: "10%", aspectRatio: "1/1" }}
                        />
                        {record.name}
                      </span>
                    ),
                  },
                  {
                    title: "Giá gốc",
                    dataIndex: "price",
                    render: (text) => `${text.toLocaleString()}₫`,
                  },
                  {
                    title: "Giá giảm",
                    render: (text, record) => {
                      const discountPrice =
                        record.price -
                        (record.price * (discounts[record.id] || 0)) / 100;
                      return `${discountPrice.toLocaleString()}₫`;
                    },
                  },
                  {
                    title: "Giảm giá (%)",
                    render: (text, record) => (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={discounts[record.id] || 0}
                        onChange={(e) =>
                          handleDiscountChange(
                            record.id,
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-16 p-1 border rounded-md"
                      />
                    ),
                  },
                  {
                    title: "Thao tác",
                    render: (text, record) => (
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteProduct(record.id)}
                      ></Button>
                    ),
                  },
                ]}
                rowKey="id"
                pagination={false}
                className="mt-4"
              />
            </div>
          ))
        )}

        <Pagination
          current={currentPage}
          total={selectedProducts.length}
          pageSize={pageSize}
          onChange={(page) => setCurrentPage(page)}
          className="mt-4"
        />
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSavePromotion}
        >
          Lưu sản phẩm
        </Button>
      </div>

      {savedProducts.length > 0 && (
        <BasicInfoComponent
          savedProducts={savedProducts}
          id={id.id}
          onDeleteProduct={handleDeleteProductFromLocalStorage} // Truyền hàm xóa vào BasicInfoComponent
        />
      )}

      {showChooseProduct && (
        <div className="chart-container mt-6 bg-secondary p-4 rounded-lg">
          <button
            className="close-button"
            onClick={() => setShowChooseProduct(false)}
          >
            <CloseOutlined />
          </button>

          <ChooseProduct
            onClose={() => setShowChooseProduct(false)}
            onSelectProduct={handleSelectProduct}
            idStore={idStore}
            existingProducts={savedProducts}
          />
        </div>
      )}
    </div>
  );
};

export default Widget;
