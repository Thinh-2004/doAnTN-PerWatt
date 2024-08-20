import React, { useState } from "react";
import axios from "../../Localhost/Custumize-axios";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import { toast } from "react-toastify";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      const id = toast.loading("Vui lòng chờ...");
      const response = await axios.post("api/send-otp", {
        toEmail: email,
      });
      const responseData = response.data;
      setTimeout(() => {
        toast.update(id, {
          render: responseData.message,
          type: "success",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });
        navigate("/otp");
      }, 500);
      // Lưu OTP và email vào session storage
      sessionStorage.setItem("generatedOTP", responseData.otp);
      sessionStorage.setItem("email", responseData.email);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi!";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="container" id="container">
      <div className="form-container shadow" id="form-container">
        <h2 id="title">Quên mật khẩu</h2>
        <p>Vui lòng điền tài khoản bạn sử dụng để đăng nhập</p>
        <form onSubmit={sendOtp}>
          <div className="form-group" id="form-group">
            <label id="title-email">Email</label>
            <input
              type="email"
              placeholder="Vui lòng nhập Email"
              id="enter-form"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" id="btn-submit">
            Gửi
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
