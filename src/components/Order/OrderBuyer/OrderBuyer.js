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
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  MenuItem,
  Pagination,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import FormReport from "../../Report/FormReport";
import { FormControl } from "react-bootstrap";
import { Select } from "antd";

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
  const [inputReason, setInputReason] = useState("");
  const [cancelProductDetail, setCancelProductDetail] = useState("");
  const [open, setOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState(" ");
  const [cancelReasonS, setCancelReasonS] = useState(" ");
  const [returnOrder, setReturnOrder] = useState("");

  const [value, setValue] = useState(0);
  const [orderDetails, setOrderDetails] = useState({});
  tailspin.register();

  const [products, setProducts] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  // const resultCode = query.get("resultCode");
  const orderInfo = query.get("orderInfo");
  const addressIds = orderInfo ? orderInfo.split(",").pop().trim() : "";
  const cartIds = orderInfo
    ? orderInfo.match(/\d+/g).slice(0, -1).join(",").trim()
    : "";

  const amount = query.get("amount");
  // const totalAmounts = amount.split(",").pop().trim();
  // let totalAmount = totalAmounts / 100;
  const [orderIdS, setOrderIdS] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalItems = fill.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = fill.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  // const [age, setAge] = React.useState("");

  // const handleChangeS = (event) => {
  //   setAge(event.target.value);
  // };

  const load = async () => {
    try {
      const res = await axios.get(`orderFill/${user.id}`);
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

  const groupByStore = (products) => {
    return products.reduce((groupStores, product) => {
      const { store } = product.productDetail.product;
      const storeId = store.id;

      if (!groupStores[storeId]) {
        groupStores[storeId] = {
          store,
          products: [],
        };
      }

      groupStores[storeId].products.push(product);
      return groupStores;
    }, {});
  };

  const fetchCartData = async () => {
    try {
      const response = await axios.get(`/cart?id=${cartIds}`);
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // const createMethodMoMo = async () => {
  //   try {
  //     const groupedProducts = groupByStore(products);

  //     for (const storeId in groupedProducts) {
  //       const { products: storeProducts } = groupedProducts[storeId];
  //       const totalAmount = storeProducts.reduce((sum, product) => {
  //         return sum + product.productDetail.price * product.quantity;
  //       }, 0);
  //       const order = {
  //         user: { id: user.id },
  //         paymentmethod: { tyle: "Thanh toán bằng MoMo" },
  //         shippinginfor: { id: addressIds },
  //         store: { id: storeId },
  //         paymentdate: new Date().toISOString(),
  //         orderstatus: "Đang chờ duyệt",
  //         totalamount: totalAmount,
  //       };

  //       const orderDetails = storeProducts.map((product) => ({
  //         productDetail: { id: product.productDetail.id },
  //         quantity: product.quantity,
  //         price: product.productDetail.price,
  //       }));

  //       if (resultCode === "0") {
  //         await axios.post("/createMoMoOrder", {
  //           order,
  //           orderDetails,
  //         });
  //       } else {
  //         return;
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleCod = async () => {
    try {
      if (amount) {
        const totalAmount = amount.split(",").pop().trim();
        // const savedFinalTotal = sessionStorage.getItem("finalTotal");
        const groupedProducts = groupByStore(products);

        let feeShip = 0;
        let leadtime = [];

        for (const storeId in groupedProducts) {
          const { products: storeProducts, store } = groupedProducts[storeId];

          if (!storeProducts.length) continue;

          const outOfStockProduct = storeProducts.find(
            (product) => product.productDetail.quantity === 0
          );

          if (outOfStockProduct) {
            toast.error(
              "Sản phẩm đã có người mua trước, vui lòng mua sản phẩm khác hoặc mua lại sau"
            );
            return;
          }

          const addressUser = await axios.get(`shippingInfoId/${addressIds}`);

          const addressPartFroms = store.address
            .split(",")
            .map((part) => part.trim());

          let phuong = "";
          let quan = "";
          let thanhPho = "";

          if (addressPartFroms.length === 3) {
            phuong = addressPartFroms[0];
            quan = addressPartFroms[1];
            thanhPho = addressPartFroms[2];
          } else if (addressPartFroms.length === 4) {
            phuong = addressPartFroms[1];
            quan = addressPartFroms[2];
            thanhPho = addressPartFroms[3];
          } else if (addressPartFroms.length === 5) {
            phuong = addressPartFroms[2];
            quan = addressPartFroms[3];
            thanhPho = addressPartFroms[4];
          }

          const addressPartsTo = addressUser.data.address
            .split(",")
            .map((part) => part.trim());

          let to_ward_name = "";
          let to_district_name = "";
          let to_province_name = "";

          if (addressPartsTo.length === 3) {
            to_ward_name = addressPartsTo[0];
            to_district_name = addressPartsTo[1];
            to_province_name = addressPartsTo[2];
          } else if (addressPartsTo.length === 4) {
            to_ward_name = addressPartsTo[1];
            to_district_name = addressPartsTo[2];
            to_province_name = addressPartsTo[3];
          } else if (addressPartsTo.length === 5) {
            to_ward_name = addressPartsTo[2];
            to_district_name = addressPartsTo[3];
            to_province_name = addressPartsTo[4];
          }

          const ghnPayload = {
            payment_type_id: 2,
            note: "",
            required_note: "KHONGCHOXEMHANG",
            return_phone: store.phone,
            return_address: store.address,
            return_district_id: "",
            return_ward_code: "",
            client_order_code: "",
            from_name: store.namestore,
            from_phone: store.phone,
            from_address: store.address,
            from_ward_name: phuong,
            from_district_name: quan,
            from_province_name: thanhPho,
            to_name: user.fullname,
            to_phone: addressUser.data.user.phone,
            to_address: addressUser.data.address,
            to_ward_name: to_ward_name,
            to_district_name: to_district_name,
            to_province_name: to_province_name,
            cod_amount: 0,
            content: "",
            weight: 200,
            length: 1,
            width: 20,
            height: 10,
            cod_failed_amount: 10000,
            pick_station_id: 1444,
            deliver_station_id: 0,
            insurance_value: parseInt(totalAmount),
            service_id: 2,
            service_type_id: 2,
            coupon: "",
            pickup_time: 1733758226,
            pick_shift: [1],
            items: storeProducts.map((product) => ({
              name:
                product.productDetail.product.name +
                " " +
                product.productDetail?.namedetail,
              code: String(product.productDetail.id),
              quantity: product.quantity,
              price: product.productDetail.price,
              length: 12,
              width: 12,
              weight: 1200,
              height: 12,
              category: {
                level1: "Sản phẩm",
              },
            })),
          };

          try {
            console.log("Payload gửi tới GHN: ", ghnPayload);
            const response = await axios.post(
              "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create",
              ghnPayload,
              {
                headers: {
                  "Content-Type": "application/json",
                  ShopId: "195541",
                  Token: "ece58b2c-b0da-11ef-9083-dadc35c0870d",
                  // Authorization: "Bearer ece58b2c-b0da-11ef-9083-dadc35c0870d",
                },
              }
            );
            console.log("Kết quả trả về từ GHN: ", response.data);
            console.log("Total fee: ", response.data.data.total_fee);

            feeShip += Number(response.data.data.total_fee);

            if (!Array.isArray(leadtime)) {
              leadtime = [];
            }

            leadtime = [...leadtime, response.data.data.expected_delivery_time];

            const savedVoucherId = localStorage.getItem("voucherIdMoMo");

            const order = {
              user: { id: user.id },
              paymentmethod: { id: 8 },
              shippinginfor: { id: addressIds },
              store: { id: storeId },
              paymentdate: new Date().toISOString(),
              receivedate: response.data.data.expected_delivery_time
                ? new Date(
                    response.data.data.expected_delivery_time
                  ).toISOString()
                : null,
              orderstatus: "Đang chờ duyệt",
              totalamount: parseInt(totalAmount) + feeShip,
              voucher:
                savedVoucherId === null
                  ? null
                  : { id: parseInt(savedVoucherId) },
            };

            const orderDetails = storeProducts.map((product) => ({
              productDetail: { id: product.productDetail.id },
              quantity: product.quantity,
              price: product.productDetail.price,
              status: null,
            }));

            await axios.post("/api/orderCreate", {
              order,
              orderDetails,
            });

            localStorage.removeItem("voucherIdMoMo");
          } catch (error) {
            console.error("Error: ", error);
            return;
          }
        }
      }
    } catch (error) {
      console.error("Lỗi: ", error);
      return;
    }
  };

  useEffect(() => {
    if (cartIds !== "") {
      const timer = setTimeout(() => {
        fetchCartData();
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [cartIds]);

  useEffect(() => {
    if (cartIds !== "") {
      const timer1 = setTimeout(() => {
        handleCod();
        const timer2 = setTimeout(() => {
          load();
        }, 1500);
        return () => clearTimeout(timer2);
      }, 10);

      return () => clearTimeout(timer1);
    }
  }, [addressIds, products, user.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      load();
    }, 500);
    return () => clearTimeout(timer);
  }, [user.id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy HH:mm");
  };

  const handleCancelOrder = async () => {
    try {
      await axios.put(`/order/${orderIdS}/status`, {
        status: "Hủy",
        note: `Đơn hàng được hủy bởi người dùng, với lý do là: ${cancelReason}`,
      });
      setFill((prevFill) =>
        prevFill.map((order) =>
          order.id === orderIdS
            ? {
                ...order,
                orderstatus: "Hủy",
                note: `Đơn hàng được Hủy bởi người dùng, với lý do là: ${cancelReason}`,
              }
            : order
        )
      );
    } catch (error) {
      console.log(error);
    }
    setOpen(false);
    setCancelReason("");
    load();
  };

  // const handleConfirmCancel = async () => {
  //   if (inputReason) {
  //     try {
  //       await axios.post(`/orderDetail/update/${cancelProductDetail}`, {
  //         status: `Đang gửi yêu cầu trả hàng, với lý do: ${inputReason}`,
  //       });

  //       const closeModalButton = document.querySelector(
  //         '[data-bs-dismiss="modal"]'
  //       );
  //       if (closeModalButton) {
  //         closeModalButton.click();
  //       }
  //       toast.success("Gữi yêu cầu thành công!");
  //       load();
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // };

  const handleReturn = async () => {
    try {
      await axios.put(`/order/${returnOrder}/status`, {
        status: "Chờ nhận hàng",
        note: `Yêu cầu trả hàng bởi người dùng, với lý do là: ${cancelReasonS}`,
      });

      setFill((prevFill) =>
        prevFill.map((order) =>
          order.id === returnOrder
            ? {
                ...order,
                note: `Yêu cầu trả hàng bởi người dùng, với lý do là: ${cancelReasonS}`,
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
      toast.success("Gữi yêu cầu trả hàng thành công");
    } catch (error) {
      console.log(error);
    }
  };

  const handleMarkAsReceived = (orderId) => {
    confirmAlert({
      title: "Xác nhận nhận hàng",
      message: "Bạn có chắc chắn muốn xác nhận đã nhận được hàng?",
      buttons: [
        {
          label: "Có",
          onClick: async () => {
            const now = new Date().toISOString();
            try {
              await axios.put(`/order/${orderId}/status`, {
                status: "Hoàn thành",
                receivedate: now,
              });
              setFill((prevFill) =>
                prevFill.map((order) =>
                  order.id === orderId
                    ? { ...order, orderstatus: "Hoàn thành", receivedate: now }
                    : order
                )
              );
              load();
            } catch (error) {
              console.log(error);
            }
          },
        },
        {
          label: "Không",
        },
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setCancelReason(" ");
    setOpen(false);
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
        className="rounded-3 mt-3"
        key={order.id}
        sx={{ backgroundColor: "backgroundElement.children" }}
      >
        <CardContent className="">
          <div className="d-flex align-items-center mb-3">
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
            <h5 id="nameShop" className="mt-3">
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
            <div className="col-0 d-flex justify-content-center">
              {order.orderstatus === "Hoàn thành" && (
                <FormReport
                  idStore={
                    orderDetails[order.id] &&
                    orderDetails[order.id][0].productDetail.product.store.id
                  }
                  idOrder={order.id}
                />
              )}
            </div>
          </div>
          <React.Fragment>
            <Dialog
              open={open}
              TransitionComponent={Transition}
              keepMounted
              onClose={handleClose}
              aria-describedby="alert-dialog-slide-description"
              maxWidth="lg"
            >
              <DialogTitle sx={{ fontSize: "24px" }}>
                {"Lý do hủy đơn hàng"}
              </DialogTitle>{" "}
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  <div className="form-check" style={{ fontSize: "18px" }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault1"
                      onChange={() =>
                        setCancelReason("muốn thay đổi địa chỉ nhận hàng")
                      }
                      style={{ cursor: "pointer" }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexRadioDefault1"
                      style={{ cursor: "pointer" }} // Thêm cursor pointer vào label
                    >
                      Muốn thay đổi địa chỉ nhận hàng
                    </label>
                  </div>

                  <div className="form-check" style={{ fontSize: "18px" }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault2"
                      onChange={() =>
                        setCancelReason("muốn nhập/thay đổi Voucher")
                      }
                      style={{ cursor: "pointer" }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexRadioDefault2"
                      style={{ cursor: "pointer" }}
                    >
                      Muốn nhập/thay đổi Voucher
                    </label>
                  </div>

                  <div className="form-check" style={{ fontSize: "18px" }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault3"
                      onChange={() =>
                        setCancelReason("muốn đổi phân loại sản phẩm")
                      }
                      style={{ cursor: "pointer" }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexRadioDefault3"
                      style={{ cursor: "pointer" }}
                    >
                      Muốn đổi phân loại sản phẩm
                    </label>
                  </div>

                  <div className="form-check" style={{ fontSize: "18px" }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault4"
                      onChange={() => setCancelReason("không còn nhu cầu nữa")}
                      style={{ cursor: "pointer" }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexRadioDefault4"
                      style={{ cursor: "pointer" }}
                    >
                      Không còn nhu cầu nữa
                    </label>
                  </div>

                  <div className="form-check" style={{ fontSize: "18px" }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault5"
                      onChange={() => setCancelReason("")}
                      style={{ cursor: "pointer" }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexRadioDefault5"
                      style={{ cursor: "pointer" }}
                    >
                      Khác
                    </label>
                  </div>

                  {![
                    "muốn thay đổi địa chỉ nhận hàng",
                    "muốn nhập/thay đổi Voucher",
                    "muốn đổi phân loại sản phẩm",
                    "không còn nhu cầu nữa",
                    " ",
                  ].includes(cancelReason) || cancelReason === "" ? (
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nhập lý do"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      style={{ fontSize: "16px", padding: "12px" }} // Tăng kích thước input
                    />
                  ) : null}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} sx={{ fontSize: "18px" }}>
                  Hủy
                </Button>{" "}
                {/* Tăng kích thước button */}
                <Button
                  onClick={() => handleCancelOrder()}
                  sx={{ fontSize: "18px" }}
                >
                  Xác nhận
                </Button>
              </DialogActions>
            </Dialog>
          </React.Fragment>

          {orderDetails[order.id] &&
            orderDetails[order.id].slice(0, 2).map((orderDetail) => {
              const firstIMG = orderDetail.productDetail.product.images?.[0];
              return (
                <div key={orderDetail.id}>
                  <div className="d-flex align-items-start">
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
          <div className="d-flex justify-content-end">
            <div className="al end">
              Thành tiền: {formatPrice(order.totalamount) + " VNĐ"}
            </div>
          </div>

          {orderDetails[order.id] && orderDetails[order.id].length > 2 && (
            <Button href={`/orderDetail/${order.id}`}>
              + {orderDetails[order.id].length - 2} sản phẩm
            </Button>
          )}
          <hr />
          <div className="d-flex justify-content-between align-items-center">
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
            ) : (
              <div></div>
            )}

            <div className="d-flex align-items-center">
              <div className="me-3">
                {order.orderstatus === "Đang chờ duyệt" ? (
                  <>
                    <Tooltip title="Hủy đơn hàng" arrow>
                      <Button
                        onClick={() => {
                          setOrderIdS(order.id);
                          handleClickOpen();
                        }}
                        style={{
                          width: "auto",
                          backgroundColor: "rgb(255, 184, 184)",
                          color: "rgb(198, 0, 0)",
                        }}
                        disableElevation
                      >
                        <i className="bi bi-x-circle-fill"></i>
                      </Button>
                    </Tooltip>
                  </>
                ) : order.orderstatus === "Chờ nhận hàng" ? (
                  new Date() - new Date(order.awaitingdeliverydate) <=
                  7 * 24 * 60 * 60 * 1000 ? (
                    <>
                      {!(
                        order.note &&
                        (order.note.split(",")[0] === "Từ chối trả hàng" ||
                          order.note.split(",")[0] ===
                            "Yêu cầu trả hàng bởi người dùng")
                      ) && (
                        <Tooltip title="Trả hàng" arrow>
                          <Button
                            className="me-3"
                            onClick={() => setReturnOrder(order.id)}
                            style={{
                              width: "auto",
                              backgroundColor: "rgb(204,244,255)",
                              color: "rgb(0,70,89)",
                            }}
                            disableElevation
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                          >
                            Trả hàng
                          </Button>
                        </Tooltip>
                      )}

                      <Tooltip title="Đã nhận hàng" arrow>
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
                      </Tooltip>
                    </>
                  ) : null
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
                        orderDetails[order.id].find(
                          (detail) =>
                            detail.productDetail.product.id === productId
                        );
                      })
                    ) : (
                      <p>Không có chi tiết đơn hàng</p>
                    )}
                  </>
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
                        Nhập lý do bạn muốn trả hàng
                      </h1>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault1"
                          onChange={() =>
                            setCancelReasonS("chưa nhận được hàng")
                          }
                          style={{ cursor: "pointer" }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexRadioDefault1"
                          style={{ cursor: "pointer" }}
                        >
                          Chưa nhận được hàng
                        </label>
                      </div>

                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault2"
                          onChange={() => setCancelReasonS("thiếu hàng")}
                          style={{ cursor: "pointer" }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexRadioDefault2"
                          style={{ cursor: "pointer" }}
                        >
                          Thiếu hàng
                        </label>
                      </div>

                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault3"
                          onChange={() =>
                            setCancelReasonS("người bán gửi sai hàng")
                          }
                          style={{ cursor: "pointer" }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexRadioDefault3"
                          style={{ cursor: "pointer" }}
                        >
                          Người bán gửi sai hàng
                        </label>
                      </div>

                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault4"
                          onChange={() => setCancelReasonS("hàng bể vỡ")}
                          style={{ cursor: "pointer" }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexRadioDefault4"
                          style={{ cursor: "pointer" }}
                        >
                          Hàng bể vỡ
                        </label>
                      </div>

                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault5"
                          onChange={() => setCancelReasonS("")}
                          style={{ cursor: "pointer" }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexRadioDefault5"
                          style={{ cursor: "pointer" }}
                        >
                          Khác
                        </label>
                      </div>

                      {![
                        "chưa nhận được hàng",
                        "thiếu hàng",
                        "người bán gửi sai hàng",
                        "hàng bể vỡ",
                        " ",
                      ].includes(cancelReasonS) || cancelReasonS === "" ? (
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Nhập lý do"
                          value={cancelReasonS}
                          onChange={(e) => setCancelReasonS(e.target.value)}
                        />
                      ) : null}
                      {/* <TextField
                        fullWidth
                        size="small"
                        id="outlined-basic"
                        label="Nhập lý do bạn muốn trả hàng"
                        variant="outlined"
                        value={inputReason}
                        onChange={(e) => setInputReason(e.target.value)}
                      /> */}
                    </div>
                    <div className="modal-footer">
                      <Button
                        onClick={() => handleReturn()}
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
      <Header />
      <h1 className="text-center mt-4 mb-4">Đơn hàng của bạn</h1>
      <div
        className="col-12 col-md-12 col-lg-10 offset-lg-1"
        style={{ transition: "0.5s" }}
      >
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
      <Footer />
    </div>
  );
};

export default Order;
