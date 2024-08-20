import React, { useState } from "react";
import axios from "../../Localhost/Custumize-axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
      const response = await axios.post(
        "api/reset-password",
        { newPassword, confirmPassword, email }
      );
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
            <label id="title-email">Mật khẩu mới</label>
            <input
              type="password"
              placeholder="Vui lòng nhập mật khẩu mới"
              required
              id="enter-form"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="form-group" id="form-group">
            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              required
              id="enter-form"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" id="btn-submit">Đặt lại mật khẩu</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
