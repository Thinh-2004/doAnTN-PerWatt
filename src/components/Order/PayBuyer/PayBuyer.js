import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import axios from "../../../Localhost/Custumize-axios";
import { toast } from "react-toastify";
import { tailspin } from "ldrs";
import "./PayBuyerStyle.css";
<<<<<<< HEAD
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
=======
import { Box, Button, Card, CardContent } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormSelectAdress from "../../APIAddressVN/FormSelectAdress.js";
>>>>>>> e73760dd1189295936e71b2db90b88646e0dfd3d

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
  const [wallet, setWallet] = useState("");
  const [walletAdmin, setWalletAdmin] = useState("");
<<<<<<< HEAD

=======
>>>>>>> e73760dd1189295936e71b2db90b88646e0dfd3d
  const query = new URLSearchParams(location.search);
  const cartIds = query.get("cartIds");
  const [resetForm, setResetForm] = useState(false);

  tailspin.register();
  const [inputValues, setInputValues] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);
<<<<<<< HEAD
=======
  const handleReset = () => {
    setResetForm(true);
  };
>>>>>>> e73760dd1189295936e71b2db90b88646e0dfd3d

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const geturlIMG = (productId, filename) =>
    `${axios.defaults.baseURL}files/product-images/${productId}/${filename}`;

  const getAvtUser = (idUser, filename) =>
    `${axios.defaults.baseURL}files/user/${idUser}/${filename}`;

  const geturlIMGDetail = (productDetailId, filename) => {
    return `${axios.defaults.baseURL}files/detailProduct/${productDetailId}/${filename}`;
  };

  const fetchWallet = async () => {
    try {
      const resUser = await axios.get(`wallet/${user.id}`);
      const resAdmin = await axios.get(`wallet/${1}`);
      setWallet(resUser.data);
      setWalletAdmin(resAdmin.data);
    } catch (error) {
      console.error(
        "Error fetching wallet data:",
        error.response ? error.response.data : error.message
      );
    }
  };

<<<<<<< HEAD
  useEffect(() => {
    fetchWallet();
  }, [user.id]);

  const handleWithdraw = async (amount) => {
    try {
      if (wallet.balance > amount) {
        const newBalance = parseFloat(wallet.balance) - parseFloat(amount);

        const res = await axios.put(`wallet/update/${user.id}`, {
          balance: newBalance,
        });

        addTransaction(amount, "Thanh toán PerWatt");

        let adminBalance = parseFloat(walletAdmin.balance);

        for (const storeId in groupedProducts) {
          const { store, products } = groupedProducts[storeId];

          const storeTotal = products.reduce((sum, product) => {
            return sum + product.productDetail.price * product.quantity;
          }, 0);

          adminBalance += storeTotal;
          const adminRes = await axios.put(`wallet/update/${1}`, {
            balance: adminBalance,
          });
          setWalletAdmin(adminRes.data);

          const transactionType =
            `Thanh toán từ người dùng: ${store.user.fullname}`.substring(0, 50);
          await axios.post(`wallettransaction/create/${2}`, {
            amount: storeTotal,
            transactiontype: transactionType,
            transactiondate: new Date(),
            user: { id: user.id },
            store: { id: store.id },
          });

          const withdrawAmount = storeTotal * 0.9;
          adminBalance -= withdrawAmount;
          const adminResWithdraw = await axios.put(`wallet/update/${1}`, {
            balance: adminBalance,
          });
          setWalletAdmin(adminResWithdraw.data);

          const transactionTypeWithdraw =
            `Chuyển tiền về của hàng: ${store.namestore}`.substring(0, 50);
          await axios.post(`wallettransaction/create/${2}`, {
            amount: -withdrawAmount,
            transactiontype: transactionTypeWithdraw,
            transactiondate: new Date(),
            user: { id: user.id },
            store: { id: store.id },
          });

          const fillWalletStore = await axios.get(`wallet/${store.user.id}`);

          const transactionStore = await axios.get(
            `wallettransaction/idWalletByIdUSer/${store.user.id}`
          );

          await axios.put(`wallet/update/${store.user.id}`, {
            balance: fillWalletStore.data.balance + withdrawAmount,
          });

          await axios.post(
            `wallettransaction/create/${transactionStore.data.id}`,
            {
              amount: withdrawAmount,
              transactiontype: "Tiền từ PerWatt",
              transactiondate: new Date(),
              user: { id: store.user.id },
            }
          );

          const transactionUser = await axios.get(
            `wallettransaction/idWalletByIdUSer/${user.id}`
          );

          await axios.post(
            `wallettransaction/create/${transactionUser.data.id}`,
            {
              amount: -storeTotal,
              transactiontype: "Thanh toán bằng PerPay",
              transactiondate: new Date(),
              user: { id: user.id },
            }
          );
        }

        setWallet(res.data);
        handleOrder();
      } else {
        toast.warning("Bạn không đủ tiền trong tài khoản");
      }
    } catch (error) {
      console.error(
        "Error withdrawing money:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const addTransaction = async (amount, transactionType) => {
    const now = new Date();

    try {
      const response = await axios.post(
        `wallettransaction/create/${wallet.id}`,
        {
          amount: amount,
          transactiontype: transactionType,
          transactiondate: now,
        }
      );
    } catch (error) {
      console.error(
        "Đã có lỗi xảy ra:",
        error.response ? error.response.data : error.message
      );
    }
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
=======
  useEffect(() => {
    fetchWallet();
  }, [user.id]);
>>>>>>> e73760dd1189295936e71b2db90b88646e0dfd3d

  const handleWithdraw = async (amount) => {
    try {
      if (wallet.balance > amount) {
        const newBalance = parseFloat(wallet.balance) - parseFloat(amount);

        const res = await axios.put(`wallet/update/${user.id}`, {
          balance: newBalance,
        });

        addTransaction(amount, "Thanh toán PerWatt");

        let adminBalance = parseFloat(walletAdmin.balance);
        for (const storeId in groupedProducts) {
          const { store, products } = groupedProducts[storeId];

          const storeTotal = products.reduce((sum, product) => {
            return sum + product.productDetail.price * product.quantity;
          }, 0);

          adminBalance += storeTotal;
          const adminRes = await axios.put(`wallet/update/${1}`, {
            balance: adminBalance,
          });
          setWalletAdmin(adminRes.data);

          const transactionUser = await axios.get(
            `wallettransaction/idWalletByIdUSer/${user.id}`
          );

          await axios.post(
            `wallettransaction/create/${transactionUser.data.id}`,
            {
              amount: -storeTotal,
              transactiontype: "Thanh toán bằng PerPay",
              transactiondate: new Date(),
              user: { id: user.id },
            }
          );
          const transactionType =
            `Thanh toán từ người dùng: ${user.fullname}`.substring(0, 50);
          await axios.post(`wallettransaction/create/${1}`, {
            amount: storeTotal,
            transactiontype: transactionType,
            transactiondate: new Date(),
            user: { id: user.id },
            store: { id: store.id },
          });

          const withdrawAmount = storeTotal * 0.9;
          const adminBalancePlus = storeTotal * 0.1;
          adminBalance -= withdrawAmount;
          const adminResWithdraw = await axios.put(`wallet/update/${1}`, {
            balance: adminBalance,
          });
          setWalletAdmin(adminResWithdraw.data);

          const formattedAdminBalance =
            adminBalancePlus.toLocaleString("vi-VN");

          const transactionTypeWithdraw =
            `Chuyển tiền về của hàng: ${store.namestore} và lấy ${formattedAdminBalance}`.substring(
              0,
              50
            );
          await axios.post(`wallettransaction/create/${1}`, {
            amount: -withdrawAmount,
            transactiontype: transactionTypeWithdraw,
            transactiondate: new Date(),
            user: { id: user.id },
            store: { id: store.id },
          });

          const fillWalletStore = await axios.get(`wallet/${store.user.id}`);

          const transactionStore = await axios.get(
            `wallettransaction/idWalletByIdUSer/${store.user.id}`
          );

          await axios.put(`wallet/update/${store.user.id}`, {
            balance: fillWalletStore.data.balance + withdrawAmount,
          });

          await axios.post(
            `wallettransaction/create/${transactionStore.data.id}`,
            {
              amount: withdrawAmount,
              transactiontype: "Tiền từ PerWatt",
              transactiondate: new Date(),
              user: { id: store.user.id },
            }
          );
        }

        setWallet(res.data);
        handleOrder();
      } else {
        toast.warning("Bạn không đủ tiền trong tài khoản");
      }
    } catch (error) {
      console.error(
        "Error withdrawing money:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const addTransaction = async (amount, transactionType) => {
    const now = new Date();

    try {
      await axios.post(`wallettransaction/create/${wallet.id}`, {
        amount: amount,
        transactiontype: transactionType,
        transactiondate: now,
      });
    } catch (error) {
      console.error(
        "Đã có lỗi xảy ra:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      if (cartIds) {
        const response = await axios.get(`/cart?id=${cartIds}`);
        setProducts(response.data);
      }
      const paymentResponse = await axios.get("/paymentMethod");
      setPaymentMethods(paymentResponse.data);

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

  useEffect(() => {
    loadProducts();
  }, [cartIds, user.id]);

  const handleInputChange = (e, index) => {
    const value = e.target.value;

    if (!/^\d$/.test(value) && value !== "") {
      e.target.value = "";
      return;
    }

    const newValues = [...inputValues];
    newValues[index] = value;
    setInputValues(newValues);

    if (index < inputRefs.current.length - 1 && value) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !inputRefs.current[index].value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

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

      const productList = Object.values(groupedProducts).flatMap(
        ({ products }) =>
          products.map((product) => ({
            name: product.productDetail.product.name,
            quantity: product.quantity,
          }))
      );

      const response = await axios.post("/api/payment/create_payment", {
        amount: totalAmount,
        products: productList,
        ids: cartIds,
        address: selectedShippingInfo,
      });

      window.location.href = response.data.url;
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

      const groupedProducts = groupByStore(products);
<<<<<<< HEAD

=======
>>>>>>> e73760dd1189295936e71b2db90b88646e0dfd3d
      for (const storeId in groupedProducts) {
        const { products: storeProducts } = groupedProducts[storeId];

        const outOfStockProduct = storeProducts.find(
          (product) => product.productDetail.quantity === 0
        );
        if (outOfStockProduct) {
          toast.error(
            "Sản phẩm đã có người mua trước, vui lòng mua sản phẩm khác hoặc mua lại sau"
          );
          return;
        }

        const outOfStockProduct = storeProducts.find(
          (product) => product.productDetail.quantity === 0
        );
        if (outOfStockProduct) {
          toast.error(
            "Sản phẩm đã có người mua trước, vui lòng mua sản phẩm khác hoặc mua lại sau"
          );
          return;
        }

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

        await axios.post("/api/orderCreate", {
          order,
          orderDetails,
        });
      }

      toast.success("Đặt hàng thành công!");
      navigate("/order");
      const closeModalButton = document.querySelector(
        '[data-bs-dismiss="modal"]'
      );
      if (closeModalButton) {
        closeModalButton.click();
      }
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
      handleReset();
      toast.success("Thêm địa chỉ thành công!");
    } catch (error) {
      toast.error("Thêm địa chỉ thất bại!");
    }
    loadProducts();
  };

  const handleMomo = async () => {
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
<<<<<<< HEAD

=======
>>>>>>> e73760dd1189295936e71b2db90b88646e0dfd3d
    const productList = Object.values(groupedProducts).flatMap(({ products }) =>
      products.map((product) => ({
        name: product.productDetail.product.name,
        quantity: product.quantity,
        id: product.productDetail.id,
      }))
    );

    sessionStorage.setItem("productList", JSON.stringify(productList));

<<<<<<< HEAD
    const data = { amount: totalAmount };
=======
    const data = {
      amount: totalAmount,
      ids: cartIds,
      address: selectedShippingInfo,
    };
>>>>>>> e73760dd1189295936e71b2db90b88646e0dfd3d
    const response = await axios.get("/pay", {
      params: data,
    });
    const paymentUrl = response.data;
    window.location.href = paymentUrl;
  };

  const handleCombinedAction = async () => {
    if (!selectedShippingInfo) {
      toast.warning("Bạn chưa chọn địa chỉ nhận hàng!");
    } else {
      try {
        if (selectedPaymentMethod === "1") {
          await handleOrder();
        } else if (selectedPaymentMethod === "6") {
          await handlePayment();
        } else if (selectedPaymentMethod === "8") {
          await handleMomo();
        } else if (selectedPaymentMethod === "9") {
          const openModalButton = document.querySelector(
            '[data-bs-toggle="modal"]'
          );
          if (openModalButton) {
            openModalButton.click();
          }
        } else {
          toast.error("Vui lòng chọn phương thức thanh toán!");
        }
      } catch (error) {
        console.error("Có lỗi xảy ra khi thực hiện các chức năng:", error);
        toast.error("Có lỗi xảy ra khi thực hiện các chức năng.");
      }
    }
  };

  const formatPrice = (value) => {
    if (!value) return "0";
    return Number(value).toLocaleString("vi-VN");
  };

  return (
    <div>
      <Header />
      <div id="smooth" className="col-12 col-md-12 col-lg-10 offset-lg-1">
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
            const totalAmount = storeProducts.reduce(
              (sum, cart) => sum + cart.productDetail.price * cart.quantity,
              0
            );
            return (
              <Card className="mt-3 rounded-3" key={storeId}>
                <CardContent
                  sx={{ backgroundColor: "backgroundElement.children" }}
                  className=""
                >
                  <div className="d-flex align-items-center">
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
                    <h5 id="nameShop" className="mt-1">
                      {store.namestore}
                    </h5>
                  </div>
                  <hr id="hr" />
                  {storeProducts.map((cart) => {
                    const firstIMG = cart.productDetail.product.images?.[0];
                    return (
                      <div className="mt-3" key={cart.productDetail.id}>
                        <div className="row">
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

                          <div className="col-lg-4 col-md-12 mt-3 mx-2">
                            <div id="fontSizeTitle">
                              {cart.productDetail.product.name}
                            </div>
                            <div id="fontSize">
                              {[
                                cart.productDetail.namedetail,
                                cart.productDetail.product.productcategory.name,
                                cart.productDetail.product.trademark.name,
                                cart.productDetail.product.warranties.name,
                              ]
                                .filter(Boolean)
                                .join(", ")}{" "}
                            </div>
                          </div>
                          <button
                            type="button"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                            hidden
                          ></button>
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
                                  <h1
                                    className="modal-title fs-5"
                                    id="exampleModalLabel"
                                  >
                                    Thanh toán bằng PerPay
                                  </h1>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                  ></button>
                                </div>
                                <div className="modal-body">
                                  <div>
                                    Số tiền thanh toán:{" "}
                                    {formatPrice(
                                      cart.productDetail.price * cart.quantity
                                    ) + " VNĐ"}
                                  </div>
                                  <div>
                                    Số dư PerPay:{" "}
                                    {formatPrice(wallet.balance) + " VNĐ"}
                                  </div>

                                  <div className="row mt-3">
                                    {[...Array(6)].map((_, index) => (
                                      <div className="col-2" key={index}>
                                        <input
                                          className="form-control"
                                          type="text"
                                          maxLength="1"
                                          ref={(el) =>
                                            (inputRefs.current[index] = el)
                                          }
                                          onChange={(e) =>
                                            handleInputChange(e, index)
                                          }
                                          onKeyDown={(e) =>
                                            handleKeyDown(e, index)
                                          }
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="modal-footer">
                                  <Button
                                    variant="contained"
                                    style={{
                                      width: "auto",
                                      backgroundColor: "rgb(218, 255, 180)",
                                      color: "rgb(45, 91, 0)",
                                    }}
                                    onClick={() =>
                                      handleWithdraw(
                                        storeProducts.reduce(
                                          (sum, detail) =>
                                            sum +
                                            detail.productDetail.price *
                                              detail.quantity,
                                          0
                                        )
                                      )
                                    }
                                    disableElevation
                                  >
                                    Xác nhận
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-6 col-md-12 mx-3 mt-5">
                            <div className="d-flex">
                              <div className="col-4">
                                Giá:{" "}
                                {formatPrice(cart.productDetail.price) + " VNĐ"}
                              </div>
                              <div className="col-3">
                                Số lượng: {cart.quantity}
                              </div>
                              <div className="col-5">
                                Thành tiền:{" "}
                                {formatPrice(
                                  cart.productDetail.price * cart.quantity
<<<<<<< HEAD
                                ) + " VNĐ"}{" "}
                                Tổng tiền:{" "}
                                {formatPrice(
                                  storeProducts.reduce(
                                    (sum, detail) =>
                                      sum +
                                      detail.productDetail.price *
                                        detail.quantity,
                                    0
                                  )
=======
>>>>>>> e73760dd1189295936e71b2db90b88646e0dfd3d
                                ) + " VNĐ"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="col-lg-11 col-md-12">
                    <div className="d-flex justify-content-end">
                      Tổng tiền: {formatPrice(totalAmount) + " VNĐ"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
<<<<<<< HEAD
        <div className="card mt-3">
          <div className="row card-body">
            <div className="col-lg-6 col-md-8 col-sm-12">
=======
        <Card
          className="rounded-3 mt-3 p-3"
          sx={{ backgroundColor: "backgroundElement.children" }}
        >
          <CardContent className="row">
            <div className="col-lg-6 col-md-8 col-sm-12 ">
>>>>>>> e73760dd1189295936e71b2db90b88646e0dfd3d
              {paymentMethods.map((method) => (
                <div className="form-check mb-3" key={method.id}>
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
                      style={{ cursor: "pointer" }}
                    />
                    &nbsp;
                    <img
                      className="image-fixed-size"
                      src={`/images/${
                        method.type === "Thanh toán khi nhận hàng"
                          ? "COD.png"
                          : method.type === "Thanh toán bằng VN Pay"
                          ? "VNPay.png"
                          : method.type === "Thanh toán bằng MoMo"
                          ? "MoMo.png"
<<<<<<< HEAD
                          : method.type === "Thánh toán bằng PerPay"
=======
                          : method.type === "Thanh toán bằng PerPay"
>>>>>>> e73760dd1189295936e71b2db90b88646e0dfd3d
                          ? "PerPay.png"
                          : "default.png"
                      }`}
                      alt={method.type}
<<<<<<< HEAD
                      style={{ width: "8%", objectFit: "cover" }}
                    />
                    {method.type === "Thánh toán bằng PerPay" ? (
                      <Button
                        variant="contained"
                        component={Link}
                        to="/wallet/buyer"
                        style={{
                          width: "auto",
                          backgroundColor: "rgb(218, 255, 180)",
                          color: "rgb(45, 91, 0)",
                        }}
                        disableElevation
                      >
                        <i class="bi bi-wallet2"></i>
                      </Button>
                    ) : (
                      ""
                    )}
=======
                      style={{
                        width: "8%",
                        objectFit: "cover",
                        borderRadius: "100%",
                        cursor : "pointer"
                      }}
                      onClick={(e) =>
                        setSelectedPaymentMethod(String(method.id))
                      }
                    />
                    &nbsp;
                    <label
                      className="form-check-label me-3"
                      htmlFor={`paymentMethod${method.id}`}
                      style={{ cursor: "pointer" }}
                    >
                      {method.type}
                    </label>
>>>>>>> e73760dd1189295936e71b2db90b88646e0dfd3d
                  </div>
                </div>
              ))}
            </div>

            <div className="col-lg-6 col-md-12 mt-lg-0 mt-md-5">
              <div className="d-flex">
                <FormControl fullWidth size="small">
                  <InputLabel id="address-select-label">
                    Chọn địa chỉ nhận hàng
                  </InputLabel>
                  <Select
                    labelId="address-select-label"
<<<<<<< HEAD
                    id="address-select "
=======
                    id="address-select"
>>>>>>> e73760dd1189295936e71b2db90b88646e0dfd3d
                    value={selectedShippingInfo || ""}
                    label="Chọn địa chỉ nhận hàng"
                    onChange={(e) => setSelectedShippingInfo(e.target.value)}
                  >
                    {shippingInfo.map((shipping) => (
                      <MenuItem key={shipping.id} value={shipping.id}>
<<<<<<< HEAD
                        {shipping.address}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  className="ms-3"
                  variant="contained"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal1"
                  style={{
                    width: "auto",
                    backgroundColor: "rgb(218, 255, 180)",
                    color: "rgb(45, 91, 0)",
                  }}
                  disableElevation
                >
                  <i class="bi bi-plus"></i>
                </Button>
=======
                        {/* {shipping.user.fullname} <br />
                        {shipping.user.phone} <br /> */}
                        {shipping.address}
                      </MenuItem>
                    ))}
                    <MenuItem>
                      <Button
                        variant="contained"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal1"
                        style={{
                          width: "100%",
                          backgroundColor: "rgb(218, 255, 180)",
                          color: "rgb(45, 91, 0)",
                          textAlign: "right",
                        }}
                        disableElevation
                      >
                        <i className="bi bi-plus"></i> Thêm địa chỉ mới
                      </Button>
                    </MenuItem>
                  </Select>
                </FormControl>
>>>>>>> e73760dd1189295936e71b2db90b88646e0dfd3d
              </div>
              <div className="mt-3"></div>
            </div>
            <div
              className="modal fade"
              id="exampleModal1"
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
                      className="form-control mb-3"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      placeholder="Nhập địa chỉ mới"
                      readOnly
                    />
<<<<<<< HEAD
=======

                    <FormSelectAdress
                      apiAddress={(fullAddress) => setNewAddress(fullAddress)}
                      resetForm={resetForm}
                      editFormAddress={newAddress}
                    />

>>>>>>> e73760dd1189295936e71b2db90b88646e0dfd3d
                    <div className="text-end mt-3">
                      <Button
                        variant="contained"
                        onClick={handleAddAddress}
                        style={{
                          width: "auto",
                          backgroundColor: "rgb(218, 255, 180)",
                          color: "rgb(45, 91, 0)",
                        }}
                        disableElevation
                      >
                        Thêm
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
<<<<<<< HEAD
          </div>
          <div className="card-body">
=======
          </CardContent>

          <div
            className="card-body"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              variant="contained"
              component={Link}
              to="/wallet/buyer"
              sx={{
                width: "auto",
                backgroundColor: "rgb(218, 255, 180)",
                color: "rgb(45, 91, 0)",
                "&:hover": {
                  backgroundColor: "rgb(218, 255, 180)",
                  color: "rgb(45, 91, 0)",
                },
              }}
              className="ms-2 me-3"
              disableElevation
            >
              <i class="bi bi-wallet2"></i>
            </Button>
>>>>>>> e73760dd1189295936e71b2db90b88646e0dfd3d
            <Button
              variant="contained"
              onClick={handleCombinedAction}
              style={{
                width: "auto",
                backgroundColor: "rgb(218, 255, 180)",
                color: "rgb(45, 91, 0)",
              }}
              disableElevation
            >
              Đặt hàng
            </Button>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default PayBuyer;
