import React, { useEffect, useState } from "react";
import "./CartStyle.css";
import Header from "../UI&UX/Header/Header";
import Footer from "../UI&UX/Footer/Footer";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "../../Localhost/Custumize-axios";

const Cart = () => {
  const [fill1, setFill1] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [images, setImages] = useState([]); // Thay đổi: Thêm trạng thái để lưu danh sách hình ảnh

  const { id } = useParams();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`/cart/${id}`);
        const imagesRes = await axios.get("/images"); // Thay đổi: Lấy danh sách hình ảnh từ API
        setFill1(res.data);
        setImages(imagesRes.data);
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
    if (product.quantity < product.maxQuantity) {
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
            {fill1.map((cart, index) => (
              <div className="card mb-3" id="cartItem" key={index}>
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <input
                      className="form-check-input mb-1"
                      type="checkbox"
                      id="checkBox"
                    />
                    <img
                      src={`/${cart.user.avatar}`}
                      id="imgShop"
                      className="mx-2"
                      alt="Shop Logo"
                      style={{ height: "100%" }}
                    />
                    <h5 id="nameShop" className="mb-0">
                      {cart.product.store.nameStore}
                    </h5>
                  </div>
                  <hr id="hr" />
                  <div className="col-8">
                    <div className="d-flex">
                      <img
                        src={`http://localhost:5000/${cart.product.image.imageName}`} // Thay đổi đường dẫn nếu cần thiết
                        id="img"
                        className="me-3 mt-3 rounded-3"
                        alt="Product"
                      />
                      <div className="col-8 mt-3">
                        <div id="fontSizeTitle">{cart.product.name}</div>
                        <div id="fontSize">
                          {`${
                            cart.product.productCategory?.name ||
                            "Chưa có danh mục"
                          }, ${
                            cart.product.trademark?.name ||
                            "Chưa có thương hiệu"
                          }, ${
                            cart.product.warranties?.name || "Chưa có bảo hành"
                          }`}
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
                            readOnly
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
            ))}
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
