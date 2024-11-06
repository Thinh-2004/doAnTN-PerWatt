import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../Localhost/Custumize-axios";
import Header from "../../Header/Header";

import moment from 'moment';
import './SellerNotification.css'; 

function NotificationCard() {
  const [orders, setOrders] = useState([]);
  const idStore = sessionStorage.getItem("idStore");
  const navigate = useNavigate(); // Hook để điều hướng


  // Hàm load dữ liệu đơn hàng từ backend
  const loadData = async (idStore) => {
    if (!idStore) {
      console.error("Store ID is missing");
      return;
    }
    try {
      const res = await axios.get(`/checkOrder/${idStore}`);
      setOrders(res.data);
    } catch (error) {
      console.log("Error fetching new orders:", error);
    }
  };

  // Hàm định dạng ngày
  const formatDate = (dateString) => {
    const date = moment(dateString); // Sử dụng moment.js để xử lý định dạng ngày
    return date.isValid() ? date.format("HH:mm:ss DD/MM/YYYY") : "Invalid Date";
  };

  // Gọi loadData khi idStore thay đổi
  useEffect(() => {
    loadData(idStore);
  }, [idStore]);

  // Hàm xử lý khi nhấp vào đơn hàng
  const handleOrderClick = (orderId) => {
    navigate(`/profileMarket/orderSeller/${orderId}`);
  };

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-danger">Tất cả thông báo</h5>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center" id="list-group-item">
                    Đơn hàng
                    <span className="badge bg-danger rounded-pill"> {orders.length}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {orders.length > 0 && (
            <div className="col-md-9">
              <div className="d-flex justify-content-between mb-3">
                <h5>Tất cả thông báo</h5>
                <button className="btn btn-outline-secondary btn-sm">Đánh dấu đã đọc tất cả</button>
              </div>
              <hr />
              <div className="list-group">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="list-group-item d-flex" id="list-group-item"
                    onClick={() => handleOrderClick(order.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* <img src={geturlIMG(order.productId, order.filename)} className="me-3" alt="thumbnail" /> */}
                    <div className="flex-grow-1">
                      <h6 className="mb-1" id="mb-1">Đơn hàng mới</h6>
                      <p className="mb-1" id="mb-1">{order.user.fullname} đã đặt một đơn hàng {order.id}. Vui lòng không giao hàng cho đến khi Mã vận đơn được cập nhật trong chi tiết đơn hàng.</p>
                      <p className="small-text" id="small-text">{formatDate(order.createdtime)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationCard;
