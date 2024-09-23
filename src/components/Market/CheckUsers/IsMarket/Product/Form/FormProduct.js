import React, { useState } from "react";
import "./FormProduct.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Category from "../../CategoryProduct/Category";
import Brand from "../../Brand/Brand";
import Warranties from "../../Warranties/Warranties";
import useSession from "../../../../../../Session/useSession";
import axios from "../../../../../../Localhost/Custumize-axios";
import { Button, styled, TextField } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DetailProduct from "../../DetailProduct/DetailProduct";

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

  const [priceAndQuantity, setPriceAndQuantity] = useState({
    price: "",
    quantity: "",
  });

  const [charCount, setCharCount] = useState(0); // State để lưu số từ
  const [charCountDesception, setCharCountDesception] = useState(0); // State để lưu số từ
  const maxCharLimitName = 100; // Giới hạn ký tự
  const maxCharLimitDesception = 250; // Giới hạn ký tự
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Cập nhật formProduct và priceAndQuantity
    setFormProduct((prevFormProduct) => ({
      ...prevFormProduct,
      [name]: value,
    }));

    if (name === "price" || name === "quantity") {
      setPriceAndQuantity((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Kiểm tra số ký tự trước khi cập nhật
    if (name === "name" && value.length > maxCharLimitName) {
      return; // Ngăn người dùng nhập nếu vượt quá 100 ký tự
    }

    // Đếm số từ trong trường 'name'
    if (name === "name") {
      const charCount = value.length;
      setCharCount(charCount);
    }

    if(name === "description"){
      const charCountDescription = value.length;
      setCharCountDesception(charCountDescription);
    }
  };
  const handleInputChangePriceAndQuantity = (e) => {
    const { name, value } = e.target;
    setPriceAndQuantity((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

    const { price, quantity } = priceAndQuantity;

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

      // if(price === ""){
      //   toast.warning("Cần nhập giá sản phẩm");
      //   return false;
      // }else if(!parseFloat(price)){
      //   toast.warning("Giá không hợp lệ");
      //   return false;
      // }else if(parseFloat(price) <= 0 | parseFloat(price) > 1000){
      //   toast.warning("Giá không được nhỏ hơn 1.000");
      //   return false;
      // }

      // if(quantity === ""){
      //   toast.warning("Cần nhập số lượng sản phẩm");
      //   return false;
      // }else if(!parseInt(quantity)){
      //   toast.warning("Số lượng không hợp lệ");
      //   return false;
      // }else if(parseInt(quantity) <= 0){
      //   toast.warning("Số lượng không được nhỏ hơn hoặc bằng 0");
      //   return false;
      // }

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

      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      // Tạo FormData để gửi đến server
      const formData = new FormData();
      // Kết hợp dữ liệu từ formProduct
      const productToSend = {
        ...formProduct,
        productcategory: { id: formProduct.productcategory },
        trademark: { id: formProduct.trademark },
        warranties: { id: formProduct.warranties },
        store: { id: formProduct.store },
      };

      formData.append(
        "product",
        new Blob([JSON.stringify(productToSend)], { type: "application/json" })
      );
      console.log(productToSend);

      // Kiểm tra nếu detailProduct rỗng
      if (detailProduct.length === 0) {
        const nullProductDetails = [
          {
            price: priceAndQuantity.price,
            quantity: priceAndQuantity.quantity,
          },
        ];
        formData.append(
          "productDetails",
          new Blob([JSON.stringify(nullProductDetails)], {
            type: "application/json",
          })
        );
        console.log(nullProductDetails);
      } else {
        formData.append(
          "productDetails",
          new Blob([JSON.stringify(detailProduct)], {
            type: "application/json",
          })
        );
        detailProduct.forEach((fileDetail) => {
          formData.append("fileDetails", fileDetail.imagedetail);
        });
        console.log(detailProduct);
      }

      // Thêm các tệp tin vào FormData
      images.forEach((file) => {
        formData.append("files", file);
      });

      try {
        const id = toast.loading("Vui lòng chờ...");
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
          setPriceAndQuantity({ price: "", quantity: "" }); // Reset giá và số lượng
          setIsArrayDetail(true); //đặt trang thái reloadArray cho detail
        }, 500);
      } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        toast.error("Đã xảy ra lỗi khi đăng sản phẩm!");
      }
    }
  };

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

  const handleDataChange = (newData) => {
    setDetailProduct(newData);
    // console.log(newData);
  };

  return (
    <div className="row mt-4">
      <form onSubmit={handleSubmit}>
        {/* Product Info */}
        <div className="col-lg-12 col-md-12 col-sm-12">
          <div className="bg-white rounded-4">
            <div className="card">
              <h3 className="text-center mt-4">Thông tin sản phẩm</h3>
              <div className="card-body">
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
                      <label>{charCount}/100</label> {/* Hiển thị số từ */}
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
                        <img
                          key={index}
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index}`}
                          className="img-fluid"
                          id="img-fill-product"
                          onClick={() => handleImageClick(index)}
                          style={{ cursor: "pointer" }}
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
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="mx-4 mt-4">Thông tin bán hàng</h3>
                {isHiddenDetailPro ? (
                  <button
                    className="btn me-4"
                    type="button"
                    onClick={() => setIsHiddenDetailPro(false)}
                  >
                    X
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn me-4"
                    id="btn-add-productCate"
                    onClick={handleClickHidden}
                  >
                    Thêm phân loại bán hàng
                  </button>
                )}
              </div>

              <div className="card-body">
                {isHiddenDetailPro ? (
                  <DetailProduct
                    DataDetail={handleDataChange}
                    reloadArrayDetail={isArrayDetail}
                  />
                ) : (
                  <div className="d-flex justify-content-between">
                    <TextField
                      label="Nhập giá sản phẩm"
                      id="outlined-size-small"
                      size="small"
                      name="price"
                      value={priceAndQuantity.price}
                      onChange={handleInputChangePriceAndQuantity}
                      fullWidth
                      className="me-2"
                    />
                    <TextField
                      label="Nhập số lượng"
                      id="outlined-size-small"
                      size="small"
                      name="quantity"
                      value={priceAndQuantity.quantity}
                      onChange={handleInputChangePriceAndQuantity}
                      fullWidth
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Detailed Info */}
        <div className="col-lg-12 col-md-12 col-sm-12">
          <div className="bg-white rounded-4 mt-3">
            <div className="card">
              <h3 className="mx-4 mt-4">Thông tin chi tiết</h3>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="mb-4 d-flex">
                      {/* Category Component */}
                      <Category
                        name="productcategory"
                        value={formProduct.productcategory}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-4 d-flex">
                      {/* Brand Component */}
                      <Brand
                        name="trademark"
                        value={formProduct.trademark}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-4 d-flex">
                      {/* Warranties Component */}
                      <Warranties
                        name="warranties"
                        value={formProduct.warranties}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 border-start">
                    <div className="mb-4 d-flex">
                      <select
                        name="specializedgame"
                        className="form-select"
                        value={formProduct.specializedgame}
                        onChange={handleInputChange}
                      >
                        <option value="" className="text-secondary" hidden>
                          Chuyên dụng game
                        </option>
                        <option value="Y">Có</option>
                        <option value="N">Không</option>
                      </select>
                    </div>
                    <div className="mb-4 d-flex">
                      <input
                        type="text"
                        placeholder="Nhập kích cỡ (dài x rộng x cao)"
                        className="form-control"
                        name="size"
                        value={formProduct.size}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
            onClick={() =>
              setFormProduct({
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
      </form>
    </div>
  );
};

export default FormProduct;
