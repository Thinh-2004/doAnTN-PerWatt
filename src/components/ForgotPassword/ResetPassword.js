import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const resetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }

    const email = sessionStorage.getItem("email");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/reset-password",
        { newPassword, confirmPassword, email }
      );
      setMessage(response.data);
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("generatedOTP");
      navigate("/login");
    } catch (error) {
      setMessage(error.response.data);
    }
  };

  return (
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
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
