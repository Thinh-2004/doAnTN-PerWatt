import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import { toast } from "react-toastify";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/send-otp", {
        toEmail: email,
      });
      const responseData = response.data;
      toast.error(responseData.message);

      // Lưu OTP và email vào session storage
      sessionStorage.setItem("generatedOTP", responseData.otp);
      sessionStorage.setItem("email", responseData.email);

      navigate("/otp");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi!";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Quên mật khẩu</h2>
        <p>Vui lòng điền Tài khoản bạn sử dụng để đăng nhập</p>
        <form onSubmit={sendOtp}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Vui lòng nhập Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit">Gửi</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
