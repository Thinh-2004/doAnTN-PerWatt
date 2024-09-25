import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../Localhost/Custumize-axios";
import Header from "../../UI&UX/Header/Header";
import moment from "moment";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import FontAwesome library for icons
import "./SellerNotification.css";

function NotificationCard() {
  const [inTransitOrders, setInTransitOrders] = useState([]); // State for in-transit orders
  const [canceledOrders, setCanceledOrders] = useState([]); // State for canceled orders
  const [filter, setFilter] = useState("all"); // State for filter, default to 'all'
  const idStore = sessionStorage.getItem("idStore"); // Get store ID from sessionStorage
  const navigate = useNavigate(); // Hook for page navigation

  // Load data function to fetch orders from the API
  const loadData = async (idStore) => {
    if (!idStore) {
      console.error("Store ID is missing"); // Log an error if store ID is missing
      return;
    }
    try {
      // Fetch both in-transit and canceled orders
      const [inTransitRes, canceledRes] = await Promise.all([
        axios.get(`/checkOrderReadyToShip/${idStore}`), // Fetch in-transit orders
        axios.get(`/canceledOrders/${idStore}`), // Fetch canceled orders
      ]);
      setInTransitOrders(inTransitRes.data); // Update state with in-transit orders
      setCanceledOrders(canceledRes.data); // Update state with canceled orders
    } catch (error) {
      console.log("Error fetching orders:", error); // Log error if API call fails
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = moment(dateString); // Use moment library to format date
    return date.isValid() ? date.format("HH:mm:ss DD/MM/YYYY") : "Invalid Date"; // Check if date is valid
  };

  useEffect(() => {
    loadData(idStore); // Call loadData when component mounts
  }, [idStore]); // Only re-run the effect if idStore changes

  // Handle click on order
  const handleOrderClick = (orderId) => {
    navigate(`/profileMarket/orderSeller/${orderId}`); // Navigate to order details page
  };

  // Filter notifications based on selected filter
  const filteredNotifications = () => {
    if (filter === "inTransit") return inTransitOrders; // Show only in-transit orders
    if (filter === "canceled") return canceledOrders; // Show only canceled orders
    return [...inTransitOrders, ...canceledOrders]; // Default: show all orders
  };

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <div className="row">
          {/* Sidebar with filter options */}
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <Link to={"#"} onClick={() => setFilter("all")}>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Tất cả thông báo
                      <span className="badge bg-primary rounded-pill">
                        {inTransitOrders.length + canceledOrders.length}
                      </span>
                    </li>
                  </Link>
                  <Link to={"#"} onClick={() => setFilter("inTransit")}>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Đơn hàng đang vận chuyển
                      <span className="badge bg-success rounded-pill">
                        {inTransitOrders.length}
                      </span>
                    </li>
                  </Link>
                  <Link to={"#"} onClick={() => setFilter("canceled")}>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Đơn hàng đã hủy
                      <span className="badge bg-warning rounded-pill">
                        {canceledOrders.length}
                      </span>
                    </li>
                  </Link>
                </ul>
              </div>
            </div>
          </div>

          {/* Notifications list */}
          <div className="col-md-9">
            <div className="d-flex justify-content-between mb-3">
              <h5>Tất cả thông báo</h5>
              <button className="btn btn-outline-secondary btn-sm">
                Đánh dấu đã đọc tất cả
              </button>
            </div>
            <hr />
            <div className="list-group">
              {/* Check if there are no notifications */}
              {filteredNotifications().length === 0 ? (
                <div className="text-center my-5">
                  {/* Add icon and message when there are no orders */}
                  <i className="fa-regular fa-file-excel fa-3x mb-3"></i>
                  <h6>Không có đơn hàng nào.</h6>
                </div>
              ) : (
                filteredNotifications().map((order) => (
                  <div
                    key={order.id}
                    className="list-group-item d-flex"
                    onClick={() => handleOrderClick(order.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={
                        order.productImage || "https://via.placeholder.com/50"
                      }
                      className="me-4"
                      alt="thumbnail"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-1">
                        {inTransitOrders.includes(order)
                          ? "Đơn hàng đang vận chuyển"
                          : "Đơn hàng đã hủy"}
                      </h6>
                      <p className="mb-1">
                        {inTransitOrders.includes(order)
                          ? `Đơn hàng ${order.id} đang vận chuyển.`
                          : `Đơn hàng ${order.id} đã bị hủy.`}
                      </p>
                      <p className="small-text">
                        {formatDate(
                          order.updatedtime || order.canceledtime
                        )}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationCard;
