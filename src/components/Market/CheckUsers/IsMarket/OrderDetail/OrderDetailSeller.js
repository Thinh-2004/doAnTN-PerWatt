import React, { useEffect, useState } from "react";
import axios from "../../../../../Localhost/Custumize-axios";
import { useParams } from "react-router-dom";
import { tailspin } from "ldrs";
import { Button, Card, CardContent, Typography } from "@mui/material";
import useSession from "../../../../../Session/useSession";

const OrderDetailSeller = () => {
  const [groupedByStore, setGroupedByStore] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [idStore] = useSession(`idStore`);
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
  useEffect(() => {
    const load = async () => {
      try {
        console.log(id);

        const res = await axios.get(`/orderDetailSeller/${id}`);

        const grouped = groupByStore(res.data);
        setGroupedByStore(grouped);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
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
            const store = storeProducts[0].productDetail.product.store;
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
                <Card
                  className="card mt-3"
                  sx={{
                    backgroundColor: "backgroundElement.children",
                    boxShadow: "none",
                  }}
                >
                  <Button
                    variant="contained"
                    style={{
                      width: "40px",
                      marginLeft: "10px",
                      height: "40px",
                      backgroundColor: "rgb(204,244,255)",
                      color: "rgb(0,70,89)",
                      minWidth: 0,
                    }}
                    disableElevation
                    href={`/profileMarket/orderSeller/${idStore}`}
                  >
                    <i class="bi bi-caret-left-fill"></i>
                  </Button>
                </Card>
                <CardContent className="">
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
                                  .name,
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
                      <div>
                        Địa chỉ nhận hàng: {order.shippinginfor.address}
                      </div>
                    </div>
                    <div className="col-6 text-end">
                      <Typography variant="span">
                        {" "}
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
    </div>
  );
};

export default OrderDetailSeller;
