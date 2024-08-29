import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import axios from "../../../Localhost/Custumize-axios";
import useSession from "../../../Session/useSession";
import { toast } from "react-toastify";
import { tailspin } from "ldrs";

const PayBuyer = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [shippingInfo, setShippingInfo] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("1");
  const [selectedShippingInfo, setSelectedShippingInfo] = useState(null);
  const [newAddress, setNewAddress] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const cartIds = query.get("cartIds");
  tailspin.register();

  const [idUser] = useSession("id");
  console.log(selectedShippingInfo);

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

  const handlePayment = async () => {
    try {
      // Tính tổng số tiền cho tất cả các sản phẩm
      const totalAmount = Object.values(groupedProducts).reduce(
        (sum, { products }) => {
          return (
            sum +
            products.reduce((productSum, product) => {
              return productSum + product.product.price * product.quantity;
            }, 0)
          );
        },
        0
      );

      // Lấy thông tin về các sản phẩm
      const productList = Object.values(groupedProducts).flatMap(
        ({ products }) =>
          products.map((product) => ({
            name: product.product.name,
            quantity: product.quantity,
          }))
      );

      // Gọi API để tạo thanh toán
      const response = await axios.post("/api/payment/create_payment", {
        amount: totalAmount, // Truyền tổng số tiền vào API
        products: productList, // Truyền thông tin sản phẩm vào API
        ids: cartIds,
        address: selectedShippingInfo,
      });

      // Chuyển hướng đến URL thanh toán
      window.location.href = response.data.url;
      console.log(response.data.url);
    } catch (error) {
      console.error("Error redirecting to payment URL:", error);
      toast.error("Có lỗi xảy ra khi chuyển hướng thanh toán.");
    }
  };

  const handleOrder = async () => {
    try {
      if (!selectedShippingInfo) {
        toast.error("Vui lòng chọn địa chỉ nhận hàng!");
        return;
      }

      // Nhóm các sản phẩm theo storeId
      const groupedProducts = groupByStore(products);

      // Lặp qua từng nhóm cửa hàng và tạo đơn hàng riêng biệt
      for (const storeId in groupedProducts) {
        const { store, products: storeProducts } = groupedProducts[storeId];

        const order = {
          user: { id: idUser },
          paymentmethod: { id: selectedPaymentMethod },
          shippinginfor: { id: selectedShippingInfo },
          fee: { id: 1 },
          store: { id: storeId },
          paymentdate: new Date().toISOString(),
          orderstatus: "Đang chờ duyệt",
        };

        const orderDetails = storeProducts.map((product) => ({
          product: { id: product.product.id },
          quantity: product.quantity,
          price: product.product.price,
        }));

        // Tạo đơn hàng cho từng cửa hàng
        await axios.post("/orderCreate", {
          order,
          orderDetails,
        });
      }

      toast.success("Đặt hàng thành công!");
      navigate("/order");
    } catch (error) {
      toast.error("Đặt hàng thất bại!");
    }
  };

  const handleOrderVNPay = async () => {
    try {
      if (!selectedShippingInfo) {
        toast.error("Vui lòng chọn địa chỉ nhận hàng!");
        return;
      }

      // Nhóm các sản phẩm theo storeId
      const groupedProducts = groupByStore(products);

      // Lặp qua từng nhóm cửa hàng và tạo đơn hàng riêng biệt
      for (const storeId in groupedProducts) {
        const { store, products: storeProducts } = groupedProducts[storeId];

        const order = {
          user: { id: idUser },
          paymentmethod: { id: selectedPaymentMethod },
          shippinginfor: { id: selectedShippingInfo },
          fee: { id: 1 },
          store: { id: storeId },
          paymentdate: new Date().toISOString(),
          orderstatus: "Đang chờ duyệt",
        };

        const orderDetails = storeProducts.map((product) => ({
          product: { id: product.product.id },
          quantity: product.quantity,
          price: product.product.price,
        }));

        // Tạo đơn hàng cho từng cửa hàng
        await axios.post("/orderCreateVnPay", {
          order,
          orderDetails,
        });
      }

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

  const handleCombinedAction = async () => {
    try {
      if (selectedPaymentMethod === "6") {
        // Nếu chọn VN Pay, thực hiện cả đặt hàng và thanh toán
        // await handleOrderVNPay();
        await handlePayment();
      } else if (selectedPaymentMethod === "1") {
        // Nếu chọn thanh toán khi nhận hàng, chỉ thực hiện đặt hàng
        await handleOrder();
      } else {
        toast.error("Vui lòng chọn phương thức thanh toán!");
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi thực hiện các chức năng:", error);
      toast.error("Có lỗi xảy ra khi thực hiện các chức năng.");
    }
  };

  return (
    <div>
      <Header />
      <div className="col-8 offset-2">
        {loading ? (
          <div className="d-flex justify-content-center mt-3">
            <l-tailspin
              size="40"
              stroke="5"
              speed="0.9"
              color="black"
            ></l-tailspin>
          </div>
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
                      alt=""
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
                      <div className="d-flex mt-3" key={cart.product.id}>
                          <img
                            src={geturlIMG(cart.product.id, firstIMG.imagename)}
                            id="img"
                            alt=""
                          />
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
            {/* <select
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
              </select> */}
            <div className="col-6 align-tiems-center">
              <div className="form-check">
                <input
                  className="form-check-input mt-3"
                  type="radio"
                  name="paymentMethod"
                  id="paymentMethod1"
                  value="1"
                  checked={selectedPaymentMethod === "1"}
                  onChange={() => setSelectedPaymentMethod("1")}
                />
                <label className="form-check-label me-3" htmlFor="paymentMethod1">
                  Thanh toán khi nhận hàng
                </label>
                <img src="/images/COD.png" alt=""
                  style={{width : "8%"}}
                   />
              </div>
              <div className="form-check">
                <input
                  className="form-check-input mt-3"
                  type="radio"
                  name="paymentMethod"
                  id="paymentMethod2"
                  value="6"
                  checked={selectedPaymentMethod === "6"}
                  onChange={() => setSelectedPaymentMethod("6")}
                />
                <label className="form-check-label" htmlFor="paymentMethod2">
                  Thanh toán bằng VN Pay
                </label>
                <img src="/images/VNPAY.png" alt=""
                  style={{width : "8%"}}
                   />
              </div>
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
                    <option
                      key={shipping.id}
                      value={shipping.id}
                      onClick={() => setSelectedShippingInfo(shipping.id)}
                    >
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
                  <i class="bi bi-plus"></i>
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
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-body">
            <button
              className="btn btn-primary"
              onClick={handleCombinedAction}
              disabled={!selectedShippingInfo} // Vô hiệu hóa nút khi địa chỉ chưa được chọn
            >
              Đặt hàng
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PayBuyer;
