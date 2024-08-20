import React, { useState, useEffect } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { UilTimes } from "@iconscout/react-unicons";
import Chart from "react-apexcharts";
import axios from "axios";
import "./CardUs.css";

const CardUs = (props) => {
  const [expanded, setExpanded] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        switch (props.title) {
          case "Processing":
            response = await axios.get("http://localhost:8080/order-us/count-store-processing");
            break;
          case "Shipped":
            response = await axios.get("http://localhost:8080/order-us/count-store-shipped");
            break;
          case "Delivered":
            response = await axios.get("http://localhost:8080/order-us/count-store-delivered");
            break;
          case "Cancelled":
            response = await axios.get("http://localhost:8080/order-us/count-store-cancelled");
            break;
          case "Returned":
            response = await axios.get("http://localhost:8080/order-us/count-store-returned");
            break;
          default:
            return;
        }
        const apiData = response.data;
        setData(apiData);
        const totalOrders = apiData.reduce((acc, item) => acc + (item.TotalOrders || 0), 0);
        setTotal(totalOrders);
      } catch (error) {
        console.error(`Có lỗi xảy ra khi lấy dữ liệu ${props.title}:`, error);
      }
    };

    fetchData();
  }, [props.title]);

  return (
    <LayoutGroup>
      {expanded ? (
        <ExpandedCard
          param={props}
          setExpanded={() => setExpanded(false)}
          data={data}
          total={total}
        />
      ) : (
        <CompactCard
          param={{ 
            ...props, 
            value: total.toLocaleString(),
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
        <span>Total: {param.value}</span>
      </div>
    </motion.div>
  );
}

function ExpandedCard({ param, setExpanded, data, total }) {
  const chartOptions = {
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
      categories: data.map(item => item.nameStore), // Các nhãn cho trục X
    },
    fill: {
      colors: ["#00E396"], // Màu của cột biểu đồ
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} Orders`, // Hiển thị đơn vị cho tooltip
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
        <Chart
          series={[{
            name: param.title,
            data: data.map(item => item.TotalOrders), // Dữ liệu cho biểu đồ
          }]}
          type="bar"
          options={chartOptions}
        />
      </div>
      <div className="summary">
        <span>{`Total ${param.title}: ${total.toLocaleString()}`}</span>
      </div>
    </motion.div>
  );
}

export default CardUs;
