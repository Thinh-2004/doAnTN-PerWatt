import React, { useEffect, useState, useRef } from "react";
import "./OrderStyle.css";
import axios from "../../../../../Localhost/Custumize-axios";
import { format } from "date-fns";
import { confirmAlert } from "react-confirm-alert";
import { tailspin } from "ldrs";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Button, Card, CardContent, TextField } from "@mui/material";
import useSession from "../../../../../Session/useSession";
import { toast } from "react-toastify";

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
  const [idStore] = useSession(`idStore`);
  const timeoutRef = useRef(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [inputReason, setInputReason] = useState("");

  tailspin.register();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`orderSeller/${idStore}`);

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
    // const interval = setInterval(() => {
    //   load();
    // }, 5000);

    // return () => clearInterval(interval);
  }, [user.id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "HH:mm:ss dd/MM/yyyy");
  };

  const handleCancelOrder = (orderId) => {
    setSelectedOrderId(orderId); // Lưu orderId để dùng khi gửi yêu cầu hủy
  };

  const handleConfirmCancel = async (orderId) => {
    if (inputReason) {
      try {
        await axios.put(`/order/${orderId}/status`, {
          status: "Hủy",
          note: `Đơn hàng được huỷ bởi chủ cửa hàng, lý do: ${inputReason}`,
        });
        // Cập nhật trạng thái
        setFill((prevFill) =>
          prevFill.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  orderstatus: "Hủy",
                  note: `Được huỷ bởi chủ cửa hàng, lý do: ${inputReason}`,
                }
              : order
          )
        );
        const closeModalButton = document.querySelector(
          '[data-bs-dismiss="modal"]'
        );
        if (closeModalButton) {
          closeModalButton.click();
        }
        toast.success("Huỷ hàng thành công với lý do: " + inputReason);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // const handleMarkAsReceived = async (orderId) => {
  //   try {
  //     await axios.put(`/order/${orderId}/status`, { status: "Đang vận chuyển" });
  //     setFill((prevFill) =>
  //       prevFill.map((order) =>
  //         order.id === orderId
  //           ? { ...order, orderstatus: "Đang vận chuyển" }
  //           : order
  //       )
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleMarkAsReceived = (orderId) => {
    confirmAlert({
      title: "Xác nhận đã gửi hàng",
      message: "Bạn có chắc chắn đã gửi hàng?",
      buttons: [
        {
          label: "Có",
          onClick: async () => {
            try {
              await axios.put(`/order/${orderId}/status`, {
                status: "Đang vận chuyển",
              });
              // Cập nhật trạng thái
              setFill((prevFill) =>
                prevFill.map((order) =>
                  order.id === orderId
                    ? { ...order, orderstatus: "Đang vận chuyển" }
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

  // const handleMarkAsReceived2 = async (orderId) => {
  //   try {
  //     await axios.put(`/order/${orderId}/status`, { status: "Chờ nhận hàng" });
  //     setFill((prevFill) =>
  //       prevFill.map((order) =>
  //         order.id === orderId
  //           ? { ...order, orderstatus: "Chờ nhận hàng" }
  //           : order
  //       )
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleOrderOnTheWay = (orderId) => {
    confirmAlert({
      title: "Xác nhận chuyển trạng thái",
      message: "Bạn có chắc chắn đơn hàng sắp vấn chuyển đến người dùng?",
      buttons: [
        {
          label: "Có",
          onClick: async () => {
            try {
              await axios.put(`/order/${orderId}/status`, {
                status: "Chờ nhận hàng",
              });
              // Cập nhật trạng thái
              setFill((prevFill) =>
                prevFill.map((order) =>
                  order.id === orderId
                    ? { ...order, orderstatus: "Chờ nhận hàng" }
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

  const fillOrderDetailbyOrderID = async (orderId) => {
    try {
      const res = await axios.get(`/orderDetail/${orderId}`);
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

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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
        className=" rounded-3 mt-3"
        key={order.id}
        sx={{ backgroundColor: "backgroundElement.children" }}
      >
        <CardContent className="">
          <div className="d-flex align-items-center mb-3">
            <img
              src={order.user.avatar}
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

            <h5 id="nameShop" className="mt-1">
              <div
                className="inherit-text"
                style={{
                  textDecoration: "inherit",
                  color: "inherit",
                }}
              >
                {order.user.fullname}
              </div>
            </h5>

            <div className="col-3 d-flex justify-content-end">
              <strong>{order.orderstatus}</strong>
            </div>
            <div className="col-3 d-flex justify-content-end">
              {formatDate(order.paymentdate)}
            </div>
            <div className="col-3 d-flex justify-content-end">
              {order.paymentmethod.type}
            </div>
          </div>

          {orderDetails[order.id] &&
            orderDetails[order.id].slice(0, 2).map((orderDetail) => {
              const firstIMG = orderDetail.productDetail.product.images?.[0];
              return (
                <div key={orderDetail.id}>
                  <div className="d-flex align-items-start">
                    <div
                      style={{ position: "relative", display: "inline-block" }}
                    >
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
                      {orderDetail.status?.includes(
                        "Đang gửi yêu cầu hoàn tiền"
                      ) && (
                        <span
                          style={{
                            position: "absolute",
                            top: "5px",
                            left: "5px",
                            backgroundColor: "red",
                            borderRadius: "50%",
                            width: "10px",
                            height: "10px",
                            boxShadow: "0 0 10px 5px rgba(255, 0, 0, 0.6)", // Hiệu ứng bloom
                            filter: "blur(1px)", // Làm mờ nhẹ để tạo cảm giác phát sáng
                            animation: "pulse 2s infinite", // Hiệu ứng chuyển động
                          }}
                        ></span>
                      )}
                    </div>

                    <div className="d-flex flex-column">
                      <div>{orderDetail.productDetail.product.name}</div>
                      {orderDetail.productDetail.namedetail && (
                        <label>
                          Phân loại: {orderDetail.productDetail.namedetail}
                        </label>
                      )}
                      <div>x {orderDetail.quantity}</div>
                      <div>
                        Tổng:{" "}
                        <span className="text-danger">
                          {formatPrice(orderDetail.price) + " VNĐ"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          <div className="d-flex justify-content-end">
            <div className="al end">
              Thành tiền: {formatPrice(order.totalamount) + " VNĐ"}
            </div>
          </div>
          {orderDetails[order.id] && orderDetails[order.id].length > 2 && (
            <>
              <Button href={`/profileMarket/OrderDetailSeller/${order.id}`}>
                + {orderDetails[order.id].length - 2} sản phẩm
              </Button>
              {orderDetails[order.id]
                .slice(2) // Lấy danh sách sản phẩm từ phần tử thứ 3 trở đi
                .some(
                  (item) => item.status === "Đang gửi yêu cầu hoàn tiền"
                ) && (
                <span
                  style={{
                    backgroundColor: "red",
                    borderRadius: "50%",
                    width: "10px",
                    height: "10px",
                    display: "inline-block",
                  }}
                ></span>
              )}
            </>
          )}

          <hr />
          <div className="d-flex justify-content-between align-items-center">
            <div>Mã đơn hàng: {order.id}</div>
            <div className="d-flex align-items-center">
              <div className="me-3">
                {order.orderstatus === "Hoàn thành" ? (
                  <></>
                ) : order.orderstatus === "Đang chờ duyệt" ? (
                  <>
                    <Button
                      className="me-3"
                      onClick={() => handleMarkAsReceived(order.id)}
                      style={{
                        width: "auto",
                        backgroundColor: "rgb(218, 255, 180)",
                        color: "rgb(45, 91, 0)",
                      }}
                      disableElevation
                    >
                      <i className="bi bi-cart-check-fill"></i>
                    </Button>
                    {/* <Button
                      onClick={() => handleCancelOrder(order.id)}
                      style={{
                        width: "auto",
                        backgroundColor: "rgb(255, 184, 184)",
                        color: "rgb(198, 0, 0)",
                      }}
                      disableElevation
                    >
                      <i className="bi bi-cart-x-fill"></i>
                    </Button> */}

                    <Button
                      onClick={() => handleCancelOrder(order.id)}
                      style={{
                        width: "auto",
                        backgroundColor: "rgb(255, 184, 184)",
                        color: "rgb(198, 0, 0)",
                      }}
                      disableElevation
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      <i className="bi bi-cart-x-fill"></i>
                    </Button>

                    <Button
                      onClick={() => handleCancelOrder(order.id)}
                      style={{
                        width: "auto",
                        backgroundColor: "rgb(255, 184, 184)",
                        color: "rgb(198, 0, 0)",
                      }}
                      disableElevation
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      <i className="bi bi-cart-x-fill"></i>
                    </Button>
                  </>
                ) : order.orderstatus === "Đang vận chuyển" ? (
                  /* <Button
                    onClick={() => handleOrderOnTheWay(order.id)}
                    style={{
                      width: "auto",
                      backgroundColor: "rgb(204,244,255)",
color: "rgb(0,70,89)",
                    }}
                    disableElevation
                  >
                    <i className="bi bi-truck"></i>
                  </Button> */

                  <Button
                    onClick={() => handleOrderOnTheWay(order.id)}
                    style={{
                      width: "auto",
                      backgroundColor: "rgb(204,244,255)",
                      color: "rgb(0,70,89)",
                      display: "flex",
                      alignItems: "center",
                    }}
                    disableElevation
                  >
                    <i
                      className="bi bi-truck"
                      style={{ animation: "moveTruck 1s linear infinite" }}
                    ></i>
                  </Button>
                ) : (
                  ""
                )}
              </div>
              <button
                type="button"
                class="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                hidden
              ></button>
              <div
                className="modal fade"
                id="exampleModal"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1 className="modal-title fs-5" id="exampleModalLabel">
                        Nhập lý do huỷ hàng
                      </h1>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <TextField
                        fullWidth
                        size="small"
                        id="outlined-basic"
                        label="Nhập lý do hủy đơn hàng"
                        variant="outlined"
                        value={inputReason}
                        onChange={(e) => setInputReason(e.target.value)} // Cập nhật lý do vào inputReason
                      />

                      {/* <input
                        type="text"
                        placeholder="Nhập lý do hủy đơn hàng"
                      /> */}
                    </div>
                    <div className="modal-footer">
                      <Button
                        onClick={() => handleConfirmCancel(selectedOrderId)} // Xác nhận hủy đơn hàng
                        style={{
                          width: "auto",
                          backgroundColor: "rgb(204,244,255)",
                          color: "rgb(0,70,89)",
                        }}
                        disableElevation
                      >
                        Xác nhận
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Button
                  variant="contained"
                  onClick={() => {
                    timeoutRef.current = setTimeout(() => {
                      window.location.href = `/profileMarket/OrderDetailSeller/${order.id}`;
                    }, 250);
                  }}
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
      <h1 className="text-center mt-4 mb-4">Đơn hàng của bạn</h1>
      <div className="col-12 col-12" style={{ transition: "0.5s" }}>
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
                "Chờ nhận hàng",
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
            "Chờ nhận hàng",
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
                    case "Chờ nhận hàng":
                      return order.orderstatus === "Chờ nhận hàng";
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
    </div>
  );
};

export default Order;
