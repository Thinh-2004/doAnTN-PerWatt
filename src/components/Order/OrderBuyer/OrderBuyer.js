import React, { useEffect, useState } from "react";
import "./OrderStyle.css";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import axios from "../../../Localhost/Custumize-axios";
import useSession from "../../../Session/useSession";
import { format } from "date-fns";
import { confirmAlert } from "react-confirm-alert";
import { tailspin } from "ldrs";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";

const CustomTabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const Order = () => {
  const [fill, setFill] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const [value, setValue] = useState(0);
  tailspin.register();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`orderFill/${user.id}`);
        const sortedData = res.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setFill(sortedData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user.id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "HH:mm:ss dd/MM/yyyy");
  };

  const handleCancelOrder = (orderId) => {
    confirmAlert({
      title: "Hủy đơn hàng",
      message: "Bạn có muốn hủy đơn không?",
      buttons: [
        {
          label: "Có",
          onClick: async () => {
            try {
              await axios.put(`/order/${orderId}/status`, { status: "Hủy" });
              setFill((prevFill) =>
                prevFill.map((order) =>
                  order.id === orderId
                    ? { ...order, orderstatus: "Hủy" }
                    : order
                )
              );
            } catch (error) {
              console.log(error);
            }
          },
        },
        { label: "Không" },
      ],
    });
  };

  const handleMarkAsReceived = async (orderId) => {
    try {
      await axios.put(`/order/${orderId}/status`, { status: "Hoàn thành" });
      setFill((prevFill) =>
        prevFill.map((order) =>
          order.id === orderId ? { ...order, orderstatus: "Hoàn thành" } : order
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const renderOrders = (filterFn) => {
    const filteredOrders = fill.filter(filterFn);
    if (loading) {
      return (
        <div className="text-center">
          <l-tailspin
            size="40"
            stroke="5"
            speed="0.9"
            color="black"
          ></l-tailspin>
        </div>
      );
    }
    if (filteredOrders.length === 0) {
      return <div className="text-center">Chưa có sản phẩm</div>;
    }
    return filteredOrders.map((order) => (
      <div className="card rounded-3 mt-3" id="cartItem" key={order.id}>
        <div className="card-body">
          <div className="d-flex">
            <div className="col-3">{order.orderstatus}</div>
            <div className="col-3">{formatDate(order.paymentdate)}</div>
            <div className="col-3">{order.paymentmethod.type}</div>
            <div className="col-2">
              <Button
                variant="contained"
                href={`/orderDetail/${order.id}`}
                style={{
                  height: "40px",
                  width: "40px",
                  backgroundColor: "rgb(204,244,255)",
                  color: "rgb(0,70,89)",
                  minWidth: 0,
                }}
                disableElevation
              >
                <i className="bi bi-eye-fill fs-5"></i>
              </Button>
            </div>
            <div className="col-2">
              {order.orderstatus === "Chờ giao hàng" && (
                <button
                  className="btn btn-success me-2"
                  onClick={() => handleMarkAsReceived(order.id)}
                  disableElevation
                >
                  Đã nhận hàng
                </button>
              )}
              {order.orderstatus !== "Hủy" && (
                <Button
                  onClick={() => handleCancelOrder(order.id)}
                  style={{
                    height: "40px",
                    width: "40px",
                    backgroundColor: "rgb(255, 184, 184)",
                    color: "rgb(198, 0, 0)",
                    minWidth: 0,
                  }}
                  disableElevation
                >
                  <i className="bi bi-cart-x-fill"></i>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    ));
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Header />
      <h1 className="text-center mt-4 mb-4">Đơn hàng của bạn</h1>
      <div className="container" style={{ transition: "0.5s" }}>
        <Box sx={{ width: "100%", background: "white" }} className="rounded-3">
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              borderRadius: "10px",
              overflow: "hidden",
            }}
            className="rounded-3"
          >
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              sx={{ backgroundColor: "white" }} // Thêm backgroundColor cho Tabs
            >
              {[
                "Tất cả",
                "Đang chờ duyệt",
                "Chờ giao hàng",
                "Hoàn thành",
                "Hủy",
              ].map((tab, index) => (
                <Tab label={tab} key={index} />
              ))}
            </Tabs>
          </Box>
          {[
            "Tất cả",
            "Đang chờ duyệt",
            "Chờ giao hàng",
            "Hoàn thành",
            "Hủy",
          ].map((tab, index) => (
            <CustomTabPanel value={value} index={index} key={index}>
              <div className="card rounded-3 sticky-top" id="cartTitle">
                <div className="card-body">
                  <div className="d-flex">
                    <div className="col-3">Trạng thái</div>
                    <div className="col-3">Ngày đặt hàng</div>
                    <div className="col-3">Phương thức thanh toán</div>
                    <div className="col-2">Chi tiết</div>
                    <div className="col-2">Hành động</div>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                {renderOrders((order) => {
                  switch (tab) {
                    case "Tất cả":
                      return true;
                    case "Đang chờ duyệt":
                      return order.orderstatus === "Đang chờ duyệt";
                    case "Chờ giao hàng":
                      return order.orderstatus === "Chờ giao hàng";
                    case "Hoàn thành":
                      return order.orderstatus === "Hoàn thành";
                    case "Hủy":
                      return order.orderstatus === "Hủy";
                    default:
                      return false;
                  }
                })}
              </div>
            </CustomTabPanel>
          ))}
        </Box>
      </div>
      <Footer />
    </div>
  );
};

export default Order;
