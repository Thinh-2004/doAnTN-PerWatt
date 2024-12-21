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
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Pagination,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import useSession from "../../../../../Session/useSession";
import { toast } from "react-toastify";
import ChatInterface from "../../../../Notification&Message&Comment/Message/Message";
import { load } from "@teachablemachine/image";

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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  const [currentPage, setCurrentPage] = useState(1);
  const [reason, setReason] = useState("");
  const [reasons, setReasonS] = useState("");

  const itemsPerPage = 4;
  const totalItems = fill.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = fill.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  tailspin.register();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
  useEffect(() => {
    load();
  }, [user.id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy HH:mm");
  };

  const handleCancelOrder = (orderId) => {
    setSelectedOrderId(orderId);
  };

  const handleConfirmCancel = async (orderId) => {
    const loadingGHN = toast.loading(
      "Đang hủy đơn và gữi gmail cho người mua!"
    );

    if (inputReason) {
      try {
        await axios.put(`/order/Update/${orderId}`, {
          status: "Hủy",
          note: `Đơn hàng được hủy bởi người bán, với lý do là: ${inputReason}`,
        });
        setFill((prevFill) =>
          prevFill.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  orderstatus: "Hủy",
                  note: `Đơn hàng được hủy bởi người bán, lý do là: ${inputReason}`,
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
        toast.update(loadingGHN, {
          render: "Hủy hàng thành công với lý do là: " + inputReason,
          type: "success",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

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
            load();
          },
        },
        { label: "Không" },
      ],
    });
  };

  const handleRefun = (orderId) => {
    setReason(orderId);
    confirmAlert({
      title: "Xác nhận trả hàng",
      message: "Bạn có chắc chắn muốn xác nhận trả hàng!",
      buttons: [
        {
          label: "Có",
          onClick: async () => {
            try {
              await axios.put(`/order/Refun/${orderId}`, {
                status: "Trả hàng",
              });
              setFill((prevFill) =>
                prevFill.map((order) =>
                  order.id === orderId
                    ? { ...order, orderstatus: "Trả hàng" }
                    : order
                )
              );
            } catch (error) {
              console.log(error);
            }
            load();
          },
        },
        {
          label: "Không",
          onClick: () => {
            handleClickOpen();
          },
        },
      ],
    });
  };

  const handleRefunS = async () => {
    const loadingGHN = toast.loading(
      "Đang gữi yêu cầu và gmail từ chối trả hàng!"
    );
    try {
      await axios.put(`/order/Refun/${reason}`, {
        status: "Chờ nhận hàng",
        note: `Từ chối trả hàng, với lý do là: ${reasons}`,
      });
      console.log(reasons);

      setFill((prevFill) =>
        prevFill.map((order) =>
          order.id === reason
            ? {
                ...order,
                orderstatus: "Trả hàng",
                note: `Từ chối trả hàng, với lý do là: ${reasons}`,
              }
            : order
        )
      );
      toast.update(loadingGHN, {
        render: "Hủy hàng thành công với lý do là: " + reasons,
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
    } catch (error) {
      console.log(error);
    }

    setOpen(false);
    load();
  };

  const handleOrderOnTheWay = (orderId) => {
    confirmAlert({
      title: "Xác nhận giao hàng",
      message: "Bạn có chắc chắn đơn hàng sắp vận chuyển đến người dùng không!",
      buttons: [
        {
          label: "Có",
          onClick: async () => {
            try {
              await axios.put(`/order/${orderId}/status`, {
                status: "Chờ nhận hàng",
                awaitingdeliverydate: new Date(),
              });
              setFill((prevFill) =>
                prevFill.map((order) =>
                  order.id === orderId
                    ? { ...order, orderstatus: "Chờ nhận hàng" }
                    : order
                )
              );
            } catch (error) {
              console.error(error);
              alert(
                "Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng. Vui lòng thử lại."
              );
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

  //Chát tin nhấn
  const [infoUser, setInfoUser] = useState({});
  const [isOpenChatBox, setIsOpenChatBox] = useState(false);
  const handleOpenShowChatBox = (user) => {
    setIsOpenChatBox(true);
    setInfoUser(user);
    console.log(user);

    setTimeout(() => {
      setIsOpenChatBox(false);
    }, 500);
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
    return currentItems.map((order) => (
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
                <div key={orderDetail.id} className="row">
                  <div className="col-sm-12 col-lg-8 d-flex align-items-start">
                    <div
                      style={{ position: "relative", display: "inline-block" }}
                    >
                      <a
                        href={`/detailProduct/${orderDetail.productDetail.product.slug}`}
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
                      </a>
                    </div>

                    <div className="d-flex flex-column me-3">
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

                  {orderDetail.status?.includes(
                    "Đang gửi yêu cầu trả hàng"
                  ) && (
                    <div className="col-sm-12 col-lg-4 ms-auto text-end">
                      <div
                        className="text-end"
                        style={{
                          padding: "5px",
                          backgroundColor: "rgb(255, 184, 184)",
                          color: "rgb(198, 0, 0)",
                          borderRadius: "10px",
                          display: "inline-block",
                        }}
                      >
                        <span>Người dùng yêu cầu trả hàng</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          <div className="d-flex justify-content-end">
            <div className="al end">
              Thành tiền: {formatPrice(order.totalamount) + " VNĐ"}
            </div>
          </div>
          <React.Fragment>
            <Dialog
              open={open}
              TransitionComponent={Transition}
              keepMounted
              onClose={handleClose}
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle>{"Nhập lý do từ chối trả hàng"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nhập lý do"
                      aria-label="Nhập lý do"
                      aria-describedby="basic-addon1"
                      value={reasons}
                      onChange={(e) => setReasonS(e.target.value)}
                    />
                  </div>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Hủy</Button>
                <Button onClick={() => handleRefunS()}>Xác nhận</Button>
              </DialogActions>
            </Dialog>
          </React.Fragment>
          {orderDetails[order.id] && orderDetails[order.id].length > 2 && (
            <>
              <Button href={`/profileMarket/OrderDetailSeller/${order.id}`}>
                + {orderDetails[order.id].length - 2} sản phẩm
              </Button>

              {orderDetails[order.id].filter(
                (detail) =>
                  detail.status &&
                  detail.status.includes("Đang gửi yêu cầu trả hàng")
              ).length > 0 ? (
                <div
                  style={{
                    padding: "5px",
                    backgroundColor: "rgb(255, 184, 184)",
                    color: "rgb(198, 0, 0)",
                    borderRadius: "10px",
                    display: "inline-block",
                  }}
                >
                  <span>
                    Còn{" "}
                    {orderDetails[order.id].filter(
                      (detail) =>
                        detail.status &&
                        detail.status.includes("Đang gửi yêu cầu trả hàng")
                    ).length - 2}{" "}
                    sản phẩm đang yêu cầu trả hàng
                  </span>
                </div>
              ) : (
                ""
              )}
            </>
          )}

          <hr />
          <div className="d-flex justify-content-between align-items-center">
            <div>Mã đơn hàng: {order.id}</div>
            <div>
              {order.note ? (
                <Tooltip
                  title={
                    order.note.includes(",")
                      ? order.note.split(",")[1].trim()
                      : ""
                  }
                  arrow
                >
                  <span
                    style={{
                      padding: "5px",
                      backgroundColor: "rgb(255, 184, 184)",
                      color: "rgb(198, 0, 0)",
                      borderRadius: "10px",
                      display: "inline-block",
                    }}
                  >
                    {order.note.split(",")[0]}
                  </span>
                </Tooltip>
              ) : null}
            </div>
            <div className="d-flex align-items-center">
              {/* icon nhắn tin */}
              <button
                className="btn btn-sm me-3"
                id="btn-chatMessage"
                onClick={() => handleOpenShowChatBox(order.user)}
              >
                Nhắn tin cho người mua
              </button>
              <ChatInterface isOpenChatBox={isOpenChatBox} user={infoUser} />
              <div className="me-3">
                {order.orderstatus === "Hoàn thành" ? (
                  <></>
                ) : order.orderstatus === "Đang chờ duyệt" ? (
                  <>
                    <Tooltip title="Duyệt đơn hàng" arrow>
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
                        <i className="bi bi-check-circle-fill"></i>
                      </Button>
                    </Tooltip>
                    <Tooltip title="Hủy đơn hàng" arrow>
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
                        <i className="bi bi-x-circle-fill"></i>{" "}
                      </Button>
                    </Tooltip>
                  </>
                ) : order.orderstatus === "Đang vận chuyển" ? (
                  <Tooltip title="Chờ giao hàng" arrow>
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
                      <i className="bi bi-truck"></i>
                    </Button>
                  </Tooltip>
                ) : order.note &&
                  order.note.split(",")[0] ===
                    "Yêu cầu trả hàng bởi người dùng" ? (
                  <Tooltip title="Xử lý yêu cầu trả hàng" arrow>
                    <Button
                      onClick={() => handleRefun(order.id)}
                      style={{
                        width: "auto",
                        backgroundColor: "rgb(255, 230, 180)",
                        color: "rgb(128, 64, 0)",
                      }}
                      disableElevation
                    >
                      <i className="bi bi-arrow-return-left"></i>{" "}
                    </Button>
                  </Tooltip>
                ) : null}
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
                        Nhập lý do hủy hàng
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
                        onChange={(e) => setInputReason(e.target.value)}
                      />
                    </div>
                    <div className="modal-footer">
                      <Button
                        onClick={() => handleConfirmCancel(selectedOrderId)}
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
                <Tooltip title="Xem chi tiết" arrow>
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
                </Tooltip>
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
      <Pagination
        className="mb-3"
        count={Math.ceil(totalItems / itemsPerPage)}
        page={currentPage}
        onChange={(event, value) => paginate(value)}
        color="primary"
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      />
    </div>
  );
};

export default Order;
