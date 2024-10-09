import React, { useState } from "react";
import axios from "../../Localhost/Custumize-axios";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import { toast } from "react-toastify";
import { Button, TextField } from "@mui/material";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();
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
    }
  };

  return (
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
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
