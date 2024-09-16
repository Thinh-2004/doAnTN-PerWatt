import { useEffect, useRef, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import axios from "../../../../Localhost/Custumize-axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import useSession from "../../../../Session/useSession";
import Header from "../../../Header/Header";
import "./ShowDetailProduct.css";
import FindMoreProduct from "../FindMoreProduct/FindMoreProduct";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const DetailProduct = () => {
  const { id } = useParams();
  const [idUser] = useSession("id");
  const changeLink = useNavigate();
  const [FillDetailPr, setFillDetailPr] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [countProductStore, setCountProductStore] = useState(0);
  const itemsPerPage = 4;
  const [idClick, setIdClick] = useState("");
  const [typeId, setTypeId] = useState("");
  const findMoreProductRef = useRef(null); // Tạo ref cho phần tử cần cuộn đến
  const [countOrderBuyed, setCountOrderBuyed] = useState(0); // Lưu số lượng đã bán cho mỗi sản phẩm
  const [isCountCart, setIsCountAddCart] = useState(false); //Truyền dữ liệu từ cha đến con
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1); //trạng thái cho số lượng trước khi thêm giỏ hàng
  const geturlIMG = (productId, filename) => {
    return `${axios.defaults.baseURL}files/product-images/${productId}/${filename}`;
  };
  const geturlIMGStore = (userId, filename) => {
    return `${axios.defaults.baseURL}files/user/${userId}/${filename}`;
  };
  const geturlImgDetailProduct = (detailId, filename) => {
    return `${axios.defaults.baseURL}files/detailProduct/${detailId}/${filename}`;
  };
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [selectedIdDetail, setSelectedIdDetail] = useState(null);
  const [fillDetail, setFilDetail] = useState([]);
  const loadProductDetail = async () => {
    try {
      const res = await axios.get(`product/${id}`);
      setFillDetailPr(res.data);

      const resDetail = await axios.get(`/detailProduct/${res.data.id}`);
      const detailData = Array.isArray(resDetail.data) ? resDetail.data : [];
      setFilDetail(detailData);

      // Lọc giá sản phẩm
      const prices = detailData.map((filter) => filter.price);
      const dataMinPrice = Math.min(...prices);
      const dataMaxPrice = Math.max(...prices);

      setMinPrice(dataMinPrice);
      setMaxPrice(dataMaxPrice);

      // Tổng số lượng sản phẩm
      const totalDetailQuantity = detailData.reduce(
        (total, detailQuantity) => total + detailQuantity.quantity,
        0
      );
      setTotalQuantity(totalDetailQuantity);

      // Đếm số lượng sản phẩm đã bán
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
    loadProductDetail();
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
      quantity: quantity,
      user: { id: userId },
      product: { id: productId },
    };

    try {
      const response = await axios.post("/cart/add", cartItem);
      console.log("Added to cart:", response.data);
      setIsCountAddCart(true);
      toast.success("Thêm sản phẩm thành công!");
    } catch (error) {
      toast.error("Thêm sản phẩm thất bại!" + error);
      console.error("Error adding to cart:", error);
    }
  };

  const handleChangeQuantity = (e) => {
    var value = parseInt(e.target.value, 10); // chuyển đổi giá trị được nhập vào và chuyển đổi số thập phân (10)
    if (value > FillDetailPr.quantity) value = FillDetailPr.quantity;
    else if (value < 1) value = 1;
    setQuantity(value);
  };

  const handleClickIdCateOrIdBrand = (idCateOrBrand, typeId) => {
    setIdClick(idCateOrBrand);
    setTypeId(typeId);
    console.log(idCateOrBrand, typeId);
  };

  const handleViewStoreInfo = () => {
    const storeId = FillDetailPr.store.id;
    if (storeId) {
      changeLink(`/pageStore/${storeId}`); // Điều hướng đến trang thông tin của store
    }
  };

  const [popUpImage, setPopUpImage] = useState(null);
  const handleClickOpen = (image) => {
    setPopUpImage(image);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //detailProduct
  const handleClickIdDetail = (idDetail) => () => {
    setSelectedIdDetail(idDetail);
    const selectedProduct = fillDetail.find(
      (detail) => detail.id === idDetail
    );

    if (selectedProduct) {
      setTotalQuantity(selectedProduct.quantity);
      setMinPrice(selectedProduct.price);
      setMaxPrice(selectedProduct.price);
    }
  };

  return (
    <>
      <Header reloadCartItems={isCountCart} />
      <div className="container mt-4">
        <div className="row bg-white rounded-4">
          <div className="col-md-4 col-lg-4 col-sm-4 border-end">
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
              <div
                className="carousel-inner align-content-center"
                style={{ height: "575px" }}
              >
                {FillDetailPr &&
                FillDetailPr.images &&
                FillDetailPr.images.length > 0 ? (
                  FillDetailPr.images.map((image, index) => (
                    <div
                      key={index}
                      className={`carousel-item  ${
                        index === selectedImage ? "active" : ""
                      }`}
                    >
                      <div
                        variant="outlined"
                        onClick={() => handleClickOpen(image)}
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          src={
                            FillDetailPr
                              ? geturlIMG(FillDetailPr.id, image.imagename)
                              : "/images/no_img.png"
                          }
                          className="d-block object-fit-cover"
                          alt={FillDetailPr ? FillDetailPr.name : "No Image"}
                          style={{ width: "100%", height: "100%" }}
                        />
                      </div>
                      <Dialog
                        open={open}
                        keepMounted
                        onClose={handleClose}
                        aria-describedby="alert-dialog-slide-description"
                        disableScrollLock={true}
                        fullWidth
                        maxWidth="xl"
                      >
                        <DialogContent>
                          <img
                            src={
                              popUpImage
                                ? geturlIMG(
                                    FillDetailPr.id,
                                    popUpImage.imagename
                                  )
                                : ""
                            }
                            className="d-block"
                            alt={FillDetailPr ? FillDetailPr.name : "No Image"}
                            style={{ width: "100%", height: "100%" }}
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClose}>Thoát</Button>
                        </DialogActions>
                      </Dialog>
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
                    (selectedImage - 1 + (FillDetailPr?.images?.length || 1)) %
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
          <div className="col-md-8 col-lg-8 col-sm-8 d-flex flex-column">
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
                    <label htmlFor="">
                      {formatCount(countOrderBuyed || 0)}
                    </label>
                  </span>
                </div>
              </div>
              <div className="d-flex justify-content-end">
                <span htmlFor="">
                  <strong htmlFor="" className="me-2">
                    {totalQuantity ? totalQuantity : 0}
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
                  {minPrice === maxPrice
                    ? formatPrice(minPrice) + " đ"
                    : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}` +
                      " đ"}
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
                      <Link
                        style={{ textDecoration: "none" }}
                        onClick={() =>
                          handleClickIdCateOrIdBrand(
                            FillDetailPr.productcategory.id,
                            "category"
                          )
                        }
                      >
                        {FillDetailPr && FillDetailPr.productcategory
                          ? FillDetailPr.productcategory.name
                          : "N/A"}
                      </Link>
                    </li>
                    <li>
                      <label htmlFor="">Thương hiệu:</label>{" "}
                      <Link
                        style={{ textDecoration: "none" }}
                        onClick={() =>
                          handleClickIdCateOrIdBrand(
                            FillDetailPr.trademark.id,
                            "brand"
                          )
                        }
                      >
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
              <div className="col-lg-6 col-md-6 col-sm-6 ">
                <div className="d-flex justify-content-start mt-3">
                  <TextField
                    id="outlined-number"
                    label="Số lượng"
                    type="number"
                    name="quantity"
                    value={quantity}
                    onChange={handleChangeQuantity}
                    inputProps={{ min: 1 }} //đặt giá trị nhỏ nhất là
                    slotProps={{
                      inputLabel: {
                        shrink: true, // cho phép Label lên xuống TextField
                      },
                    }}
                    size="small"
                  />
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
                    onClick={() =>
                      addToCart(FillDetailPr ? FillDetailPr.id : null)
                    }
                    disabled={FillDetailPr && FillDetailPr.quantity === 0}
                  >
                    <i className="bi bi-cart-plus fs-5"></i>
                  </Button>
                </div>
              </div>
              <div
                className="mt-2 mb-2"
                hidden={
                  !(
                    fillDetail &&
                    fillDetail.length > 0 &&
                    fillDetail.some(
                      (detail) => detail.namedetail !== null
                    )
                  )
                }
              >
                <p className="p-3 fst-italic fs-5 m-0">Phân loại sản phẩm</p>
                <div
                  className="bg-light rounded-3 p-2 m-2 d-flex flex-wrap overflow-auto"
                  style={{ height: "70%" }}
                >
                  {fillDetail &&
                    fillDetail.length > 0 &&
                    fillDetail.map((fillDetail, index) => (
                      <div
                        className={`d-flex align-items-center text-nowrap rounded-2 p-2 m-2 position-relative ${
                          selectedIdDetail === fillDetail.id
                            ? "active-selected-detailProduct"
                            : "hover-idDetailProduct"
                        }`}
                        key={fillDetail.id}
                        id={`${
                          selectedIdDetail === fillDetail.id
                            ? "active-selected-detailProduct"
                            : "hover-idDetailProduct"
                        }`}
                        onClick={handleClickIdDetail(fillDetail.id)}
                      >
                        <img
                          src={geturlImgDetailProduct(
                            fillDetail.id,
                            fillDetail.imagedetail
                          )}
                          alt="Ảnh phân loại sản phẩm"
                          className="img-fluid"
                          style={{ maxWidth: "50px", maxHeight: "50px" }}
                        />
                        <label className="ms-2">{fillDetail.namedetail}</label>
                        <div
                          className="position-absolute bottom-0 end-0"
                          hidden={selectedIdDetail !== fillDetail.id}
                        >
                          <CheckCircleOutlineIcon
                            style={{ color: "#00C7FF" }}
                          />
                        </div>
                      </div>
                    ))}
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
                  <button
                    className="btn btn-sm mx-2"
                    onClick={handleViewStoreInfo}
                    id="btn-infor-shop"
                  >
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
        <div ref={findMoreProductRef}>
          <FindMoreProduct
            idClick={idClick}
            filterType={typeId}
          ></FindMoreProduct>
        </div>
      </div>
    </>
  );
};
export default DetailProduct;
