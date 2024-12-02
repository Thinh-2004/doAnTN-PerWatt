import React, { useCallback, useEffect, useRef, useState } from "react";
import "./FormProduct.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../../../../../Localhost/Custumize-axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  styled,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DetailProduct from "../DetailProduct/DetailProduct";
import InfoDetailProduct from "./ChildrenForm/InfoDetailProduct";

const FormProduct = () => {
  const idStore = localStorage.getItem("idStore");
  const [images, setImages] = useState([]);
  const [lastClickTime, setLastClickTime] = useState(null);
  const clickTimeout = 300; // Thời gian tối đa giữa hai lần click (milisecond)
  const [isHiddenDetailPro, setIsHiddenDetailPro] = useState(false); //Điều kiện hiển thị chi tiết sản phẩm
  const [detailProduct, setDetailProduct] = useState([]);
  const [isArrayDetail, setIsArrayDetail] = useState(false); //Đặt trang thái reload array detail
  const [formProduct, setFormProduct] = useState({
    name: "",
    productcategory: "",
    trademark: "",
    warranties: "",
    size: "",
    specializedgame: "",
    description: "",
    store: idStore,
  });

  const [charCount, setCharCount] = useState(0); // State để lưu số từ
  const [charCountDesception, setCharCountDesception] = useState(0); // State để lưu số từ
  const maxCharLimitName = 150; // Giới hạn ký tự
  const maxFiles = 9;

  // Xử lý khi người dùng chọn tệp
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

  const handleImageClick = (index) => {
    const now = Date.now();
    if (lastClickTime && now - lastClickTime < clickTimeout) {
      setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    } else {
      setLastClickTime(now);
    }
  };

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormProduct((prevFormProduct) => ({
      ...prevFormProduct,
      [name]: value,
    }));

    // Kiểm tra số ký tự trước khi cập nhật
    if (name === "name" && value.length > maxCharLimitName) {
      return; // Ngăn người dùng nhập nếu vượt quá 100 ký tự
    }

    // Đếm số từ trong trường 'name'
    if (name === "name") {
      const charCount = value.length;
      setCharCount(charCount);
    }

    if (name === "description") {
      const charCountDescription = value.length;
      setCharCountDesception(charCountDescription);
    }
  }, []);

  const detailProductRef = useRef();

  const validate = () => {
    const {
      name,
      productcategory,
      trademark,
      warranties,
      size,
      description,
      specializedgame,
    } = formProduct;

    if (detailProductRef.current) {
      const { valid, message } = detailProductRef.current.validateChild();

      if (!valid) {
        toast.warning(message);
        return false;
      }
    }

    if (
      !name &&
      !size &&
      !description &&
      !productcategory &&
      !trademark &&
      !warranties &&
      !specializedgame
    ) {
      toast.warning("Vui lòng nhập đầy đủ thông tin.");
      return false;
    } else {
      if (name === "") {
        toast.warning("Vui lòng nhập tên sản phẩm.");
        return false;
      } else if (name.length < 20) {
        toast.warning("Tên sản phẩm tối thiểu 20 kí tự.");
        return false;
      }

      if (description === "") {
        toast.warning("Vui lòng nhập mô tả sản phẩm.");
        return false;
      } else if (description.length <= 250) {
        toast.warning("Mô tả sản phẩm phải lớn hơn hoặc tối thiểu 250 kí tự");
        return false;
      }

      if (productcategory === "") {
        toast.warning("Cần chọn loại sản phẩm.");
        return false;
      }

      if (specializedgame === "") {
        toast.warning("Cần chọn chuyên dụng.");
        return false;
      }

      if (trademark === "") {
        toast.warning("Cần chọn thương hiệu.");
        return false;
      }

      if (warranties === "") {
        toast.warning("Cần chọn thời gian bảo hành.");
        return false;
      }

      if (size === "") {
        toast.warning("Cần nhập kích cỡ.");
        return false;
      }

      if ((images.length === 0) | (images === null)) {
        toast.warning("Cần nhập chọn hình sản phẩm.");
        return false;
      }

      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      // Tạo FormData để gửi đến server
      const formData = new FormData();
      // Kết hợp dữ liệu từ formProduct
      const { price, quantity, ...rest } = formProduct; // Sử dụng destructuring để loại bỏ
      const productToSend = {
        ...rest,
        productcategory: { id: formProduct.productcategory },
        trademark: { id: formProduct.trademark },
        warranties: { id: formProduct.warranties },
        store: { id: formProduct.store },
      };

      formData.append(
        "product",
        new Blob([JSON.stringify(productToSend)], { type: "application/json" })
      );
      // console.log(productToSend);

      formData.append(
        "productDetails",
        new Blob([JSON.stringify(detailProduct)], {
          type: "application/json",
        })
      );
      // console.log(detailProduct);
      //Kiểm tra detailProduct có phải là mảng
      if (Array.isArray(detailProduct)) {
        detailProduct.forEach((fileDetail) => {
          formData.append("fileDetails", fileDetail.imagedetail);
        });
      } else {
        console.log(detailProduct);
      }
      // Thêm các tệp tin vào FormData
      images.forEach((file) => {
        formData.append("files", file);
      });
      const id = toast.loading("Vui lòng chờ...");
      try {
        const response = await axios.post("/productCreate", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setTimeout(() => {
          toast.update(id, {
            render: "Sản phẩm đã được đăng thành công",
            type: "success",
            isLoading: false,
            closeButton: true,
            autoClose: 5000,
          });
          setFormProduct({
            name: "",
            productcategory: "",
            trademark: "",
            warranties: "",
            size: "",
            specializedgame: "",
            description: "",
            store: idStore,
          });
          setImages([]);
          setDetailProduct([]); // Reset dữ liệu chi tiết sản phẩm
          setIsArrayDetail(true); //đặt trang thái reloadArray cho detail
          // Đặt lại giá trị đếm kí tự
          setCharCount(0);
          setCharCountDesception(0);
        }, 500);
      } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        toast.update(id, {
          render: "Lỗi xảy ra khi tạo sản phẩm, Vui lòng thử lại",
          type: "error",
          isLoading: false,
          closeButton: true,
          autoClose: 5000,
        });
      }
    }
  };

  useEffect(() => {
    if (isArrayDetail) {
      //Đặt lại setIsArratDetail cho lần thêm sản phẩm sau
      const timer = setTimeout(() => {
        setIsArrayDetail(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isArrayDetail]);

  const handleClickHidden = () => {
    setIsHiddenDetailPro(true);
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

  const handleDataChange = useCallback((dataDetail) => {
    setDetailProduct(dataDetail);
    console.log(dataDetail);
  }, []);

  return (
    <div className="row mt-4">
      <form onSubmit={handleSubmit}>
        {/* Product Info */}
        <div className="col-lg-12 col-md-12 col-sm-12">
          <div className="rounded-4">
            <Card
              sx={{ backgroundColor: "backgroundElement.children" }}
              className=""
            >
              <Typography variant="h4" className="text-center mt-4">
                Thông tin sản phẩm
              </Typography>
              <CardContent className="">
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-6 border-end">
                    <div className="mb-3">
                      <TextField
                        label="Nhập tên sản phẩm"
                        id="outlined-size-small"
                        size="small"
                        name="name"
                        value={formProduct.name}
                        onChange={handleInputChange}
                        fullWidth
                        inputProps={{ maxLength: maxCharLimitName }} // Giới hạn trực quan cho người dùng
                      />
                      <label>
                        {charCount}/{maxCharLimitName}
                      </label>{" "}
                      {/* Hiển thị số từ */}
                    </div>
                    <div className="mb-3">
                      <TextField
                        id="outlined-multiline-static"
                        label="Mô tả sản phẩm"
                        multiline
                        rows={23}
                        name="description"
                        value={formProduct.description}
                        onChange={handleInputChange}
                        fullWidth
                      />
                      <label htmlFor="">{charCountDesception} kí tự</label>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 ">
                    <div className="mb-3 border" id="bg-upload-img">
                      {images.map((image, index) => (
                        <Tooltip title="Double click để xóa">
                          <img
                            key={index}
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index}`}
                            className="img-fluid"
                            id="img-fill-product"
                            onClick={() => handleImageClick(index)}
                            style={{ cursor: "pointer" }}
                          />
                        </Tooltip>
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
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Detail product */}
        <div className="col-lg-12 col-md-12 col-sm-12">
          <Box className="rounded-4 mt-3">
            <Card sx={{ backgroundColor: "backgroundElement.children" }}>
              <div className="row align-items-center p-3">
                <h3 className="col-lg-6 col-md-6 col-sm-6 w-25">
                  Thông tin bán hàng
                </h3>
                <div className="col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end w-75">
                  {isHiddenDetailPro ? (
                    <Button
                      sx={{ color: "text.primary" }}
                      type="button"
                      onClick={() => setIsHiddenDetailPro(false)}
                    >
                      X
                    </Button>
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
                <DetailProduct
                  DataDetail={handleDataChange}
                  reloadArrayDetail={isArrayDetail}
                  isChangeForm={isHiddenDetailPro}
                  ref={detailProductRef}
                />
              </div>
            </Card>
          </Box>
        </div>
        {/* Detailed Info */}
        <div className="col-lg-12 col-md-12 col-sm-12">
          <InfoDetailProduct
            formProduct={formProduct}
            handleInputChange={handleInputChange}
          />
        </div>
        {/* Form Actions */}
        <div className="mt-4 mb-4">
          <button className="btn mx-2" id="btn-addProduct" type="submit">
            Đăng sản phẩm
          </button>
          <button
            className="btn mx-2"
            id="btn-resetProduct"
            type="button"
            onClick={() => {
              setFormProduct({
                name: "",
                productcategory: "",
                trademark: "",
                warranties: "",
                size: "",
                specializedgame: "",
                description: "",
                store: idStore,
              });
              setIsArrayDetail(true);
              //Đặt lại đếm kí tự
              setCharCount(0);
              setCharCountDesception(0);
            }}
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
      </form>
    </div>
  );
};

export default FormProduct;
