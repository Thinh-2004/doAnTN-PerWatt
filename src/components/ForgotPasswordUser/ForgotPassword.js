import React, { useState } from "react";
<<<<<<< HEAD
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import { toast } from "react-toastify";
=======
import axios from "../../Localhost/Custumize-axios";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import { toast } from "react-toastify";
import { Button, TextField } from "@mui/material";
>>>>>>> 58b6b921afbae8680c6ac95e820dfb3b6a74604f
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
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
=======
    const id = toast.loading("Vui lòng chờ...");
    try {
      const response = await axios.post("api/send-otp", {
        toEmail: email,
      });
      const responseData = response.data;
      setTimeout(() => {
        toast.update(id, {
          render: responseData.message,
          type: "success",
          isLoading: false,
          autoClose: 1500,
          closeButton: true,
        });
        navigate("/otp");
      }, 500);
      // Lưu OTP và email vào session storage
      sessionStorage.setItem("generatedOTP", responseData.otp);
      sessionStorage.setItem("email", responseData.email);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi!";
      toast.update(id, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 1500,
        closeButton: true,
      });
>>>>>>> 58b6b921afbae8680c6ac95e820dfb3b6a74604f
    }
  };

  return (
<<<<<<< HEAD
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
=======
    <div className="container" id="container">
      <div className="form-container shadow" id="form-container">
        <h2 id="title">Quên mật khẩu</h2>
        <form onSubmit={sendOtp}>
          <div className="form-group" id="form-group">
            <TextField
              id="outlined-basic"
              label="Vui lòng nhập Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="small"
              fullWidth
              />
          </div>
         <Button  fullWidth disableElevation color="error" type="submit" variant="contained">TIẾP THEO</Button>
>>>>>>> 58b6b921afbae8680c6ac95e820dfb3b6a74604f
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
