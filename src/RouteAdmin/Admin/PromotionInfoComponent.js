import React, { useContext, useEffect, useState } from "react";
import { notification, Table, Switch, Input, Empty } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "../../Localhost/Custumize-axios";
import Header from "../../components/Header/Header";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { ThemeModeContext } from "../../components/ThemeMode/ThemeModeProvider";

const PromotionInfoComponent = () => {
  const [promotionName, setPromotionName] = useState("");
  const [promotionStart, setPromotionStart] = useState("");
  const [promotionEnd, setPromotionEnd] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [editingPromotionId, setEditingPromotionId] = useState(null);
  const [status] = useState("đang hoạt động");
  const [searchTerm, setSearchTerm] = useState("");
  const [paginationPageSize, setPaginationPageSize] = useState(5); // Default page size
  const { mode } = useContext(ThemeModeContext);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/voucher-categories");
        const data = response.data;
        setCategories(data);
      } catch (error) {
        notification.error({
          message: "Lỗi",
          description: "Không thể tải danh mục!",
        });
      }
    };
    fetchCategories();
  }, []);

  // Fetch existing promotions
  useEffect(() => {
    fetchPromotions();
  }, []);

  // Fetch promotions from the server
  const fetchPromotions = async () => {
    try {
      const response = await axios.get("/vouchersAdmin");
      const data = response.data;
      setPromotions(data);
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể tải dữ liệu khuyến mãi!",
      });
    }
  };

  const handleSubmit = async () => {
    // Kiểm tra dữ liệu nhập
    if (
      !promotionName ||
      !selectedCategory ||
      !promotionStart ||
      !promotionEnd
    ) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin!",
      });
      return;
    }

    // Kiểm tra ngày bắt đầu và kết thúc
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Chỉ xét ngày

    const startDate = new Date(promotionStart);
    const endDate = new Date(promotionEnd);

    if (startDate < currentDate) {
      notification.error({
        message: "Lỗi",
        description: "Ngày bắt đầu không được nhỏ hơn ngày hiện tại!",
      });
      return;
    }

    if (startDate >= endDate) {
      notification.error({
        message: "Lỗi",
        description: "Ngày bắt đầu phải nhỏ hơn ngày kết thúc!",
      });
      return;
    }

    // Xác định trạng thái
    const statusToSave =
      endDate > currentDate ? "đang hoạt động" : "không hoạt động";

    const voucherData = {
      vouchername: promotionName,
      startday: startDate.toISOString(), // Chuyển thời gian sang ISO
      endday: endDate.toISOString(),
      voucherAdminCategory: { id: selectedCategory },
      status: statusToSave,
      voucherAdminDetails: [],
    };

    try {
      let response;

      if (editingPromotionId) {
        // Cập nhật
        response = await axios.put(
          `/vouchersAdmin/${editingPromotionId}`,
          voucherData,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        // Tạo mới
        response = await axios.post("/vouchersAdmin/create", voucherData, {
          headers: { "Content-Type": "application/json" },
        });
      }

      if (response.status === 200 || response.status === 201) {
        notification.success({
          message: "Thành công",
          description: editingPromotionId
            ? "Voucher đã được cập nhật thành công!"
            : "Voucher đã được lưu thành công!",
        });

        fetchPromotions();

        // Reset form sau khi lưu thành công
        setPromotionName("");
        setPromotionStart("");
        setPromotionEnd("");
        setSelectedCategory("");
        setEditingPromotionId(null);
      } else {
        throw new Error("Lưu voucher thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error saving voucher:", error);
      notification.error({
        message: "Lỗi",
        description: error.response?.data?.message || error.message,
      });
    }
  };

  const handleEditPromotion = (record) => {
    const formatDateToLocal = (date) => {
      const d = new Date(date);
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); // Adjust to local time zone
      return d.toISOString().slice(0, 16); // Remove seconds and 'Z'
    };

    setPromotionName(record.vouchername);
    setPromotionStart(formatDateToLocal(record.startday));
    setPromotionEnd(formatDateToLocal(record.endday));
    setSelectedCategory(record.voucherAdminCategory.id);
    setEditingPromotionId(record.id);
  };

  const handleDeletePromotion = async (id) => {
    try {
      const response = await axios.delete(`/vouchersAdmin/${id}`);

      if (response.status === 200) {
        notification.success({
          message: "Thành công",
          description: "Khuyến mãi đã được xóa thành công!",
        });

        fetchPromotions(); // Cập nhật danh sách khuyến mãi
      } else {
        throw new Error("Xóa khuyến mãi thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error deleting promotion:", error);
      notification.error({
        message: "Lỗi",
        description: error.response?.data?.message || error.message,
      });
    }
  };

  const handleStatusChange = async (id, currentStatus, endday) => {
    const currentDate = new Date();
    const endDate = new Date(endday);

    if (currentStatus === "không hoạt động" && currentDate >= endDate) {
      notification.error({
        message: "Lỗi",
        description: "Không thể bật trạng thái khi ngày kết thúc đã qua!",
      });
      return;
    }

    const newStatus =
      currentStatus === "đang hoạt động" ? "không hoạt động" : "đang hoạt động";

    try {
      const response = await axios.put(`/vouchersAdmin/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      notification.success({
        message: "Thành công",
        description: "Trạng thái đã được cập nhật!",
      });

      fetchPromotions(); // Cập nhật danh sách khuyến mãi sau khi thay đổi trạng thái
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: error.message,
      });
    }
  };

  const updatePromotionStatus = (promotion) => {
    const currentDate = new Date();
    const endDate = new Date(promotion.endday);

    if (currentDate >= endDate) {
      promotion.status = "không hoạt động"; // Update status
    }
  };

  const filteredPromotions = promotions
    .map((promotion) => {
      updatePromotionStatus(promotion); // Update status for each promotion
      return promotion;
    })
    .filter((promotion) =>
      promotion.vouchername?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.startday) - new Date(a.startday));

  const columns = [
    {
      title: "Tên khuyến mãi",
      dataIndex: "vouchername",
      key: "vouchername",
      onCell: (record) => ({
        onClick: () => handleEditPromotion(record),
      }),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startday",
      key: "startday",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endday",
      key: "endday",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Danh mục",
      dataIndex: "voucherAdminCategory",
      key: "voucherAdminCategory",
      render: (category) =>
        category ? category.namecategory : "Không có danh mục",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <Switch
          checked={text === "đang hoạt động"}
          onChange={() => handleStatusChange(record.id, text, record.endday)}
          checkedChildren="On"
          unCheckedChildren="Off"
        />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Button
          type="danger"
          onClick={() => handleDeletePromotion(record.id)}
          icon={<DeleteOutlined />}
        />
      ),
    },
  ];

  const handleSearch = (value) => {
    setSearchTerm(value); // Update search term
  };

  // Use setInterval to check and update promotion status every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPromotions();
    }, 100000); // 10 seconds interval

    return () => clearInterval(interval); // Clean up on component unmount
  }, []);

  return (
    <>
      <Header />
      <Box
        sx={{ backgroundColor: "backgroundElement.children" }}
        className="p-6 bg-card rounded-lg shadow-md"
      >
        <h2 className="text-lg font-semibold mb-4">Thông tin khuyến mãi</h2>

        <div className="mb-4">
          <label
            htmlFor="promotion-name"
            className="block text-sml font-medium"
          >
            Tên khuyến mãi
          </label>
          <TextField
            fullWidth
            size="small"
            type="text"
            id="promotion-name"
            className="mt-1 p-2"
            placeholder="Tên khuyến mãi"
            value={promotionName}
            onChange={(e) => setPromotionName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="promotion-category"
            className="block text-sml font-medium"
          >
            Chọn danh mục
          </label>
          <FormControl fullWidth size="small">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value={null}>Chọn danh mục</MenuItem>

              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {" "}
                  {category.namecategory}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="mb-4">
          <label
            htmlFor="promotion-start"
            className="block text-sml font-medium"
          >
            Ngày bắt đầu
          </label>
          <input
            type="datetime-local"
            id="promotion-start"
            className="mt-1 block w-full border rounded-2 p-2"
            value={promotionStart}
            onChange={(e) => setPromotionStart(e.target.value)}
            style={{
              backgroundColor: mode === "light" ? "white" : "#363535",
              color: mode === "light" ? "black" : "white",
            }}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="promotion-end" className="block text-sml font-medium">
            Ngày kết thúc
          </label>
          <input
            type="datetime-local"
            id="promotion-end"
            className="mt-1 block w-full border rounded-2 p-2"
            value={promotionEnd}
            onChange={(e) => setPromotionEnd(e.target.value)}
            style={{
              backgroundColor: mode === "light" ? "white" : "#363535",
              color: mode === "light" ? "black" : "white",
            }}
          />
        </div>

        <div className="mb-4">
          <Button variant="contained" disableElevation onClick={handleSubmit}>
            {editingPromotionId ? "Cập nhật khuyến mãi" : "Lưu khuyến mãi"}
          </Button>
        </div>

        <div className="mb-4">
          <Input.Search
            placeholder="Tìm kiếm khuyến mãi"
            onSearch={handleSearch}
            allowClear
            enterButton
          />
        </div>

        <div className={mode === "light" ? "table-light-mode" : "table-dark-mode"}>
          {filteredPromotions.length > 0 ? (
            <Table
              dataSource={filteredPromotions}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: paginationPageSize }}
              onChange={(pagination) =>
                setPaginationPageSize(pagination.pageSize)
              }
            />
          ) : (
            <Empty description="Không có khuyến mãi nào" />
          )}
        </div>
      </Box>
    </>
  );
};

export default PromotionInfoComponent;
