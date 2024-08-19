import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Category from "../../CategoryProduct/Category";
import Brand from "../../Brand/Brand";
import Warranties from "../../Warranties/Warranties";
import { toast } from "react-toastify";
import useSession from "../../../../../../Session/useSession";
import axios from "../../../../../../Localhost/Custumize-axios";

const EditProduct = () => {
  const { id } = useParams();
  const geturlIMG = (productId, filename) => {
    return `${axios.defaults.baseURL}files/product-images/${productId}/${filename}`;
  };
  const [idStore] = useSession("idStore");
  const [images, setImages] = useState([]);
  const [lastClickTime, setLastClickTime] = useState(null);
  const clickTimeout = 300; // Thời gian tối đa giữa hai lần click (milisecond)
  const [formEditProduct, setFormEditProduct] = useState({
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
  const changeLink = useNavigate();

  // Fill dữ liệu edit
  const fillData = async (id) => {
    try {
      const res = await axios.get(`product/${id}`);
      setFormEditProduct({
        ...res.data,
        productcategory: res.data.productcategory.id,
        trademark: res.data.trademark.id,
        warranties: res.data.warranties.id,
        store: idStore,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fillData(id);
  }, [id]);

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
      fillData(id);
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
      price,
      quantity,
      size,
      description,
      specializedgame,
    } = formEditProduct;
    const pattenSize = /^(?:\d+x\d+x\d+|\d+inch(?: \d+inch)*)$/i;
    if (
      !name ||
      !price ||
      !quantity ||
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

    if (price === "") {
      toast.warning("Vui lòng nhập giá sản phẩm");
      return false;
    } else if (!parseFloat(price)) {
      toast.warning("Giá sản phẩm không hợp lệ");
      return false;
    }

    if (quantity === "") {
      toast.warning("Vui lòng nhập số lượng.");
      return false;
    } else if (!parseInt(quantity)) {
      toast.warning("Số lượng sản phẩm không hợp lệ.");
      return false;
    }

    if(description === ""){
      toast.warning("Vui lòng nhập mô tả.");
      return false;
    }else if(description.length < 250){
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

      try {
        const idToast = toast.loading("Vui lòng chờ...");
        const response = await axios.put(`/productUpdate/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
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
        toast.error("Đã xảy ra lỗi khi đăng sản phẩm!");
      }
    }
  };

  return (
    <div className="row mt-4">
      <form onSubmit={handleUpdate}>
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
                        value={formEditProduct.name}
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
                          value={formEditProduct.price}
                          onChange={handleInputChange}
                        />
                        <input
                          type="number"
                          placeholder="Nhập số lượng"
                          className="form-control"
                          name="quantity"
                          value={formEditProduct.quantity}
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
                        value={formEditProduct.description}
                        onChange={handleInputChange}
                      ></textarea>
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
        <div className="col-lg-12">
          <div className="bg-white rounded-4 mt-3">
            <div className="card">
              <h3 className="mx-4 mt-4">Thông tin chi tiết</h3>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="mb-4 d-flex">
                      <Category
                        name="productcategory"
                        value={formEditProduct.productcategory}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-4 d-flex">
                      <Brand
                        name="trademark"
                        value={formEditProduct.trademark}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-4 d-flex">
                      <Warranties
                        name="warranties"
                        value={formEditProduct.warranties}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 border-start">
                    <div className="mb-4 d-flex">
                      <select
                        name="specializedgame"
                        className="form-select"
                        value={formEditProduct.specializedgame}
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
                        value={formEditProduct.size}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 mb-4">
          <button className="btn mx-2" id="btn-addProduct" type="submit">
            Đăng sản phẩm
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
      </form>
    </div>
  );
};

export default EditProduct;
