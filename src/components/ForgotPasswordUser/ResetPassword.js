import React, { useState } from "react";

import axios from "../../Localhost/Custumize-axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, TextField } from "@mui/material";

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
      const response = await axios.post("api/reset-password", {
        newPassword,
        confirmPassword,
        email,
      });
      toast.success(response.data);
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("generatedOTP");
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  return (
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
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
