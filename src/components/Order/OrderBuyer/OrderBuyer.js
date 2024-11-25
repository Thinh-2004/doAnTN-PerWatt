import React, { useEffect, useState } from "react";
import "./OrderStyle.css";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import axios from "../../../Localhost/Custumize-axios";
import { format } from "date-fns";
import { confirmAlert } from "react-confirm-alert";
import { tailspin } from "ldrs";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Button, Card, CardContent } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const CustomTabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const Order = () => {
  const [fill, setFill] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const [value, setValue] = useState(0);
  const [orderDetails, setOrderDetails] = useState({});
  tailspin.register();

  const [products, setProducts] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const resultCode = query.get("resultCode");
  const orderInfo = query.get("orderInfo");
  const addressIds = orderInfo ? orderInfo.split(",").pop().trim() : "";
  const cartIds = orderInfo
    ? orderInfo.match(/\d+/g).slice(0, -1).join(",").trim()
    : "";

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

  useEffect(() => {
    if (cartIds) {
      (async () => {
        try {
          const response = await axios.get(`/cart?id=${cartIds}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("hadfjkdshf")}`,
            },
          });
          setProducts(response.data);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [user.id]);

  const createMethodMoMo = async () => {
    try {
      const groupedProducts = groupByStore(products);

      for (const storeId in groupedProducts) {
        const { products: storeProducts } = groupedProducts[storeId];

        const order = {
          user: { id: user.id },
          shippinginfor: { id: addressIds },
          store: { id: storeId },
          paymentdate: new Date().toISOString(),
          orderstatus: "Đang chờ duyệt",
        };

        const orderDetails = storeProducts.map((product) => ({
          productDetail: { id: product.productDetail.id },
          quantity: product.quantity,
          price: product.productDetail.price,
        }));
        //00 = thành công
        if (resultCode === "0") {
          console.log("Calling API...");
          const res = await axios.post(
            "/createMoMoOrder",
            {
              order,
              orderDetails,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("hadfjkdshf")}`,
              },
            }
          );
          console.log(res.data);
        } else {
          return;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    createMethodMoMo();
  }, [fill]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`orderFill/${user.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("hadfjkdshf")}`,
          },
        });
        setFill(res.data);

        res.data.forEach((order) => {
          fillOrderDetailbyOrderID(order.id);
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    load();
    load();
  }, [user.id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "HH:mm:ss dd/MM/yyyy");
  };

  const handleCancelOrder = (orderId) => {
    confirmAlert({
      title: "Hủy đơn hàng",
      message: "Bạn có muốn hủy đơn không?",
      buttons: [
        {
          label: "Có",
          onClick: async () => {
            try {
              await axios.put(
                `/order/${orderId}/status`,
                {
                  status: "Hủy",
                  note: "Đơn hàng được huỷ bởi người dùng",
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                      "hadfjkdshf"
                    )}`,
                  },
                }
              );
              setFill((prevFill) =>
                prevFill.map((order) =>
                  order.id === orderId
                    ? {
                        ...order,
                        orderstatus: "Hủy",
                        note: "Đơn hàng được huỷ bởi người dùng",
                      }
                    : order
                )
              );
            } catch (error) {
              console.log(error);
            }
          },
        },
        { label: "Không" },
      ],
    });
  };

  const handleMarkAsReceived = async (orderId) => {
    const now = new Date().toISOString();
    try {
      await axios.put(
        `/order/${orderId}/status`,
        {
          status: "Hoàn thành",
          receivedate: now,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("hadfjkdshf")}`,
          },
        }
      );
      setFill((prevFill) =>
        prevFill.map((order) =>
          order.id === orderId
            ? { ...order, orderstatus: "Hoàn thành", receivedate: now }
            : order
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const fillOrderDetailbyOrderID = async (orderId) => {
    try {
      const res = await axios.get(`/orderDetail/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("hadfjkdshf")}`,
        },
      });
      setOrderDetails((prevOrderDetails) => ({
        ...prevOrderDetails,
        [orderId]: res.data,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const formatPrice = (value) => {
    if (!value) return "0";
    return Number(value).toLocaleString("vi-VN");
  };

  const renderOrders = (filterFn) => {
    const filteredOrders = fill.filter(filterFn);
    if (loading) {
      return (
        <div className="text-center">
          <l-tailspin
            size="40"
            stroke="5"
            speed="0.9"
            color="black"
          ></l-tailspin>
        </div>
      );
    }
    if (filteredOrders.length === 0) {
      return <div className="text-center">Chưa có sản phẩm</div>;
    }

    return filteredOrders.map((order) => (
      <Card
        className="rounded-3 mt-3"
        key={order.id}
        sx={{ backgroundColor: "backgroundElement.children" }}
      >
        <CardContent className="">
          <div className="d-flex align-items-center mb-1">
            <Link to={`/pageStore/${order.store.slug}`}>
              <img
                src={order.store.user.avatar}
                id="imgShop"
                className="mx-2 object-fit-cover"
                style={{
                  width: "30px",
                  height: "30px",
                  objectFit: "contain",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "100%",
                }}
                alt=""
              />
            </Link>
            <h5 id="nameShop" className="mt-1">
              <Link
                className="inherit-text"
                to={`/pageStore/${order.store.slug}`}
                style={{
                  textDecoration: "inherit",
                  color: "inherit",
                }}
              >
                {order.store.namestore}
              </Link>
            </h5>

            <div className="col-3 d-flex justify-content-center">
              <strong>{order.orderstatus}</strong>
            </div>
            <div className="col-3 d-flex justify-content-center">
              {formatDate(order.paymentdate)}
            </div>
            <div className="col-3 d-flex justify-content-center">
              {order.paymentmethod.type}
            </div>
          </div>

          {orderDetails[order.id] &&
            orderDetails[order.id].slice(0, 2).map((orderDetail) => {
              const firstIMG = orderDetail.productDetail.product.images?.[0];
              return (
                <div key={orderDetail.id}>
                  <div className="d-flex align-items-start">
                    <img
                      src={
                        orderDetail.productDetail.imagedetail
                          ? orderDetail.productDetail.imagedetail
                          : firstIMG?.imagename
                      }
                      alt=""
                      style={{
                        width: "100px",
                        height: "100px",
                      }}
                      className="rounded-3 mb-3 me-3"
                    />
                    <div className="d-flex flex-column">
                      <div>{orderDetail.productDetail.product.name}</div>
                      {orderDetail.productDetail.namedetail && (
                        <label>
                          Phân loại: {orderDetail.productDetail.namedetail}
                        </label>
                      )}
                      <div>Giá: {formatPrice(orderDetail.price) + " VNĐ"}</div>
                      <div>x {orderDetail.quantity}</div>

                      <div>
                        Tổng:{" "}
                        <span className="text-danger">
                          {formatPrice(
                            orderDetail.price * orderDetail.quantity
                          ) + " VNĐ"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          {orderDetails[order.id] && orderDetails[order.id].length > 3 && (
            <Button href={`/orderDetail/${order.id}`}>
              + {orderDetails[order.id].length - 2} sản phẩm
            </Button>
          )}
          <hr />
          <div className="d-flex justify-content-between align-items-center">
            <div>{order.note}</div>
            <div className="d-flex align-items-center">
              <div className="me-3">
                {order.orderstatus === "Chờ nhận hàng" ? (
                  <Button
                    onClick={() => handleMarkAsReceived(order.id)}
                    style={{
                      width: "auto",
                      backgroundColor: "rgb(218, 255, 180)",
                      color: "rgb(45, 91, 0)",
                    }}
                    disableElevation
                  >
                    Đã nhận hàng
                  </Button>
                ) : order.orderstatus === "Hoàn thành" ? (
                  <>
                    {orderDetails &&
                    orderDetails[order.id] &&
                    Array.isArray(orderDetails[order.id]) ? (
                      Array.from(
                        new Set(
                          orderDetails[order.id].map(
                            (orderDetail) =>
                              orderDetail.productDetail.product.id
                          )
                        )
                      ).map((productId) => {
                        const orderDetail = orderDetails[order.id].find(
                          (detail) =>
                            detail.productDetail.product.id === productId
                        );
                        return (
                          <Button
                            className="ms-3"
                            key={orderDetail?.productDetail?.product?.slug}
                            href={`/detailProduct/${orderDetail?.productDetail?.product?.slug}`}
                            style={{
                              width: "auto",
                              backgroundColor: "rgb(255, 184, 184)",
                              color: "rgb(198, 0, 0)",
                            }}
                            disableElevation
                          >
                            Mua lại
                          </Button>
                        );
                      })
                    ) : (
                      <p>Không có chi tiết đơn hàng</p>
                    )}
                  </>
                ) : (
                  order.orderstatus !== "Hủy" && (
                    <Button
                      onClick={() => handleCancelOrder(order.id)}
                      style={{
                        width: "auto",
                        backgroundColor: "rgb(255, 184, 184)",
                        color: "rgb(198, 0, 0)",
                      }}
                      disableElevation
                    >
                      <i className="bi bi-cart-x-fill"></i>
                    </Button>
                  )
                )}
              </div>
              <div>
                <Button
                  variant="contained"
                  href={`/orderDetail/${order.id}`}
                  style={{
                    height: "40px",
                    width: "auto",
                    backgroundColor: "rgb(204,244,255)",
                    color: "rgb(0,70,89)",
                  }}
                  disableElevation
                >
                  <i className="bi bi-eye-fill fs-5"></i>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Header />
      <h1 className="text-center mt-4 mb-4">Đơn hàng của bạn</h1>
      <div
        className="col-12 col-md-12 col-lg-10 offset-lg-1"
        style={{ transition: "0.5s" }}
      >
        {/* <Button
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
        </Button> */}

        <Box
          sx={{ width: "100%", backgroundColor: "backgroundElement.children" }}
          className="rounded-3"
        >
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              borderRadius: "10px",
              overflow: "hidden",
            }}
            className="rounded-3"
          >
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              sx={{ backgroundColor: "backgroundElement.children" }}
            >
              {[
                "Tất cả",
                "Đang chờ duyệt",
                "Đang vận chuyển",
                "Hoàn thành",
                "Hủy",
                "Trả hàng",
              ].map((tab, index) => (
                <Tab label={tab} key={index} />
              ))}
            </Tabs>
          </Box>
          {[
            "Tất cả",
            "Đang chờ duyệt",
            "Đang vận chuyển",
            "Hoàn thành",
            "Hủy",
            "Trả hàng",
          ].map((tab, index) => (
            <CustomTabPanel value={value} index={index} key={index}>
              <div>
                {renderOrders((order) => {
                  switch (tab) {
                    case "Tất cả":
                      return true;
                    case "Đang chờ duyệt":
                      return order.orderstatus === "Đang chờ duyệt";
                    case "Đang vận chuyển":
                      return order.orderstatus === "Đang vận chuyển";
                    case "Hoàn thành":
                      return order.orderstatus === "Hoàn thành";
                    case "Hủy":
                      return order.orderstatus === "Hủy";
                    case "Trả hàng":
                      return order.orderstatus === "Trả hàng";
                    default:
                      return false;
                  }
                })}
              </div>
            </CustomTabPanel>
          ))}
        </Box>
      </div>
      <Footer />
    </div>
  );
};

export default Order;
