import React, { useState, useEffect } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { UilTimes } from "@iconscout/react-unicons";
import Chart from "react-apexcharts";
import axios from "axios";
import "./CardAd.css";

const CardAd = (props) => {
  const [expanded, setExpanded] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalStores, setTotalStores] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [revenueData, setRevenueData] = useState([]);
  const [storesByYearData, setStoresByYearData] = useState([]);
  const [orderDetailsData, setOrderDetailsData] = useState([]);
  const [usersByYearData, setUsersByYearData] = useState([]);

  useEffect(() => {
    if (props.title === "Revenue") {
      axios.get("http://localhost:8080/revenue/total-revenue-by-store")
        .then(response => {
          const data = response.data;
          setRevenueData(data);
          const totalRevenue = data.reduce((acc, item) => acc + item.totalRevenue, 0);
          setTotalRevenue(totalRevenue);
          setTotalStores(data.length); // Tổng số cửa hàng có doanh thu
        })
        .catch(error => {
          console.error("Có lỗi xảy ra khi lấy dữ liệu doanh thu:", error);
        });

      axios.get("http://localhost:8080/revenue/stores-by-year")
        .then(response => {
          const data = response.data;
          setStoresByYearData(data);
        })
        .catch(error => {
          console.error("Có lỗi xảy ra khi lấy dữ liệu số lượng cửa hàng:", error);
        });
    } else if (props.title === "Store") {
      axios.get("http://localhost:8080/revenue/stores-by-year")
        .then(response => {
          const data = response.data;
          setStoresByYearData(data);
          const totalStores = data.reduce((acc, item) => acc + item.TotalStores, 0);
          setTotalStores(totalStores);
        })
        .catch(error => {
          console.error("Có lỗi xảy ra khi lấy dữ liệu số lượng cửa hàng:", error);
        });
    } else if (props.title === "Bill") {
      axios.get("http://localhost:8080/order-details/count-by-store-and-year")
        .then(response => {
          const data = response.data;
          setOrderDetailsData(data);
          const totalOrders = data.reduce((acc, item) => acc + item.TotalOrderDetails, 0);
          setTotalOrders(totalOrders);
        })
        .catch(error => {
          console.error("Có lỗi xảy ra khi lấy dữ liệu đơn hàng:", error);
        });
    } else if (props.title === "User") {
      axios.get("http://localhost:8080/user-ads/users-by-year")
        .then(response => {
          const data = response.data;
          setUsersByYearData(data);
          const totalUsers = data.reduce((acc, item) => acc + item.TotalUsers, 0);
          setTotalUsers(totalUsers);
        })
        .catch(error => {
          console.error("Có lỗi xảy ra khi lấy dữ liệu người dùng:", error);
        });
    }
  }, [props.title]);

  return (
    <LayoutGroup>
      {expanded ? (
        <ExpandedCard
          param={props}
          setExpanded={() => setExpanded(false)}
          revenueData={revenueData}
          storesByYearData={storesByYearData}
          orderDetailsData={orderDetailsData}
          usersByYearData={usersByYearData}
          totalRevenue={totalRevenue}
          totalStores={totalStores}
          totalOrders={totalOrders}
          totalUsers={totalUsers}
        />
      ) : (
        <CompactCard
          param={{ 
            ...props, 
            value: props.title === "Store" 
              ? "Active" 
              : (props.title === "Bill" 
                ? "Approve"
                : (props.title === "User" 
                  ? "Registered" 
                  : totalRevenue.toLocaleString())), 
            stores: props.title === "Bill" ? totalOrders : (props.title === "User" ? totalUsers : totalStores)
          }}
          setExpanded={() => setExpanded(true)}
        />
      )}
    </LayoutGroup>
  );
};

function CompactCard({ param, setExpanded }) {
  const Png = param.png;
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
        <span>{param.value}</span>
        {param.stores !== undefined && (
          <span>
            {param.title === "Bill"
              ? `Total Orders: ${param.stores}`
              : param.title === "User"
              ? `Total Users: ${param.stores}`
              : `Total Stores: ${param.stores}`}
          </span>
        )}
      </div>
    </motion.div>
  );
}

function ExpandedCard({ param, setExpanded, revenueData, storesByYearData, orderDetailsData, usersByYearData, totalRevenue, totalStores, totalOrders, totalUsers }) {
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
      colors: ["#00E396"],
    },
    tooltip: {
      y: {
        formatter: (val) => `$ ${val.toLocaleString()}`,
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
      colors: ["#FF5733"],
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} Stores`,
      },
    },
  };

  const orderDetailsOptions = {
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
    xaxis: {
      categories: orderDetailsData.map(item => `${item.StoreName} (${item.Year})`),
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      colors: ["#4B9CE2"],
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} Orders`,
      },
    },
  };

  const userOptions = {
    chart: {
      type: "bar",
      height: "auto",
    },
    xaxis: {
      categories: usersByYearData.map(item => item.Year),
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      colors: ["#00bfff"],
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} Users`,
      },
    },
  };

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
        {param.title === "Revenue" && (
          <Chart
            series={[
              {
                name: "Total Revenue",
                data: revenueData.map(item => item.totalRevenue),
              },
            ]}
            type="bar"
            options={revenueOptions}
          />
        )}
        {param.title === "Store" && (
          <Chart
            series={[
              {
                name: "Total Stores",
                data: storesByYearData.map(item => item.TotalStores),
              },
            ]}
            type="bar"
            options={storesOptions}
          />
        )}
        {param.title === "Bill" && (
          <Chart
            series={[
              {
                name: "Total Orders",
                data: orderDetailsData.map(item => item.TotalOrderDetails),
              },
            ]}
            type="bar"
            options={orderDetailsOptions}
          />
        )}
        {param.title === "User" && (
          <Chart
            series={[
              {
                name: "Total Users",
                data: usersByYearData.map(item => item.TotalUsers),
              },
            ]}
            type="bar"
            options={userOptions}
          />
        )}
      </div>
      <div className="summary">
        <span>{param.title === "Revenue" ? `Total Revenue: $${totalRevenue.toLocaleString()}` : ""}</span>
        <span>{param.title === "Store" ? `Total Stores: ${totalStores}` : ""}</span>
        <span>{param.title === "Bill" ? `Total Orders: ${totalOrders}` : ""}</span>
        <span>{param.title === "User" ? `Total Users: ${totalUsers}` : ""}</span>
      </div>
    </motion.div>
  );
}

export default CardAd;
