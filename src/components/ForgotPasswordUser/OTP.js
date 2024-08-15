import React, { useState } from "react";
import axios from "../../Localhost/Custumize-axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const verifyOtp = async (e) => {
    e.preventDefault();
    const generatedOTP = sessionStorage.getItem("generatedOTP");
    const email = sessionStorage.getItem("email");

    try {
      const response = await axios.post(
        "api/verify-otp",
        {
          otp,
          generatedOTP,
          email,
        }
      );
      toast.success(response.data || "OTP đã được xác nhận!");
      navigate("/resetPassword");
    } catch (error) {
      toast.error(error.response?.data || "Đã xảy ra lỗi!");
    }
  };

  return (
    <div className="container" id="container">
      <div className="form-container" id="form-container">
        <h2 id="title">Xác nhận OTP</h2>
        <form onSubmit={verifyOtp}>
          <div className="form-group" id="form-group">
            <label id="title-email">OTP</label>
            <input
              type="text"
              placeholder="Vui lòng nhập OTP"
              required
              id="enter-form"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <button type="submit" id="btn-submit">Xác nhận</button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
