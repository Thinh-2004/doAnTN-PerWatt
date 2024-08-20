import React, { useState } from "react";
import "./FormProduct.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Category from "../../CategoryProduct/Category";
import Brand from "../../Brand/Brand";
import Warranties from "../../Warranties/Warranties";
import useSession from "../../../../../../Session/useSession";
import axios from "../../../../../../Localhost/Custumize-axios";

const FormProduct = () => {
  const [idStore] = useSession("idStore");
  const [images, setImages] = useState([]);
  const [lastClickTime, setLastClickTime] = useState(null);
  const clickTimeout = 300; // Thời gian tối đa giữa hai lần click (milisecond)
  const [formProduct, setFormProduct] = useState({
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
  });

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

    setFormProduct((prevFormProduct) => ({
      ...prevFormProduct,
      [name]: value,
    }));
  };

  const validate = () => {
    const {
      name,
      productcategory,
      trademark,
      warranties,
      price,
      quantity,
      size,
      description,
      specializedgame,
    } = formProduct;
    //Biểu thức chính quy
    const pattenSize = /^(?:\d+x\d+x\d+|\d+inch(?: \d+inch)*)$/i;
    if (
      !name &&
      !price &&
      !quantity &&
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
      if (price === "") {
        toast.warning("Vui lòng nhập giá sản phẩm.");
        return false;
      } else if (!parseFloat(price)) {
        toast.warning("Giá không hợp lệ");
        return false;
      }

      if (quantity === "") {
        toast.warning("Vui lòng nhập số lượng sản phẩm.");
        return false;
      } else if (!parseInt(quantity)) {
        toast.warning("Số lượng sản phẩm không hợp lệ.");
        return false;
      }

      if (description === "") {
        toast.warning("Vui lòng nhập mô tả sản phẩm.");
        return false;
      }

      if (productcategory === "") {
        toast.warning("Cần loại sản phẩm.");
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
      const formData = new FormData();
      const productToSend = {
        ...formProduct,
        productcategory: {
          id: formProduct.productcategory,
        },
        trademark: {
          id: formProduct.trademark,
        },
        warranties: {
          id: formProduct.warranties,
        },
        store: {
          id: formProduct.store,
        },
      };
      formData.append(
        "product",
        new Blob([JSON.stringify(productToSend)], { type: "application/json" })
      );
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
            price: "",
            quantity: "",
            size: "",
            specializedgame: "",
            description: "",
            store: idStore,
          });
          setImages([]);
        }, 500);
      } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        toast.error("Đã xảy ra lỗi khi đăng sản phẩm!");
      }
    }
  };

  return (
    <div className="row mt-4">
      <form onSubmit={handleSubmit}>
        {/* Product Info */}
        <div className="col-lg-12">
          <div className="bg-white rounded-4">
            <div className="card">
              <h3 className="text-center mt-4">Thông tin sản phẩm</h3>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-6 border-end">
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nhập tên sản phẩm"
                        name="name"
                        value={formProduct.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-3">
                      <div className="d-flex">
                        <input
                          type="text"
                          placeholder="Nhập giá sản phẩm"
                          className="form-control me-2"
                          name="price"
                          value={formProduct.price}
                          onChange={handleInputChange}
                        />
                        <input
                          type="number"
                          placeholder="Nhập số lượng"
                          className="form-control"
                          name="quantity"
                          value={formProduct.quantity}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <textarea
                        placeholder="Mô tả sản phẩm"
                        className="form-control"
                        rows={12}
                        name="description"
                        value={formProduct.description}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3 border" id="bg-upload-img">
                      {images.map((image, index) => (
                        <img
                          key={index}
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index}`}
                          className="img-fluid"
                          onClick={() => handleImageClick(index)}
                        />
                      ))}
                    </div>
                    <div className="mb-3">
                      <input
                        type="file"
                        className="form-control"
                        multiple
                        onChange={handleFileChange}
                      />
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
        {/* Detailed Info */}
        <div className="col-lg-12">
          <div className="bg-white rounded-4 mt-3">
            <div className="card">
              <h3 className="mx-4 mt-4">Thông tin chi tiết</h3>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-6">
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
                  <div className="col-lg-6 border-start">
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
