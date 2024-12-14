import React, { useState, useEffect } from "react";
import axios from "../../../../../Localhost/Custumize-axios";
import {
  Card,
  Table,
  Input,
  Typography,
  Button,
  notification,
  Row,
  Col,
  Empty,
} from "antd";
import { format } from "date-fns";
import { vi } from "date-fns/locale"; // Use Vietnamese locale for formatting

const { Title, Text } = Typography;

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const formatDate = (date) => {
  return format(new Date(date), "  'ngày' dd MMMM 'năm' yyyy 'lúc' HH:mm:ss", {
    locale: vi,
  });
};

const BasicInfoComponent = ({ savedProducts, id, onDeleteProduct }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState(savedProducts);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [discounts, setDiscounts] = useState({});
  const [voucherDetails, setVoucherDetails] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });

  useEffect(() => {
    setProducts(savedProducts);
  }, [savedProducts]);

  const filteredProducts = products.filter((filter) =>
    filter.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedProducts = filteredProducts.reduce((groups, product) => {
    const category = product.category || "Không xác định";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(product);
    return groups;
  }, {});

  const groupedProductsArray = Object.entries(groupedProducts).map(
    ([category, products]) => ({
      category,
      products,
    })
  );

  useEffect(() => {
    const fetchVoucherDetails = async () => {
      try {
        const response = await axios.get(`/vouchersAdmin/${id}`);
        setVoucherDetails(response.data); // Cập nhật thông tin voucher
      } catch (error) {
        console.error("Lỗi khi lấy thông tin voucher:", error);
        notification.error({
          message: "Lỗi",
          description: "Không thể lấy thông tin voucher.",
        });
      }
    };

    fetchVoucherDetails();
  }, [id]);

  const handleDeleteSelected = async () => {
    // Kiểm tra xem có sản phẩm nào được chọn không
    if (selectedRowKeys.length === 0) {
      notification.warning({
        message: "Cảnh báo",
        description: "Vui lòng chọn ít nhất một sản phẩm để xóa.",
      });
      return; // Dừng lại nếu không có sản phẩm nào được chọn
    }

    const updatedProducts = savedProducts.filter(
      (product) => !selectedRowKeys.includes(product.id)
    );

    // Cập nhật lại danh sách sản phẩm đã xóa trên localStorage
    const key = `savedProducts_${id}`;
    if (updatedProducts.length > 0) {
      localStorage.setItem(key, JSON.stringify(updatedProducts));
    } else {
      localStorage.removeItem(key);
    }

    // Hiển thị thông báo thành công
    notification.success({
      message: "Thành công",
      description: "Xóa thành công.",
    });

    // Gọi API để xóa các sản phẩm đã chọn khỏi cơ sở dữ liệu
    try {
      await Promise.all(
        selectedRowKeys.map(async (idProduct) => {
          const response = await axios.delete(
            `/voucherAdminDetails/deleteByProduct/${idProduct}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.status !== 200) {
            throw new Error(`Không thể xóa sản phẩm có id: ${idProduct}`);
          }
        })
      );
      console.log("Các sản phẩm đã được xóa khỏi cơ sở dữ liệu");
      // Sau khi xóa thành công, gọi lại hàm onDeleteProduct
      onDeleteProduct(selectedRowKeys); // Đồng bộ với widget

      setSelectedRowKeys([]); // Xóa danh sách các sản phẩm đã chọn
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: `Có lỗi xảy ra khi xóa sản phẩm: ${error.message}`,
      });
    }
  };

  const handleSelectRow = (id) => {
    const newSelectedRowKeys = selectedRowKeys.includes(id)
      ? selectedRowKeys.filter((key) => key !== id)
      : [...selectedRowKeys, id];
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleUpdateDiscount = async () => {
    try {
      for (const [idProduct, discount] of Object.entries(discounts)) {
        const product = products.find((p) => p.id === parseInt(idProduct));
        const discountPrice = product?.originalPrice * (1 - discount / 100);

        if (product) {
          await axios.put(
            `/voucherAdminDetails/updateDiscountByProduct/${idProduct}`,
            null,
            {
              params: { newDiscountPrice: discountPrice },
            }
          );
        }
      }

      notification.success({
        message: "Thành công",
        description: "Cập nhật giảm giá thành công.",
      });

      setDiscounts({});
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Đã xảy ra lỗi khi cập nhật giảm giá! Vui lòng thử lại.",
      });
    }
  };

  const handleDiscountChange = (id, value) => {
    const discountValue = parseFloat(value) || 0;

    const updatedDiscounts = { ...discounts, [id]: discountValue };
    setDiscounts(updatedDiscounts);

    const updatedProducts = products.map((product) => {
      if (product.id === id) {
        const originalPrice = product.originalPrice;
        const discountPrice = originalPrice * (1 - discountValue / 100);
        return {
          ...product,
          discount: discountValue,
          discountPrice: discountPrice,
        };
      }
      return product;
    });

    setProducts(updatedProducts);
  };

  const handleTableChange = (pagination) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  return (
    <Card title="Danh sách sản phẩm đã lưu" className="mt-6">
      <Row gutter={16}>
        <Col span={12}>
          <Text>
            Loại chương trình khuyến mãi:{" "}
            <strong>
              {voucherDetails ? voucherDetails.vouchername : "Loading..."}
            </strong>
          </Text>
        </Col>
        <Col span={12}>
          <Text>
            Thời gian khuyến mãi:{" "}
            <strong>
              {voucherDetails
                ? `${formatDate(voucherDetails.startday)} - ${formatDate(
                    voucherDetails.endday
                  )}`
                : "Loading..."}
            </strong>
          </Text>
        </Col>
      </Row>

      <Input
        placeholder="Tìm kiếm..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <Row gutter={16} style={{ marginBottom: "16px" }}>
        <Col>
          <Button onClick={handleDeleteSelected}>
            Xóa các sản phẩm đã chọn
          </Button>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={handleUpdateDiscount}
            disabled={!Object.keys(discounts).length}
          >
            Cập nhật giảm giá
          </Button>
        </Col>
      </Row>
      {groupedProductsArray.length === 0 ? (
        <Empty description={<span>Không có sản phẩm nào</span>} />
      ) : (
        groupedProductsArray.map((fill, index) => (
          <React.Fragment key={index}>
            <Title level={4}>{fill.category}</Title>
            <Table
              dataSource={fill.products}
              columns={[
                {
                  title: "Tên sản phẩm",
                  dataIndex: "name",
                  key: "name",
                  render: (text, record) => (
                    <span
                      className=""
                      style={{
                        display: "inline-block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        width: "300px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedRowKeys.includes(record.id)}
                        onChange={() => handleSelectRow(record.id)}
                        style={{ marginRight: "8px" }}
                      />
                      <img
                        src={record.imgSrc}
                        alt={record.name}
                        style={{ width: "50px", marginRight: "8px" }}
                        className="rounded-3"
                      />
                      {record.name}
                    </span>
                  ),
                },
                {
                  title: "Giá gốc",
                  dataIndex: "originalPrice",
                  key: "originalPrice",
                  render: (text) => formatPrice(text),
                },
                {
                  title: "Giảm giá (%)",
                  dataIndex: "discount",
                  key: "discount",
                  render: (text, record) => (
                    <Input
                      value={discounts[record.id] || text || ""}
                      onChange={(e) =>
                        handleDiscountChange(record.id, e.target.value)
                      }
                      style={{ width: 80 }}
                    />
                  ),
                },
                {
                  title: "Giá sau giảm",
                  dataIndex: "discountPrice",
                  key: "discountPrice",
                  render: (text) => formatPrice(text),
                },
              ]}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: fill.products.length,
              }}
              onChange={handleTableChange}
              rowKey="id"
            />
          </React.Fragment>
        ))
      )}
    </Card>
  );
};

export default BasicInfoComponent;
