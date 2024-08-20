<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import axios from "../../../Localhost/Custumize-axios";
import useSession from "../../../Session/useSession";
import { toast } from "react-toastify";

const PayBuyer = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [shippingInfo, setShippingInfo] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [selectedShippingInfo, setSelectedShippingInfo] = useState(null);
  const [newAddress, setNewAddress] = useState(""); // New state for address
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const cartIds = query.get("cartIds");
  const [idUser] = useSession("id");

  const geturlIMG = (productId, filename) => {
    return `${axios.defaults.baseURL}files/product-images/${productId}/${filename}`;
  };
  const getAvtUser = (idUser, filename) => {
    return `${axios.defaults.baseURL}files/user/${idUser}/${filename}`;
  };
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        if (cartIds) {
          const response = await axios.get(`/cart?id=${cartIds}`);
          setProducts(response.data);
        }
        const paymentResponse = await axios.get("/paymentMethod");
        setPaymentMethods(paymentResponse.data);

        if (idUser) {
          const shippingInfoResponse = await axios.get(
            `/shippingInfo?userId=${idUser}`
          );
          setShippingInfo(shippingInfoResponse.data);
        }
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [cartIds, idUser]);

  const groupByStore = (products) => {
    return products.reduce((groups, product) => {
      const storeId = product.product.store.id;
      if (!groups[storeId]) {
        groups[storeId] = {
          store: product.product.store,
          products: [],
        };
      }
      groups[storeId].products.push(product);
      return groups;
    }, {});
  };

  const groupedProducts = groupByStore(products);

  const handleOrder = async () => {
    try {
      if (!selectedPaymentMethod) {
        toast.error("Vui lòng chọn phương thức thanh toán!");
        return;
      }
      if (!selectedShippingInfo) {
        toast.error("Vui lòng chọn địa chỉ nhận hàng!");
        return;
      }

      const storeIds = [...new Set(products.map((p) => p.product.store.id))];
      const storeId = storeIds.length > 0 ? storeIds[0] : null;

      if (!storeId) {
        toast.error("Cửa hàng không hợp lệ!");
        return;
      }

      const order = {
        user: { id: idUser },
        paymentmethod: { id: selectedPaymentMethod },
        shippinginfor: { id: selectedShippingInfo },
        fee: { id: 1 },
        store: { id: storeId },
        paymentdate: new Date().toISOString(),
        orderstatus: "Đang chờ duyệt",
      };

      const orderDetails = products.map((product) => ({
        product: { id: product.product.id },
        quantity: product.quantity,
        price: product.product.price,
      }));

      const response = await axios.post("/orderCreate", {
        order,
        orderDetails,
      });

      toast.success("Đặt hàng thành công!");
      navigate("/order");
    } catch (error) {
      toast.error("Đặt hàng thất bại!");
    }
  };

  const handleAddAddress = async () => {
    try {
      if (!newAddress.trim()) {
        toast.warning("Vui lòng nhập địa chỉ!");
        return;
      }

      const response = await axios.post("/shippingInfoCreate", {
        address: newAddress,
        user: { id: idUser },
      });

      setShippingInfo([...shippingInfo, response.data]);
      setNewAddress("");
      toast.success("Thêm địa chỉ thành công!");
    } catch (error) {
      toast.error("Thêm địa chỉ thất bại!");
    }
  };

  return (
    <div>
      <Header />
      <div className="col-8 offset-2">
        {loading ? (
          <div>Loading...</div>
        ) : (
          Object.keys(groupedProducts).map((storeId) => {
            const { store, products: storeProducts } = groupedProducts[storeId];
            return (
              <div className="card mt-3" key={storeId}>
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <img
                      src={getAvtUser(store.user.id, store.user.avatar)}
                      id="imgShop"
                      className="mx-2"
                      alt="Shop Logo"
                      style={{ height: "80%" }}
                    />
                    <h5 id="nameShop" className="mb-0">
                      {store.namestore}
                    </h5>
                  </div>
                  <hr id="hr" />
                  {storeProducts.map((cart) => {
                    const firstIMG =
                      Array.isArray(cart.product.images) &&
                      cart.product.images.length > 0
                        ? cart.product.images[0]
                        : null;
                    return (
                      <div className="d-flex" key={cart.product.id}>
                        {firstIMG ? (
                          <img
                            src={geturlIMG(cart.product.id, firstIMG.imagename)}
                            id="img"
                            alt="Product"
                          />
                        ) : (
                          <div>Không có ảnh</div>
                        )}
                        <div className="col-5 mt-3 mx-2">
                          <div id="fontSizeTitle">{cart.product.name}</div>
                          <div id="fontSize">
                            {`${cart.product.productcategory.name}, ${cart.product.trademark.name}, ${cart.product.warranties.name}`}
                          </div>
                        </div>
                        <div className="col-8 mx-3 mt-5">
                          <div className="d-flex">
                            <div className="col-3">
                              Giá: {cart.product.price} VNĐ
                            </div>
                            <div className="col-2">
                              Số lượng: {cart.quantity}
                            </div>
                            <div className="col-4">
                              Thành tiền: {cart.product.price * cart.quantity}{" "}
                              VNĐ
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
        <div className="card mt-3">
          <div className="row card-body">
            <div className="col-6">
              <select
                className="form-select"
                value={selectedPaymentMethod || ""}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              >
                <option value="">Chọn phương thức thanh toán</option>
                {paymentMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.type}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-6">
              <div className="d-flex">
                <select
                  className="form-select me-2"
                  value={selectedShippingInfo || ""}
                  onChange={(e) => setSelectedShippingInfo(e.target.value)}
                >
                  <option value="">Chọn địa chỉ nhận hàng</option>
                  {shippingInfo.map((shipping) => (
                    <option key={shipping.id} value={shipping.id}>
                      {shipping.address}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  Thêm
                </button>
              </div>
            </div>
            <div
              className="modal fade"
              id="exampleModal"
              tabIndex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">
                      Địa chỉ nhận hàng
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <input
                      type="text"
                      className="form-control"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      placeholder="Nhập địa chỉ mới"
                    />
                    <button
                      className="btn btn-primary mt-3"
                      onClick={handleAddAddress}
                    >
                      Thêm
                    </button>
=======
import React from "react";
import Header from "../../UI&UX/Header/Header";
import Footer from "../../UI&UX/Footer/Footer";

const PayBuyer = () => {
  return (
    <div>
      <Header></Header>
      <div className="container">
        <div className="card rounded-3 mt-3">
          <div className="card-body">
            <h5>Địa chỉ nhận hàng</h5>
            <hr />
            <div className="row">
              <div className="col-2">
                <p className="fw-bold">Võ Khánh Toàn</p>
                <div className="fw-bold">0763889837</div>
              </div>
              <div className="col-9">
                <text>
                  Đường 3 Tháng 2, Hẻm 51, Hẻm quán nhậu Số Dzách, gần chị Diễm
                  anh tới rồi gọi em., Phường An Khánh, Quận Ninh Kiều, Cần Thơ
                </text>
              </div>
              <div className="col-1">
                <button
                  type="button"
                  class="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  Thay đổi
                </button>
              </div>
              <div
                class="modal fade"
                id="exampleModal"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id="exampleModalLabel">
                        Địa chỉ của tôi
                      </h1>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div class="modal-body">
                      <select className="form-select" name="" id="">
                        <option value="">Cần thơ</option>
                      </select>
                      <button
                        type="button"
                        class="btn btn-primary mt-3"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal1"
                      >
                        Thêm địa chỉ
                      </button>
                    </div>
                    <div class="modal-footer">
                      <button
                        type="button"
                        class="btn btn-primary"
                        data-bs-dismiss="modal"
                      >
                        Xác nhận
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="modal fade"
                id="exampleModal1"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id="exampleModalLabel">
                        Thêm địa chỉ
                      </h1>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div class="modal-body">
                      <label className="label">Địa chỉ</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div class="modal-footer">
                      <button
                        type="button"
                        class="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                      >
                        Quay lại
                      </button>
                      <button
                        type="button"
                        class="btn btn-primary"
                        data-bs-dismiss="modal"
                      >
                        Xác nhận
                      </button>
                    </div>
>>>>>>> a4a2c76a2188eff27aed7a2ceb5503475a5fc9ca
                  </div>
                </div>
              </div>
            </div>
          </div>
<<<<<<< HEAD
          <div className="card-body">
            <button className="btn btn-primary" onClick={handleOrder}>
              Đặt hàng
            </button>
          </div>
        </div>
      </div>
      <Footer />
=======
        </div>
        <div className="card mt-3">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <input
                className="form-check-input mb-1"
                type="checkbox"
                id="checkBox"
              />
              <img
                src="http://localhost:3000/images/logoWeb.png"
                id="imgShop"
                className="mx-2"
                alt="Shop Logo"
                style={{ height: "100%" }}
              />
              <h5 id="nameShop" className="mb-0">
                PerWatt
              </h5>
            </div>
            <hr id="hr" />
            <div className="col-8">
              <div className="d-flex">
                <img
                  src="https://imagor.owtg.one/unsafe/fit-in/1000x1000/filters:quality(100)/https://media-api-beta.thinkpro.vn/media/core/products/2022/12/23/lenovo-thinkpad-x1-carbon-gen-11-thinkpro-01.png"
                  id="img"
                />
                <div className="col-8 mt-3">
                  <div id="fontSizeTitle">Lenovo ThinkPad X1 Carbon Gen 11</div>
                  <div id="fontSize">
                    i7 1365U, 16GB, 256GB, FHD+ Touch, Black, Outlet, Nhập khẩu
                  </div>
                </div>
                <div className="col-8 mx-3">
                  <div className="d-flex mt-3" id="spinner">
                    <button
                      className="btn border rounded-0 rounded-start"
                      id="button"
                    >
                      <i class="bi bi-dash-lg"></i>
                    </button>
                    <input
                      type="number"
                      min={0}
                      className="form-control rounded-0 w-50"
                    />
                    <button
                      className="btn border rounded-0 rounded-end"
                      id="button"
                    >
                      <i class="bi bi-plus-lg"></i>
                    </button>
                  </div>
                  <h5 className="mt-2" id="price">
                    Tổng cộng: 1.000.000VNĐ
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card rounded-3 mt-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <h5>PerWatt Voucher</h5>
              <button className="btn btn-primary ml-auto">Thay đổi</button>
            </div>
          </div>
        </div>
        <div className="card rounded-3 mt-3">
          <div className="card-body">
            <div className="d-flex">
              <h5 className="me-3">Phương thức thanh toán</h5>
              <input class="form-check-input me-1" type="checkbox" />
              <label class="form-check-label me-3" for="flexCheckDefault">
                Thanh toán khi nhận hàng
              </label>
              <input class="form-check-input me-1" type="checkbox" />
              <label class="form-check-label" for="flexCheckDefault">
                Thanh toán bằng thẻ
              </label>
            </div>
          </div>
        </div>
        <div className="card rounded-3 mt-3">
          <div className="card-body">
            <div className="d-flex justify-content-end">
              <h5>Tổng thanh toán: 1000đ</h5>
            </div>
            <hr />
            <div className="d-flex justify-content-end">
              <a className="btn btn-danger" href="/order">Đặt hàng</a>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
>>>>>>> a4a2c76a2188eff27aed7a2ceb5503475a5fc9ca
    </div>
  );
};

export default PayBuyer;
