import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "../../../../../Localhost/Custumize-axios";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./CardUs.css";

const CardUs = (props) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [percentage, setPercentage] = useState(0);

  // Lấy idUser từ sessionStorage
  const idUser = sessionStorage.getItem("id");

  // Tìm kiếm idStore từ idUser và lưu vào sessionStorage
  const findStoreByIdUser = async (idUser) => {
    try {
      const res = await axios.get(`searchStore/${idUser}`);
      sessionStorage.setItem("idStore", res.data.id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (idUser) {
      findStoreByIdUser(idUser);
    }
  }, [idUser]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idStore = sessionStorage.getItem("idStore");
        if (idStore && props.title) {
          const response = await axios.get(
            `http://localhost:8080/order-us/count-orders/${idStore}?status=${props.title}`
          );
          const apiData = response.data;

          if (Array.isArray(apiData)) {
            setData(apiData);
            const totalOrders = apiData.reduce(
              (acc, item) => acc + (item.count || 0),
              0
            );
            setTotal(totalOrders);
          } else if (typeof apiData === "object" && apiData !== null) {
            setData([apiData]);
            const totalOrders = apiData.count || 0;
            setTotal(totalOrders);
          } else {
            console.error(
              "Dữ liệu trả về không phải là mảng hoặc đối tượng hợp lệ:",
              apiData
            );
            setData([]);
            setTotal(0);
          }
        } else {
          // Đặt total thành 0 nếu không có idStore hoặc props.title
          setData([]);
          setTotal(0);
        }
      } catch (error) {
        console.error(`Có lỗi xảy ra khi lấy dữ liệu ${props.title}:`, error);
        // Đặt total thành 0 nếu có lỗi xảy ra
        setData([]);
        setTotal(0);
      }
    };

    fetchData();
  }, [props.title]);

  // Tính phần trăm dựa trên dữ liệu của thẻ
  useEffect(() => {
    if (total > 0) {
      const totalCount = data.reduce((acc, item) => acc + (item.count || 0), 0);
      setPercentage((total / totalCount) * 100);
    } else {
      // Đặt phần trăm thành 0 nếu total là 0
      setPercentage(0);
    }
  }, [data, total]);

  return (
    <motion.div
      className="CompactCard"
      style={{
        background: props.color.backGround,
        boxShadow: props.color.boxShadow,
      }}
      layoutId="compactCard"
    >
      <div className="radialBar">
        <div className="circularProgress">
          <CircularProgressbar
            value={percentage}
            text={`${Math.round(percentage)}%`}
            styles={{
              path: {
                stroke: `rgba(62, 152, 199, ${percentage / 100})`,
              },
              text: {
                fill: '#fff',
                fontSize: '16px',
              },
            }}
          />
        </div>
        <span>{props.title}</span>
      </div>
      <div className="detail">
        <div className="icon">
          <props.png />
        </div>
        <div className="text">
          {total > 0 ? (
            <span>Số lượng: {total.toLocaleString()}</span>
          ) : (
            <span>Số lượng: 0</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CardUs;
