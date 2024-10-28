<<<<<<< HEAD
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
=======
import React, { useState, useRef } from "react";
import axios from "../../Localhost/Custumize-axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./OtpStyle.css";
import { Button } from "@mui/material";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const inputRefs = useRef([]);

>>>>>>> 58b6b921afbae8680c6ac95e820dfb3b6a74604f
  const navigate = useNavigate();

  const verifyOtp = async (e) => {
    e.preventDefault();
    const generatedOTP = sessionStorage.getItem("generatedOTP");
    const email = sessionStorage.getItem("email");

    try {
<<<<<<< HEAD
      const response = await axios.post(
        "http://localhost:8080/api/verify-otp",
        {
          otp,
          generatedOTP,
          email,
        }
      );
      toast.error(response.data || "OTP đã được xác nhận!");
=======
      const response = await axios.post("api/verify-otp", {
        otp: otp.join(''),
        generatedOTP,
        email,
      });
      toast.success(response.data || "OTP đã được xác nhận!");
>>>>>>> 58b6b921afbae8680c6ac95e820dfb3b6a74604f
      navigate("/resetPassword");
    } catch (error) {
      toast.error(error.response?.data || "Đã xảy ra lỗi!");
    }
  };

<<<<<<< HEAD
  return (
    <div className="container">
      <div className="form-container">
        <h2>Xác nhận OTP</h2>
        <form onSubmit={verifyOtp}>
          <div className="form-group">
            <label>OTP</label>
            <input
              type="text"
              placeholder="Vui lòng nhập OTP"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <button type="submit">Xác nhận</button>
=======
  const handleOtpChange = (event, index) => {
    const { value } = event.target;
    const newOtp = [...otp];
    
    if (value.match(/[0-9]/)) {
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Move to the next input field if not the last one
      if (index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    } else if (value === '') {
      // Handle backspace
      newOtp[index] = '';
      setOtp(newOtp);

      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  return (
    <div className="otp-container-wrapper" id="otp-container-wrapper">
      <div className="otp-form-container" id="otp-form-container">
        <h2 id="otp-title">Xác nhận OTP</h2>
        <form onSubmit={verifyOtp}>
          <div className="otp-fields-container" id="otp-fields-container">
            {otp.map((value, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="otp-field"
                ref={el => inputRefs.current[index] = el}
                value={value}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !value && index > 0) {
                    setTimeout(() => {
                      inputRefs.current[index - 1].focus();
                    }, 0);
                  }
                }}
              />
            ))}
          </div>
          <Button style={{ width: "85%"}} disableElevation color="error" type="submit" variant="contained">TIẾP THEO</Button>
>>>>>>> 58b6b921afbae8680c6ac95e820dfb3b6a74604f
        </form>
      </div>
    </div>
  );
};
<<<<<<< HEAD

=======
>>>>>>> 58b6b921afbae8680c6ac95e820dfb3b6a74604f
export default VerifyOTP;
