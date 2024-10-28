import React, { useState } from "react";
<<<<<<< HEAD
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
=======
import axios from "../../Localhost/Custumize-axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, TextField } from "@mui/material";
>>>>>>> 58b6b921afbae8680c6ac95e820dfb3b6a74604f
const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const resetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }

    const email = sessionStorage.getItem("email");

    try {
<<<<<<< HEAD
      const response = await axios.post(
        "http://localhost:8080/api/reset-password",
        { newPassword, confirmPassword, email }
      );
      toast.error(response.data);
=======
      const response = await axios.post("api/reset-password", {
        newPassword,
        confirmPassword,
        email,
      });
      toast.success(response.data);
>>>>>>> 58b6b921afbae8680c6ac95e820dfb3b6a74604f
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("generatedOTP");
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  return (
<<<<<<< HEAD
    <div className="container">
      <div className="form-container">
        <h2>Đặt lại mật khẩu</h2>
        <form onSubmit={resetPassword}>
          <div className="form-group">
            <label>Mật khẩu mới</label>
            <input
              type="password"
              placeholder="Vui lòng nhập mật khẩu mới"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit">Đặt lại mật khẩu</button>
=======
    <div className="container" id="container">
      <div className="form-container" id="form-container">
        <h2 id="title">Đặt lại mật khẩu</h2>
        <form onSubmit={resetPassword}>
          <div className="form-group" id="form-group">
            <TextField
              id="outlined-basic"
              label="Vui lòng nhập mật khẩu mới"
              variant="outlined"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              size="small"
              fullWidth
            />
          </div>
          <div className="form-group" id="form-group">
            <TextField
              id="outlined-basic"
              label="Xác nhận mật khẩu mới"
              variant="outlined"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              size="small"
              fullWidth
            />
          </div>
          <Button
            fullWidth
            disableElevation
            color="error"
            type="submit"
            variant="contained"
          >
            ĐẶT LẠI MẬT KHẨU
          </Button>
>>>>>>> 58b6b921afbae8680c6ac95e820dfb3b6a74604f
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
