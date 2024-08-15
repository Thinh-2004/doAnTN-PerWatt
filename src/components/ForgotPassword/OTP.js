import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const verifyOtp = async (e) => {
    e.preventDefault();
    const generatedOTP = sessionStorage.getItem("generatedOTP");
    const email = sessionStorage.getItem("email");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/verify-otp",
        {
          otp,
          generatedOTP,
          email,
        }
      );
      setMessage(response.data || "OTP đã được xác nhận!");
      navigate("/resetPassword");
    } catch (error) {
      setMessage(error.response?.data || "Đã xảy ra lỗi!");
    }
  };

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
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default VerifyOTP;
