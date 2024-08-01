import React, { useState } from "react";
import "./CardAd.css";
import { motion, LayoutGroup } from "framer-motion";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { UilTimes } from "@iconscout/react-unicons";
import Chart from "react-apexcharts";

const CardAd = (props) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <LayoutGroup>
      {expanded ? (
        <ExpandedCard param={props} setExpanded={() => setExpanded(false)} />
      ) : (
        <CompactCard param={props} setExpanded={() => setExpanded(true)} />
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
        <span>Last 24 hours</span>
      </div>
    </motion.div>
  );
}

function ExpandedCard({ param, setExpanded }) {
  // Cấu hình cho biểu đồ doanh thu ("sales")
  const salesOptions = {
    chart: {
      type: "area",
      height: "auto",
    },
    dropShadow: {
      enabled: false,
      enableOnseries: undefined,
      top: 0,
      left: 0,
      blur: 3,
      color: "#000",
      opacity: 0.35,
    },
    fill: {
      colors: ["#fff"],
      type: "gradient",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      colors: ["white"],
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
    grid: {
      show: true,
    },
    xaxis: {
      type: "datetime",
      categories: [
        "2024-08-05T00:00:00.000Z",
        "2024-08-05T01:30:00.000Z",
        "2024-08-05T02:30:00.000Z",
        "2024-08-05T03:30:00.000Z",
        "2024-08-05T04:30:00.000Z",
        "2024-08-05T05:30:00.000Z",
        "2024-08-05T06:30:00.000Z",
      ], // Categories cập nhật hợp lệ
    },
  };

  // Cấu hình cho biểu đồ doanh thu ("revenus")
  const revenusOptions = {
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
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    },
    fill: {
      colors: ["#00E396"],
    },
    tooltip: {
      y: {
        formatter: (val) => `$ ${val}`,
      },
    },
  };

  // Chọn cấu hình dựa trên loại biểu đồ
  const options = param.title === "Sales" ? salesOptions : revenusOptions;

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
          series={param.series}
          type={param.title === "Sales" ? "area" : "bar"}
          options={options}
        />
      </div>
      <span>Last 24</span>
    </motion.div>
  );
}

export default CardAd;
