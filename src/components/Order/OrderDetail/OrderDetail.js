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
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
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

  tailspin.register();

  const geturlIMG = (productId, filename) => {
    return `${axios.defaults.baseURL}files/product-images/${productId}/${filename}`;
  };
  const getAvtUser = (idUser, filename) => {
    return `${axios.defaults.baseURL}files/user/${idUser}/${filename}`;
  };

  const geturlIMGDetail = (productDetailId, filename) => {
    return `${axios.defaults.baseURL}files/detailProduct/${productDetailId}/${filename}`;
  };

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
    return format(date, "HH:mm:ss dd/MM/yyyy");
  };

  // const refundReturn = async (orderDetailId) => {
  //   try {
  //     await axios.put(`/orderDetail/update/${orderDetailId}`);

  //     toast.success("Gữi yêu cầu thành công!");
  //     load();
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Đã xảy ra lỗi trong quá gữi yêu cầu hoàn tiền!");
  //   }
  // };

  // const handleConfirmCancel = async (orderDetailId) => {
  //   if (inputReason) {
  //     try {
  //       await axios.put(`/orderDetail/update/${orderDetailId}`, {
  //         status: `Đang gửi yêu cầu hoàn tiền, lý do: ${inputReason}`,
  //       });

  //       const closeModalButton = document.querySelector(
  //         '[data-bs-dismiss="modal"]'
  //       );
  //       if (closeModalButton) {
  //         closeModalButton.click();
  //       }
  //       refundReturn(orderDetailId);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // };

  const handleConfirmCancel = async () => {
    if (inputReason) {
      try {
        await axios.post(`/orderDetail/update/${cancelProductDetail}`, {
          status: `Đang gửi yêu cầu hoàn tiền, lý do: ${inputReason}`,
        });

        const closeModalButton = document.querySelector(
          '[data-bs-dismiss="modal"]'
        );
        if (closeModalButton) {
          closeModalButton.click();
        }
        toast.success("Gữi yêu cầu thành công!");
        load();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <Header />
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
                                ? geturlIMGDetail(
                                    orderDetail.productDetail.id,
                                    orderDetail.productDetail.imagedetail
                                  )
                                : geturlIMG(
                                    orderDetail.productDetail.product.id,
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
                        </div>
                        <div className="col-3 mt-3 mx-2">
                          <div id="fontSizeTitle">
                            {orderDetail.productDetail.product.name}
                          </div>
                          <div id="fontSize">
                            {
                              [
                                orderDetail.productDetail.namedetail,
                                orderDetail.productDetail.product
                                  .productcategory.name,
                                orderDetail.productDetail.product.trademark
                                  .name === "No brand"
                                  ? "Không có thương hiệu"
                                  : "",
                                orderDetail.productDetail.product.warranties
                                  .name,
                              ]
                                .filter(Boolean) // Lọc bỏ các giá trị null hoặc rỗng
                                .join(", ") // Nối các chuỗi lại với nhau bằng dấu phẩy và khoảng trắng
                            }
                          </div>
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
                                <h1
                                  className="modal-title fs-5"
                                  id="exampleModalLabel"
                                >
                                  Nhập lý do bạn muốn hoàn tiền
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
                                  label="Nhập lý do bạn muốn hoàn tiền"
                                  variant="outlined"
                                  value={inputReason}
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
                                  disableElevation
                                >
                                  Xác nhận
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-10 mx-3 mt-5">
                          <div className="d-flex align-items-center">
                            <div className="col-2">
                              Giá: {formatPrice(orderDetail.price) + " VNĐ"}
                            </div>
                            <div className="col-1 me-5">
                              Số lượng: {orderDetail.quantity}
                            </div>
                            <div className="col-2">
                              Thành tiền:{" "}
                              {formatPrice(
                                orderDetail.price * orderDetail.quantity
                              ) + " VNĐ"}
                            </div>
                            <div className="col-5 d-flex justify-content-center align-items-center">
                              {order.orderstatus === "Hoàn thành" ? (
                                orderDetail.status === "" ? (
                                  <Button
                                    variant="contained"
                                    style={{
                                      backgroundColor: "rgb(255, 184, 184)",
                                      color: "rgb(198, 0, 0)",
                                      display: "inline-block",
                                    }}
                                    onClick={() =>
                                      setCancelProductDetail(orderDetail.id)
                                    }
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModal"
                                    disableElevation
                                  >
                                    Trả hàng/Hoàn tiền
                                  </Button>
                                ) : orderDetail.status ===
                                  "Đã xác nhận hoàn tiền" ? (
                                  <div
                                    style={{
                                      padding: "5px",
                                      backgroundColor: "rgb(218, 255, 180)",
                                      color: "rgb(45, 91, 0)",
                                      borderRadius: "10px",
                                      display: "inline-block",
                                    }}
                                  >
                                    Cửa hàng đã hoàn tiền cho bạn
                                  </div>
                                ) : (
                                  <div
                                    style={{
                                      padding: "5px",
                                      backgroundColor: "rgb(255, 184, 184)",
                                      color: "rgb(198, 0, 0)",
                                      borderRadius: "10px",
                                      display: "inline-block",
                                    }}
                                  >
                                    {orderDetail.status}
                                  </div>
                                )
                              ) : (
                                ""
                              )}
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
                      {order.receivedate ? (
                        <div>Số điện thoại: {order.user.phone}</div>
                      ) : (
                        ""
                      )}
                      <div>
                        Địa chỉ nhận hàng: {order.shippinginfor.address}
                      </div>
                      <div>
                        Thời gian đặt hàng: {formatDate(order.paymentdate)}
                      </div>
                      <div>
                        {order.receivedate ? (
                          <>
                            Thời gian nhận hàng: {formatDate(order.receivedate)}
                          </>
                        ) : (
                          <>Thời gian nhận hàng: chưa nhận</>
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
