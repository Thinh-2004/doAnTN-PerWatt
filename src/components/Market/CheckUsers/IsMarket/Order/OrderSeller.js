import React, { useEffect, useState } from "react";
import "./OrderStyle.css";
import axios from "../../../../../Localhost/Custumize-axios";
import { format } from "date-fns";
import useSession from "../../../../../Session/useSession";

const OrderSeller = () => {
  const [fill, setFill] = useState([]);
  const [idStore] = useSession(`idStore`);
  const [idOrder, setIdOrder] = useState("");
  const [orderDetails, setOrderDetails] = useState([]);
  const [statusOptions] = useState([
    "Đang chờ duyệt",
    "Chờ giao hàng",
    "Hoàn thành",
    "Hủy",
  ]);
  const [activeTab, setActiveTab] = useState("Tất cả");

  const geturlIMG = (productId, filename) => {
    return `${axios.defaults.baseURL}files/product-images/${productId}/${filename}`;
  };

  const handleOrderDetail = async (orderId) => {
    setIdOrder(orderId);
    try {
      const res2 = await axios.get(`orderDetailSeller/${orderId}`);
      setOrderDetails(res2.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/order/${orderId}/status`, { status: newStatus });
      setFill((prevFill) =>
        prevFill.map((order) =>
          order.id === orderId ? { ...order, orderstatus: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`orderSeller/${idStore}`);
        setFill(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (idStore) {
      load();
    }
  }, [idStore]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "HH:mm:ss dd/MM/yyyy");
  };

  const formatPrice = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString("vi-VN");
  };

  return (
    <div>
    <h1 className="text-center mt-4 mb-4">Quản lý đơn hàng của Shop</h1>
      <div className="container">
        <div className="card mt-3">
          <div className="card-body">
            <ul
              className="nav nav-pills mb-3 sticky-top"
              id="pills-tab"
              role="tablist"
            >
              {[
                "Tất cả",
                "Đang chờ duyệt",
                "Chờ giao hàng",
                "Hoàn thành",
                "Hủy",
              ].map((status, index) => (
                <li className="nav-item" role="presentation" key={index}>
                  <button
                    className={`nav-link ${
                      activeTab === status ? "active" : ""
                    }`}
                    id={`pills-${status}-tab`}
                    data-bs-toggle="pill"
                    data-bs-target={`#pills-${status}`}
                    type="button"
                    role="tab"
                    aria-controls={`pills-${status}`}
                    aria-selected={activeTab === status}
                    onClick={() => setActiveTab(status)}
                  >
                    {status}
                  </button>
                </li>
              ))}
            </ul>
            <div className="tab-content" id="pills-tabContent">
              {[
                "Tất cả",
                "Đang chờ duyệt",
                "Chờ giao hàng",
                "Hoàn thành",
                "Hủy",
              ].map((tab, index) => (
                <div
                  key={index}
                  className={`tab-pane fade ${
                    activeTab === tab ? "show active" : ""
                  }`}
                  id={`pills-${tab}`}
                  role="tabpanel"
                  aria-labelledby={`pills-${tab}-tab`}
                  tabIndex="0"
                >
                  <div className="card rounded-3 sticky-top" id="cartTitle">
                    <div className="card-body">
                      <div className="d-flex">
                        <div className="col-4">Trạng thái</div>
                        <div className="col-4">Ngày đặt hàng</div>
                        <div className="col-4">Phương thức thanh toán</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5">
                    {fill.length === 0 ? (
                      <div className="text-center">
                        <h4>Chưa có đơn hàng nào</h4>
                      </div>
                    ) : (
                      fill
                        .filter((order) => {
                          if (tab === "Tất cả") return true;
                          return order.orderstatus === tab;
                        })
                        .map((order) => (
                          <div
                            key={order.id}
                            className="card rounded-3 mt-3"
                            id="cartItem"
                          >
                            <div className="card-body">
                              <div className="d-flex">
                                <div className="col-2">
                                  <select
                                    className="form-select rounded-5"
                                    value={order.orderstatus}
                                    onChange={(e) =>
                                      updateOrderStatus(
                                        order.id,
                                        e.target.value
                                      )
                                    }
                                  >
                                    {statusOptions.map((statusOption) => (
                                      <option
                                        key={statusOption}
                                        value={statusOption}
                                        disabled={
                                          (order.orderstatus === "Hoàn thành" &&
                                            statusOption !== "Hoàn thành") ||
                                          (order.orderstatus ===
                                            "Đang chờ duyệt" &&
                                            (statusOption === "Hoàn thành" ||
                                              statusOption ===
                                                "Đang chờ duyệt")) ||
                                          (order.orderstatus ===
                                            "Chờ giao hàng" &&
                                            (statusOption ===
                                              "Đang chờ duyệt" ||
                                              statusOption === "Hoàn thành" ||
                                              statusOption ===
                                                "Chờ giao hàng")) ||
                                          (order.orderstatus === "Hủy" &&
                                            statusOption !== "Hủy")
                                        }
                                      >
                                        {statusOption}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div className="offset-2 col-4">
                                  {formatDate(order.paymentdate)}
                                </div>
                                <div className="col-2">
                                  {order.paymentmethod.type}
                                </div>
                                <div className="ms-auto">
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModal"
                                    onClick={() => handleOrderDetail(order.id)}
                                  >
                                    Xem chi tiết
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-custom ">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Chi tiết đơn hàng
              </h1>
              {orderDetails.length > 0 && (
                <span className="ms-3 mt-1">
                  Mã đơn hàng: {orderDetails[0].order.id}
                </span>
              )}
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {orderDetails.length === 0 ? (
                <p>Đang tải dữ liệu...</p>
              ) : (
                orderDetails.map((orderDe) => (
                  <div key={orderDe.product.id} className="d-flex">
                    <div className="col-1">
                      {orderDe.product.images.length > 0 ? (
                        <img
                          src={geturlIMG(
                            orderDe.product.id,
                            orderDe.product.images[0].imagename
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
                      <div id="fontSizeTitle">{orderDe.product.name}</div>
                      <div id="fontSize">
                        {`${orderDe.product.productcategory.name}, ${orderDe.product.trademark.name}, ${orderDe.product.warranties.name}`}
                      </div>
                    </div>
                    <div className="col-8 mx-3 mt-5">
                      <div className="d-flex">
                        <div className="col-3">
                          Giá: {formatPrice(orderDe.price)} VNĐ
                        </div>
                        <div className="col-2">
                          Số lượng: {orderDe.quantity}
                        </div>
                        <div className="col-4">
                          Thành tiền:{" "}
                          {formatPrice(orderDe.price * orderDe.quantity)} VNĐ
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <div className="text-start" style={{ marginLeft: "20px" }}>
                {orderDetails.length > 0 && (
                  <>
                  <div>Họ tên khách hàng: {orderDetails[0].order.user.fullname}</div>
                    <div>Số điện thoại: {orderDetails[0].order.user.phone}</div>
                    <div>
                      Địa chỉ giao hàng:{" "}
                      {orderDetails[0].order.shippinginfor.address}
                    </div>
                  </>
                )}
              </div>
              <div className="text-end mx-3">
                <div className="card">
                  <div className="card-body">
                    Tổng cộng:
                    {formatPrice(
                      orderDetails.reduce(
                        (sum, detail) => sum + detail.price * detail.quantity,
                        0
                      )
                    ) + " VNĐ"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSeller;
