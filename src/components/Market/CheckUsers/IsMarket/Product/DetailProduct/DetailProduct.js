import {
  Button,
  Card,
  CardContent,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useState, useEffect, useImperativeHandle } from "react";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { forwardRef } from "react";

const DetailProduct = forwardRef(
  ({ DataDetail, reloadArrayDetail, isChangeForm }, ref) => {
    const [moveData, setMoveData] = useState([]); //để chuyển dữ liệu sang components khác xử lí
    const [temporaryData, setTemporaryData] = useState([]); //để fill dữ liệu;
    const [newTemporaryData, setNewTemporaryData] = useState({
      namedetail: "",
      price: "",
      quantity: "",
      imagedetail: "",
      imageName: "",
      formattedPrice: "",
    });
    const [imagePreview, setImagePreview] = useState("");
    const [editingIndex, setEditingIndex] = useState(null); // Index của mục đang được chỉnh sửa

    const formatPrice = (value) => {
      // Xóa các ký tự không phải số
      const numberString = value.replace(/\D/g, "");

      if (numberString === "") return "";

      // Format lại giá trị với dấu phẩy phân cách
      return Number(numberString).toLocaleString();
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      // Kiểm tra nếu input là price
      if (name === "price") {
        // Format giá trị và lưu giá trị gốc
        const numberString = value.replace(/\D/g, ""); // Xóa ký tự không phải số
        const formattedValue = value === "" ? "" : formatPrice(numberString);
        setNewTemporaryData((prevData) => ({
          ...prevData,
          [name]: numberString, // Lưu giá gốc để kiểm tra
          formattedPrice: formattedValue, // Lưu giá đã format để hiển thị
        }));
      } else {
        setNewTemporaryData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    };

    const validate = () => {
      const { namedetail, price, quantity, imagedetail } = newTemporaryData;

      if (!isChangeForm) {
        if (!price) {
          return {
            valid: false,
            message: "Vui lòng nhập giá phân loại sản phẩm",
          };
        } else if (!parseFloat(price)) {
          return { valid: false, message: "Giá không hợp lệ" };
        } else if (price.replace(/\D/g, "") <= 1000) {
          return { valid: false, message: "Giá không được nhỏ hơn 1.000" };
        }

        if (!quantity) {
          return {
            valid: false,
            message: "Vui lòng nhập số lượng phân loại sản phẩm.",
          };
        } else if (!parseInt(quantity)) {
          return {
            valid: false,
            message: "Số lượng phân loại sản phẩm không hợp lệ.",
          };
        } else if (parseInt(quantity) <= 0) {
          return {
            valid: false,
            message: "Số lượng không được nhỏ hơn hoặc bằng 0",
          };
        }
      } else if (isChangeForm) {
        if (!namedetail && temporaryData.length <= 0) {
          return {
            valid: false,
            message: "Vui lòng nhập tên phân loại sản phẩm",
          };
        } else if (namedetail.length > 200 && temporaryData.length <= 0) {
          return {
            valid: false,
            message: "Tên phân loại không được lớn hơn 200 kí tự",
          };
        }

        if (!price && temporaryData.length <= 0) {
          return {
            valid: false,
            message: "Vui lòng nhập giá phân loại sản phẩm",
          };
        } else if (!parseFloat(price) && temporaryData.length <= 0) {
          return { valid: false, message: "Giá không hợp lệ" };
        } else if (
          price.replace(/\D/g, "") <= 1000 &&
          temporaryData.length <= 0
        ) {
          return { valid: false, message: "Giá không được nhỏ hơn 1.000" };
        }

        if (!quantity && temporaryData.length <= 0) {
          return {
            valid: false,
            message: "Vui lòng nhập số lượng phân loại sản phẩm.",
          };
        } else if (!parseInt(quantity) && temporaryData.length <= 0) {
          return {
            valid: false,
            message: "Số lượng phân loại sản phẩm không hợp lệ.",
          };
        } else if (parseInt(quantity) <= 0 && temporaryData.length <= 0) {
          return {
            valid: false,
            message: "Số lượng không được nhỏ hơn hoặc bằng 0",
          };
        }

        if (!imagedetail && temporaryData.length <= 0) {
          return { valid: false, message: "Vui lòng chọn hình ảnh." };
        }
      }

      return { valid: true };
    };

    useImperativeHandle(ref, () => ({
      validateChild() {
        return validate();
      },
    }));

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
          formattedPrice: "",
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
      let dataDetail = []; // Sử dụng `let` để có thể gán lại giá trị

      if (isChangeForm) {
        dataDetail = moveData;
      } else {
        dataDetail = [
          {
            price: newTemporaryData.price,
            quantity: newTemporaryData.quantity,
          },
        ];
      }

      console.log(dataDetail);
      DataDetail(dataDetail); // Gọi `DataDetail` một lần duy nhất
    }, [
      moveData,
      DataDetail,
      isChangeForm,
      newTemporaryData.price,
      newTemporaryData.quantity,
    ]);

    useEffect(() => {
      if (reloadArrayDetail) {
        setTemporaryData([]);
        setNewTemporaryData({
          namedetail: "",
          price: "",
          quantity: "",
          imagedetail: "",
          formattedPrice: "",
        });
        setMoveData([]);
      }
    }, [reloadArrayDetail]);

    return (
      <div className="shadow">
        <Card className="">
          <CardContent className="">
            <div className="d-flex justify-content-between">
              {isChangeForm ? (
                <div className="row">
                  <div className="col-lg-4 col-md-4 col-sm-4 mb-3">
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
                  <div className="col-lg-4 col-md-4 col-sm-4 mb-3">
                    <TextField
                      label="Nhập giá sản phẩm"
                      id="outlined-size-small"
                      size="small"
                      name="price"
                      value={newTemporaryData.formattedPrice}
                      onChange={handleInputChange}
                      fullWidth
                      className="me-2"
                    />
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-4 mb-3">
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
                      variant="outlined"
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
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">Hình</TableCell>
                            <TableCell align="center">Tên phân loại</TableCell>
                            <TableCell align="center">Giá phân loại</TableCell>
                            <TableCell align="center">
                              Số lượng phân loại
                            </TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {temporaryData.map((fill, index) => (
                            <TableRow key={index}>
                              <TableCell align="center">
                                <img
                                  src={fill.imagedetail}
                                  alt="Hình ảnh"
                                  style={{ width: "100px", height: "100px" }}
                                />
                              </TableCell>
                              <TableCell align="center">
                                {fill.namedetail}
                              </TableCell>
                              <TableCell align="center">
                                {formatPrice(fill.price)}
                              </TableCell>
                              <TableCell align="center">
                                {fill.quantity}
                              </TableCell>
                              <TableCell align="center">
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
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </div>
              ) : (
                <>
                  <TextField
                    label="Nhập giá sản phẩm"
                    id="outlined-size-small"
                    size="small"
                    name="price"
                    value={newTemporaryData.formattedPrice}
                    onChange={handleInputChange}
                    fullWidth
                    className="me-2"
                    // disabled={isArrayDetail}
                  />
                  <TextField
                    label="Nhập số lượng"
                    id="outlined-size-small"
                    size="small"
                    name="quantity"
                    value={newTemporaryData.quantity}
                    onChange={handleInputChange}
                    fullWidth
                    // disabled={isArrayDetail}
                  />
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
);

export default DetailProduct;
