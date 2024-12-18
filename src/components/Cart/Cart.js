import React, { useContext, useEffect, useRef, useState } from "react";
import "./CartStyle.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";
import axios from "../../Localhost/Custumize-axios";
import { tailspin } from "ldrs";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import { FaBan } from "react-icons/fa";
import {
  Button,
  Card,
  CardContent,
  Pagination,
  Typography,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { ThemeModeContext } from "../ThemeMode/ThemeModeProvider";

<FaBan />;

const Cart = () => {
  const [fill, setFill] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [cartData, setCartData] = useState([]);

  const [groupSelection, setGroupSelection] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [isCardLoaded, setIsCardLoaded] = useState(false);
  const [isCountCart, setIsCountAddCart] = useState(false); //Truyền dữ liệu từ cha đến con
  const [productDetails, setProductDetails] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [isCheckAll, setIscheckAll] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [cartId, setCartId] = useState(null);
  const { mode } = useContext(ThemeModeContext);
  const [voucher, setVoucher] = useState([]);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);

  useEffect(() => {
    const thanhPho = async () => {
      try {
        const quanHuyen = 252;
        const langXa = 2042;
        const response = await fetch(
          "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Token: "ece58b2c-b0da-11ef-9083-dadc35c0870d",
            },
          }
        );
        const data = await response.json();

        const response2 = await axios.get(
          "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district",
          {
            headers: {
              "Content-Type": "application/json",
              Token: "ece58b2c-b0da-11ef-9083-dadc35c0870d",
            },
            params: {
              province_id: quanHuyen,
            },
          }
        );

        const response3 = await axios.post(
          "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id",
          {
            district_id: langXa,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Token: "ece58b2c-b0da-11ef-9083-dadc35c0870d",
            },
          }
        );
        console.log(data.data);
        console.log(response2.data.data);
        console.log(response3.data.data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    thanhPho();
  }, []);

  tailspin.register();

  const groupByStore = (products) => {
    return products.reduce((groups, product) => {
      const store = product?.productDetail?.product?.store;

      if (store) {
        const storeId = store.id;
        if (!groups[storeId]) {
          groups[storeId] = [];
        }
        groups[storeId].push(product);
      } else {
        console.warn("Sản phẩm không có thông tin cửa hàng:", product);
      }

      return groups;
    }, {});
  };

  const updateQuantity = async (id, quantity) => {
    try {
      await axios.put(`/cartUpdate/${id}`, quantity, {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const fetchCart = async () => {
    const loadingTimeout = new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const res = await Promise.race([
        axios.get(`/cart/${user.id}`),
        loadingTimeout,
      ]);
      setCartData(res.data);

      if (res) {
        setFill(res.data);
        const grouped = groupByStore(res.data);
        setGroupSelection(
          Object.keys(grouped).reduce((acc, storeId) => {
            acc[storeId] = false;
            return acc;
          }, {})
        );
        updateTotalPrice(res.data);
      } else {
        setLoading(true);
      }
    } catch (error) {
      console.error("Error loading cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadVoucher = async (idProduct) => {
    try {
      const res = await axios.get(`fillVoucherPrice/${idProduct}`);
      setVoucher((pre) => ({
        ...pre,
        [idProduct]: res.data,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fill.forEach((voucher) => {
      loadVoucher(voucher.productDetail.product.id);
    });
  }, [fill]);

  const deleteSelectedProduct = async (cartId) => {
    confirmAlert({
      title: "Xóa sản phẩm khỏi giỏ hàng",
      message: "Bạn có chắc chắn muốn xóa các sản phẩm đã chọn không?",
      buttons: [
        {
          label: "Có",
          onClick: async () => {
            try {
              axios.delete(`/cartDelete/${cartId}`);
              setIsCountAddCart(true);
              fetchCart();
            } catch (error) {
              console.error("Lỗi xóa sản phẩm:", error);
            }
            fetchCart();
          },
        },
        {
          label: "Không",
        },
      ],
    });
  };

  const deleteSelectedProducts = async () => {
    confirmAlert({
      title: "Xóa sản phẩm khỏi giỏ hàng",
      message: "Bạn có chắc chắn muốn xóa các sản phẩm đã chọn không?",
      buttons: [
        {
          label: "Có",
          onClick: async () => {
            try {
              setSelectAll(false);
              await Promise.all(
                selectedProductIds.map((id) =>
                  axios.delete(`/cartDelete/${id}`)
                )
              );

              setIsCountAddCart(true);
              setSelectedProductIds([]);
              fetchCart();
            } catch (error) {
              console.error("Lỗi xóa sản phẩm:", error);
            }
          },
        },
        {
          label: "Không",
        },
      ],
    });
  };

  const deleteProduct = async (productId) => {
    confirmAlert({
      title: "Xóa sản phẩm khỏi giỏ hàng",
      message: "Bạn có chắc chắn muốn xóa sản phẩm này không?",
      Button: [
        {
          label: "Có",
          onClick: async () => {
            try {
              await axios.delete(`/cartDelete/${productId}`);
              setIsCountAddCart(true);
              setSelectedProductIds(
                selectedProductIds.filter((id) => id !== productId)
              );
              fetchCart();
              toast.success("Sản phẩm đã được xóa khỏi giỏ hàng");
            } catch (error) {
              console.error("Lỗi xóa sản phẩm:", error);
              toast.error("Có lỗi xảy ra khi xóa sản phẩm");
            }
          },
        },
        {
          label: "Không",
        },
      ],
    });
  };

  const handleCheckboxChange = (productId, isChecked) => {
    const updatedSelectedProductIds = isChecked
      ? [...selectedProductIds, productId]
      : selectedProductIds.filter((id) => id !== productId);

    setSelectedProductIds(updatedSelectedProductIds);
    setSelectAll(updatedSelectedProductIds.length === fill.length);
  };

  const handleGroupCheckboxChange = (storeId, isChecked) => {
    const storeProducts = groupedProducts[storeId];
    const updatedSelectedProductIds = isChecked
      ? [...selectedProductIds, ...storeProducts.map((p) => p.id)]
      : selectedProductIds.filter(
          (id) => !storeProducts.some((p) => p.id === id)
        );

    setSelectedProductIds(updatedSelectedProductIds);
    setGroupSelection((prev) => ({ ...prev, [storeId]: isChecked }));
  };

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      const allSelectableProducts = fill
        .filter((cart) => cart.productDetail.quantity > 0)
        .map((cart) => cart.id);
      setSelectedProductIds(allSelectableProducts);
      setIscheckAll(true);
      setSelectAll(true);
    } else {
      setSelectedProductIds([]);
      setIscheckAll(false);
      setSelectAll(false);
    }
  };

  const updateTotalPrice = () => {
    const newTotalPrice = fill.reduce(
      (acc, item) =>
        selectedProductIds.includes(item.id)
          ? acc + item.productDetail.price * item.quantity
          : acc,
      0
    );
    setTotalPrice(newTotalPrice);
  };

  const handleIncrease = async (productId) => {
    const updatedFill = fill.map((item) =>
      item.id === productId && item.quantity < item.productDetail.quantity
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setFill(updatedFill); // Cập nhật trạng thái `fill`

    // Tính toán tổng tiền ngay sau khi cập nhật `fill`
    const newTotalPrice = updatedFill.reduce(
      (acc, item) =>
        selectedProductIds.includes(item.id)
          ? acc + item.productDetail.price * item.quantity
          : acc,
      0
    );
    setTotalPrice(newTotalPrice);

    await updateQuantity(
      productId,
      updatedFill.find((item) => item.id === productId).quantity
    );
  };

  const handleDecrease = async (productId) => {
    const currentProduct = fill.find((item) => item.id === productId);

    if (currentProduct.quantity === 1) {
      await deleteSelectedProduct(productId);
    } else {
      const updatedFill = fill.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
      setFill(updatedFill);

      // Tính toán tổng tiền ngay sau khi cập nhật `fill`
      const newTotalPrice = updatedFill.reduce(
        (acc, item) =>
          selectedProductIds.includes(item.id)
            ? acc + item.productDetail.price * item.quantity
            : acc,
        0
      );
      setTotalPrice(newTotalPrice);

      const updatedQuantity = currentProduct.quantity - 1;
      await updateQuantity(productId, updatedQuantity);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    const updatedFill = fill.map((item) =>
      item.id === productId
        ? {
            ...item,
            quantity: Math.min(newQuantity, item.productDetail.quantity),
          }
        : item
    );
    setFill(updatedFill);

    const newTotalPrice = updatedFill.reduce(
      (acc, item) =>
        selectedProductIds.includes(item.id)
          ? acc + item.productDetail.price * item.quantity
          : acc,
      0
    );
    setTotalPrice(newTotalPrice);

    await updateQuantity(
      productId,
      updatedFill.find((item) => item.id === productId).quantity
    );
  };

  const formatPrice = (value) => {
    if (!value) return "0";
    return Number(value).toLocaleString("vi-VN");
  };

  const groupedProducts = groupByStore(fill);

  const anySelectedProductOutOfStock = () => {
    return fill.some(
      (item) =>
        selectedProductIds.includes(item.id) &&
        item.productDetail.quantity === 0
    );
  };

  const fetchProductDetails = async (productId) => {
    if (productId) {
      try {
        const response = await axios.get(
          `/productDetailByProductId/${productId}`
        );
        setProductDetails(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    }
  };

  const handleProductDetailClick = (productId) => {
    fetchProductDetails(productId);
  };

  const handleDetailUpdate = (cartId, selectedDetailId, quantityDetail) => {
    if (selectedDetailId) {
      updateCartProductDetail(cartId, selectedDetailId, quantityDetail)
        .then(() => {
          fetchProductDetails();
        })
        .catch((error) => {
          console.error("Error updating cart product detail:", error);
        });
    } else {
      toast.warning("Vui lòng chọn loại sản phẩm.");
    }
  };

  const updateCartProductDetail = async (
    cartItemId,
    productDetailId,
    quantityDetail
  ) => {
    try {
      const userId = user.id;
      const countResponse = await axios.get(
        `/cartCount/${userId}/${productDetailId}`
      );
      const count = countResponse.data;

      if (!quantityDetail) {
        toast.warning("Loại sản phẩm hiện tại đã hết hàng");
        return;
      } else if (count > 0) {
        toast.warning("Sản phẩm này đã có trong giỏ hàng");
        return;
      }

      const response = await axios.put(
        `/cartProductDetailUpdate/${cartItemId}`,
        { productDetailId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        fetchCart();
      }

      setAnchorEl(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
    }
  };

  useEffect(() => {
    updateTotalPrice();
  }, [selectedProductIds, fill]);

  useEffect(() => {
    fetchCart();
  }, [user.id]);

  return (
    <div>
      <Header reloadCartItems={isCountCart} />
      <div id="smooth" className="col-12 col-md-12 col-lg-10 offset-lg-1">
        <div className="row mt-3">
          <div className="col-lg-9 col-md-12">
            {loading ? (
              <div className="d-flex justify-content-center mt-3">
                <l-tailspin
                  size="40"
                  stroke="5"
                  speed="0.9"
                  color="black"
                ></l-tailspin>
              </div>
            ) : fill.length === 0 ? (
              <div className="text-center mt-5">
                <h4>Giỏ hàng trống</h4>
                <Button
                  id="button"
                  variant="contained"
                  color="error"
                  component={Link}
                  to="/"
                  style={{ width: "auto" }}
                  disableElevation
                >
                  Mua ngay
                </Button>
              </div>
            ) : (
              <>
                <Card className=" rounded-3 mb-3" sx={{ boxShadow: "none" }}>
                  <CardContent
                    sx={{
                      backgroundColor: "backgroundElement.children",
                      boxShadow: "none",
                    }}
                    className="d-flex justify-content-between align-items-center p-2"
                  >
                    <div className="d-flex align-items-center">
                      <Checkbox
                        id="selectAll"
                        checked={selectAll}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                      <label htmlFor="selectAll" style={{ cursor: "pointer" }}>
                        Chọn tất cả sản phẩm
                      </label>
                    </div>
                    <Button
                      variant="contained"
                      id="deleteButton"
                      onClick={deleteSelectedProducts}
                      disableElevation
                      disabled={selectedProductIds.length === 0}
                    >
                      <i className="bi bi-trash3-fill"></i>
                    </Button>
                  </CardContent>
                </Card>
                {Object.keys(groupedProducts).map((storeId) => {
                  const storeProducts = groupedProducts[storeId];
                  const store = storeProducts[0].productDetail.product.store;
                  const isGroupSelected = groupSelection[storeId] || false;

                  return (
                    <Card
                      className="rounded-3 mb-3"
                      id="cartItem"
                      key={storeId}
                      style={{ position: "relative", minHeight: "200px" }}
                      sx={{ boxShadow: "none" }}
                      onLoad={() => {
                        setIsCardLoaded(true);
                      }}
                    >
                      {!isCardLoaded && (
                        <l-tailspin
                          className="d-flex justify-content-center align-items-center"
                          size="40"
                          stroke="5"
                          speed="0.9"
                          color="black"
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 10,
                            transition: "all 2s",
                          }}
                        ></l-tailspin>
                      )}
                      <CardContent
                        className="card-body"
                        style={{ display: isCardLoaded ? "block" : "none" }}
                        sx={{ backgroundColor: "backgroundElement.children" }}
                      >
                        <div className="d-flex justify-content-between">
                          <div className="d-flex">
                            <Checkbox
                              id={`groupCheckBox-${storeId}`}
                              checked={isGroupSelected}
                              disabled={isCheckAll}
                              onChange={(e) =>
                                handleGroupCheckboxChange(
                                  storeId,
                                  e.target.checked
                                )
                              }
                            />

                            <Link to={`/pageStore/${store.slug}`}>
                              <img
                                src={store.user.avatar}
                                id="imgShop"
                                alt=""
                                className="mx-2 object-fit-cover"
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  objectFit: "contain",
                                  display: "block",
                                  margin: "0 auto",
                                  backgroundColor: "#f0f0f0",
                                  borderRadius: "100%",
                                }}
                              />
                            </Link>
                            <h5 id="nameShop" className="mt-1">
                              <Link
                                className="inherit-text"
                                to={`/pageStore/${store.slug}`}
                                style={{
                                  textDecoration: "inherit",
                                  color:
                                    mode === "light"
                                      ? "darkslategrey"
                                      : "white",
                                }}
                              >
                                {store.namestore}
                              </Link>
                            </h5>
                          </div>
                        </div>

                        <hr id="hr" />
                        {storeProducts.map((cart) => {
                          const firstIMG =
                            cart.productDetail.product?.images?.[0];

                          const productVoucher =
                            voucher[cart.productDetail.product.id] || [];

                          const matchingPrices = productVoucher.filter(
                            (v) =>
                              cart.productDetail.product.id === v.product.id
                          );

                          const isVoucherPrice = productVoucher.some(
                            (check) =>
                              check.product.id === cart.productDetail.product.id
                          );

                          const isStatusVoucher = productVoucher.some(
                            (check) => check.status === "Hoạt động"
                          );

                          let result;

                          if (matchingPrices.length > 0) {
                            const priceDown =
                              cart.productDetail.price *
                              cart.quantity *
                              (matchingPrices[0].discountprice / 100);
                            result = formatPrice(
                              cart.productDetail.price * cart.quantity -
                                priceDown
                            );
                            {
                              /* console.log(result); */
                            }
                          }
                          return (
                            <div className="d-flex mt-3 mb-3" key={cart.id}>
                              {cart.productDetail.quantity === 0 ? (
                                <button
                                  className="btn btn-danger mt-4 me-1"
                                  style={{
                                    height: "calc(1.5em + 0.75rem + 2px)",
                                  }}
                                  onClick={() => deleteProduct(cart.id)}
                                  title="Xóa sản phẩm"
                                >
                                  <i className="bi bi-trash3-fill"></i>
                                </button>
                              ) : (
                                <Checkbox
                                  className={{ transition: "0.5s" }}
                                  id={`checkBox-${cart.id}`}
                                  checked={selectedProductIds.includes(cart.id)}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      cart.id,
                                      e.target.checked
                                    )
                                  }
                                />
                              )}

                              <div
                                style={{
                                  position: "relative",
                                  width: "100px",
                                  height: "100px",
                                }}
                              >
                                <Link
                                  to={
                                    cart &&
                                    cart.productDetail &&
                                    cart.productDetail.product
                                      ? `/detailProduct/${cart.productDetail.product.slug}`
                                      : "#"
                                  }
                                >
                                  <img
                                    src={
                                      cart &&
                                      cart.productDetail &&
                                      cart.productDetail.imagedetail
                                        ? cart.productDetail.imagedetail
                                        : firstIMG.imagename
                                    }
                                    alt="Product"
                                    style={{
                                      width: "100px",
                                      height: "100px",
                                      objectFit: "contain",
                                      display: "block",
                                      margin: "0 auto",
                                      backgroundColor: "#ffff",
                                    }}
                                    className="rounded-3"
                                  />
                                  {cart.productDetail.quantity === 0 && (
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
                                </Link>
                              </div>

                              <div className="row ms-2">
                                <div className="col-lg-6 col-md-12 mt-3 mx-3 pe-4">
                                  <div className="row">
                                    <div id="fontSizeTitle">
                                      <Typography
                                        sx={{ color: "text.default" }}
                                      >
                                        {cart.productDetail.product.name}
                                      </Typography>
                                    </div>
                                    <Box
                                      id="fontSize"
                                      sx={{
                                        backgroundColor: "background.default",
                                      }}
                                    >
                                      <div className="d-flex">
                                        <div key={cart.id}>
                                          <div
                                            className="Strong"
                                            style={{ cursor: "pointer" }}
                                            onClick={(event) => {
                                              handleProductDetailClick(
                                                cart.productDetail.product.id
                                              );
                                              setSelectedDetail(
                                                cart.productDetail
                                              );
                                              setCartId(cart.id);
                                              handleClick(event);
                                            }}
                                          >
                                            {cart.productDetail.namedetail ? (
                                              <strong className="d-flex">
                                                {cart.productDetail.namedetail}
                                                {anchorEl ? (
                                                  <ArrowDropUpIcon className="pb-1" />
                                                ) : (
                                                  <ArrowDropDownIcon className="pb-1" />
                                                )}
                                              </strong>
                                            ) : (
                                              ""
                                            )}
                                          </div>
                                          <Popper
                                            id={user.id}
                                            open={open}
                                            anchorEl={anchorEl}
                                          >
                                            <Box
                                              className="rounded-3"
                                              sx={{
                                                boxShadow:
                                                  "0 0 5px rgba(108, 117, 125, 0.5)",
                                                margin: "0px",
                                                padding: "0px",
                                                bgcolor: "background.paper",
                                              }}
                                            >
                                              {productDetails.length > 0 ? (
                                                <ul style={{ padding: "10px" }}>
                                                  <strong>
                                                    Loại sản phẩm:
                                                  </strong>
                                                  {productDetails.map(
                                                    (detail) => {
                                                      const isProductInCart =
                                                        Array.isArray(
                                                          cart.productDetails
                                                        ) &&
                                                        cart.productDetails.some(
                                                          (cartItem) =>
                                                            cartItem.productDetailId ===
                                                            detail.id
                                                        );

                                                      const isSelected =
                                                        selectedDetail &&
                                                        selectedDetail.id ===
                                                          detail.id;

                                                      return (
                                                        <div key={detail.id}>
                                                          <button
                                                            className="btn mb-2"
                                                            onClick={() => {
                                                              setSelectedDetail(
                                                                detail
                                                              );
                                                            }}
                                                            style={{
                                                              display: "flex",
                                                              alignItems:
                                                                "center",
                                                              outline:
                                                                isSelected
                                                                  ? "1px solid #6c757d"
                                                                  : "1px solid #ffffff",
                                                              border: "none",
                                                              transition:
                                                                "outline-color 0.5s",
                                                            }}
                                                            disabled={
                                                              isProductInCart
                                                            }
                                                          >
                                                            <img
                                                              className="rounded-3"
                                                              src={
                                                                detail.imagedetail
                                                              }
                                                              alt={
                                                                detail.namedetail
                                                              }
                                                              style={{
                                                                width: "30px",
                                                                height: "30px",
                                                                marginRight:
                                                                  "10px",
                                                              }}
                                                              loading="lazy"
                                                            />
                                                            {detail.namedetail}{" "}
                                                            {formatPrice(
                                                              detail.price
                                                            ) + " VNĐ"}
                                                          </button>
                                                        </div>
                                                      );
                                                    }
                                                  )}
                                                </ul>
                                              ) : (
                                                <p>
                                                  Không có thông tin sản phẩm.
                                                </p>
                                              )}

                                              <div className="p-2 d-flex justify-content-end">
                                                <Button
                                                  style={{
                                                    backgroundColor:
                                                      "rgb(204,244,255)",
                                                    color: "rgb(0,70,89)",
                                                    height: "30px",
                                                    width: "90px",
                                                    fontSize: "10px",
                                                  }}
                                                  variant="contained"
                                                  onClick={() => {
                                                    handleDetailUpdate(
                                                      cartId,
                                                      selectedDetail.id,
                                                      cart.productDetail
                                                        .quantity
                                                    );
                                                  }}
                                                  disableElevation
                                                >
                                                  Xác nhận
                                                </Button>
                                              </div>
                                            </Box>
                                          </Popper>
                                        </div>
                                        <Typography
                                          sx={{ color: "text.default" }}
                                          variant="span"
                                        >
                                          {[
                                            cart.productDetail.product
                                              .productcategory.name,
                                            cart.productDetail.product.trademark
                                              .name,
                                            cart.productDetail.product
                                              .warranties.name,
                                          ]
                                            .filter(Boolean)
                                            .join(", ")}
                                        </Typography>
                                      </div>
                                    </Box>
                                  </div>
                                </div>
                                <div className="col-lg-5 col-md-12">
                                  <div
                                    className="d-flex mt-3"
                                    id="spinner"
                                    disabled={cart.productDetail.quantity === 0}
                                  >
                                    <Button
                                      className="btn border rounded-0 rounded-start"
                                      id="buttonDown"
                                      onClick={() => handleDecrease(cart.id)}
                                      disabled={
                                        cart.productDetail.quantity === 0
                                      }
                                      variant="contained"
                                      sx={{
                                        width: "auto",
                                        color:
                                          mode === "light" ? "black" : "white",
                                        backgroundColor:
                                          "backgroundElement.children",
                                      }}
                                      disableElevation
                                    >
                                      <i className="bi bi-dash-lg"></i>
                                    </Button>

                                    <input
                                      type="number"
                                      min={0}
                                      className="form-control rounded-0 w-50"
                                      value={
                                        cart.quantity !== 0 ? cart.quantity : 0
                                      }
                                      onChange={(e) =>
                                        handleQuantityChange(
                                          cart.id,
                                          Number(e.target.value)
                                        )
                                      }
                                      disabled={
                                        cart.productDetail.quantity === 0
                                      }
                                      style={{
                                        backgroundColor:
                                          mode === "light"
                                            ? "white"
                                            : "#363535",
                                        color:
                                          mode === "light" ? "black" : "white",
                                      }}
                                    />
                                    <Button
                                      className={`btn border rounded-0 rounded-end ${
                                        cart.quantity >=
                                        cart.productDetail.quantity ? (
                                          <FaBan />
                                        ) : (
                                          "btn-active"
                                        )
                                      }`}
                                      sx={{
                                        width: "auto",
                                        color:
                                          mode === "light" ? "black" : "white",
                                        backgroundColor:
                                          "backgroundElement.children",
                                      }}
                                      onClick={() => handleIncrease(cart.id)}
                                      disabled={
                                        cart.quantity >=
                                          cart.productDetail.quantity ||
                                        cart.productDetail.quantity === 0
                                      }
                                      variant="contained"
                                      disableElevation
                                    >
                                      <i className="bi bi-plus-lg"></i>
                                    </Button>
                                  </div>
                                  <Typography
                                    variant="h6"
                                    className="mt-2"
                                    sx={{
                                      color: "text.default",
                                      ontSize: "15px",
                                    }}
                                  >
                                    <div
                                      className="d-flex align-items-center"
                                      style={{ fontSize: "20px" }}
                                    >
                                      <div className="me-2">Tổng:</div>
                                      {isVoucherPrice && isStatusVoucher ? (
                                        <>
                                          <del
                                            className="me-2"
                                            style={{ fontSize: "15px" }}
                                          >
                                            {formatPrice(
                                              cart.productDetail.price *
                                                cart.quantity
                                            ) + " VNĐ"}
                                          </del>
                                          <div>{result + " VNĐ"}</div>
                                        </>
                                      ) : (
                                        <>
                                          {formatPrice(
                                            cart.productDetail.price *
                                              cart.quantity
                                          ) + " VNĐ"}
                                        </>
                                      )}
                                    </div>

                                    {cart.productDetail.quantity <= 10 && (
                                      <div className="text-danger">
                                        Còn lại: {cart.productDetail.quantity}{" "}
                                        sản phẩm
                                      </div>
                                    )}
                                  </Typography>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  );
                })}
              </>
            )}
          </div>
          <div className="col-lg-3 col-md-12">
            <Card
              sx={{
                backgroundColor: "backgroundElement.children",
                boxShadow: "none",
              }}
              id="sticky-top"
            >
              <CardContent id="smooth">
                <div className="d-flex justify-content-between">
                  <Typography
                    variant="h5"
                    className="text-start"
                    sx={{ color: "text.default" }}
                  >
                    Tổng cộng:
                  </Typography>
                  <h5 className="text-end text-danger">
                    {formatPrice(totalPrice)} VNĐ
                  </h5>
                </div>
                <div>
                  {selectedProductIds.length > 0 ? (
                    <div>
                      <Typography sx={{ color: "text.default" }}>
                        {" "}
                        Số lượng sản phẩm đã chọn: {selectedProductIds.length}
                      </Typography>
                    </div>
                  ) : (
                    <Typography sx={{ color: "text.default" }}>
                      Chưa có sản phẩm nào được chọn.
                    </Typography>
                  )}
                </div>
                <Button
                  variant="contained"
                  id="button"
                  onClick={() => {
                    if (!cartData[0].user.phone) {
                      toast.warning(
                        "Tài khoản của bạn chưa có số điện thoại nhận để nhận hàng!" +
                          cartData[0].user.phone
                      );
                      return;
                    }

                    if (selectedProductIds.length > 0) {
                      window.location.href = `/paybuyer?cartIds=${selectedProductIds.join(
                        ","
                      )}`;
                    }
                  }}
                  disableElevation
                  disabled={
                    selectedProductIds.length === 0 ||
                    anySelectedProductOutOfStock()
                  }
                >
                  <i class="bi bi-bag-fill me-1"></i> Mua hàng
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
