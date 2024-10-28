import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Category from "../../CategoryProduct/Category";
import Brand from "../../Brand/Brand";
import Warranties from "../../Warranties/Warranties";
import { toast } from "react-toastify";
import axios from "../../../../../../Localhost/Custumize-axios";
import { Button, styled, TextField } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditDetailProduct from "../DetailProduct/EditDetailProduct";
import InfoDetailProduct from "./ChildrenForm/InfoDetailProduct";

const EditProduct = () => {
  const slug = useParams();
  const geturlIMG = (productId, filename) => {
    return `${axios.defaults.baseURL}files/product-images/${productId}/${filename}`;
  };
  const idStore = localStorage.getItem("idStore");
  const [images, setImages] = useState([]);
  const [lastClickTime, setLastClickTime] = useState(null);
  const clickTimeout = 300; // Thời gian tối đa giữa hai lần click (milisecond)
  const [isHiddenDetailPro, setIsHiddenDetailPro] = useState(false); //Điều kiện hiển thị chi tiết sản phẩm
  const [formEditProduct, setFormEditProduct] = useState({
    name: "",
    productcategory: "",
    trademark: "",
    warranties: "",
    size: "",
    specializedgame: "",
    description: "",
    store: idStore,
  });

  const maxFiles = 9;
  const changeLink = useNavigate();
  const [editDetailProduct, setEditDetailProduct] = useState([]);

  // Fill dữ liệu edit
  const fillData = async () => {
    try {
      const res = await axios.get(`product/${slug.slug}`);
      setFormEditProduct({
        ...res.data,
        productcategory: res.data.productcategory.id,
        trademark: res.data.trademark.id,
        warranties: res.data.warranties.id,
        productDetails: res.data.productDetails,
        store: idStore,
      });
      console.log(res.data);

      const resDetail = await axios.get(`/detailProduct/${res.data.id}`);

      // Kiểm tra nếu resDetail trả về là mảng, nếu không, trả về mảng rỗng
      const detailData = Array.isArray(resDetail.data) ? resDetail.data : [];

      // Đổ dữ liệu productDetails vào state
      const detailInputs = detailData.map((detail) => ({
        namedetail: detail.namedetail,
        price: detail.price,
        quantity: detail.quantity,
        imagedetail: detail.imagedetail,
      }));
      setEditDetailProduct(detailInputs);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Fill dữ liệu
    fillData();
  }, []);

  // Hàm xử lí sự kiện thay đổi File
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);

    if (files.length + images.length > maxFiles) {
      toast.warning("Bạn chỉ có thể tải tối đa 9 tấm hình");
      return;
    }

    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length !== files.length) {
      toast.warning("File không hợp lệ");
      return;
    }

    setImages((prevImages) => [...prevImages, ...imageFiles]);
  };

  // Hàm xử lí click để xóa ảnh
  const handleImageClick = (index) => {
    const now = Date.now();
    if (lastClickTime && now - lastClickTime < clickTimeout) {
      setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    } else {
      setLastClickTime(now);
    }
  };

  // Hàm xóa ảnh được fill lên từ API
  const handleDeleteImageClick = async (idImage) => {
    try {
      await axios.delete(`image/${idImage}`);
      fillData();
    } catch (error) {
      console.log(error);
    }
  };

  // Hàm xử lí sự kiện các thẻ input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormEditProduct((prevFormProduct) => ({
      ...prevFormProduct,
      [name]: value,
    }));
  };

  // Bắt lỗi
  const validate = () => {
    const {
      name,
      productcategory,
      trademark,
      warranties,
      size,
      description,
      specializedgame,
    } = formEditProduct;
    if (
      !name ||
      !size ||
      !description ||
      !productcategory ||
      !trademark ||
      !warranties ||
      !specializedgame
    ) {
      toast.warning("Vui lòng nhập đầy đủ thông tin.");
      return false;
    }

    if (name === "") {
      toast.warning("Nhập tên sản phẩm.");
      return false;
    } else if (name.length < 20) {
      toast.warning("Tên sản phẩm tối thiểu 20 kí tự.");
      return false;
    }

    if (description === "") {
      toast.warning("Vui lòng nhập mô tả.");
      return false;
    } else if (description.length < 250) {
      toast.warning("Mô tả không được ít hơn 250 kí tự");
      return false;
    }

    if (size === "") {
      toast.warning("Vui lòng nhập kích thước");
      return false;
    }
    return true;
  };

  // Hàm sửa sản phẩm
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (validate()) {
      const formData = new FormData();
      const productToSend = {
        ...formEditProduct,
        productcategory: { id: formEditProduct.productcategory },
        trademark: { id: formEditProduct.trademark },
        warranties: { id: formEditProduct.warranties },
        store: { id: formEditProduct.store },
      };
      formData.append(
        "product",
        new Blob([JSON.stringify(productToSend)], { type: "application/json" })
      );
      images.forEach((file) => formData.append("files", file));
      const idToast = toast.loading("Vui lòng chờ...");
      try {
        const response = await axios.put(
          `/productUpdate/${formEditProduct.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setTimeout(() => {
          toast.update(idToast, {
            render: "Cập nhật sản phẩm thành công",
            type: "success",
            isLoading: false,
            closeButton: true,
            autoClose: 5000,
          });
          changeLink("/profileMarket/listStoreProduct");
          setImages([]);
        }, 500);
      } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        toast.update(idToast, {
          render: "Đã xảy ra lỗi khi đăng sản phẩm!",
          type: "error",
          isLoading: false,
          closeButton: true,
          autoClose: 5000,
        });
      }
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

  const handleClickHidden = () => {
    setIsHiddenDetailPro(true);
  };

  useEffect(() => {
    // Chỉ cập nhật state nếu giá trị thay đổi
    if (editDetailProduct.length > 1) {
      setIsHiddenDetailPro(true);
    } else {
      setIsHiddenDetailPro(false);
    }
  }, [editDetailProduct]);

  const [receiveDataDetail, setReceiveDataDetail] = useState(0);

  const handleReceiveData = (data) => {
    setReceiveDataDetail(data);
  };

  useEffect(() => {
    if (receiveDataDetail === 1) {
      fillData();
    } else {
      fillData();
    }
  }, [receiveDataDetail]);

  return (
    <div className="row mt-4">
      {/* Product Info */}
      <div className="col-lg-12">
        <div className="bg-white rounded-4">
          <div className="card">
            <h3 className="text-center mt-4">Thông tin sản phẩm</h3>
            <div className="card-body">
              <div className="row">
                <div className="col-lg-6 border-end">
                  <div className="mb-3">
                    <TextField
                      label="Nhập tên sản phẩm"
                      id="outlined-size-small"
                      size="small"
                      name="name"
                      value={formEditProduct.name}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </div>
                  <div className="mb-3">
                    <TextField
                      id="outlined-multiline-static"
                      label="Mô tả sản phẩm"
                      multiline
                      rows={24}
                      name="description"
                      value={formEditProduct.description}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-3 border" id="bg-upload-img">
                    {formEditProduct.images &&
                      formEditProduct.images.map((image, index) => (
                        <img
                          key={index}
                          src={geturlIMG(formEditProduct.id, image.imagename)}
                          alt={`Current ${index}`}
                          className="img-fluid"
                          id="img-fill-product"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDeleteImageClick(image.id)}
                        />
                      ))}
                    {images.map((image, index) => (
                      <img
                        key={`new-${index}`}
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index}`}
                        className="img-fluid"
                        id="img-fill-product"
                        onClick={() => handleImageClick(index)}
                      />
                    ))}
                  </div>
                  <div className="mb-3">
                    <Button
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                      startIcon={<CloudUploadIcon />}
                      fullWidth
                      disableElevation
                    >
                      Tải hình ảnh sản phẩm
                      <VisuallyHiddenInput
                        type="file"
                        onChange={handleFileChange}
                        multiple
                      />
                    </Button>
                  </div>
                  <div className="mb-3" id="remember">
                    <p>
                      <span className="text-danger">Lưu ý</span>
                      <ul>
                        <li>Chọn ảnh tối đa 9 hình ảnh</li>
                        <li>
                          Nhấp double click (2 lần nhấn chuột) để xóa hình cần
                          xóa
                        </li>
                      </ul>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Detail product */}
      <div className="col-lg-12 col-md-12 col-sm-12">
        <div className="bg-white rounded-4 mt-3">
          <div className="card">
            <div className="row align-items-center p-3">
              <h3 className="col-lg-6 col-md-6 col-sm-6 w-25">
                Thông tin bán hàng
              </h3>
              <div className="col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end w-75">
                {isHiddenDetailPro ? (
                  <button
                    className="btn"
                    type="button"
                    onClick={() => setIsHiddenDetailPro(false)}
                  >
                    X
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn"
                    id="btn-add-productCate"
                    onClick={handleClickHidden}
                  >
                    Thêm phân loại bán hàng
                  </button>
                )}
              </div>
            </div>

            <div className="card-body">
              <EditDetailProduct
                idProduct={formEditProduct}
                isChangeFormEdit={isHiddenDetailPro}
                CountData={handleReceiveData}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Detailed Info */}
      <div className="col-lg-12">
      <InfoDetailProduct formProduct={formEditProduct} handleInputChange={handleInputChange}/>
      </div>
      {/* Form Actions */}
      <div className="mt-4 mb-4">
        <button className="btn mx-2" id="btn-addProduct" onClick={handleUpdate}>
          Cập nhật sản phẩm
        </button>
        <button
          className="btn mx-2"
          id="btn-resetProduct"
          type="button"
          onClick={() =>
            setFormEditProduct({
              name: "",
              productcategory: "",
              trademark: "",
              warranties: "",
              price: "",
              quantity: "",
              size: "",
              specializedgame: "",
              description: "",
              store: idStore,
            })
          }
        >
          Làm mới
        </button>
        <Link
          className="btn mx-2"
          id="btn-cancelProduct"
          to={"/profileMarket/listStoreProduct"}
        >
          Hủy
        </Link>
      </div>
    </div>
  );
};

export default EditProduct;
