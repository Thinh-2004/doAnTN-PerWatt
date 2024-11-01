import { useContext, useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import axios from "../../../../Localhost/Custumize-axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../../Header/Header";
import "./ShowDetailProduct.css";
import { Box, Button, TextField, useTheme } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ListImageDetailProduct from "./ListImageDetailProduct";
import NavStore from "./NavStore";
import { ThemeModeContext } from "../../../ThemeMode/ThemeModeProvider";

const DetailProduct = () => {
  const { slug } = useParams();
  const changeLink = useNavigate();
  const [FillDetailPr, setFillDetailPr] = useState(null);
  const [countProductStore, setCountProductStore] = useState(0);
  const [countOrderBuyed, setCountOrderBuyed] = useState(0); // Lưu số lượng đã bán cho mỗi sản phẩm
  const [isCountCart, setIsCountAddCart] = useState(false); //Truyền dữ liệu từ cha đến con

  const [quantity, setQuantity] = useState(1); //trạng thái cho số lượng trước khi thêm giỏ hàng
  const [productDetailIds, setproductDetailIds] = useState(null);

  const geturlImgDetailProduct = (detailId, filename) => {
    return `${axios.defaults.baseURL}files/detailProduct/${detailId}/${filename}`;
  };
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [selectedIdDetail, setSelectedIdDetail] = useState(null);
  const [fillDetail, setFilDetail] = useState([]); //fill phân loại sản phẩm
  const {mode} = useContext(ThemeModeContext);

  const loadProductDetail = async () => {
    try {
      //api gọi sản phẩm
      const res = await axios.get(`product/${slug}`);
      setFillDetailPr(res.data);

      //api gọi detail product
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

      // Đếm số lượng sản phẩm đã đăng bán
      if (res.data && res.data.store && res.data.store.id) {
        const storeRes = await axios.get(
          `/countBySlugProduct/${res.data.store.id}`
        );
        setCountProductStore(storeRes.data.length);
      }

      //Đếm số lượng sản phẩm đã bán được
      if (resDetail.data) {
        //Duyệt từng chi tiết sản phẩm để lấy số lượng đã bán
        const countOrderBy = await Promise.all(
          resDetail.data.map(async (detail) => {
            const res = await axios.get(`countOrderSuccess/${detail.id}`);
            return res.data;
          })
        );

        //Tính tổng số lượng đã bán được
        const countQuantityOrderBy = countOrderBy.reduce(
          (count, quantity) => count + quantity,
          0
        );
        setCountOrderBuyed(countQuantityOrderBy);
        console.log(countQuantityOrderBy);
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
  }, [slug]);

  const formatPrice = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString("vi-VN"); // Định dạng theo kiểu Việt Nam
  };

  const addToCart = async (productId) => {
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null; // Thay thế bằng ID người dùng thực tế
    if (user == null || user === "") {
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
      user: { id: user.id },
      productDetail: { id: productDetailIds },
    };
    // console.log("ở đây nè id product " + productDetailIds);
    // console.log("ở đây nè số lượng " + quantity);

    try {
      const response = await axios.post("/cart/add", cartItem);
      // console.log("Added to cart:", response.data);
      setIsCountAddCart(true);
      toast.success("Thêm sản phẩm thành công!");
    } catch (error) {
      toast.error("Thêm sản phẩm thất bại!" + error);
      console.error("Error adding to cart:", error);
    }
  };

  const handleChangeQuantity = (e) => {
    var value = parseInt(e.target.value, 10); // chuyển đổi giá trị được nhập vào và chuyển đổi số thập phân (10)
    if (value > totalQuantity) value = totalQuantity;
    else if (value < 1) value = 1;
    setQuantity(value);
  };

  const handleClickIdDetail = (idDetail) => () => {
    setSelectedIdDetail(idDetail);
    const selectedProduct = fillDetail.find((detail) => detail.id === idDetail);

    if (selectedProduct) {
      setTotalQuantity(selectedProduct.quantity);
      setMinPrice(selectedProduct.price);
      setMaxPrice(selectedProduct.price);
      setQuantity(1);
    }

    setproductDetailIds(idDetail);
  };

  useEffect(() => {
    //số lượng của sản phẩm chi tiết
    if (fillDetail.length === 1) {
      setproductDetailIds(fillDetail[0].id);
    } else {
      setproductDetailIds(null);
    }
    // console.log(totalQuantity);
  }, [fillDetail]);

  return (
    <>
      <Header reloadCartItems={isCountCart} />
      <div className="container mt-4">
        <Box
          className="row rounded-4 shadow"
          sx={{ backgroundColor: "backgroundElement.children" }}
        >
          <div className="col-md-4 col-lg-4 col-sm-4 border-end">
            <ListImageDetailProduct
              dataImage={FillDetailPr}
              totalQuantity={totalQuantity}
            />
          </div>

          <div className="col-md-8 col-lg-8 col-sm-8 d-flex flex-column">
            <div className="p-3 border-bottom">
              <h1 className="fst-italic" id="productName">
                {FillDetailPr?.store?.taxcode && (
                  <img
                    src="/images/IconShopMall.png"
                    alt=""
                    className="rounded-circle me-2"
                    style={{ width: "4%", height: "4%" }}
                  />
                )}
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
            <div
              className={`w-100 h-25 mt-4 rounded-4 ${
                mode === "light" ? "bg-light" : "border"
              } `}
            >
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
                        to={`/findMoreProduct/${FillDetailPr?.productcategory?.name}`}
                      >
                        {FillDetailPr && FillDetailPr.productcategory
                          ? FillDetailPr.productcategory.name
                          : null}
                      </Link>
                    </li>
                    <li>
                      <label htmlFor="">Thương hiệu:</label>{" "}
                      <Link
                        style={{ textDecoration: "none" }}
                        to={`/findMoreProduct/${FillDetailPr?.trademark?.name}`}
                      >
                        {FillDetailPr && FillDetailPr.trademark
                          ? FillDetailPr.trademark.name
                          : null}
                      </Link>
                    </li>
                    <li>
                      <label htmlFor="">Thời hạn bảo hành:</label>{" "}
                      <span>
                        {FillDetailPr && FillDetailPr.warranties
                          ? FillDetailPr.warranties.name
                          : null}
                      </span>
                    </li>
                    <li>
                      <label htmlFor="">Kích thước:</label>
                      <span>
                        {FillDetailPr
                          ? FillDetailPr.size.split("\n").map((line, index) => (
                              <span
                                key={index}
                                style={{
                                  display: index === 0 ? "" : "block", // Mỗi dòng hiển thị trên một dòng mới
                                  paddingLeft: index === 0 ? "5px" : "90px", // Không thụt lề dòng đầu tiên, thụt lề các dòng sau
                                }}
                              >
                                {line}
                              </span>
                            ))
                          : "N/A"}
                      </span>
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
                <div className="d-flex justify-content-start mt-3 mb-3">
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
                    disabled={totalQuantity === 0}
                    disableElevation
                  >
                    <i className="bi bi-cash fs-5"></i>
                  </Button>
                  <Button
                    className="btn mx-2 w-75 h-25 rounded-3"
                    disableElevation
                    id="btn-add-card"
                    onClick={() => {
                      if (!productDetailIds || productDetailIds.length > 1) {
                        toast.warning("Bạn chưa chọn loại sản phẩm");
                      } else {
                        addToCart(FillDetailPr ? FillDetailPr.id : null);
                      }
                    }}
                    disabled={totalQuantity === 0}
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
                    fillDetail.length > 1 &&
                    fillDetail.some((detail) => detail.namedetail !== null)
                  )
                }
              >
                <p className="p-3 fst-italic fs-5 m-0">Phân loại sản phẩm</p>
                <div
                  className={`${
                    mode === "light" ? "bg-light" : "border"
                  } rounded-3 p-2 m-2 d-flex flex-wrap overflow-auto`}
                  style={{ height: "70%" }}
                >
                  {fillDetail &&
                    fillDetail.length > 0 &&
                    fillDetail.map((fillDetail, index) => (
                      <Box
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
                        sx={{
                          opacity: fillDetail.quantity === 0 ? 0.5 : 1,
                          pointerEvents:
                            fillDetail.quantity === 0 ? "none" : "auto",
                          backgroundColor: "backgroundElement.default",
                        }}
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

                        <label className={`ms-2`}>
                          {fillDetail.namedetail}
                        </label>

                        {fillDetail.quantity === 0 && (
                          <div
                            className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center rounded-3"
                            style={{
                              backgroundColor: "rgba(0, 0, 0, 0.5)",
                              color: "white",
                              fontWeight: "bold",
                              zIndex: 1,
                            }}
                          >
                            Hết hàng
                          </div>
                        )}

                        <div
                          className="position-absolute bottom-0 end-0"
                          hidden={selectedIdDetail !== fillDetail.id}
                        >
                          <CheckCircleOutlineIcon
                            style={{ color: "#00C7FF" }}
                          />
                        </div>
                      </Box>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </Box>
        <NavStore
          FillDetailPr={FillDetailPr}
          countProductStore={countProductStore}
        />
        <Box
          className="row rounded-4 mt-3"
          sx={{ backgroundColor: "backgroundElement.children" }}
        >
          <div className="p-3">
            <h4>Thông tin chi tiết sản phẩm</h4>
            <span className="p-0 m-0">
              <hr />
            </span>
            <span id="description">
              {FillDetailPr ? FillDetailPr.description : "N/A"}
            </span>
          </div>
        </Box>
        <Box
          className="row rounded-4 mt-3"
          sx={{ backgroundColor: "backgroundElement.children" }}
        >
          <div className="p-3">
            <h4>Đánh giá sản phẩm</h4>
            <span className="p-0 m-0">
              <hr />
            </span>
          </div>
        </Box>
      </div>
    </>
  );
};
export default DetailProduct;
