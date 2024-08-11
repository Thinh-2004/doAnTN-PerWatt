import React, { useState, useEffect } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { UilTimes } from "@iconscout/react-unicons";
import Chart from "react-apexcharts";
import axios from "axios";
import "./CardAd.css";

// Hàm formatNumber để định dạng số
const formatNumber = (value) => {
  if (value === null || value === undefined) return '';
  return `${value.toLocaleString()} đ`;
};

const CardAd = (props) => {
  const [expanded, setExpanded] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalStores, setTotalStores] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [revenueData, setRevenueData] = useState([]);
  const [storesByYearData, setStoresByYearData] = useState([]);
  const [usersByYearData, setUsersByYearData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (props.title === "Doanh thu") {
          const revenueResponse = await axios.get("http://localhost:8080/revenue/total-revenue-by-store");
          const revenueData = revenueResponse.data;
          console.log("Dữ liệu doanh thu:", revenueData); // Kiểm tra dữ liệu nhận được
          setRevenueData(revenueData);
          const totalRevenue = revenueData.reduce((acc, item) => acc + item.totalRevenue, 0);
          setTotalRevenue(totalRevenue);
          setTotalStores(revenueData.length);

          const storesResponse = await axios.get("http://localhost:8080/revenue/stores-by-year");
          const storesData = storesResponse.data;
          console.log("Dữ liệu số lượng cửa hàng:", storesData); // Kiểm tra dữ liệu nhận được
          setStoresByYearData(storesData);
        } else if (props.title === "Cửa hàng") {
          const storesResponse = await axios.get("http://localhost:8080/revenue/stores-by-year");
          const storesData = storesResponse.data;
          console.log("Dữ liệu số lượng cửa hàng:", storesData); // Kiểm tra dữ liệu nhận được
          setStoresByYearData(storesData);
          const totalStores = storesData.reduce((acc, item) => acc + item.TotalStores, 0);
          setTotalStores(totalStores);
        } else if (props.title === "Người dùng") {
          const usersResponse = await axios.get("http://localhost:8080/user-ads/total-users");
          const usersData = usersResponse.data;
          console.log("Dữ liệu người dùng:", usersData); // Kiểm tra dữ liệu nhận được
          setUsersByYearData(usersData);
          const totalUsers = usersData.reduce((acc, item) => acc + item.TotalUsers, 0);
          setTotalUsers(totalUsers);
        }
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, [props.title]);

  return (
    <LayoutGroup>
      {expanded && props.title !== "Người dùng" ? (
        <ExpandedCard
          param={props}
          setExpanded={() => setExpanded(false)}
          revenueData={revenueData}
          storesByYearData={storesByYearData}
          usersByYearData={usersByYearData}
          totalRevenue={totalRevenue}
          totalStores={totalStores}
          totalUsers={totalUsers}
        />
      ) : (
        <CompactCard
          param={{ 
            ...props, 
            value: props.title === "Cửa hàng" 
              ? "Cửa hàng đã được tạo" 
              : (props.title === "Người dùng" 
                ? "Đã đăng ký" 
                : formatNumber(totalRevenue)), 
            stores: props.title === "Người dùng" ? totalUsers : totalStores
          }}
          setExpanded={() => {
            if (props.title !== "Người dùng") {
              setExpanded(true);
            }
          }}
        />
      )}
    </LayoutGroup>
  );
};

function CompactCard({ param, setExpanded }) {
  const Png = param.png;
  const commission = (param.title === "Doanh thu" 
    ? (parseFloat(param.value.replace(/,/g, '')) * 0.05).toLocaleString() 
    : "0"); // Tính 5% hoa hồng

  return (
    <motion.div
      className="CompactCard"
      style={{
        background: param.color.backGround,
        boxShadow: param.color.boxShadow,
      }}
      onClick={setExpanded}
      layoutId="compactCard"
    >
      <div className="radialBar">
        <CircularProgressbar
          value={param.barValue}
          text={`${param.barValue}%`}
        />
        <span>{param.title}</span>
      </div>
      <div className="detail">
        <Png />
        {param.title === "Doanh thu" && (
          <span>{commission},000 ₫</span>
        )}
        {param.stores !== undefined && (
          <span>
            {param.title === "Người dùng"
              ? `Tổng số: ${param.stores.toLocaleString()}`
              : `Tổng số: ${param.stores.toLocaleString()}`}
          </span>
        )}
      </div>
    </motion.div>
  );
}

function ExpandedCard({ param, setExpanded, revenueData, storesByYearData, usersByYearData, totalRevenue, totalStores, totalUsers }) {
  const revenueOptions = {
    chart: {
      type: "bar",
      height: "auto",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: revenueData.map(item => item.storeName),
    },
    fill: {
      colors: ["#FF6347"],
    },
    tooltip: {
      y: {
        formatter: (val) => formatNumber(val),
      },
    },
  };

  const storesOptions = {
    chart: {
      type: "bar",
      height: "auto",
    },
    xaxis: {
      categories: storesByYearData.map(item => item.Year),
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      colors: ["#32CD32"],
    },
    tooltip: {
      y: {
        formatter: (val) => `${val.toLocaleString()} Cửa hàng`,
      },
    },
  };

  const userOptions = {
    chart: {
      type: "bar",
      height: "auto",
    },
    xaxis: {
      categories: ["Tổng số người dùng"], // Hiển thị một mục duy nhất vì dữ liệu chỉ có một giá trị tổng
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      colors: ["#00bfff"],
    },
    tooltip: {
      y: {
        formatter: (val) => `${val.toLocaleString()} Người dùng`,
      },
    },
  };

  const commission = (totalRevenue * 0.05).toLocaleString(); // Tính 5% hoa hồng

  return (
    <motion.div
      className="ExpandedCard"
      style={{
        background: param.color.backGround,
        boxShadow: param.color.boxShadow,
      }}
      layoutId="expandableCard"
    >
      <div style={{ alignSelf: "flex-end", cursor: "pointer", color: "white" }}>
        <UilTimes onClick={setExpanded} />
      </div>
      <span>{param.title}</span>
      <div className="chartContainer">
        {param.title === "Doanh thu" && (
          <Chart
            series={[
              {
                name: "Tổng doanh thu",
                data: revenueData.map(item => item.totalRevenue),
              },
            ]}
            type="bar"
            options={revenueOptions}
          />
        )}
        {param.title === "Cửa hàng" && (
          <Chart
            series={[
              {
                name: "Tổng số cửa hàng",
                data: storesByYearData.map(item => item.TotalStores),
              },
            ]}
            type="bar"
            options={storesOptions}
          />
        )}
        {param.title === "Người dùng" && (
          <Chart
            series={[
              {
                name: "Tổng số người dùng",
                data: [totalUsers], // Sử dụng tổng số người dùng
              },
            ]}
            type="bar"
            options={userOptions}
          />
        )}
      </div>
      <div className="summary">
        {param.title === "Doanh thu" && (
          <span>5% Hoa hồng thu về: {formatNumber(commission)}</span>
        )}
        <span>{param.title === "Cửa hàng" ? `Tổng số cửa hàng: ${(totalStores)}` : ""}</span>
        <span>{param.title === "Người dùng" ? `Tổng số người dùng: ${formatNumber(totalUsers)}` : ""}</span>
      </div>
    </motion.div>
  );
}

export default CardAd;
