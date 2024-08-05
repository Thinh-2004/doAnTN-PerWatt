import React, { useEffect, useState } from "react";
import "./OrderStyle.css";
import Header from "../../UI&UX/Header/Header";
import Footer from "../../UI&UX/Footer/Footer";
import axios from "../../../Localhost/Custumize-axios";

const Order = () => {
  const [fill, setFill] = useState([]);
  const [orderProduct, setOrderProduct] = useState([]);
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("order");
        setFill(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    load();
  }, []);

  const loadOrderDetail = async (id) => {
    try {
      const res = await axios.get(`orderDetail/${id}`);
      setOrderProduct(res.data);
      console.log(res.data);
    } catch (error) {}
  };

  return (
    <div>
      <Header></Header>
      <div className="container">
        <div className="card mt-3">
          <div className="card-body">
            <ul
              class="nav nav-pills mb-3 sticky-top"
              id="pills-tab"
              role="tablist"
            >
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link active"
                  id="pills-home-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-home"
                  type="button"
                  role="tab"
                  aria-controls="pills-home"
                  aria-selected="true"
                >
                  Tất cả
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
                  id="pills-profile-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-profile"
                  type="button"
                  role="tab"
                  aria-controls="pills-profile"
                  aria-selected="false"
                >
                  Chờ thanh toán
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
                  id="pills-contact-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-contact"
                  type="button"
                  role="tab"
                  aria-controls="pills-contact"
                  aria-selected="false"
                >
                  Vận chuyển
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
                  id="pills-123-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-12"
                  type="button"
                  role="tab"
                  aria-controls="pills-12"
                  aria-selected="false"
                >
                  Chờ giao hàng
                </button>
              </li>
            </ul>
            <div class="tab-content" id="pills-tabContent">
              <div
                class="tab-pane fade show active"
                id="pills-home"
                role="tabpanel"
                aria-labelledby="pills-home-tab"
                tabindex="0"
              >
                {/* đầu */}
                {fill.map((order, index) => (
                  <a href={`/orderDetail/${order.id}`} key={order.id}>
                    <div className="card rounded-3 mb-3" id="cartItem">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <input
                            className="form-check-input mb-1"
                            type="checkbox"
                            id="checkBox"
                          />
                          <img
                            src={order.user.avatar}
                            id="imgShop"
                            className="mx-3"
                            alt="Shop Logo"
                            style={{ height: "120%" }}
                          />
                          <h5 id="nameShop" className="mb-0">
                            {order.store.namestore}
                          </h5>
                          <button className="btn btn-danger  ms-auto">
                            Mua lại
                          </button>
                        </div>
                        <hr />
                        <div className="col-8">
                          <div className="d-flex">
                            <img
                              src="https://imagor.owtg.one/unsafe/fit-in/1000x1000/filters:quality(100)/https://media-api-beta.thinkpro.vn/media/core/products/2022/12/23/lenovo-thinkpad-x1-carbon-gen-11-thinkpro-01.png"
                              id="img"
                            />
                            <div className="col-8 mt-3">
                              <div id="fontSizeTitle"></div>
                              <div id="fontSize">
                                i7 1365U, 16GB, 256GB, FHD+ Touch, Black,
                                Outlet, Nhập khẩu
                              </div>
                            </div>
                            <div className="col-8 mt-4">
                              <h5 className="mt-3" id="price">
                                Thành tiền: 1.000.000VNĐ{" "}
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
                {/* cuoi */}
              </div>
              <div
                class="tab-pane fade"
                id="pills-profile"
                role="tabpanel"
                aria-labelledby="pills-profile-tab"
                tabindex="0"
              ></div>
              <div
                class="tab-pane fade"
                id="pills-12"
                role="tabpanel"
                aria-labelledby="pills-12"
                tabindex="0"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Order;
