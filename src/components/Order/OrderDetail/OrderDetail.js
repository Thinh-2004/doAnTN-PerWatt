import React, { useEffect, useState } from "react";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import axios from "../../../Localhost/Custumize-axios";
import { tailspin } from "ldrs";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const OrderDetail = () => {
  const [groupedByStore, setGroupedByStore] = useState({});
  const [loading, setLoading] = useState(true);
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const { id } = useParams();

  const [inputReason, setInputReason] = useState("");
  const [cancelProductDetail, setCancelProductDetail] = useState("");
  const changeLink = useNavigate();
  tailspin.register();
  const [isCountCart, setIsCountAddCart] = useState(false);
  const load = async () => {
    try {
      const res = await axios.get(`/orderDetail/${id}`);
      const grouped = groupByStore(res.data);
      setGroupedByStore(grouped);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, [user.id]);

  const groupByStore = (details) => {
    return details.reduce((groups, detail) => {
      const storeId = detail.productDetail.product.store.id;
      if (!groups[storeId]) {
        groups[storeId] = [];
      }
      groups[storeId].push(detail);
      return groups;
    }, {});
  };

  const formatPrice = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString("vi-VN");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy HH:mm");
  };

  const formatDateGHN = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy");
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

  const addToCartNow = async (productDetailId, quantity) => {
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;

    const cartItem = {
      quantity: quantity,
      user: { id: user.id },
      productDetail: { id: productDetailId },
    };

    try {
      await axios.post("/cart/add", cartItem);
      setIsCountAddCart(true);
      toast.success("Mua lại mua sản phẩm thành công!");
      changeLink("/cart");
    } catch (error) {
      toast.error("Thêm sản phẩm thất bại!" + error);
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div>
      <Header reloadCartItems={isCountCart} />
      <h1 className="text-center mt-4 mb-4">Đơn hàng chi tiết của bạn</h1>
      <div
        className="col-12 col-md-12 col-lg-10 offset-lg-1"
        style={{ transition: "0.5s" }}
      >
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
          Object.keys(groupedByStore).map((storeId) => {
            const storeProducts = groupedByStore[storeId];
            const store = storeProducts[0].productDetail.product.store;
            const order = storeProducts[0].order;
            return (
              <Card
                className="rounded-3 mt-3"
                key={storeId}
                sx={{
                  position: "relative",
                  minHeight: "200px",
                  transition: "0.5s",
                  backgroundColor: "backgroundElement.children",
                }}
              >
                <CardContent>
                  <Button
                    className="mb-3"
                    variant="contained"
                    style={{
                      width: "auto",
                      backgroundColor: "rgb(204,244,255)",
                      color: "rgb(0,70,89)",
                    }}
                    disableElevation
                    href="/order"
                  >
                    <i class="bi bi-caret-left-fill"></i>
                  </Button>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <img
                        src={store.user.avatar}
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
                    <div className="mt-1">Mã đơn hàng: {order.id}</div>
                  </div>
                  <hr />
                  {storeProducts.map((orderDetail, index) => {
                    const firstIMG =
                      orderDetail.productDetail.product.images?.[0];
                    return (
                      <div
                        className="d-flex mb-3 align-items-center"
                        key={index}
                      >
                        <div
                          className="col-1"
                          style={{
                            position: "relative",
                            width: "100px",
                            height: "100px",
                          }}
                        >
                          <img
                            src={
                              orderDetail &&
                              orderDetail.productDetail &&
                              orderDetail.productDetail.imagedetail
                                ? orderDetail.productDetail.imagedetail
                                : firstIMG.imagename
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
                        </div>
                        <div className="col-3 mt-3 mx-2">
                          <div id="fontSizeTitle">
                            {orderDetail.productDetail.product.name}
                          </div>
                          <div id="fontSize">
                            {[
                              orderDetail.productDetail.namedetail,
                              orderDetail.productDetail.product.productcategory
                                .name,
                              orderDetail.productDetail.product.trademark
                                .name === "No brand"
                                ? "Không có thương hiệu"
                                : "",
                              orderDetail.productDetail.product.warranties.name,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </div>
                        </div>
                        {/* <button
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
                                <h1
                                  className="modal-title fs-5"
                                  id="exampleModalLabel"
                                >
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
                                <TextField
                                  fullWidth
                                  size="small"
                                  id="outlined-basic"
                                  label="Nhập lý do bạn muốn trả hàng"
                                  variant="outlined"
                                  value={inputReason}
                                  disabled={cancelProductDetail === ""}
                                  onChange={(e) =>
                                    setInputReason(e.target.value)
                                  }
                                />
                              </div>
                              <div className="modal-footer">
                                <Button
                                  onClick={() => handleConfirmCancel()}
                                  style={{
                                    width: "auto",
                                    backgroundColor: "rgb(204,244,255)",
                                    color: "rgb(0,70,89)",
                                  }}
                                  disabled={cancelProductDetail === ""}
                                  disableElevation
                                >
                                  Xác nhận
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div> */}
                        <div className="col-8 mx-3 mt-5">
                          <div className="d-flex align-items-center">
                            <div className="col-3">
                              Giá: {formatPrice(orderDetail.price) + " VNĐ"}
                            </div>
                            <div className="col-2">
                              Số lượng: {orderDetail.quantity}
                            </div>
                            <div className="col-3">
                              Thành tiền:{" "}
                              {formatPrice(
                                orderDetail.price * orderDetail.quantity
                              ) + " VNĐ"}
                            </div>
                            <div className="col-5 d-flex justify-content-center align-items-center">
                              <div className="col-5 d-flex justify-content-center align-items-center">
                                {(order.orderstatus === "Hủy" ||
                                  order.orderstatus === "Hoàn thành" ||
                                  order.orderstatus === "Trả hàng") && (
                                  <Button
                                    variant="contained"
                                    style={{
                                      backgroundColor: "rgb(204,244,255)",
                                      color: "rgb(0,70,89)",
                                      display: "inline-block",
                                    }}
                                    onClick={() =>
                                      addToCartNow(
                                        orderDetail.productDetail.id,
                                        orderDetail.quantity
                                      )
                                    }
                                    disableElevation
                                  >
                                    Mua lại
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <hr />
                  <div className="d-flex">
                    <div className="col-6">
                      <div>Họ và tên người nhận: {order.user.fullname}</div>
                      <div>Số điện thoại: {order.user.phone}</div>
                      <div>
                        Địa chỉ nhận hàng: {order.shippinginfor.address}
                      </div>
                      <div>
                        Thời gian đặt hàng: {formatDate(order.paymentdate)}
                      </div>

                      <div>
                        {order.orderstatus === "Hoàn thành" &&
                        order.receivedate ? (
                          <>
                            Thời gian nhận hàng: {formatDate(order.receivedate)}
                          </>
                        ) : (
                          <>
                            <>Trạng thái nhận hàng của người mua: Chưa nhận </>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="col-6 text-end">
                      <Typography variant="span">
                        Tổng cộng: {formatPrice(order.totalamount) + " VNĐ"}
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrderDetail;
