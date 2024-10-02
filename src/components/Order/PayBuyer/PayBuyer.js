import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  tailspin.register();

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  // Hàm để lấy URL ảnh sản phẩm
  const geturlIMG = (productId, filename) =>
    `${axios.defaults.baseURL}files/product-images/${productId}/${filename}`;

  // Hàm để lấy URL ảnh đại diện của người dùng
  const getAvtUser = (idUser, filename) =>
    `${axios.defaults.baseURL}files/user/${idUser}/${filename}`;

  const geturlIMGDetail = (productDetailId, filename) => {
    return `${axios.defaults.baseURL}files/detailProduct/${productDetailId}/${filename}`;
  };

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        if (cartIds) {
          const response = await axios.get(`/cart?id=${cartIds}`);
          setProducts(response.data);
          setSelectedProductIds(products);
        }
        const paymentResponse = await axios.get("/paymentMethod");
        setPaymentMethods(paymentResponse.data);
        console.log(paymentResponse.data);

        if (user.id) {
          const shippingInfoResponse = await axios.get(
            `/shippingInfo?userId=${user.id}`
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
  }, [cartIds, user.id]);

  const groupByStore = (products) => {
    return products.reduce((groups, product) => {
      const storeId = product.productDetail.product.store.id;
      if (!groups[storeId]) {
        groups[storeId] = {
          store: product.productDetail.product.store,
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
              return (
                productSum + product.productDetail.price * product.quantity
              );
            }, 0)
          );
        },
        0
      );

      // Lấy thông tin về các sản phẩm
      const productList = Object.values(groupedProducts).flatMap(
        ({ products }) =>
          products.map((product) => ({
            name: product.productDetail.product.name,
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
          user: { id: user.id },
          paymentmethod: { id: selectedPaymentMethod },
          shippinginfor: { id: selectedShippingInfo },
          store: { id: storeId },
          paymentdate: new Date().toISOString(),
          orderstatus: "Đang chờ duyệt",
        };

        const orderDetails = storeProducts.map((product) => ({
          productDetail: { id: product.productDetail.id },
          quantity: product.quantity,
          price: product.productDetail.price,
        }));

        // Tạo đơn hàng cho từng cửa hàng
        await axios.post("/api/orderCreate", {
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
        user: { id: user.id },
      });
      setShippingInfo([...shippingInfo, response.data]);
      setNewAddress("");
      toast.success("Thêm địa chỉ thành công!");
    } catch (error) {
      toast.error("Thêm địa chỉ thất bại!");
    }
  };

  const handleMomo = async () => {
    // Tính tổng số tiền cho tất cả các sản phẩm
    const totalAmount = Object.values(groupedProducts).reduce(
      (sum, { products }) => {
        return (
          sum +
          products.reduce((productSum, product) => {
            return productSum + product.productDetail.price * product.quantity;
          }, 0)
        );
      },
      0
    );

    // Lấy thông tin về các sản phẩm
    const productList = Object.values(groupedProducts).flatMap(({ products }) =>
      products.map((product) => ({
        name: product.productDetail.product.name,
        quantity: product.quantity,
        id: product.productDetail.id,
      }))
    );

    sessionStorage.setItem("productList", JSON.stringify(productList));

    // Sử dụng tổng số tiền đã tính toán
    const data = { amount: totalAmount };
    const response = await axios.get("/pay", {
      params: data,
    });
    const paymentUrl = response.data; // Lấy URL thanh toán từ response
    window.location.href = paymentUrl; // Chuyển hướng người dùng đến URL thanh toán
  };

  const handleCombinedAction = async () => {
    if (!selectedShippingInfo) {
      toast.warning("Bạn chưa chọn địa chỉ nhận hàng!");
    } else {
      try {
        if (selectedPaymentMethod === "6") {
          await handlePayment();
        } else if (selectedPaymentMethod === "1") {
          await handleOrder();
        } else if (selectedPaymentMethod === "8") {
          await handleMomo();
        } else {
          toast.error("Vui lòng chọn phương thức thanh toán!");
        }
      } catch (error) {
        console.error("Có lỗi xảy ra khi thực hiện các chức năng:", error);
        toast.error("Có lỗi xảy ra khi thực hiện các chức năng.");
      }
    }
  };

  // Hàm để định dạng giá tiền
  const formatPrice = (value) => {
    if (!value) return "0";
    return Number(value).toLocaleString("vi-VN");
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
                  <hr id="hr" />
                  {storeProducts.map((cart) => {
                    const firstIMG = cart.productDetail.product.images?.[0];
                    return (
                      <div className="d-flex mt-3" key={cart.productDetail.id}>
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
                        <div className="col-4 mt-3 mx-2">
                          <div id="fontSizeTitle">
                            {cart.productDetail.product.name}
                          </div>
                          <div id="fontSize">
                            {
                              [
                                cart.productDetail.namedetail,
                                cart.productDetail.product.productcategory.name,
                                cart.productDetail.product.trademark.name,
                                cart.productDetail.product.warranties.name,
                              ]
                                .filter(Boolean) // Lọc bỏ các giá trị null hoặc rỗng
                                .join(", ") // Nối các chuỗi lại với nhau bằng dấu phẩy và khoảng trắng
                            }{" "}
                          </div>
                        </div>
                        <div className="col-8 mx-3 mt-5">
                          <div className="d-flex">
                            <div className="col-3">
                              Giá:{" "}
                              {formatPrice(cart.productDetail.price) + " VNĐ"}
                            </div>
                            <div className="col-2">
                              Số lượng: {cart.quantity}
                            </div>
                            <div className="col-4">
                              Thành tiền:{" "}
                              {formatPrice(
                                cart.productDetail.price * cart.quantity
                              ) + " VNĐ"}
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
            <div className="col-6 align-items-center">
              {paymentMethods.map((method) => (
                <div className="form-check" key={method.id}>
                  <div className="d-flex align-items-center">
                    <input
                      className="form-check-input me-1 mb-1"
                      type="radio"
                      name="paymentMethod"
                      id={`paymentMethod${method.id}`}
                      value={method.id}
                      checked={selectedPaymentMethod === String(method.id)}
                      onChange={() =>
                        setSelectedPaymentMethod(String(method.id))
                      }
                    />
                    <label
                      className="form-check-label me-3"
                      htmlFor={`paymentMethod${method.id}`}
                    >
                      {method.type}
                    </label>
                    <img
                      src={`/images/${
                        method.id === 1
                          ? "COD.png"
                          : method.id === 6
                          ? "VNPay.png"
                          : method.id === 8
                          ? "MoMo.jpg"
                          : "default.png"
                      }`}
                      alt={method.type}
                      style={{ width: "8%" }}
                    />
                  </div>
                </div>
              ))}
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
            <button className="btn btn-primary" onClick={handleCombinedAction}>
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
