import { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import axios from "../../../../../Localhost/Custumize-axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import useSession from "../../../../../Session/useSession";
import Header from "../../../Header/Header";
import './DetailProduct.css'

const DetailProduct = () => {
  const { id } = useParams();
  const [idUser] = useSession("id");
  const changeLink = useNavigate();
  const geturlIMG = (productId, filename) => {
    return `${axios.defaults.baseURL}files/product-images/${productId}/${filename}`;
  };
  const geturlIMGStore = (storeId, filename) => {
    return `${axios.defaults.baseURL}files/store/${storeId}/${filename}`;
  };
  const [FillDetailPr, setFillDetailPr] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [countProductStore, setCountProductStore] = useState(0);
  const itemsPerPage = 4;

  const loadProductDetail = async (id) => {
    try {
      const res = await axios.get(`product/${id}`);
      setFillDetailPr(res.data);

      if (res.data && res.data.store && res.data.store.id) {
        const storeRes = await axios.get(`/productStore/${res.data.store.id}`);
        setCountProductStore(storeRes.data.length);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadProductDetail(id);
  }, [id]);

  const handleSelectImage = (index) => {
    setSelectedImage(index);
    setCurrentPage(Math.floor(index / itemsPerPage));
  };

  const formatPrice = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString("vi-VN"); // Định dạng theo kiểu Việt Nam
  };

  const addToCart = async (productId) => {
    const userId = idUser; // Thay thế bằng ID người dùng thực tế
    if (userId == null || userId === "") {
      confirmAlert({
        title: "Bạn chưa đăng nhập",
        message:
          "Hãy đăng nhập để có thể thêm hoặc mua sản phẩm yêu thích của bạn",
        buttons: [
          {
            label: "Đi tới đăng nhập",
            onClick: () => {
              const toastId = toast.loading("Vui lòng chờ...");
              setTimeout(() => {
                toast.update(toastId, {
                  render: "Chuyển tới form đăng nhập thành công",
                  type: "message",
                  isLoading: false,
                  autoClose: 5000,
                  closeButton: true,
                });
                changeLink("/login");
              }, 500);
            },
          },
          {
            label: "Hủy",
          },
        ],
      });
      return;
    }

    const cartItem = {
      quantity: 1,
      user: { id: userId },
      product: { id: productId },
    };

    try {
      const response = await axios.post("/cart/add", cartItem);
      console.log("Added to cart:", response.data);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
    window.location.reload();
  };

  return (
    <>
      <Header />
      <div className="container mt-4">
        <div className="row bg-white rounded-4">
          <div className="col-md-4 border-end">
            <div id="carouselExampleDark" className="carousel carousel-dark slide">
              <div className="carousel-inner">
                {FillDetailPr && FillDetailPr.images && FillDetailPr.images.length > 0 ? (
                  FillDetailPr.images.map((image, index) => (
                    <div key={index} className={`carousel-item ${index === selectedImage ? "active" : ""}`}>
                      <img
                        src={FillDetailPr ? geturlIMG(FillDetailPr.id, image.imagename) : "/images/no_img.png"}
                        className="d-block"
                        alt={FillDetailPr ? FillDetailPr.name : "No Image"}
                        style={{ width: "100%", height: "400px" }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="carousel-item active">
                    <img src="/images/no_img.png" className="d-block" alt="" style={{ width: "100%", height: "400px" }} />
                  </div>
                )}
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleDark"
                data-bs-slide="prev"
                onClick={() =>
                  handleSelectImage((selectedImage - 1 + (FillDetailPr?.images?.length || 1)) % (FillDetailPr?.images?.length || 1))
                }
              >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleDark"
                data-bs-slide="next"
                onClick={() =>
                  handleSelectImage((selectedImage + 1) % (FillDetailPr?.images?.length || 1))
                }
              >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
            <div className="d-flex mt-2">
              {FillDetailPr &&
                FillDetailPr.images &&
                FillDetailPr.images.length > 0 &&
                FillDetailPr.images
                  .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
                  .map((image, index) => (
                    <button
                      id="btn-children-img"
                      key={index}
                      type="button"
                      data-bs-target="#carouselExampleDark"
                      data-bs-slide-to={index}
                      className={`carousel-indicator-button mb-2 ${
                        index === selectedImage % itemsPerPage ? "active" : ""
                      }`}
                      aria-current={index === selectedImage % itemsPerPage ? "true" : "false"}
                      aria-label={`Slide ${index + 1}`}
                      onClick={() => handleSelectImage(currentPage * itemsPerPage + index)}
                    >
                      <img
                        src={FillDetailPr ? geturlIMG(FillDetailPr.id, image.imagename) : "/images/no_img.png"}
                        className="img-thumbnail"
                        alt=""
                        style={{ width: "100px", height: "100px" }}
                      />
                    </button>
                  ))}
            </div>
          </div>
          <div className="col-md-8">
            <div className="p-3 border-bottom">
              <h1 className="fst-italic">{FillDetailPr ? FillDetailPr.name : "No Name"}</h1>
            </div>
            <div className="d-flex justify-content-between">
              <div className="d-flex">
                <div className="mx-2 mt-1">
                  <span htmlFor="">
                    <i className="bi bi-star-fill text-warning">
                      <label htmlFor="" className="fs-6">5.0</label>
                    </i>
                  </span>
                </div>
                <span className="border-end"></span>
                <div className="mx-2 mt-1">
                  <span htmlFor="">
                    <strong htmlFor="">Số lượng đánh giá</strong> :{" "}
                    <label htmlFor="">999</label>
                  </span>
                </div>
                <span className="border-end"></span>
                <div className="mx-2 mt-1">
                  <span htmlFor="">
                    <strong htmlFor="">Đã bán</strong> :{" "}
                    <label htmlFor="">10k</label>
                  </span>
                </div>
              </div>
              <div className="d-flex justify-content-end">
                <span htmlFor="">
                  <strong htmlFor="" className="me-2">
                    {FillDetailPr ? FillDetailPr.quantity : "N/A"}
                  </strong>
                  <label htmlFor="">sản phẩm còn lại</label>
                </span>
              </div>
            </div>
            <div className="bg-light w-100 h-25 mt-4 rounded-4">
              <p className="fs-5 p-0 mx-2">Giá:</p>
              <div className="d-flex align-items-center">
                <del className="text-secondary fs-5 mx-3">
                  {formatPrice(3000000)}đ
                </del>
                <span className="text-danger fw-bold fs-3 mx-3">
                  {formatPrice(FillDetailPr ? FillDetailPr.price : 0)}đ
                </span>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div>
                  <p className="p-3 fst-italic fs-5 m-0">Thông tin cơ bản</p>
                  <ul>
                    <li>
                      <label htmlFor="">Loại sản phẩm:</label>{" "}
                      <Link style={{ textDecoration: "none" }}>
                        {FillDetailPr && FillDetailPr.productcategory ? FillDetailPr.productcategory.name : "N/A"}
                      </Link>
                    </li>
                    <li>
                      <label htmlFor="">Thương hiệu:</label>{" "}
                      <Link style={{ textDecoration: "none" }}>
                        {FillDetailPr && FillDetailPr.trademark ? FillDetailPr.trademark.name : "N/A"}
                      </Link>
                    </li>
                    <li>
                      <label htmlFor="">Thời hạn bảo hành:</label>{" "}
                      <span>
                        {FillDetailPr && FillDetailPr.warranties ? FillDetailPr.warranties.name : "N/A"}
                      </span>
                    </li>
                    <li>
                      <label htmlFor="">Kích thước:</label>{" "}
                      <span>{FillDetailPr ? FillDetailPr.size : "N/A"}</span>
                    </li>
                    <li>
                      <label htmlFor="">Hỗ trợ chơi game:</label>{" "}
                      <span>
                        {FillDetailPr && FillDetailPr.specializedgame === "Y" ? "Có" : "Không hỗ trợ"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-6 d-flex flex-column">
                <div className="d-flex align-items-end mt-auto">
                  <button className="btn btn-sm btn-outline-success w-100 rounded-3">
                    <i className="bi bi-cash fs-6"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-outline-primary mx-2 w-100 rounded-3"
                    onClick={() => addToCart(FillDetailPr ? FillDetailPr.id : null)}
                  >
                    <i className="bi bi-cart-plus fs-6"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row bg-white rounded-4 mt-3">
          <div className="col-lg-4 border-end">
            <div className="p-4 d-flex">
              <img
                src={FillDetailPr && FillDetailPr.store ? geturlIMGStore(FillDetailPr.store.id, FillDetailPr.store.imgbackgound) : "/images/no_img.png"}
                alt=""
                id="avt-store"
              />
              <div className="mt-3">
                <span htmlFor="" className="fs-6 mx-3">
                  {FillDetailPr && FillDetailPr.store ? FillDetailPr.store.namestore : "N/A"}
                </span>
                <button className="btn btn-sm btn-outline-info mx-2">
                  Xem thông tin
                </button>
                <button className="btn btn-sm btn-outline-secondary">
                  Xem nhắn tin
                </button>
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="row mt-4">
              <div className="col-lg-4">
                <div className="d-flex justify-content-between">
                  <label htmlFor="">Sản phẩm đã đăng bán:</label>
                  <span>{countProductStore}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row bg-white rounded-4 mt-3">
          <div className="p-3">
            <h4>Thông tin chi tiết sản phẩm</h4>
            <span className="p-0 m-0">
              <hr />
            </span>
            <span id="description">
              {FillDetailPr ? FillDetailPr.description : "N/A"}
            </span>
          </div>
        </div>
        <div className="row bg-white rounded-4 mt-3">
          <div className="p-3">
            <h4>Đánh giá sản phẩm</h4>
            <span className="p-0 m-0">
              <hr />
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailProduct;
