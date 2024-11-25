import React, { useEffect, useState } from "react";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import axios from "../../../Localhost/Custumize-axios";
import { tailspin } from "ldrs";
import { Button, Card, CardContent, Typography } from "@mui/material";
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

  tailspin.register();

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

  const refundReturn = async (store, totalAmount, productDetailId) => {
    const resWalletShop = await axios.get(`wallet/${store.user.id}`);
    if (resWalletShop.data.balance >= totalAmount) {
      //store
      const newBalanceShop = resWalletShop.data.balance - totalAmount * 0.9;
      await axios.put(`wallet/update/${store.user.id}`, {
        balance: newBalanceShop,
      });
      //admin
      const resWalletAdmin = await axios.get(`wallet/${1}`);
      const newBalanceAdmin = resWalletAdmin.data.balance - totalAmount * 0.1;

      await axios.put(`wallet/update/${1}`, {
        balance: newBalanceAdmin,
      });
      //user
      const resWalletUser = await axios.get(`wallet/${user.id}`);
      const newBalanceUser = resWalletUser.data.balance + totalAmount;

      await axios.put(`wallet/update/${user.id}`, {
        balance: newBalanceUser,
      });

      //store
      const fillWalletStore = await axios.get(`wallet/${store.user.id}`);
      console.log(store.user.id);
      console.log(fillWalletStore);

      const transactionTypeStore =
        `Hoàn tiền về người dùng: ${user.fullname}`.substring(0, 50);
      await axios.post(`wallettransaction/create/${fillWalletStore.data.id}`, {
        amount: -totalAmount * 0.9,
        transactiontype: transactionTypeStore,
        transactiondate: new Date(),
        user: { id: user.id },
        store: { id: store.id },
      });

      //admin
      const transactionTypeAdmin =
        `Hoàn tiền về người dùng: ${user.fullname}`.substring(0, 50);
      await axios.post(`wallettransaction/create/${1}`, {
        amount: -totalAmount * 0.1,
        transactiontype: transactionTypeAdmin,
        transactiondate: new Date(),
        user: { id: user.id },
        store: { id: store.id },
      });

      //userStore
      const fillWalletUser = await axios.get(`wallet/${user.id}`);

      const transactionTypeUserStore =
        `Hoàn tiền về từ cửa hàng: ${store.namestore}`.substring(0, 50);
      await axios.post(`wallettransaction/create/${fillWalletUser.data.id}`, {
        amount: totalAmount * 0.9,
        transactiontype: transactionTypeUserStore,
        transactiondate: new Date(),
        user: { id: user.id },
        store: { id: store.id },
      });

      //userAdmin
      const transactionTypeUserAdmin = "Hoàn tiền về từ PerWatt";
      await axios.post(`wallettransaction/create/${fillWalletUser.data.id}`, {
        amount: totalAmount * 0.1,
        transactiontype: transactionTypeUserAdmin,
        transactiondate: new Date(),
        user: { id: user.id },
        store: { id: store.id },
      });

      console.log(productDetailId);

      await axios.put(`/order/${id}/status`, { status: "Trả hàng" });
      load();

      toast.success("Hoàn tiền thành công");
    } else {
      toast.warning("Tài khoản cửa hàng không đủ để hoàn tiền");
      return;
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
                <CardContent className="">
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
                      <div className="d-flex mb-3" key={index}>
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
                        <div className="col-5 mt-3 mx-2">
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
                        <div className="col-8 mx-3 mt-5">
                          <div className="d-flex">
                            <div className="col-2">
                              Giá: {formatPrice(orderDetail.price) + " VNĐ"}
                            </div>
                            <div className="col-4 d-flex justify-content-between">
                              <Typography>
                                {" "}
                                Số lượng: {orderDetail.quantity}
                              </Typography>
                              <Typography>
                                {" "}
                                Thành tiền:{" "}
                                {formatPrice(
                                  orderDetail.price * orderDetail.quantity
                                ) + " VNĐ"}
                              </Typography>
                            </div>
                            {order.orderstatus === "Hoàn thành" ? (
                              <div className="ms-5">
                                <Button
                                  variant="contained"
                                  style={{
                                    width: "auto",
                                    backgroundColor: "rgb(255, 184, 184)",
                                    color: "rgb(198, 0, 0)",
                                  }}
                                  onClick={() =>
                                    refundReturn(
                                      store,
                                      orderDetail.productDetail.price *
                                        orderDetail.quantity,
                                      orderDetail.productDetail.id
                                    )
                                  }
                                  disableElevation
                                >
                                  Trả hàng/Hoàn tiền
                                </Button>
                              </div>
                            ) : (
                              ""
                            )}
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
                        Tổng cộng:{" "}
                        {formatPrice(
                          storeProducts.reduce(
                            (sum, detail) =>
                              sum + detail.price * detail.quantity,
                            0
                          )
                        ) + " VNĐ"}
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
