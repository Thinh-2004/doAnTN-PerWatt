import React from "react";
import { motion } from "framer-motion";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const RotatingCircularProgressbar = ({ value, text }) => {
  return (
    <motion.div
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      style={{ width: 100, height: 100 }}
    >
      <CircularProgressbar
        value={value}
        text={text}
        styles={{
          path: {
            stroke: `rgba(62, 152, 199, ${value / 100})`,
            transition: "stroke-dashoffset 0.5s ease 0s",
          },
          text: {
            fill: "#f88",
            fontSize: "16px",
          },
        }}
      />
    </motion.div>
  );
};

export default RotatingCircularProgressbar;
