import React, { useState, useEffect } from "react";
import axios from "../../../../../Localhost/Custumize-axios";
import "./Widget.css";
import ChooseProduct from "./ChooseProduct";
import { UilTimes } from "@iconscout/react-unicons";
import { Checkbox, Pagination, Button, Table, notification, Empty } from "antd";
import BasicInfoComponent from "./BasicInfoComponent";
import { useLocation, useParams } from "react-router-dom";

const Widget = () => {
  const [showChooseProduct, setShowChooseProduct] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [discounts, setDiscounts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [savedProducts, setSavedProducts] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const idVoucherAdmin = useParams();

  // Lấy idStore từ localStorage
  const idStore = localStorage.getItem("idStore");

  useEffect(() => {
    if (!idStore) {
      console.error("Store ID is missing in localStorage");
      notification.error({
        message: "Lỗi",
        description:
          "Không tìm thấy ID cửa hàng trong localStorage. Vui lòng kiểm tra lại!",
      });
    }
  }, [idStore]);

  // Hàm lưu dữ liệu đã chọn vào localStorage theo idVoucherAdmin
  const saveSelectedProductsToLocalStorage = (products, discounts) => {
    localStorage.setItem(
      `selectedProducts_${idVoucherAdmin.id}`,
      JSON.stringify(products)
    );
    localStorage.setItem(
      `discounts_${idVoucherAdmin.id}`,
      JSON.stringify(discounts)
    );
  };

  // Hàm lấy dữ liệu đã chọn từ localStorage theo idVoucherAdmin
  const loadSelectedProductsFromLocalStorage = () => {
    const savedProducts = localStorage.getItem(
      `selectedProducts_${idVoucherAdmin.id}`
    );
    const savedDiscounts = localStorage.getItem(
      `discounts_${idVoucherAdmin.id}`
    );
    if (savedProducts) setSelectedProducts(JSON.parse(savedProducts));
    if (savedDiscounts) setDiscounts(JSON.parse(savedDiscounts));
  };

  // Tải dữ liệu từ localStorage khi thay đổi idVoucherAdmin
  useEffect(() => {
    loadSelectedProductsFromLocalStorage();
  }, [idVoucherAdmin]);

  useEffect(() => {
    const storedSavedProducts =
      JSON.parse(localStorage.getItem(`savedProducts_${idVoucherAdmin.id}`)) ||
      [];
    setSavedProducts(storedSavedProducts);
  }, [idVoucherAdmin]);

  const handleToggleChooseProduct = () =>
    setShowChooseProduct(!showChooseProduct);

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
    saveSelectedProductsToLocalStorage(updatedProducts, discounts);
  };

  const handleToggleProduct = (product) => {
    const updatedProducts = selectedProducts.map((item) => {
      if (item.id === product.id) {
        return { ...item, isChecked: !item.isChecked };
      }
      return item;
    });
    setSelectedProducts(updatedProducts);
    saveSelectedProductsToLocalStorage(updatedProducts, discounts);
  };

  const handleDiscountChange = (id, discount) => {
    const updatedDiscounts = {
      ...discounts,
      [id]: Math.max(0, Math.min(100, discount)),
    };
    setDiscounts(updatedDiscounts);
    saveSelectedProductsToLocalStorage(selectedProducts, updatedDiscounts);
  };

  const handleDeleteProduct = (productId) => {
    const updatedProducts = selectedProducts.filter(
      (product) => product.id !== productId
    );
    setSelectedProducts(updatedProducts);
    saveSelectedProductsToLocalStorage(updatedProducts, discounts);
  };

  const getDiscountedProducts = () => {
    return selectedProducts
      .filter((product) => product.isChecked)
      .map((product) => {
        const discountValue = discounts[product.id] || 0;
        const discountedPrice =
          product.price - product.price * (discountValue / 100);
        return {
          productDetail: { id: product.id },
          discountPrice: discountedPrice,
          discount: discountValue,
          name: product.name,
          originalPrice: product.price,
          imgSrc: product.imgSrc,
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

    const dataToSave = voucherAdminDetails.map((detail) => ({
      productDetail: { id: detail.productDetail.id },
      discountPrice: detail.discount,
      voucherAdmin: { id: parseInt(idVoucherAdmin.id) },
    }));
    console.log(dataToSave);

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

      const existingProducts =
        JSON.parse(
          localStorage.getItem(`savedProducts_${idVoucherAdmin.id}`)
        ) || [];
      const updatedSavedProducts = [...existingProducts, ...dataToSave];
      localStorage.setItem(
        `savedProducts_${idVoucherAdmin.id}`,
        JSON.stringify(updatedSavedProducts)
      );
      setSavedProducts(updatedSavedProducts);

      const remainingProducts = selectedProducts.filter(
        (product) => !product.isChecked
      );
      setSelectedProducts(remainingProducts);
      setDiscounts({});
      saveSelectedProductsToLocalStorage(remainingProducts, {});
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

  /////
  return (
    <div className="container">
      <div className="p-6 bg-card rounded-lg shadow-md mt-6">
        <h2 className="text-lg font-semibold mb-4">Sản phẩm khuyến mãi</h2>
        <button
          className="bg-secondary text-white px-4 py-2 rounded-md"
          onClick={handleToggleChooseProduct}
        >
          + Thêm sản phẩm
        </button>

        {selectedProducts.length === 0 ? (
          <Empty description={<span>Không có sản phẩm nào</span>} />
        ) : (
          <Table
            dataSource={selectedProducts.slice(
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
                  <Button danger onClick={() => handleDeleteProduct(record.id)}>
                    Xóa
                  </Button>
                ),
              },
            ]}
            rowKey="id"
            pagination={false}
            className="mt-4"
          />
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
        <button
          className="bg-primary text-white px-6 py-2 rounded-md"
          onClick={handleSavePromotion}
        >
          Lưu sản phẩm
        </button>
      </div>

      <BasicInfoComponent />

      {showChooseProduct && (
        <div className="chart-container mt-6 bg-secondary p-4 rounded-lg">
          <button
            className="close-button"
            onClick={() => setShowChooseProduct(false)}
          >
            <UilTimes />
          </button>
          <ChooseProduct
            onClose={() => setShowChooseProduct(false)}
            onSelectProduct={handleSelectProduct}
            idStore={idStore}
          />
        </div>
      )}
    </div>
  );
};

export default Widget;
