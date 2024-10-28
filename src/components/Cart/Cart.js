import React, { useEffect, useState } from "react";
import "./CartStyle.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";
import axios from "../../Localhost/Custumize-axios";
import { tailspin } from "ldrs";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import { FaBan } from "react-icons/fa";
import { Button } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

<FaBan />;

const Cart = () => {
  const [fill, setFill] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [groupSelection, setGroupSelection] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [isCardLoaded, setIsCardLoaded] = useState(false);
  const [isCountCart, setIsCountAddCart] = useState(false); //Truyền dữ liệu từ cha đến con
  const [productDetails, setProductDetails] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [isCheckAll, setIscheckAll] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loading, setLoading] = useState(true); // Trạng thái loading

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  // const ids = open ? "simple-popper" : undefined;

  tailspin.register();

  const geturlIMG = (productId, filename) =>
    `${axios.defaults.baseURL}files/product-images/${productId}/${filename}`;

  const getAvtUser = (idUser, filename) =>
    `${axios.defaults.baseURL}files/user/${idUser}/${filename}`;

  const geturlIMGDetail = (productDetailId, filename) => {
    return `${axios.defaults.baseURL}files/detailProduct/${productDetailId}/${filename}`;
  };

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
    let loadingTimeout;

    // Chỉ hiển thị loading nếu API mất hơn 0.5 giây
    loadingTimeout = setTimeout(() => setLoading(true), 500);

    try {
      const res = await axios.get(`/cart/${user.id}`);

      // API trả về thành công trước 0.5 giây, hủy hiển thị loading
      clearTimeout(loadingTimeout);
      setLoading(false);

      setFill(res.data);
      const grouped = groupByStore(res.data);
      setGroupSelection(
        Object.keys(grouped).reduce((acc, storeId) => {
          acc[storeId] = false;
          return acc;
        }, {})
      );
      updateTotalPrice(res.data);
    } catch (error) {
      console.error("Error loading cart items:", error);
      clearTimeout(loadingTimeout);
      setLoading(false); // Đảm bảo loading bị tắt khi có lỗi
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

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

  const handleIncrease = async (productId) => {
    // Tìm sản phẩm cần tăng số lượng dựa vào productId
    const updatedFill = fill.map((item) =>
      item.id === productId && item.quantity < item.productDetail.quantity
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setFill(updatedFill); // Cập nhật lại mảng fill
    await updateQuantity(
      productId,
      updatedFill.find((item) => item.id === productId).quantity
    ); // Gọi API để cập nhật số lượng
    updateTotalPrice(); // Cập nhật lại tổng giá
  };

  const handleDecrease = async (productId) => {
    // Tìm sản phẩm cần giảm số lượng dựa vào productId
    const updatedFill = fill.map((item) =>
      item.id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setFill(updatedFill); // Cập nhật lại mảng fill
    await updateQuantity(
      productId,
      updatedFill.find((item) => item.id === productId).quantity
    ); // Gọi API để cập nhật số lượng
    updateTotalPrice(); // Cập nhật lại tổng giá
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    // Tìm sản phẩm cần thay đổi số lượng dựa vào productId
    const updatedFill = fill.map((item) =>
      item.id === productId
        ? {
            ...item,
            quantity: Math.min(newQuantity, item.productDetail.quantity),
          } // Đảm bảo số lượng không vượt quá tồn kho
        : item
    );
    setFill(updatedFill); // Cập nhật lại mảng fill
    await updateQuantity(
      productId,
      updatedFill.find((item) => item.id === productId).quantity
    ); // Gọi API để cập nhật số lượng
    updateTotalPrice(); // Cập nhật lại tổng giá
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

  useEffect(() => {
    updateTotalPrice();
  }, [selectedProductIds, fill]);

  useEffect(() => {
    fetchCart();
  }, [user.id]);

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

  const handleDetailUpdate = (cartId, selectedDetailId) => {
    if (selectedDetailId) {
      updateCartProductDetail(cartId, selectedDetailId)
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

  const updateCartProductDetail = async (cartItemId, productDetailId) => {
    try {
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

  return (
    <div>
      <Header reloadCartItems={isCountCart} />
      <div id="smooth" className="col-12 col-md-12 col-lg-8 offset-lg-2">
        <div className="row mt-3">
          <div className="col-9">
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
                <Link to="/" className="btn btn-danger">
                  Mua ngay
                </Link>
              </div>
            ) : (
              <>
                <div className="card mb-3">
                  <div className="card-body d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <Checkbox
                        id="selectAll"
                        checked={selectAll}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                      <label htmlFor="selectAll">Chọn tất cả sản phẩm</label>
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
                  </div>
                </div>
                {Object.keys(groupedProducts).map((storeId) => {
                  const storeProducts = groupedProducts[storeId];
                  const store = storeProducts[0].productDetail.product.store;
                  const isGroupSelected = groupSelection[storeId] || false;
                  return (
                    <div
                      className="card mb-3"
                      id="cartItem"
                      key={storeId}
                      style={{ position: "relative", minHeight: "200px" }}
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
                      <div
                        className="card-body"
                        style={{ display: isCardLoaded ? "block" : "none" }}
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
                                src={getAvtUser(
                                  store.user.id,
                                  store.user.avatar,
                                  store.id
                                )}
                                id="imgShop"
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
                                alt=""
                              />
                            </Link>
                            <h5 id="nameShop" className="mt-1">
                              <Link
                                className="inherit-text"
                                to={`/pageStore/${store.slug}`}
                                style={{
                                  textDecoration: "inherit",
                                  color: "inherit",
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
                            cart.productDetail.product.images?.[0];
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
                                        ? geturlIMGDetail(
                                            cart.productDetail.id,
                                            cart.productDetail.imagedetail
                                          )
                                        : geturlIMG(
                                            cart.productDetail.product.id,
                                            firstIMG.imagename
                                          )
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
                                    onLoad={() => {
                                      setIsCardLoaded(true);
                                    }}
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
                              <div className="col-5 mt-3 mx-1">
                                <div id="fontSizeTitle">
                                  {cart.productDetail.product.name}
                                </div>
                                <div id="fontSize">
                                  <div className="d-flex">
                                    <div>
                                      <div
                                        className="Strong"
                                        style={{ cursor: "pointer" }}
                                        onClick={(event) => {
                                          handleProductDetailClick(
                                            cart.productDetail.product.id
                                          );
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
                                              <strong>Loại sản phẩm:</strong>
                                              {productDetails.map((detail) => {
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
                                                        alignItems: "center",
                                                        outline: isSelected
                                                          ? "1px solid #6c757d"
                                                          : "1px solid #ffffff",
                                                        border: "none",
                                                        transition:
                                                          "outline-color 0.5s",
                                                      }}
                                                      disabled={isProductInCart}
                                                    >
                                                      <img
                                                        className="rounded-3"
                                                        src={geturlIMGDetail(
                                                          detail.id,
                                                          detail.imagedetail
                                                        )}
                                                        alt={detail.namedetail}
                                                        style={{
                                                          width: "30px",
                                                          height: "30px",
                                                          marginRight: "10px",
                                                        }}
                                                      />
                                                      {detail.namedetail}
                                                    </button>
                                                  </div>
                                                );
                                              })}
                                            </ul>
                                          ) : (
                                            <p>Không có thông tin sản phẩm.</p>
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
                                                  cart.id,
                                                  selectedDetail.id
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
                                    {[
                                      cart.productDetail.product.productcategory
                                        .name,
                                      cart.productDetail.product.trademark
                                        .name === "No brand"
                                        ? null
                                        : cart.productDetail.product.trademark
                                            .name,
                                      cart.productDetail.product.warranties
                                        .name,
                                    ]
                                      .filter(Boolean)
                                      .join(", ")}
                                  </div>
                                </div>
                              </div>
                              <div className="col-6">
                                <div
                                  className="d-flex mt-3"
                                  id="spinner"
                                  disabled={cart.productDetail.quantity === 0}
                                >
                                  <button
                                    className="btn border rounded-0 rounded-start"
                                    id="buttonDown"
                                    onClick={() => handleDecrease(cart.id)}
                                    disabled={cart.productDetail.quantity === 0}
                                  >
                                    <i className="bi bi-dash-lg"></i>
                                  </button>
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
                                    disabled={cart.productDetail.quantity === 0}
                                  />

                                  <button
                                    className={`btn border rounded-0 rounded-end ${
                                      cart.quantity >=
                                      cart.productDetail.quantity ? (
                                        <FaBan />
                                      ) : (
                                        "btn-active"
                                      )
                                    }`}
                                    id="buttonUp"
                                    onClick={() => handleIncrease(cart.id)}
                                    disabled={
                                      cart.quantity >=
                                        cart.productDetail.quantity ||
                                      cart.productDetail.quantity === 0
                                    }
                                  >
                                    <i className="bi bi-plus-lg"></i>
                                  </button>
                                </div>
                                <h5 className="mt-2" id="price">
                                  Tổng cộng:{" "}
                                  {formatPrice(
                                    cart.productDetail.price * cart.quantity
                                  ) + " VNĐ"}
                                  {cart.productDetail.quantity <= 10 && (
                                    <div className="text-danger">
                                      Còn lại: {cart.productDetail.quantity} sản
                                      phẩm
                                    </div>
                                  )}
                                </h5>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
          <div className="col-12 col-md-3 mt-3">
            <div className="card" id="sticky-top">
              <div className="card-body" id="smooth">
                <div className="d-flex justify-content-between">
                  <h5 className="text-start">Tổng cộng:</h5>
                  <h5 className="text-end text-danger">
                    {formatPrice(totalPrice)} VNĐ
                  </h5>
                </div>
                <div>
                  {selectedProductIds.length > 0 ? (
                    <div>
                      Số lượng sản phẩm đã chọn: {selectedProductIds.length}
                    </div>
                  ) : (
                    <div>Chưa có sản phẩm nào được chọn.</div>
                  )}
                </div>
                <Button
                  variant="contained"
                  id="button"
                  onClick={() => {
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
                  Đặt hàng
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
