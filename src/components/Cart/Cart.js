import React, { useEffect, useState } from "react";
import "./CartStyle.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../Localhost/Custumize-axios";
import useSession from "../../Session/useSession";
import { tailspin } from "ldrs";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import { FaBan } from "react-icons/fa";

<FaBan />;

const Cart = () => {
  const [fill, setFill] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [groupSelection, setGroupSelection] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [isCardLoaded, setIsCardLoaded] = useState(false);
  const [isCountCart, setIsCountAddCart] = useState(false); //Truyền dữ liệu từ cha đến con
  const changeLink = useNavigate();

  tailspin.register();

  // Hàm để lấy URL ảnh sản phẩm
  const geturlIMG = (productId, filename) =>
    `${axios.defaults.baseURL}files/product-images/${productId}/${filename}`;

  // Hàm để lấy URL ảnh đại diện của người dùng
  const getAvtUser = (idUser, filename) =>
    `${axios.defaults.baseURL}files/user/${idUser}/${filename}`;

  const geturlIMGDetail = (productDetailId, filename) => {
    return `${axios.defaults.baseURL}files/detailProduct/${productDetailId}/${filename}`;
  };

  // Hàm để nhóm sản phẩm theo cửa hàng
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

  // Hàm để cập nhật số lượng sản phẩm trong giỏ hàng
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
    try {
      const res = await axios.get(`/cart/${user.id}`);
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
    }
  };

  // Sử dụng hook để tải giỏ hàng khi ID người dùng thay đổi
  useEffect(() => {
    fetchCart();
  }, []);

  // Hàm để xóa tất cả các sản phẩm đã chọn
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
              setSelectedProductIds([]); // Xóa danh sách sản phẩm đã chọn sau khi xóa
              fetchCart(); // Gọi fetchCart sau khi xóa sản phẩm để cập nhật danh sách
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
      buttons: [
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

  // Hàm để cập nhật tổng giá trị giỏ hàng
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

  // Hàm để xử lý thay đổi checkbox của sản phẩm
  const handleCheckboxChange = (productId, isChecked) => {
    const updatedSelectedProductIds = isChecked
      ? [...selectedProductIds, productId]
      : selectedProductIds.filter((id) => id !== productId);

    setSelectedProductIds(updatedSelectedProductIds);
    setSelectAll(updatedSelectedProductIds.length === fill.length);
  };

  // Hàm để xử lý thay đổi checkbox của nhóm cửa hàng
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

  // Hàm để chọn hoặc bỏ chọn tất cả sản phẩm
  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      // Chỉ chọn những sản phẩm có số lượng > 0
      const allSelectableProducts = fill
        .filter((cart) => cart.productDetail.quantity > 0) // Lọc các sản phẩm có quantity > 0
        .map((cart) => cart.id); // Lấy danh sách các ID sản phẩm có thể chọn

      setSelectedProductIds(allSelectableProducts);
      setSelectAll(true);
    } else {
      // Bỏ chọn tất cả
      setSelectedProductIds([]);
      setSelectAll(false);
    }
  };

  // Hàm để giảm số lượng sản phẩm
  const handleDecrease = async (index) => {
    const newFill = [...fill];
    const cart = newFill[index];
    if (cart.quantity > 1) {
      cart.quantity -= 1;
      setFill(newFill);
      await updateQuantity(cart.id, cart.quantity);
      updateTotalPrice();
    }
  };

  // Hàm để tăng số lượng sản phẩm
  const handleIncrease = async (index) => {
    const newFill = [...fill];
    const cart = newFill[index];
    if (cart.quantity < cart.productDetail.quantity) {
      cart.quantity += 1;
      setFill(newFill);
      await updateQuantity(cart.id, cart.quantity);
      updateTotalPrice();
    }
  };

  // Hàm để xử lý thay đổi số lượng sản phẩm
  const handleQuantityChange = async (index, newQuantity) => {
    const newFill = [...fill];
    const cart = newFill[index];

    // Đảm bảo số lượng mới không vượt quá số lượng sản phẩm có sẵn
    if (newQuantity >= cart.productDetail.quantity) {
      cart.quantity = cart.productDetail.quantity;
    } else if (newQuantity >= 0) {
      cart.quantity = newQuantity;
    }

    setFill(newFill);
    await updateQuantity(cart.id, cart.quantity);
    updateTotalPrice();
  };

  // Hàm để định dạng giá tiền
  const formatPrice = (value) => {
    if (!value) return "0";
    return Number(value).toLocaleString("vi-VN");
  };

  // Sử dụng hook để cập nhật tổng giá trị giỏ hàng khi các sản phẩm đã chọn hoặc giỏ hàng thay đổi
  useEffect(() => {
    updateTotalPrice();
  }, [selectedProductIds, fill]);

  // Nhóm các sản phẩm theo cửa hàng
  const groupedProducts = groupByStore(fill);

  const anySelectedProductOutOfStock = () => {
    return fill.some(
      (item) =>
        selectedProductIds.includes(item.id) &&
        item.productDetail.quantity === 0
    );
  };

  const [showFlyingImage, setShowFlyingImage] = useState(false);

  const handleFlyingImageClick = () => {
    setShowFlyingImage(true);
    setTimeout(() => setShowFlyingImage(false), 1000); // Hide the image after 1 second
  };

  return (
    <div>
      <Header reloadCartItems={isCountCart} />
      <div className="col-8 offset-2">
        <div className="row mt-3">
          <div className="col-9">
            {fill.length === 0 ? (
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
                      <input
                        className="form-check-input mb-1 me-3"
                        type="checkbox"
                        id="selectAll"
                        checked={selectAll}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                      <label htmlFor="selectAll">Chọn tất cả sản phẩm</label>
                    </div>
                    <button
                      className="btn btn-danger"
                      id="xoaNut"
                      onClick={deleteSelectedProducts}
                      disabled={selectedProductIds.length === 0} // Vô hiệu hóa nút khi không có sản phẩm nào được chọn
                    >
                      <i className="bi bi-trash3-fill"></i>
                    </button>
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
                            <input
                              className="form-check-input mt-2 me-3"
                              type="checkbox"
                              id={`groupCheckBox-${storeId}`}
                              checked={isGroupSelected}
                              onChange={(e) =>
                                handleGroupCheckboxChange(
                                  storeId,
                                  e.target.checked
                                )
                              }
                            />
                            <Link
                              to={`/pageStore/${store.id}`} // Sử dụng dấu ngoặc nhọn để truyền chuỗi động
                            >
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
                                to={`/pageStore/${store.id}`}
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
                        {storeProducts.map((cart, index) => {
                          const firstIMG =
                            cart.productDetail.product.images?.[0];
                          return (
                            <div className="d-flex mt-3 mb-3" key={index}>
                              {cart.productDetail.quantity === 0 ? (
                                <button
                                  className="btn btn-danger mt-4 me-1"
                                  style={{
                                    height: "calc(1.5em + 0.75rem + 2px)", // Điều chỉnh chiều cao
                                  }}
                                  onClick={() => deleteProduct(cart.id)}
                                  title="Xóa sản phẩm"
                                >
                                  <i className="bi bi-trash3-fill"></i>
                                </button>
                              ) : (
                                <input
                                  className="form-check-input mt-4 me-3"
                                  type="checkbox"
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
                                      ? `/detailProduct/${cart.productDetail.product.id}`
                                      : "#"
                                  } // Nếu cart hoặc productDetail chưa có, không điều hướng
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
                              <div className="col-4 mt-3 mx-1">
                                <div id="fontSizeTitle">
                                  {cart.productDetail.product.name}
                                </div>
                                <div id="fontSize">
                                  {storeProducts.every(
                                    (item) =>
                                      item.productDetail.namedetail === null
                                  ) ? null : (
                                    <select className="form-select">
                                      {storeProducts.map(
                                        (item, index) =>
                                          item.productDetail.namedetail !==
                                            null && (
                                            <option
                                              key={index}
                                              value={item.productDetail.id}
                                            >
                                              {item.productDetail.namedetail}
                                            </option>
                                          )
                                      )}
                                    </select>
                                  )}

                                  {
                                    [
                                      cart.productDetail.namedetail,
                                      cart.productDetail.product.productcategory
                                        .name,
                                      cart.productDetail.product.trademark.name,
                                      cart.productDetail.product.warranties
                                        .name,
                                    ]
                                      .filter(Boolean) // Lọc bỏ các giá trị null hoặc rỗng
                                      .join(", ") // Nối các chuỗi lại với nhau bằng dấu phẩy và khoảng trắng
                                  }
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
                                    onClick={() => handleDecrease(index)}
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
                                        index,
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
                                    onClick={() => handleIncrease(index)}
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
          <div className="col-3">
            <div className="card" id="sticky-top">
              <div className="card-body">
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
                <button
                  className="btn btn-danger w-100"
                  id="button"
                  onClick={() => {
                    if (selectedProductIds.length > 0) {
                      window.location.href = `/paybuyer?cartIds=${selectedProductIds.join(
                        ","
                      )}`;
                    }
                  }}
                  disabled={
                    selectedProductIds.length === 0 ||
                    anySelectedProductOutOfStock()
                  }
                >
                  Đặt hàng
                </button>
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
