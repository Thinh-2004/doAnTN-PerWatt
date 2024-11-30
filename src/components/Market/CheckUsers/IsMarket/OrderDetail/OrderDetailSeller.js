import React, { useEffect, useState } from "react";
import axios from "../../../../../Localhost/Custumize-axios";
import { useParams } from "react-router-dom";
import { tailspin } from "ldrs";
import {
  Button,
  Card,
  CardContent,
  TextField,
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
      const res = await axios.get(`/orderDetailSeller/${id}`);

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
    return format(date, "HH:mm:ss dd/MM/yyyy");
  };

  const Aaccept = (
    storeId,
    userId,
    totalAmount,
    productDetailId,
    namestore,
    orderDetailId,
    status
  ) => {
    const statusMessage = status.split(",")[1]
      ? status.split(",")[1].trim()
      : status;

    confirmAlert({
      title: "Xác nhận hoàn tiền",
      message: "Với " + statusMessage,
      buttons: [
        {
          label: "Có",
          onClick: () =>
            refundReturn(
              storeId,
              userId,
              totalAmount,
              productDetailId,
              namestore,
              orderDetailId
            ),
        },
        {
          label: "Không",
          onClick: () => cancelRefund(),
        },
      ],
    });
  };

  const refundReturn = async (
    storeId,
    userId,
    totalAmount,
    productDetailId,
    namestore,
    orderDetailId
  ) => {
    try {
      // Lấy thông tin ví của shop
      const resWalletShop = await axios.get(`wallet/${userId}`);
      // Lấy thông tin ví của admin
      const resWalletAdmin = await axios.get(`wallet/${1}`);

      // Kiểm tra nếu số dư của shop và admin đủ để hoàn tiền
      if (resWalletShop.data.balance < totalAmount * 0.9) {
        toast.warning("Tài khoản cửa hàng không đủ để hoàn tiền");
        return;
      }

      if (resWalletAdmin.data.balance < totalAmount * 0.1) {
        toast.warning("Tài khoản quản trị không đủ để hoàn tiền");
        return;
      }

      // Nếu đủ, tiếp tục các giao dịch
      // Cập nhật số dư của cửa hàng (shop)
      const newBalanceShop = resWalletShop.data.balance - totalAmount * 0.9;
      await axios.put(`wallet/update/${userId}`, {
        balance: newBalanceShop,
      });

      // Cập nhật số dư của admin
      const newBalanceAdmin = resWalletAdmin.data.balance - totalAmount * 0.1;
      await axios.put(`wallet/update/${1}`, {
        balance: newBalanceAdmin,
      });

      // Cập nhật số dư của người dùng (user)
      const resWalletUser = await axios.get(`wallet/${user.id}`);
      const newBalanceUser = resWalletUser.data.balance + totalAmount;
      await axios.put(`wallet/update/${user.id}`, {
        balance: newBalanceUser,
      });

      //đã fix
      // Ghi lại giao dịch cho shop
      const fillWalletStore = await axios.get(`wallet/${user.id}`);
      const transactionTypeStore =
        `Hoàn tiền về người dùng: ${user.fullname}`.substring(0, 50);
      await axios.post(`wallettransaction/create/${fillWalletStore.data.id}`, {
        amount: -totalAmount * 0.9,
        transactiontype: transactionTypeStore,
        transactiondate: new Date(),
        user: { id: user.id },
        store: { id: storeId },
      });

      // Ghi lại giao dịch cho admin
      const transactionTypeAdmin =
        `Hoàn tiền về người dùng: ${user.fullname}`.substring(0, 50);
      await axios.post(`wallettransaction/create/${1}`, {
        amount: -totalAmount * 0.1,
        transactiontype: transactionTypeAdmin,
        transactiondate: new Date(),
        user: { id: user.id },
        store: { id: storeId },
      });

      // Ghi lại giao dịch cho người dùng (user)
      const fillWalletUser = await axios.get(`wallet/${userId}`);
      const transactionTypeUserStore =
        `Hoàn tiền về từ cửa hàng: ${namestore}`.substring(0, 50);
      await axios.post(`wallettransaction/create/${fillWalletUser.data.id}`, {
        amount: totalAmount * 0.9,
        transactiontype: transactionTypeUserStore,
        transactiondate: new Date(),
        user: { id: user.id },
        store: { id: storeId },
      });

      // Ghi lại giao dịch cho userAdmin
      const transactionTypeUserAdmin = "Hoàn tiền về từ PerWatt";
      await axios.post(`wallettransaction/create/${fillWalletUser.data.id}`, {
        amount: totalAmount * 0.1,
        transactiontype: transactionTypeUserAdmin,
        transactiondate: new Date(),
        user: { id: user.id },
        store: { id: storeId },
      });

      // Cập nhật trạng thái của orderDetail
      await axios.post(`/orderDetail/update/${orderDetailId}`, {
        status: "Đã xác nhận hoàn tiền",
      });

      load(); // Load lại dữ liệu

      toast.success("Hoàn tiền thành công");
    } catch (error) {
      toast.error("Đã có lỗi xảy ra trong quá trình hoàn tiền");
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
      status: "Từ chối hoàn tiền với lý do " + reason,
    });

    toast.success("Từ chối hoàn tiền thành công!");
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
                        src={getAvtUser(
                          order.user.id,
                          order.user.avatar,
                          order.id
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
                                  Nhập lý do bạn không muốn xác nhận hoàn tiền
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
                                  label="Nhập lý do bạn không muốn xác nhận hoàn tiền"
                                  variant="outlined"
                                  value={reason}
                                  onChange={(e) => setReason(e.target.value)} // Cập nhật lý do vào inputReason
                                />
                              </div>
                              <div className="modal-footer">
                                <Button
                                  onClick={() => cancelRefundS(orderDetail.id)} // Xác nhận hủy đơn hàng
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
                              {orderDetail.status === "" ? (
                                ""
                              ) : orderDetail.status.includes(
                                  "Đang gửi yêu cầu hoàn tiền"
                                ) ? (
                                <Button
                                  variant="contained"
                                  style={{
                                    display: "inline-block",
                                    backgroundColor: "rgb(255, 184, 184)",
                                    color: "rgb(198, 0, 0)",
                                  }}
                                  disableElevation
                                  onClick={() => {
                                    Aaccept(
                                      orderDetail.order.store.id,
                                      orderDetail.order.user.id,
                                      orderDetail.price * orderDetail.quantity,
                                      orderDetail.productDetail.id,
                                      orderDetail.order.store.namestore,
                                      orderDetail.id,
                                      orderDetail.status
                                    );
                                    setCancelProductDetail(orderDetail.id);
                                  }}
                                >
                                  Xác nhận hoàn tiền
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
                                  Đã hoàn tiền cho người mua
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
                        Tổng cộng: {formatPrice(order.totalAmount) + " VNĐ"}
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
