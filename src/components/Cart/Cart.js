import React, { useEffect, useState } from "react";
import "./CartStyle.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";
import axios from "../../Localhost/Custumize-axios";
import useSession from "../../Session/useSession";

const Cart = () => {
  const [fill, setFill] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [id] = useSession("id");
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [groupSelection, setGroupSelection] = useState({});
  const [selectAll, setSelectAll] = useState(false);

  const geturlIMG = (productId, filename) => {
    return `${axios.defaults.baseURL}files/product-images/${productId}/${filename}`;
  };
  const getAvtUser = (idUser, filename) => {
    return `${axios.defaults.baseURL}files/user/${idUser}/${filename}`;
  };
  const updateQuantity = async (id, quantity) => {
    try {
      const response = await axios.put(`/cartUpdate/${id}`, quantity, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`/cartDelete/${id}`);
      const res = await axios.get(`/cart/${id}`);
      setFill(res.data);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSelectedProducts = async () => {
    try {
      await Promise.all(
        selectedProductIds.map((id) => axios.delete(`/cartDelete/${id}`))
      );
      // Cập nhật giỏ hàng sau khi xóa sản phẩm
      const res = await axios.get(`/cart/${id}`);
      setFill(res.data);
      setSelectedProductIds([]);
      setTotalPrice(0); // Reset tổng tiền
      setSelectAll(false); // Bỏ chọn checkbox "Chọn tất cả sản phẩm"
      window.location.reload();
    } catch (error) {
      console.error("Error deleting selected products:", error);
    }
  };

  useEffect(() => {
    const load = async (id) => {
      try {
        const res = await axios.get(`/cart/${id}`);
        setFill(res.data);
        console.log(res.data);
        const grouped = groupByStore(res.data);
        const initialGroupSelection = {};
        Object.keys(grouped).forEach((storeId) => {
          initialGroupSelection[storeId] = false;
        });
        setGroupSelection(initialGroupSelection);
        // Tính tổng tiền khi dữ liệu được tải lần đầu
        updateTotalPrice(res.data);
      } catch (error) {
        console.error("Error loading cart items:", error);
      }
    };
    load(id);
  }, [id]);

  useEffect(() => {
    // Cập nhật tổng tiền khi danh sách sản phẩm đã chọn thay đổi
    updateTotalPrice();
  }, [selectedProductIds, fill]);

  const handleDecrease = async (index) => {
    const newFill = [...fill];
    const cart = newFill[index];
    if (cart.quantity > 1) {
      cart.quantity -= 1;
      setFill(newFill);
      await updateQuantity(cart.id, cart.quantity);
      // Cập nhật tổng tiền khi số lượng sản phẩm thay đổi
      updateTotalPrice();
    }
  };

  const handleIncrease = async (index) => {
    const newFill = [...fill];
    const cart = newFill[index];
    if (cart.quantity < cart.product.quantity) {
      cart.quantity += 1;
      setFill(newFill);
      await updateQuantity(cart.id, cart.quantity);
      // Cập nhật tổng tiền khi số lượng sản phẩm thay đổi
      updateTotalPrice();
    }
  };

  const handleCheckboxChange = (productId, isChecked) => {
    const updatedSelectedProductIds = isChecked
      ? [...selectedProductIds, productId]
      : selectedProductIds.filter((id) => id !== productId);

    setSelectedProductIds(updatedSelectedProductIds);

    // Cập nhật trạng thái của checkbox "Chọn tất cả sản phẩm"
    if (updatedSelectedProductIds.length === fill.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
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

  const updateTotalPrice = () => {
    const selectedItems = fill.filter((item) =>
      selectedProductIds.includes(item.id)
    );
    const newTotalPrice = selectedItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    setTotalPrice(newTotalPrice);
  };

  const formatPrice = (value) => {
    if (!value) return "0";
    return Number(value).toLocaleString("vi-VN");
  };

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

  const groupedProducts = groupByStore(fill);

  return (
    <div>
      <Header />
      <div className="col-8 offset-2">
        <div className="row mt-3">
          <div className="col-9">
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
                >
                  Xóa
                </button>
              </div>
            </div>
            {Object.keys(groupedProducts).map((storeId) => {
              const storeProducts = groupedProducts[storeId];
              const store = storeProducts[0].product.store;
              const isGroupSelected = groupSelection[storeId] || false;
              return (
                <div className="card mb-3" id="cartItem" key={storeId}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div className="d-flex">
                        <input
                          className="form-check-input mt-2 me-3"
                          type="checkbox"
                          id={`groupCheckBox-${storeId}`}
                          checked={isGroupSelected}
                          onChange={(e) =>
                            handleGroupCheckboxChange(storeId, e.target.checked)
                          }
                        />
                        <img
                          src={getAvtUser(store.user.id, store.user.avatar)}
                          id="imgShop"
                          className="mx-2"
                          alt="Shop Logo"
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
                        <div className="d-flex mb-3" key={index}>
                          <input
                            className="form-check-input mt-4 me-3"
                            type="checkbox"
                            id={`checkBox-${cart.id}`}
                            checked={selectedProductIds.includes(cart.id)}
                            onChange={(e) =>
                              handleCheckboxChange(cart.id, e.target.checked)
                            }
                          />
                          {firstIMG ? (
                            <img
                              src={geturlIMG(
                                cart.product.id,
                                firstIMG.imagename
                              )}
                              id="img"
                              alt="Product"
                            />
                          ) : (
                            <div>Không có ảnh</div>
                          )}
                          <div className="col-4 mt-3 mx-2">
                            <div id="fontSizeTitle">{cart.product.name}</div>
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
                                readOnly
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
                              {formatPrice(cart.product.price * cart.quantity) +
                                " VNĐ"}
                            </h5>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
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
                <Link
                  // Đường dẫn đến trang đặt hàng, bao gồm các ID sản phẩm đã chọn trong query string
                  to={`/paybuyer?cartIds=${selectedProductIds.join(",")}`}
                  // Lớp CSS cho nút, giúp định hình giao diện
                  className="btn btn-danger w-100"
                  // ID của nút để áp dụng các kiểu CSS và để quản lý khi cần
                  id="button"
                  // Thuộc tính aria-disabled để cải thiện khả năng truy cập; đánh dấu nút là không khả dụng khi không có sản phẩm nào được chọn
                  aria-disabled={selectedProductIds.length === 0}
                  // Thuộc tính tabIndex để ngăn không cho nút nhận focus khi không có sản phẩm nào được chọn
                  tabIndex={selectedProductIds.length === 0 ? -1 : 0}
                  // Inline style để thay đổi giao diện của nút khi không có sản phẩm nào được chọn
                  style={{
                    pointerEvents:
                      selectedProductIds.length === 0 ? "none" : "auto",
                    opacity: selectedProductIds.length === 0 ? 0.5 : 1,
                  }}
                >
                  Đặt hàng
                </Link>
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
