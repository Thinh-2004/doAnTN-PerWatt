import React, { useEffect, useState } from "react";
import Header from "../../UI&UX/Header/Header";
import Footer from "../../UI&UX/Footer/Footer";
import axios from "../../../Localhost/Custumize-axios";
import { useParams } from "react-router-dom";

const OrderDetail = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [groupedByStore, setGroupedByStore] = useState({});
  const { id } = useParams();

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
      const storeId = detail.product.store.id;
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
            <a className="btn btn-primary" href="/order">
              Quay lại
            </a>
          </div>
        </div>

        {Object.keys(groupedByStore).map((storeId) => {
          const storeProducts = groupedByStore[storeId];
          const store = storeProducts[0].product.store;
          const order = storeProducts[0].order;

          return (
            <div className="card mt-3" key={storeId}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <img
                      src={getAvtUser(store.user.id, store.user.avatar)}
                      id="imgShop"
                      className="mx-2"
                      alt="Shop Logo"
                      style={{ height: "80%" }}
                    />
                    <h5 id="nameShop" className="mt-1">
                      {store.namestore}
                    </h5>
                  </div>
                  <div className="mt-1">Mã đơn hàng: {order.id}</div>
                </div>
                <hr />
                {storeProducts.map((orderDetail, index) => {
                  const firstIMG = orderDetail.product.images?.[0];
                  return (
                    <div className="d-flex" key={index}>
                      <div className="col-1">
                        {firstIMG ? (
                          <img
                            src={geturlIMG(
                              orderDetail.product.id,
                              firstIMG.imagename
                            )}
                            id="img"
                            alt="Product"
                            style={{ width: "100px", height: "100px" }}
                          />
                        ) : (
                          <div>Không có ảnh</div>
                        )}
                      </div>

                      <div className="col-5 mt-3 mx-2">
                        <div id="fontSizeTitle">{orderDetail.product.name}</div>
                        <div id="fontSize">
                          {`${orderDetail.product.productcategory.name}, ${orderDetail.product.trademark.name}, ${orderDetail.product.warranties.name}`}
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
                            Thành tiền:
                            {formatPrice(
                              orderDetail.product.price * orderDetail.quantity
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
                    <div>Địa chỉ giao hàng: {order.shippinginfor.address}</div>
                  </div>
                  <div className="col-6 text-end">
                    <div className="card mt-3">
                      <div className="card-body">
                        Tổng cộng:
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
