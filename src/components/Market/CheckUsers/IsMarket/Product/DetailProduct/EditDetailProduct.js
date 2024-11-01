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
import React, { useState, useEffect } from "react";
import axios from "../../../../../../Localhost/Custumize-axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

const EditDetailProduct = ({ CountData, idProduct, isChangeFormEdit }) => {
  const [fillData, setFillData] = useState([]); //để fill dữ liệu;
  const [isHiddenDetailPro, setIsHiddenDetailPro] = useState(isChangeFormEdit); //Điều kiện hiển thị chi tiết sản phẩm
  const [newTemporaryData, setNewTemporaryData] = useState({
    namedetail: "",
    price: "",
    quantity: "",
    imagedetail: null,
  });
  const [dataEdit, setDataEdit] = useState({
    namedetail: "",
    price: "",
    quantity: "",
    imagedetail: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [imageEdit, setImageEdit] = useState("");
  const [editingIndex, setEditingIndex] = useState(null); // Index của mục đang được chỉnh sửa
  const geturlIMG = (detailProductId, filename) => {
    return `${axios.defaults.baseURL}files/detailProduct/${detailProductId}/${filename}`;
  };

  const formatPrice = (value) => {
    // Xóa các ký tự không phải số
    const numberString = value.replace(/\D/g, "");

    if (numberString === "") return "";

    // Format lại giá trị với dấu phẩy phân cách
    return Number(numberString).toLocaleString();
  };

  const loadData = async () => {
    try {
      const res = await axios.get(`/detailProduct/${idProduct.id}`);
      setFillData(res.data);
      // Kiểm tra dữ liệu trả về
      if (Array.isArray(res.data) && res.data.length > 0) {
        setDataEdit(res.data[0]);
      } else {
        console.warn("Dữ liệu trả về không hợp lệ hoặc mảng trống.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (idProduct) {
      loadData();
    }
  }, [idProduct]);

  //Hiển thị bảng chi tiết sản phẩm
  useEffect(() => {
    if (fillData && fillData.length > 1) {
      const hasEmptyDetails = fillData.some(
        (detail) => !detail.namedetail || !detail.imagedetail
      );
      setIsHiddenDetailPro(!hasEmptyDetails);
    } else if (fillData && fillData.length <= 1) {
      setIsHiddenDetailPro(false);
    }
  }, [fillData]);

  //Set boolean để thay đổi giao diện phân loại không cần components cha
  useEffect(() => {
    setIsHiddenDetailPro(isChangeFormEdit);
  }, [isChangeFormEdit]);

  const handleFormInputChange = (id, e) => {
    const { name, value } = e.target;

    // setDataEdit((prevData) => {
    //   const newData = prevData.map((item) => {
    //     if (item.id === id) {
    //       if (name === "price") {
    //         const numberString = value.replace(/\D/g, "");
    //         return {
    //           ...item,
    //           [name]: numberString,
    //         };
    //       } else {
    //         return {
    //           ...item,
    //           [name]: value,
    //         };
    //       }
    //     }
    //     return item;
    //   });
    //   return newData;
    // });

    // Cập nhật trực tiếp cho đối tượng dataEdit
    setDataEdit((prevData) => {
      if (prevData.id === id) {
        if (name === "price") {
          const numberString = value.replace(/\D/g, "");
          return {
            ...prevData,
            [name]: numberString, // Cập nhật trường price
          };
        } else {
          return {
            ...prevData,
            [name]: value, // Cập nhật các trường khác
          };
        }
      }
      return prevData;
    });
  };

  const handleListInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "price") {
      const numberString = value.replace(/\D/g, "");
      const formattedValue =
        numberString === "" ? "" : formatPrice(numberString);

      setNewTemporaryData((prevData) => ({
        ...prevData,
        [name]: numberString,
        formattedPrice: formattedValue,
      }));
    } else {
      setNewTemporaryData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const validateIsTrue = () => {
    const { namedetail, price, quantity, imagedetail } = newTemporaryData;
    const priceString = String(price);

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
    } else if (priceString.replace(/\D/g, "") < 1000) {
      toast.warning("Giá không được nhỏ hơn 1.000");
      return false;
    }

    if (!quantity) {
      toast.warning("Vui lòng nhập số lượng sản phẩm.");
      return false;
    } else if (!parseInt(quantity)) {
      toast.warning("Số lượng phân loại sản phẩm không hợp lệ.");
      return false;
    } else if (parseInt(quantity) < 0) {
      toast.warning("Số lượng không được nhỏ hơn hoặc bằng 0");
      return false;
    }

    if (!imagedetail) {
      toast.warning("Vui lòng chọn hình ảnh.");
      return false;
    }

    return true;
  };
  const validateIsFalse = () => {
    const { price, quantity } = dataEdit;
    const priceString = String(price);
    if (!price) {
      toast.warning("Vui lòng nhập giá phân loại sản phẩm");
      return false;
    } else if (!parseFloat(price)) {
      toast.warning("Giá không hợp lệ");
      return false;
    } else if (priceString.replace(/\D/g, "") < 1000) {
      toast.warning("Giá không được nhỏ hơn 1.000");
      return false;
    }

    if (!quantity) {
      toast.warning("Vui lòng nhập số lượng phân loại sản phẩm.");
      return false;
    } else if (!parseInt(quantity)) {
      toast.warning("Số lượng phân loại sản phẩm không hợp lệ.");
      return false;
    } else if (parseInt(quantity) < 0) {
      toast.warning("Số lượng không được nhỏ hơn hoặc bằng 0");
      return false;
    }

    return true;
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    if (validateIsTrue()) {
      const formData = new FormData();
      // Thêm file vào FormData
      if (newTemporaryData.imagedetail) {
        formData.append("file", newTemporaryData.imagedetail);
      }

      // Thêm JSON của productDetail vào FormData
      const productDetailToSend = {
        namedetail: newTemporaryData.namedetail,
        price: newTemporaryData.price,
        quantity: newTemporaryData.quantity,
        product: {
          id: idProduct.id,
        },
      };

      formData.append("productDetail", JSON.stringify(productDetailToSend));

      try {
        if (editingIndex !== null) {
          await axios.put(`/detailProduct/${editingIndex}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          loadData();
          setImageEdit("");
          setEditingIndex(null);
        } else {
          const res = await axios.post("/detailProduct", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          setFillData((prevData) => [...prevData, res.data]);
          loadData();
        }
        // Reset form
        setNewTemporaryData({
          namedetail: "",
          price: "",
          quantity: "",
          imagedetail: null,
        });
        setImagePreview("");
        toast.success("Lưu dữ liệu thành công");
      } catch (error) {
        console.error(error.response.data);
        toast.error("Có lỗi xảy ra khi lưu dữ liệu");
      }
    }
  };

  const handleUpdate = async (id) => {
    console.log(id);
    if (validateIsFalse()) {
      // const detailToUpdate = fillData.find((item) => item.id === id);
      // Kiểm tra nếu dataEdit là mảng
      const detailToUpdate = Array.isArray(dataEdit)
        ? dataEdit.find((item) => item.id === id)
        : dataEdit; // Nếu dataEdit không phải là mảng, dùng trực tiếp đối tượng

      const formData = new FormData();
      // Thêm file vào FormData
      if (newTemporaryData.imagedetail) {
        formData.append("file", newTemporaryData.imagedetail);
      }

      // Thêm JSON của productDetail vào FormData
      const productDetailToSend = {
        namedetail: detailToUpdate.namedetail || null,
        price: detailToUpdate.price,
        quantity: detailToUpdate.quantity,
        product: {
          id: idProduct.id,
        },
        imagedetail: detailToUpdate.imagedetail || null,
      };
      console.log(productDetailToSend);

      formData.append("productDetail", JSON.stringify(productDetailToSend));

      try {
        await axios.put(`/detailProduct/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Cập nhật thành công");
        loadData();
        setImageEdit("");
        setEditingIndex(null);
      } catch (error) {
        toast.error("Cập nhật thất bại");
        console.log(error);
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Sử dụng URL.createObjectURL để hiển thị hình ảnh xem trước
      setNewTemporaryData((prevData) => ({
        ...prevData,
        imagedetail: file,
      }));
    }
    setImageEdit("");
  };

  const handleEdit = async (id) => {
    const itemToEdit = fillData.find((fill) => fill.id === id);
    setNewTemporaryData({
      namedetail: itemToEdit.namedetail,
      price: itemToEdit.price,
      quantity: itemToEdit.quantity,
      imagedetail: itemToEdit.imagedetail,
    });
    setImageEdit(itemToEdit.imagedetail);
    setEditingIndex(id); // Có thể lưu trữ id để tham chiếu sau này
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/detailProduct/${id}`);
      setFillData((prevData) => prevData.filter((item) => item.id !== id));
      toast.success("Xóa dữ liệu thành công");
      loadData();
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi xóa dữ liệu");
    }
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
    // Chỉ cập nhật state nếu giá trị thay đổi
    if (fillData.length > 1) {
      setIsHiddenDetailPro(true);
      CountData(2);
    } else {
      setIsHiddenDetailPro(false);
      CountData(1);
    }
  }, [fillData]);

  return (
    <>
      <div className=" shadow">
        <Card sx={{backgroundColor: "backgroundElement.children"}}>
          <CardContent className="">
            {isHiddenDetailPro ? ( //Show bảng và form phân loại
              <div className="row">
                <div className="col-lg-4 col-md-4 col-sm-4 mb-3">
                  <TextField
                    label="Nhập tên phân loại"
                    id="outlined-size-small"
                    size="small"
                    name="namedetail"
                    value={newTemporaryData.namedetail}
                    onChange={handleListInputChange}
                    fullWidth
                  />
                </div>
                <div className="col-lg-4 col-md-4 col-sm-4 mb-3">
                  <TextField
                    label="Nhập giá sản phẩm"
                    id="outlined-size-small"
                    size="small"
                    name="price"
                    value={formatPrice(newTemporaryData.price.toString())}
                    onChange={handleListInputChange}
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
                    onChange={handleListInputChange}
                    fullWidth
                  />
                </div>
                <div className="mt-2 mb-2">
                  <Button
                    color="success"
                    style={{ textTransform: "none", fontSize: "15px" }}
                    onClick={handleAddOrUpdate}
                    className="me-4"
                    type="submit"
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
                    Tải hình phân loại
                    <VisuallyHiddenInput
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </Button>
                </div>
                {imageEdit ? (
                  <div>
                    <div htmlFor="">Ảnh được chỉnh sửa</div>
                    <img
                      src={geturlIMG(editingIndex, imageEdit)}
                      alt="Ảnh xem edit"
                      style={{ width: "100px", height: "100px" }}
                      className="img-fluid rounded-3"
                    />
                  </div>
                ) : (
                  <div hidden={imagePreview === ""}>
                    <div>Ảnh xem trước</div>
                    <img
                      src={imagePreview}
                      alt="Ảnh xem trước"
                      style={{ width: "100px", height: "100px" }}
                      className="img-fluid rounded-3"
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
                          <TableCell align="center">Số lượng phân loại</TableCell>
                          <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                      {fillData.map((fill) => (
                        <TableRow key={fill.id}>
                          <TableCell align="center">
                            <img
                              src={geturlIMG(fill.id, fill.imagedetail)}
                              alt="Hình ảnh"
                              style={{ width: "100px", height: "100px" }}
                              className="img-fluid rounded-3"
                            />
                          </TableCell>
                          <TableCell align="center">{fill.namedetail}</TableCell>
                          <TableCell align="center">{formatPrice(fill.price.toString())}</TableCell>
                          <TableCell align="center">{fill.quantity}</TableCell>
                          <TableCell align="center">
                            <Button
                              onClick={() => handleEdit(fill.id)} // Truyền id vào đây
                              color="primary"
                              startIcon={<EditIcon />}
                              size="small"
                              className="me-2"
                            >
                              Sửa
                            </Button>
                            <Button
                              onClick={() => handleDelete(fill.id)}
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
              //Show form phâm loại
              <>
                {/* {fillData.map((detailInput, index) => (
                  <>
                    <div
                      key={detailInput.id}
                      className="d-flex justify-content-between"
                    >
                      <TextField
                        label="Nhập giá sản phẩm"
                        size="small"
                        name="price"
                        value={formatPrice(detailInput.price.toString())}
                        onChange={(e) =>
                          handleFormInputChange(detailInput.id, e)
                        }
                        fullWidth
                        className="me-2"
                      />
                      <TextField
                        label="Nhập số lượng"
                        size="small"
                        name="quantity"
                        value={detailInput.quantity}
                        onChange={(e) =>
                          handleFormInputChange(detailInput.id, e)
                        }
                        fullWidth
                      />
                    </div>
                    <Button
                      color="success"
                      style={{ textTransform: "none", fontSize: "15px" }}
                      onClick={() => handleUpdate(detailInput.id)}
                      className="mx-2 mt-2 me-2"
                      type="button"
                    >
                      Cập nhật
                    </Button>
                  </>

                ))} */}
                <div className="d-flex justify-content-between">
                  <TextField
                    label="Nhập giá sản phẩm"
                    size="small"
                    name="price"
                    value={formatPrice(dataEdit.price.toString())}
                    onChange={(e) => handleFormInputChange(dataEdit.id, e)}
                    fullWidth
                    className="me-2"
                  />
                  <TextField
                    label="Nhập số lượng"
                    size="small"
                    name="quantity"
                    value={dataEdit.quantity}
                    onChange={(e) => handleFormInputChange(dataEdit.id, e)}
                    fullWidth
                  />
                </div>
                <Button
                  color="success"
                  style={{ textTransform: "none", fontSize: "15px" }}
                  onClick={() => handleUpdate(dataEdit.id)}
                  className=" mt-2 me-2"
                  type="button"
                  variant="outlined"
                >
                  Cập nhật
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default EditDetailProduct;
