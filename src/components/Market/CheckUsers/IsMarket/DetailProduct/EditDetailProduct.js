import { Button, styled, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "../../../../../Localhost/Custumize-axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const EditDetailProduct = ({ DataDetail }) => {
  const { id } = useParams(); //Lấy id Product
  const [fillData, setFillData] = useState([]); //để fill dữ liệu;
  const [moveData, setMoveData] = useState([]); //để chuyển dữ liệu sang components khác xử lí
  const [newTemporaryData, setNewTemporaryData] = useState({
    namedetail: "",
    price: "",
    quantity: "",
    imagedetail: null, // Sử dụng null thay vì Data URL
  });
  const [imagePreview, setImagePreview] = useState("");
  const [imageEdit, setImageEdit] = useState("");
  const [editingIndex, setEditingIndex] = useState(null); // Index của mục đang được chỉnh sửa
  const geturlIMG = (detailProductId, filename) => {
    return `${axios.defaults.baseURL}files/detailProduct/${detailProductId}/${filename}`;
  };

  const loadData = async () => {
    try {
      const res = await axios.get(`/detailProduct/${id}`);
      setFillData(res.data);
      setMoveData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
    }else if(namedetail.length > 200){
      toast.warning("Tên phân loại không được lớn hơn 200 kí tự");
      return false;
    }

    if (!price) {
      toast.warning("Vui lòng nhập giá phân loại sản phẩm");
      return false;
    } else if (!parseFloat(price)) {
      toast.warning("Giá không hợp lệ");
      return false;
    } else if (parseFloat(price) <= 0 | parseFloat(price) < 1000) {
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

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    if (validate()) {
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
          id: id,
        },
      };

      formData.append("productDetail", JSON.stringify(productDetailToSend));

      try {
        if (editingIndex !== null) {
          await axios.put(`/detailProduct/${editingIndex}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          loadData();
          setMoveData((prevData) => [...prevData, productDetailToSend]);
          setImageEdit("");
          setEditingIndex(null);
        } else {
          const res = await axios.post("/detailProduct", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          setFillData((prevData) => [...prevData, res.data]);
          loadData();
          setMoveData((prevData) => [...prevData, productDetailToSend]);
        }
        // Reset form
        setNewTemporaryData({
          namedetail: "",
          price: "",
          quantity: "",
          imagedetail: null,
        });
        setImagePreview("");
        DataDetail([...moveData, productDetailToSend]); //Truyền dữ liệu đến components khác xử lí
        toast.success("Lưu dữ liệu thành công");
      } catch (error) {
        console.error(error.response.data);
        toast.error("Có lỗi xảy ra khi lưu dữ liệu");
      }
    }
  };

  useEffect(() => {
    DataDetail(moveData);
  }, [moveData, DataDetail]);

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

  return (
    <>
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
                  type="submit"
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
            </div>
          </div>
        </div>
        <div className="mt-2">
          <table
            className="table text-center"
            style={{ verticalAlign: "middle" }}
          >
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
              {fillData.map((fill) => (
                <tr key={fill.id}>
                  <td>
                    <img
                      src={geturlIMG(fill.id, fill.imagedetail)}
                      alt="Hình ảnh"
                      style={{ width: "100px", height: "100px" }}
                      className="img-fluid rounded-3"
                    />
                  </td>
                  <td>{fill.namedetail}</td>
                  <td>{fill.price}</td>
                  <td>{fill.quantity}</td>
                  <td>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default EditDetailProduct;
