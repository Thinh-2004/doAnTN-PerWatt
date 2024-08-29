import React, { useEffect, useState } from "react";
import "./CartStyle.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";
import axios from "../../Localhost/Custumize-axios";
import useSession from "../../Session/useSession";
import { tailspin } from "ldrs";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";

const Cart = () => {
  const [fill, setFill] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [id] = useSession("id");
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [groupSelection, setGroupSelection] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [isCardLoaded, setIsCardLoaded] = useState(false);
  const [isCountCart, setIsCountAddCart] = useState(false); //Truyền dữ liệu từ cha đến con
  tailspin.register();

  // Hàm để lấy URL ảnh sản phẩm
  const geturlIMG = (productId, filename) =>
    `${axios.defaults.baseURL}files/product-images/${productId}/${filename}`;

  // Hàm để lấy URL ảnh đại diện của người dùng
  const getAvtUser = (idUser, filename) =>
    `${axios.defaults.baseURL}files/user/${idUser}/${filename}`;

  // Hàm để nhóm sản phẩm theo cửa hàng
  const groupByStore = (products) => {
    return products.reduce((groups, product) => {
      const storeId = product.product.store.id;
      if (!groups[storeId]) {
        groups[storeId] = [];
      }
      groups[storeId].push(product);
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

  // Hàm để xóa một sản phẩm khỏi giỏ hàng
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`/cartDelete/${id}`);
      fetchCart();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  

  // Hàm để tải danh sách sản phẩm trong giỏ hàng
  const fetchCart = async () => {
    try {
      const res = await axios.get(`/cart/${id}`);
      console.log("cặc");
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
              console.error("Error deleting selected products:", error);
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
          ? acc + item.product.price * item.quantity
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
    const allCart = fill.map((cart) => cart.id);
    const grouped = groupByStore(fill);
    const allGroupIds = Object.keys(grouped);

    setSelectAll(isChecked);
    setSelectedProductIds(isChecked ? allCart : []);
    setGroupSelection(
      allGroupIds.reduce(
        (acc, storeId) => ({ ...acc, [storeId]: isChecked }),
        {}
      )
    );
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
    if (cart.quantity < cart.product.quantity) {
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

    if (newQuantity >= 0 && newQuantity <= cart.product.quantity) {
      cart.quantity = newQuantity;
      setFill(newFill);
      await updateQuantity(cart.id, newQuantity);
      updateTotalPrice();
    }
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

  return (
    <div>
      <Header reloadCartItems={isCountCart} /> {/* Hiển thị header */}
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
                  const store = storeProducts[0].product.store;
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
                            <img
                              src={getAvtUser(store.user.id, store.user.avatar)}
                              id="imgShop"
                              className="mx-2"
                              style={{ height: "80%" }}
                            />
                            <h5 id="nameShop" className="mt-1">
                              {store.namestore}
                            </h5>
                          </div>
                        </div>
                        <hr id="hr" />
                        {storeProducts.map((cart, index) => {
                          const firstIMG = cart.product.images?.[0];
                          return (
                            <div className="d-flex mt-3 mb-3" key={index}>
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
                              <img
                                src={geturlIMG(
                                  cart.product.id,
                                  firstIMG.imagename
                                )}
                                id="img"
                                alt=""
                                style={{
                                  width: "100px",
                                  height: "100px",
                                }}
                                onLoad={() => {
                                  setIsCardLoaded(true);
                                }}
                              />
                              <div className="col-4 mt-3 mx-2">
                                <div id="fontSizeTitle">
                                  {cart.product.name}
                                </div>
                                <div id="fontSize">
                                  {`${cart.product.productcategory.name}, ${cart.product.trademark.name}, ${cart.product.warranties.name}`}
                                </div>
                              </div>
                              <div className="col-7 ">
                                <div className="d-flex mt-3" id="spinner">
                                  <button
                                    className="btn border rounded-0 rounded-start"
                                    id="buttonDown"
                                    onClick={() => handleDecrease(index)}
                                  >
                                    <i className="bi bi-dash-lg"></i>
                                  </button>
                                  <input
                                    type="number"
                                    min={0}
                                    className="form-control rounded-0 w-50"
                                    value={cart.quantity}
                                    onChange={(e) =>
                                      handleQuantityChange(
                                        index,
                                        Number(e.target.value)
                                      )
                                    } // Xử lý thay đổi số lượng
                                  />
                                  <button
                                    className={`btn border rounded-0 rounded-end ${
                                      cart.quantity >= cart.product.quantity
                                        ? "btn-disabled"
                                        : "btn-active"
                                    }`}
                                    id="buttonUp"
                                    onClick={() => handleIncrease(index)}
                                    disabled={
                                      cart.quantity >= cart.product.quantity
                                    }
                                  >
                                    <i className="bi bi-plus-lg"></i>
                                  </button>
                                </div>
                                <h5 className="mt-2" id="price">
                                  Tổng cộng:
                                  {formatPrice(
                                    cart.product.price * cart.quantity
                                  ) + " VNĐ"}
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
                  className="btn btn-danger w-100" // Lớp CSS cho nút
                  id="button" // ID của nút
                  onClick={() => {
                    if (selectedProductIds.length > 0) {
                      window.location.href = `/paybuyer?cartIds=${selectedProductIds.join(
                        ","
                      )}`;
                    }
                  }}
                  disabled={selectedProductIds.length === 0} // Vô hiệu hóa nút khi không có sản phẩm nào được chọn
                >
                  Đặt hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer /> {/* Hiển thị footer */}
    </div>
  );
};

export default Cart;
