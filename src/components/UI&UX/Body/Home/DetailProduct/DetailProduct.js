import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../../../Header/Header";
import axios from "../../../../../Localhost/Custumize-axios";
import "./DetailProduct.css";

const DetailProduct = () => {
  const { id } = useParams();
  const geturlIMG = (productId, filename) => {
    return `${axios.defaults.baseURL}files/product-images/${productId}/${filename}`;
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

      //kiểm ra và lấy id Strore trong API phía trên
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

  return (
    <>
      <Header />
      <div className="container mt-4">
        <div className="row bg-white rounded-4">
          <div className="col-md-4 border-end">
            <div
              id="carouselExampleDark"
              className="carousel carousel-dark slide"
            >
              <div className="carousel-inner">
                {FillDetailPr &&
                  FillDetailPr.images &&
                  FillDetailPr.images.map((image, index) => (
                    <div
                      key={index}
                      className={`carousel-item ${
                        index === selectedImage ? "active" : ""
                      }`}
                    >
                      <img
                        src={geturlIMG(FillDetailPr.id, image.imagename)}
                        className="d-block"
                        alt={FillDetailPr.name}
                        style={{ width: "100%", height: "400px" }}
                      />
                    </div>
                  ))}
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleDark"
                data-bs-slide="prev"
                onClick={() =>
                  handleSelectImage(
                    (selectedImage - 1 + FillDetailPr.images.length) %
                      FillDetailPr.images.length
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
                    (selectedImage + 1) % FillDetailPr.images.length
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
                        src={geturlIMG(FillDetailPr.id, image.imagename)}
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
              <h1 className="fst-italic">
                {FillDetailPr && FillDetailPr.name}
              </h1>
            </div>
            <div className="d-flex justify-content-between">
              <div className="d-flex">
                <div className="mx-2 mt-1">
                  <span htmlFor="" className="">
                    <i class="bi bi-star-fill text-warning">
                      <label htmlFor="" className="fs-6">
                        5.0
                      </label>
                    </i>
                  </span>
                </div>
                <span className="border-end"></span>
                <div className="mx-2 mt-1">
                  <span htmlFor="" className="">
                    <strong htmlFor="">Số lượng đánh giá</strong> :{" "}
                    <label htmlFor="">999</label>
                  </span>
                </div>
                <span className="border-end"></span>
                <div className="mx-2 mt-1">
                  <span htmlFor="" className="">
                    <strong htmlFor="">Đã bán</strong> :{" "}
                    <label htmlFor="">10k</label>
                  </span>
                </div>
              </div>
              <div className="d-flex justify-content-end">
                <span htmlFor="" className="">
                  <strong htmlFor="" className="me-2">
                    {FillDetailPr && FillDetailPr.quantity}
                  </strong>
                  <label htmlFor="">sản phẩm còn lại</label>
                </span>
              </div>
            </div>
            <div className="bg-light w-100 h-25 mt-4 rounded-4">
              <p className="fs-5 p-0 mx-2">Giá:</p>
              <div className="d-flex align-items-center">
                <del className="text-secondary fs-5 mx-3">
                  {formatPrice(3000000)}đ{" "}
                </del>
                <span className="text-danger fw-bold fs-3 mx-3">
                  {formatPrice(FillDetailPr && FillDetailPr.price)}đ
                </span>
              </div>
            </div>
            <div>
              <p className="p-3 fst-italic fs-5 m-0">Thông tin cơ bản</p>
              <ul>
                <li>
                  <label htmlFor="">Loại sản phẩm:</label>{" "}
                  <Link style={{ textDecoration: "none" }}>
                    {FillDetailPr && FillDetailPr.productcategory.name}
                  </Link>
                </li>
                <li>
                  <label htmlFor="">Thương hiệu:</label>{" "}
                  <Link style={{ textDecoration: "none" }}>
                    {FillDetailPr && FillDetailPr.trademark.name}
                  </Link>
                </li>
                <li>
                  <label htmlFor="">Thời hạn bảo hành:</label>{" "}
                  <span>{FillDetailPr && FillDetailPr.warranties.name}</span>
                </li>
                <li>
                  <label htmlFor="">Kích thước:</label>{" "}
                  <span>{FillDetailPr && FillDetailPr.size}</span>
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
        <div className="row bg-white rounded-4 mt-3">
          <div className="col-lg-4 border-end">
            <div className="p-4 d-flex">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvc-WNCIy7rBlDWNzbw5NYYmodCs0KWoG2pg&s"
                alt=""
                id="avt-store"
              />
              <div className="mt-3">
                <span htmlFor="" className="fs-5 mx-3">
                  {FillDetailPr && FillDetailPr.store.namestore}
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
            <span className="p-0 m-0"><hr /></span>
            <span id="description">{FillDetailPr && FillDetailPr.description}</span>
          </div>
        </div>
        <div className="row bg-white rounded-4 mt-3">
          <div className="p-3">
            <h4>Đánh giá sản phẩm</h4>
            <span className="p-0 m-0"><hr /></span>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailProduct;
