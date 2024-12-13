import React, { useState, useEffect, useContext } from "react";
import axios from "../../Localhost/Custumize-axios";
import { Table, Button, Input, Form, Modal, Upload, message } from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  PercentageOutlined,
} from "@ant-design/icons"; // Importing icons

import "./ProductCategoryForm.css";
import Header from "../../components/Header/Header";
import { Box } from "@mui/material";
import { ThemeModeContext } from "../../components/ThemeMode/ThemeModeProvider";

const ProductCategoryForm = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    imageCateProduct: "",
    vat: 0,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [visible, setVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { mode } = useContext(ThemeModeContext);

  // Fetch categories when the component is mounted
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/category/list");
      setCategories(response.data);
      setFilteredCategories(response.data); // Set filtered categories to all initially
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
      message.error("Không thể tải danh mục sản phẩm!");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "vat") {
      const vatValue = parseFloat(value) || 0;

      if (vatValue > 10) {
        message.warning("VAT không được vượt quá 10%!");
        return;
      }

      setForm({
        ...form,
        vat: vatValue, // Cập nhật VAT nếu hợp lệ
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleFileChange = (info) => {
    setFileList(info.fileList);
  };

  const handleSubmit = async () => {
    // Kiểm tra các trường bắt buộc
    if (!form.name) {
      message.error("Tên danh mục không được để trống!");
      return;
    }

    if (form.vat <= 0 || isNaN(form.vat)) {
      message.error("VAT phải là một số dương và không được bằng 0!");
      return;
    }

    if (form.vat > 10) {
      message.error("VAT không được vượt quá 10%!");
      return;
    }

    // Nếu là chế độ chỉnh sửa, không cần kiểm tra ảnh
    if (!isEditMode && fileList.length === 0) {
      message.error("Vui lòng chọn hình ảnh cho danh mục!");
      return;
    }

    // Nếu không có lỗi, tiến hành xử lý thêm hoặc cập nhật
    if (isEditMode) {
      await handleUpdateCategory();
    } else {
      await handleCreateCategory();
    }
  };

  const handleCreateCategory = async () => {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("vat", (form.vat / 100).toFixed(2)); // Convert to actual value
    formData.append("imageCateProduct", fileList[0]?.originFileObj);

    try {
      await axios.post("/category", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Danh mục đã được tạo thành công!");
      fetchCategories();
      resetForm();
      setVisible(false);
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error);
      message.error("Không thể thêm danh mục!");
    }
  };

  const handleUpdateCategory = async () => {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("vat", (form.vat / 100).toFixed(2)); // Convert to actual value
    if (fileList[0])
      formData.append("imageCateProduct", fileList[0].originFileObj);

    try {
      await axios.put(`/category/${form.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Cập nhật danh mục sản phẩm thành công!");
      fetchCategories();
      resetForm();
      setVisible(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục:", error);
      message.error("Không thể cập nhật danh mục!");
    }
  };

  const handleEdit = (category) => {
    setForm({
      ...category,
      vat: (category.vat * 100).toFixed(0), // Show VAT as percentage
    });
    setIsEditMode(true);
    setFileList(
      category.imageCateProduct
        ? [
            {
              url: `/files/uploads/${category.imageCateProduct}`,
            },
          ]
        : []
    );
    setVisible(true);
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa danh mục này?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await axios.delete(`/category/${id}`);
          setCategories(categories.filter((category) => category.id !== id));
          message.success("Xóa danh mục sản phẩm thành công!");
          fetchCategories();
        } catch (error) {
          console.error("Lỗi khi xóa danh mục:", error);
          message.error("Không thể xóa danh mục!");
        }
      },
    });
  };

  const resetForm = () => {
    setForm({ id: null, name: "", imageCateProduct: "", vat: 0 });
    setIsEditMode(false);
    setFileList([]);
  };

  // Function to handle search input change
  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value) {
      setFilteredCategories(
        categories.filter((category) =>
          category.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setFilteredCategories(categories);
    }
  };

  const columns = [
    {
      title: "Tên Danh Mục",
      dataIndex: "name",
      key: "name",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Hình Ảnh",
      dataIndex: "imagecateproduct",
      key: "imagecateproduct",
      render: (text) =>
        text ? (
          <img
            src={text}
            alt="category"
            style={{
              width: 50, // Giới hạn chiều rộng
              height: 50, // Giới hạn chiều cao
              objectFit: "cover", // Giữ tỉ lệ hình ảnh, không bị méo
              display: "block",
              margin: "0 auto", // Căn giữa ảnh
            }}
          />
        ) : (
          <span>Không có ảnh</span>
        ),
      width: 100,
    },
    {
      title: "VAT",
      dataIndex: "vat",
      key: "vat",
      render: (vat) => `${(vat * 100).toFixed(0)}%`,
      width: 100,
    },
    {
      title: "Hành Động",
      key: "actions",
      render: (text, record) => (
        <span>
          <Button
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
            icon={<EditOutlined />} // Adding edit icon without text
          />
          <Button
            onClick={() => handleDelete(record.id)}
            danger
            icon={<DeleteOutlined />} // Adding delete icon without text
          />
        </span>
      ),
      width: 150,
    },
  ];

  return (
    <>
      <Header />
      <Box
        sx={{ backgroundColor: "backgroundElement.children" }}
        className="product-category-form"
      >
        <h2>
          {isEditMode
            ? "Chỉnh Sửa Danh Mục Sản Phẩm"
            : "Thêm Danh Mục Sản Phẩm"}
        </h2>

        <Button
          type="primary"
          onClick={() => setVisible(true)}
          icon={<PlusOutlined />}
        />

        <Input.Search
          placeholder="Tìm kiếm danh mục"
          onSearch={handleSearch}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ margin: "20px 0" }}
        />

        <Table
          dataSource={filteredCategories}
          columns={columns}
          rowKey="id"
          style={{ marginTop: 20 }}
          tableLayout="fixed" // Đảm bảo các cột có chiều rộng cố định
          pagination={true} // Nếu bạn không cần phân trang
        />

        <Modal
          title={isEditMode ? "Chỉnh Sửa Danh Mục" : "Thêm Danh Mục"}
          visible={visible}
          onCancel={() => {
            resetForm();
            setVisible(false);
          }}
         
          onOk={handleSubmit}
          okText={isEditMode ? "Cập Nhật" : "Thêm"}
          cancelText="Hủy"
        >
          <Form>
            <Form.Item
              label="Tên Danh Mục"
              labelCol={{ span: 6 }} // Tùy chỉnh vị trí label nếu cần
              wrapperCol={{ span: 18 }} // Tùy chỉnh vị trí input nếu cần
            >
              <Input
                name="name"
                value={form.name}
                onChange={handleInputChange}
                required
                prefix={<EditOutlined />} // Thêm icon vào đầu input
              />
            </Form.Item>

            <Form.Item
              label="Hình Ảnh"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
            >
              <Upload
                listType="picture"
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={() => false}
              >
                <Button icon={<UploadOutlined />}>Chọn Hình Ảnh</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              label="VAT (%)"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
            >
              <Input
                name="vat"
                type="number"
                value={form.vat}
                onChange={handleInputChange}
                required
                suffix={<PercentageOutlined />} // Thêm icon vào sau input
              />
            </Form.Item>
          </Form>
        </Modal>
      </Box>
    </>
  );
};

export default ProductCategoryForm;
