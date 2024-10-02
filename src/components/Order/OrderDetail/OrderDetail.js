import React, { useEffect, useState } from "react";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import axios from "../../../Localhost/Custumize-axios";
import { useParams } from "react-router-dom";
import { tailspin } from "ldrs";
import { Button } from "@mui/material";

const OrderDetail = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [groupedByStore, setGroupedByStore] = useState({});
  const [isCardLoaded, setIsCardLoaded] = useState(false);
  const { id } = useParams();
  tailspin.register();

  const geturlIMG = (productId, filename) => {
    return `${axios.defaults.baseURL}files/product-images/${productId}/${filename}`;
  };
  const getAvtUser = (idUser, filename) => {
    return `${axios.defaults.baseURL}files/user/${idUser}/${filename}`;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`/orderDetail/${id}`);
        setOrderDetails(res.data);
        const grouped = groupByStore(res.data);
        setGroupedByStore(grouped);
      } catch (error) {
        console.error(error);
      }
    };
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

  return (
    <div>
      <Header />
      <div className="container">
        <div className="card mt-3">
          <div className="card-body">
            <Button variant="contained" href="/order">
              <i class="bi bi-caret-left-fill"></i>
            </Button>
          </div>
        </div>

        {Object.keys(groupedByStore).map((storeId) => {
          const storeProducts = groupedByStore[storeId];
          const store = storeProducts[0].productDetail.product.store;
          const order = storeProducts[0].order;
          return (
            <div
              className="card mt-3"
              key={storeId}
              style={{ position: "relative", minHeight: "200px" }}
            >
              {!isCardLoaded && (
                <l-tailspin
                  className="d-flex justify-content-center align-items-center"
                  size="40"
                  stroke="5"
                  speed="0.9"
                  color="black"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 10,
                  }}
                ></l-tailspin>
              )}
              <div
                className="card-body"
                style={{ display: isCardLoaded ? "block" : "none" }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <img
                      src={getAvtUser(store.user.id, store.user.avatar)}
                      id="imgShop"
                      className="mx-2"
                      alt=""
                      style={{ height: "80%" }}
                      onLoad={() => setIsCardLoaded(true)}
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
                          src={geturlIMG(
                            orderDetail.productDetail.product.id,
                            firstIMG.imagename
                          )}
                          id="img"
                          alt=""
                          style={{
                            width: "100px",
                            height: "100px",
                          }}
                          onLoad={() => {
                            setIsCardLoaded(true);
                          }}
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
                              orderDetail.productDetail.product.productcategory
                                .name,
                              orderDetail.productDetail.product.trademark.name,
                              orderDetail.productDetail.product.warranties.name,
                            ]
                              .filter(Boolean) // Lọc bỏ các giá trị null hoặc rỗng
                              .join(", ") // Nối các chuỗi lại với nhau bằng dấu phẩy và khoảng trắng
                          }
                        </div>
                      </div>
                      <div className="col-8 mx-3 mt-5">
                        <div className="d-flex">
                          <div className="col-3">
                            Giá: {formatPrice(orderDetail.price) + " VNĐ"}
                          </div>
                          <div className="col-2">
                            Số lượng: {orderDetail.quantity}
                          </div>
                          <div className="col-4">
                            Thành tiền:{" "}
                            {formatPrice(
                              orderDetail.price * orderDetail.quantity
                            ) + " VNĐ"}
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
                    <div>Địa chỉ nhận hàng: {order.shippinginfor.address}</div>
                  </div>
                  <div className="col-6 text-end">
                    <div className="card mt-3">
                      <div className="card-body">
                        Tổng cộng:{" "}
                        {formatPrice(
                          storeProducts.reduce(
                            (sum, detail) =>
                              sum + detail.price * detail.quantity,
                            0
                          )
                        ) + " VNĐ"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Footer />
    </div>
  );
};

export default OrderDetail;
