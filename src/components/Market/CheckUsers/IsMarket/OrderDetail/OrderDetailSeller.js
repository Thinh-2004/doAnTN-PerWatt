import React, { useEffect, useState } from "react";
import axios from "../../../../../Localhost/Custumize-axios";
import { useParams } from "react-router-dom";
import { tailspin } from "ldrs";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import useSession from "../../../../../Session/useSession";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";

const OrderDetailSeller = () => {
  const [groupedByStore, setGroupedByStore] = useState({});
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");
  const [cancelProductDetail, setCancelProductDetail] = useState("");

  const { id } = useParams();
  const [idStore] = useSession(`idStore`);
  tailspin.register();
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const load = async () => {
    try {
      const res = await axios.get(`/orderDetailSeller/${id}`);

      const grouped = groupByStore(res.data);
      setGroupedByStore(grouped);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const maxWords = 15; // Giới hạn số từ tối đa hiển thị

  // Hàm cắt chuỗi theo số lượng từ
  const truncateText = (text, maxWords) => {
    const words = text.split(" ");
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + "..."; // Cắt và thêm dấu "..."
    }
    return text;
  };

  useEffect(() => {
    load();
  }, [id]);

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

  const Aaccept = (orderDetailId, status) => {
    const statusMessage = status.split(",")[1]
      ? status.split(",")[1].trim()
      : status;

    confirmAlert({
      title: "Xác nhận trả hàng",
      message: "Với " + statusMessage,
      buttons: [
        {
          label: "Có",
          onClick: () => refundReturn(orderDetailId),
        },
        {
          label: "Không",
          onClick: () => cancelRefund(),
        },
      ],
    });
  };
  const refundReturn = async (orderDetailId) => {
    try {
      await axios.post(`/orderDetail/update/${orderDetailId}`, {
        status: "Đã xác nhận trả hàng",
      });
      load();
      toast.success("Trả hàng thành công");
    } catch (error) {
      toast.error("Đã có lỗi xảy ra trong quá trình trả hàng");
      console.error(error);
    }
  };

  const cancelRefund = async () => {
    const openModalButton = document.querySelector('[data-bs-toggle="modal"]');
    if (openModalButton) {
      openModalButton.click();
    }
  };

  const cancelRefundS = async () => {
    await axios.post(`/orderDetail/update/${cancelProductDetail}`, {
      status: "Từ chối trả hàng, với lý do " + reason,
    });

    toast.success("Từ chối trả hàng thành công!");
    load();
    const closeModalButton = document.querySelector(
      '[data-bs-dismiss="modal"]'
    );
    if (closeModalButton) {
      closeModalButton.click();
    }
  };

  return (
    <div>
      <h1 className="text-center mt-4 mb-4">Đơn hàng của bạn</h1>
      <div className="col-12 col-12" style={{ transition: "0.5s" }}>
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
            const order = storeProducts[0].order;
            return (
              <Card
                className=" mt-3"
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
                    href={`/profileMarket/orderSeller/${idStore}`}
                  >
                    <i class="bi bi-caret-left-fill"></i>
                  </Button>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <img
                        src={order.user.avatar}
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
                        {order.user.fullname}
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
                              orderDetail.productDetail.product.trademark.name,
                              orderDetail.productDetail.product.warranties.name,
                            ]
                              .filter(Boolean)
                              .join(", ")}
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
                                  Nhập lý do bạn không muốn xác nhận trả hàng
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
                                  label="Nhập lý do bạn không muốn xác nhận trả hàng"
                                  variant="outlined"
                                  value={reason}
                                  onChange={(e) => setReason(e.target.value)}
                                />
                              </div>
                              <div className="modal-footer">
                                <Button
                                  onClick={() => cancelRefundS(orderDetail.id)}
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
                            <div className="col-1 me-3">
                              Số lượng: {orderDetail.quantity}
                            </div>
                            <div className="col-3">
                              Thành tiền:{" "}
                              {formatPrice(
                                orderDetail.price * orderDetail.quantity
                              ) + " VNĐ"}
                            </div>
                            <div className="col-3 d-flex justify-content-center align-items-center">
                              {orderDetail.status === null ? (
                                ""
                              ) : orderDetail.status?.includes(
                                  "Đang gửi yêu cầu trả hàng"
                                ) ? (
                                <Button
                                  variant="contained"
                                  style={{
                                    display: "inline-block",
                                    backgroundColor: "rgb(204,244,255)",
                                    color: "rgb(0,70,89)",
                                  }}
                                  disableElevation
                                  onClick={() => {
                                    Aaccept(orderDetail.id, orderDetail.status);
                                    setCancelProductDetail(orderDetail.id);
                                  }}
                                >
                                  Xác nhận trả hàng
                                </Button>
                              ) : orderDetail.status ===
                                "Đã xác nhận trả hàng" ? (
                                <div
                                  style={{
                                    padding: "5px",
                                    backgroundColor: "rgb(218, 255, 180)",
                                    color: "rgb(45, 91, 0)",
                                    borderRadius: "10px",
                                    display: "inline-block",
                                  }}
                                >
                                  Đã xác nhận trả hàng cho người mua
                                </div>
                              ) : (
                                <div
                                  style={{
                                    padding: "5px",
                                    backgroundColor: "rgb(255, 184, 184)",
                                    color: "rgb(198, 0, 0)",
                                    borderRadius: "10px",
                                    display: "inline-block",
                                    maxWidth: "100%",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  <Tooltip title={orderDetail.status} arrow>
                                    <span>
                                      {orderDetail.status.includes(",")
                                        ? "Từ chối trả hàng"
                                        : truncateText(
                                            orderDetail.status,
                                            maxWords
                                          )}
                                    </span>
                                  </Tooltip>
                                </div>
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
                            Thời gian người mua đã nhận hàng:{" "}
                            {formatDate(order.receivedate)}
                          </>
                        ) : (
                          <>Trạng thái nhận hàng của người mua: Chưa nhận </>
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
    </div>
  );
};

export default OrderDetailSeller;
