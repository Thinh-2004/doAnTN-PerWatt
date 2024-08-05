import React, { useEffect, useState } from "react";
import "./CartStyle.css";
import Header from "../UI&UX/Header/Header";
import Footer from "../UI&UX/Footer/Footer";
import { Link } from "react-router-dom";
import axios from "../../Localhost/Custumize-axios";
import useSession from "../../Session/useSession";

const Cart = () => {
  const [fill1, setFill1] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [id] = useSession("id");

  const geturlIMG = (productId, filename) => {
    return `${axios.defaults.baseURL}files/product-images/${productId}/${filename}`;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`/cart/${id}`);
        setFill1(res.data);
        updateTotalPrice(res.data); // Update total price after data load
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    load();
  }, [id]);

  const handleDecrease = (index) => {
    const newFill1 = [...fill1];
    const product = newFill1[index];
    if (product.quantity > 1) {
      product.quantity -= 1;
      setFill1(newFill1);
      updateTotalPrice(newFill1);
    }
  };

  const handleIncrease = (index) => {
    const newFill1 = [...fill1];
    const product = newFill1[index];
    if (product.quantity < product.product.quantity) { // Check against product max quantity
      product.quantity += 1;
      setFill1(newFill1);
      updateTotalPrice(newFill1);
    }
  };

  const updateTotalPrice = (items) => {
    const newTotalPrice = items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    setTotalPrice(newTotalPrice);
  };

  return (
    <div>
      <Header />
      <div className="col-8 offset-2">
        <div className="row mt-3">
          <div className="col-9">
            {fill1.map((cart, index) => {
              const firstIMG =
                cart.product.images && cart.product.images.length > 0 ? cart.product.images[0] : null;
              return (
                <div className="card mb-3" id="cartItem" key={index}>
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <input
                        className="form-check-input mb-1"
                        type="checkbox"
                        id="checkBox"
                      />
                      <img
                        src={`/images/${cart.user.avatar}`}
                        id="imgShop"
                        className="mx-2"
                        alt="Shop Logo"
                        style={{ height: "100%" }}
                      />
                      <h5 id="nameShop" className="mb-0">
                        {cart.product.store.namestore}
                      </h5>
                    </div>
                    <hr id="hr" />
                    <div className="col-8">
                      <div className="d-flex">
                        {firstIMG ? (
                          <img
                            src={geturlIMG(cart.product.id, firstIMG.imagename)}
                            id="img"
                            alt="Product"
                          />
                        ) : (
                          <div>No image available</div>
                        )}
                        <div className="col-7 mt-3 mx-2">
                          <div id="fontSizeTitle">{cart.product.name}</div>
                          <div id="fontSize">
                            {`${cart.product.productcategory.name}, ${cart.product.trademark.name}, ${cart.product.warranties.name}`}
                          </div>
                        </div>
                        <div className="col-8 mx-3">
                          <div className="d-flex mt-3" id="spinner">
                            <button
                              className="btn border rounded-0 rounded-start"
                              id="button"
                              onClick={() => handleDecrease(index)}
                            >
                              <i className="bi bi-dash-lg"></i>
                            </button>
                            <input
                              type="number"
                              min={0}
                              className="form-control rounded-0 w-50"
                              value={cart.quantity}
                              />
                            <button
                              className="btn border rounded-0 rounded-end"
                              id="button"
                              onClick={() => handleIncrease(index)}
                            >
                              <i className="bi bi-plus-lg"></i>
                            </button>
                          </div>
                          <h5 className="mt-2" id="price">
                            Tổng cộng: {cart.product.price * cart.quantity} VNĐ
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* rightCard */}
          <div className="col-3">
            <div className="card" id="sticky-top">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h5 className="text-start">Tạm tính:</h5>
                  <h5 className="text-end text-danger">{totalPrice} VNĐ</h5>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <h5 className="text-start">Tổng cộng:</h5>
                  <h5 className="text-end text-danger">{totalPrice} VNĐ</h5>
                </div>
                <Link className="btn btn-danger w-100" id="button">
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
