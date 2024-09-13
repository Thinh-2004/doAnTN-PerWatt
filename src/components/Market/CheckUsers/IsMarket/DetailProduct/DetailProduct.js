import { Button, styled, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

const DetailProduct = ({ DataDetail, reloadArrayDetail }) => {
  const [moveData, setMoveData] = useState([]); //để chuyển dữ liệu sang components khác xử lí
  const [temporaryData, setTemporaryData] = useState([]); //để fill dữ liệu;
  const [newTemporaryData, setNewTemporaryData] = useState({
    namedetail: "",
    price: "",
    quantity: "",
    imagedetail: "",
    imageName: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [editingIndex, setEditingIndex] = useState(null); // Index của mục đang được chỉnh sửa

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTemporaryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = () => {
    const { namedetail, price, quantity, imagedetail } = newTemporaryData;

    if (!namedetail) {
      toast.warning("Vui lòng nhập phân loại sản phẩm");
      return false;
    } else if (namedetail.length > 200) {
      toast.warning("Tên phân loại không được lớn hơn 200 kí tự");
      return false;
    }

    if (!price) {
      toast.warning("Vui lòng nhập giá phân loại sản phẩm");
      return false;
    } else if (!parseFloat(price)) {
      toast.warning("Giá không hợp lệ");
      return false;
    } else if ((parseFloat(price) <= 0) | (parseFloat(price) < 1000)) {
      toast.warning("Giá không được nhỏ hơn 1.000");
      return false;
    }

    if (!quantity) {
      toast.warning("Vui lòng nhập số lượng phân loại sản phẩm.");
      return false;
    } else if (!parseInt(quantity)) {
      toast.warning("Số lượng phân loại sản phẩm không hợp lệ.");
      return false;
    } else if (parseInt(quantity) <= 0) {
      toast.warning("Số lượng không được nhỏ hơn hoặc bằng 0");
      return false;
    }

    if (!imagedetail) {
      toast.warning("Vui lòng chọn hình ảnh.");
      return false;
    }

    return true;
  };

  const handleAddOrUpdate = () => {
    if (validate()) {
      const newItems = {
        namedetail: newTemporaryData.namedetail,
        price: newTemporaryData.price,
        quantity: newTemporaryData.quantity,
        imagedetail: imagePreview,
      };

      if (editingIndex !== null) {
        // Cập nhật mục đã chọn
        setTemporaryData((prevData) =>
          prevData.map((item, index) =>
            index === editingIndex ? newItems : item
          )
        );
        setMoveData((prevData) =>
          prevData.map((item, index) =>
            index === editingIndex ? newItems : item
          )
        );
        setEditingIndex(null); // Kết thúc chế độ chỉnh sửa
      } else {
        // Thêm mục mới
        setTemporaryData((prevData) => [...prevData, newItems]);
        setMoveData((prevData) => [...prevData, newItems]);
      }

      setNewTemporaryData({
        namedetail: "",
        price: "",
        quantity: "",
        imagedetail: "",
        imageName: "",
        imageExtension: "",
      });
      setImagePreview("");
      DataDetail([...moveData, newItems]); //Truyền dữ liệu đến component khác xử lý
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Cập nhật ảnh xem trước
        setNewTemporaryData((prevData) => ({
          ...prevData,
          imagedetail: file, // Lưu trữ đối tượng file
        }));
      };
      reader.readAsDataURL(file); // Đọc file dưới dạng data URL
    }
  };

  const handleEdit = (index) => {
    const itemToEdit = temporaryData[index];
    setNewTemporaryData({
      namedetail: itemToEdit.namedetail,
      price: itemToEdit.price,
      quantity: itemToEdit.quantity,
      imagedetail: itemToEdit.imagedetail,
      imageName: itemToEdit.imageName,
      imageExtension: itemToEdit.imageExtension,
    });
    setImagePreview(itemToEdit.imagedetail);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updatedTemporaryData = temporaryData.filter((_, i) => i !== index);
    setTemporaryData(updatedTemporaryData);
    setMoveData(updatedTemporaryData); // Đảm bảo `moveData` cũng được cập nhật
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  useEffect(() => {
    DataDetail(moveData);
    console.log(moveData);
  }, [moveData, DataDetail]);
  useEffect(() => {
    if (reloadArrayDetail) {
      setTemporaryData([]);
    }
  }, [reloadArrayDetail]);

  return (
    <div className="bg-white shadow">
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-lg-4 col-md-4 col-sm-4">
              <TextField
                label="Nhập tên phân loại"
                id="outlined-size-small"
                size="small"
                name="namedetail"
                value={newTemporaryData.namedetail}
                onChange={handleInputChange}
                fullWidth
              />
            </div>
            <div className="col-lg-4 col-md-4 col-sm-4">
              <TextField
                label="Nhập giá sản phẩm"
                id="outlined-size-small"
                size="small"
                name="price"
                value={newTemporaryData.price}
                onChange={handleInputChange}
                fullWidth
                className="me-2"
              />
            </div>
            <div className="col-lg-4 col-md-4 col-sm-4">
              <TextField
                label="Nhập số lượng"
                id="outlined-size-small"
                size="small"
                name="quantity"
                value={newTemporaryData.quantity}
                onChange={handleInputChange}
                fullWidth
              />
            </div>
            <div className="mt-2 mb-2">
              <Button
                color="success"
                style={{ textTransform: "none", fontSize: "15px" }}
                onClick={handleAddOrUpdate}
                className="me-4"
              >
                {editingIndex !== null ? "Cập nhật" : "Thêm"}
              </Button>
              <Button
                component="label"
                role={undefined}
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                color="inherit"
                disableElevation
              >
                Tải hình ảnh phân loại
                <VisuallyHiddenInput
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </Button>
            </div>
            {imagePreview && (
              <div>
                <div htmlFor="">Ảnh xem trước</div>
                <img
                  src={imagePreview}
                  alt="Ảnh xem trước"
                  style={{ width: "100px", height: "100px" }}
                />
              </div>
            )}
            <div className="mt-2">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Hình</th>
                    <th scope="col">Tên phân loại</th>
                    <th scope="col">Giá phân loại</th>
                    <th scope="col">Số lượng phân loại</th>
                    <th scope="col">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {temporaryData.map((fill, index) => (
                    <tr key={index}>
                      <td>
                        <img
                          src={fill.imagedetail}
                          alt="Hình ảnh"
                          style={{ width: "100px", height: "100px" }}
                        />
                      </td>
                      <td>{fill.namedetail}</td>
                      <td>{fill.price}</td>
                      <td>{fill.quantity}</td>
                      <td>
                        <Button
                          onClick={() => handleEdit(index)}
                          color="primary"
                          startIcon={<EditIcon />}
                          size="small"
                          className="me-2"
                        >
                          Sửa
                        </Button>
                        <Button
                          onClick={() => handleDelete(index)}
                          color="error"
                          startIcon={<DeleteIcon />}
                          size="small"
                        >
                          Xóa
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;
