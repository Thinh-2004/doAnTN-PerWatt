import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../../../../../../Localhost/Custumize-axios";
import { confirmAlert } from "react-confirm-alert";
import useSession from "../../../../../../Session/useSession";
import { toast } from "react-toastify";
import { Button } from "@mui/material";

const CheckItemProduct = () => {
  const { id } = useParams();
  const [FillDetailPr, setFillDetailPr] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [countProductStore, setCountProductStore] = useState(0);
  const itemsPerPage = 4;
  const [idClick, setIdClick] = useState("");
  const [typeId, setTypeId] = useState("");
  const findMoreProductRef = useRef(null); // Tạo ref cho phần tử cần cuộn đến
  const [countOrderBuyed, setCountOrderBuyed] = useState(0); // Lưu số lượng đã bán cho mỗi sản phẩm
  const geturlIMG = (productId, filename) => {
    return `${axios.defaults.baseURL}files/product-images/${productId}/${filename}`;
  };
  const geturlIMGStore = (userId, filename) => {
    return `${axios.defaults.baseURL}files/user/${userId}/${filename}`;
  };

  const loadProductDetail = async (id) => {
    try {
      const res = await axios.get(`product/${id}`);
      setFillDetailPr(res.data);
      if (res.data && res.data.store && res.data.store.id) {
        const storeRes = await axios.get(`/productStore/${res.data.store.id}`);
        setCountProductStore(storeRes.data.length);
      }
      if (res.data.id) {
        const countBuyed = await axios.get(`countOrderSuccess/${res.data.id}`);
        setCountOrderBuyed(countBuyed.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatCount = (count) => {
    if (count >= 1000000) {
      // Nếu số lượng lớn hơn hoặc bằng 1 triệu, chia cho 1 triệu và làm tròn đến 1 chữ số thập phân, sau đó thêm "tr".
      return `${(count / 1000000).toFixed(1)}tr`;
    } else if (count >= 1_000) {
      // Nếu số lượng lớn hơn hoặc bằng 1 nghìn nhưng nhỏ hơn 1 triệu, chia cho 1 nghìn và làm tròn đến 1 chữ số thập phân, sau đó thêm "K".
      return `${(count / 1000).toFixed(1)}K`;
    } else {
      // Nếu không thỏa các điều kiện, chuyển đổi số lượng thành chuỗi.
      return count.toString();
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    loadProductDetail(id);
  }, [id]);

  // Theo dõi sự thay đổi của idClick và typeId để cuộn đến phần tử
  useEffect(() => {
    if (findMoreProductRef.current) {
      findMoreProductRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [idClick, typeId]);

  const handleSelectImage = (index) => {
    setSelectedImage(index);
    setCurrentPage(Math.floor(index / itemsPerPage));
  };

  const formatPrice = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString("vi-VN"); // Định dạng theo kiểu Việt Nam
  };

  return (
    <>
      <div className="container mt-4">
        <Link className="btn btn-secondary mb-3" to={"/profileMarket"}>
          Quay về
        </Link>
        <div className="container mt-4">
          <div className="row bg-white rounded-4">
            <div className="col-md-4 border-end">
              <div
                id="carouselExampleDark"
                className="carousel carousel-dark slide position-relative"
              >
                <div
                  className="position-absolute top-50 start-50 translate-middle rounded-3"
                  id="text-sold-out"
                  style={{
                    display:
                      FillDetailPr && FillDetailPr.quantity === 0
                        ? "inline"
                        : "none",
                  }}
                >
                  <span className="text-white">Hết hàng</span>
                </div>
                <div className="carousel-inner">
                  {FillDetailPr &&
                  FillDetailPr.images &&
                  FillDetailPr.images.length > 0 ? (
                    FillDetailPr.images.map((image, index) => (
                      <div
                        key={index}
                        className={`carousel-item ${
                          index === selectedImage ? "active" : ""
                        }`}
                      >
                        <img
                          src={
                            FillDetailPr
                              ? geturlIMG(FillDetailPr.id, image.imagename)
                              : "/images/no_img.png"
                          }
                          className="d-block"
                          alt={FillDetailPr ? FillDetailPr.name : "No Image"}
                          style={{ width: "100%", height: "400px" }}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="carousel-item active">
                      <img
                        src="/images/no_img.png"
                        className="d-block"
                        alt=""
                        style={{ width: "100%", height: "400px" }}
                      />
                    </div>
                  )}
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselExampleDark"
                  data-bs-slide="prev"
                  onClick={() =>
                    handleSelectImage(
                      (selectedImage -
                        1 +
                        (FillDetailPr?.images?.length || 1)) %
                        (FillDetailPr?.images?.length || 1)
                    )
                  }
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselExampleDark"
                  data-bs-slide="next"
                  onClick={() =>
                    handleSelectImage(
                      (selectedImage + 1) % (FillDetailPr?.images?.length || 1)
                    )
                  }
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
              <div className="d-flex mt-2">
                {FillDetailPr &&
                  FillDetailPr.images &&
                  FillDetailPr.images.length > 0 &&
                  FillDetailPr.images
                    .slice(
                      currentPage * itemsPerPage,
                      (currentPage + 1) * itemsPerPage
                    )
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
                        aria-current={
                          index === selectedImage % itemsPerPage
                            ? "true"
                            : "false"
                        }
                        aria-label={`Slide ${index + 1}`}
                        onClick={() =>
                          handleSelectImage(currentPage * itemsPerPage + index)
                        }
                      >
                        <img
                          src={
                            FillDetailPr
                              ? geturlIMG(FillDetailPr.id, image.imagename)
                              : "/images/no_img.png"
                          }
                          className="img-thumbnail"
                          alt=""
                          style={{ width: "100px", height: "100px" }}
                        />
                      </button>
                    ))}
              </div>
            </div>
            <div className="col-md-8 d-flex flex-column">
              <div className="p-3 border-bottom">
                <h1 className="fst-italic" id="productName">
                  {FillDetailPr ? FillDetailPr.name : "No Name"}
                </h1>
              </div>
              <div className="d-flex justify-content-between">
                <div className="d-flex">
                  <div className="mx-2 mt-1">
                    <span htmlFor="">
                      <i className="bi bi-star-fill text-warning">
                        <label htmlFor="" className="fs-6">
                          5.0
                        </label>
                      </i>
                    </span>
                  </div>
                  <span className="border-end"></span>
                  <div className="mx-2 mt-1">
                    <span htmlFor="">
                      <strong htmlFor="">Số lượng đánh giá: </strong>
                      <label htmlFor="">999</label>
                    </span>
                  </div>
                  <span className="border-end"></span>
                  <div className="mx-2 mt-1">
                    <span htmlFor="">
                      <strong htmlFor="">Đã bán: </strong>
                      <label htmlFor=""> {countOrderBuyed || 0}</label>
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
                <p className="fs-5 p-1 mx-2">Giá:</p>
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
                          {FillDetailPr && FillDetailPr.productcategory
                            ? FillDetailPr.productcategory.name
                            : "N/A"}
                        </Link>
                      </li>
                      <li>
                        <label htmlFor="">Thương hiệu:</label>{" "}
                        <Link style={{ textDecoration: "none" }}>
                          {FillDetailPr && FillDetailPr.trademark
                            ? FillDetailPr.trademark.name
                            : "N/A"}
                        </Link>
                      </li>
                      <li>
                        <label htmlFor="">Thời hạn bảo hành:</label>{" "}
                        <span>
                          {FillDetailPr && FillDetailPr.warranties
                            ? FillDetailPr.warranties.name
                            : "N/A"}
                        </span>
                      </li>
                      <li>
                        <label htmlFor="">Kích thước:</label>{" "}
                        <span>{FillDetailPr ? FillDetailPr.size : "N/A"}</span>
                      </li>
                      <li>
                        <label htmlFor="">Hỗ trợ chơi game:</label>{" "}
                        <span>
                          {FillDetailPr && FillDetailPr.specializedgame === "Y"
                            ? "Có"
                            : "Không hỗ trợ"}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-lg-6 col-md-6 col-sm-6   ">
                  <div className="d-flex justify-content-start mt-3">
                    <button
                      className="btn border rounded-0 rounded-start"
                      id="buttonDown"
                      // onClick={() => handleDecrease(index)}
                    >
                      <i className="bi bi-dash-lg"></i>
                    </button>
                    <input
                      type="number"
                      min={0}
                      className="form-control rounded-0 w-50"
                      // value={cart.quantity}
                      readOnly
                    />
                    <button
                      className={`btn border rounded-0 rounded-end 
                               
                                `}
                      id="buttonUp"
                      // onClick={() => handleIncrease(index)}
                      // disabled={
                      //   cart.quantity >= cart.product.quantity
                      // }
                    >
                      <i className="bi bi-plus-lg"></i>
                    </button>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 align-content-end ">
                  <div className="d-flex">
                    <Button
                      className="btn w-75 h-75 rounded-3"
                      id="btn-buy-now"
                      disabled={FillDetailPr && FillDetailPr.quantity === 0}
                      disableElevation
                    >
                      <i className="bi bi-cash fs-5"></i>
                    </Button>
                    <Button
                      className="btn mx-2 w-75 h-25 rounded-3"
                      disableElevation
                      id="btn-add-card"
                      disabled={FillDetailPr && FillDetailPr.quantity === 0}
                    >
                      <i className="bi bi-cart-plus fs-5"></i>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row bg-white rounded-4 mt-3">
            <div className="col-lg-4 col-md-4 col-sm-4 border-end">
              <div className="d-flex justify-content-center">
                <div className="p-2 d-flex justify-content-center">
                  <img
                    src={
                      FillDetailPr && FillDetailPr.store
                        ? geturlIMGStore(
                            FillDetailPr.store.user.id,
                            FillDetailPr.store.user.avatar
                          )
                        : "/images/no_img.png"
                    }
                    alt=""
                    id="avt-store"
                  />
                </div>
                <div className=" mt-3 ">
                  <div className="text-center">
                    <span htmlFor="" className="fs-6">
                      {FillDetailPr && FillDetailPr.store
                        ? FillDetailPr.store.namestore
                        : "N/A"}
                    </span>
                  </div>
                  <div className="d-flex justify-content-center">
                    <button className="btn btn-sm mx-2" id="btn-infor-shop">
                      Xem thông tin
                    </button>
                    <button className="btn btn-sm" id="btn-chatMessage">
                      Nhắn tin shop
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8 col-md-8 col-sm-8">
              <div className="row mt-4">
                <div className="col-lg-4 col-md-4 col-sm-4">
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
      </div>
    </>
  );
};

export default CheckItemProduct;
