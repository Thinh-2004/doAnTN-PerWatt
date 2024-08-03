import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useSession from "../../Session/useSession"; // Giả sử hook của bạn ở cùng thư mục
import "./ChangePassword.css"; // Giả sử bạn có file CSS cho form
import { toast } from "react-toastify";
const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullname] = useSession("fullname");
  const [email] = useSession("email"); // Lấy email từ session storage
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/changePassword",
        {
          currentPassword,
          newPassword,
          confirmPassword,
          email,
        }
      );
      toast.error(response.data);
      navigate("/login"); // Sử dụng navigate để điều hướng
    } catch (error) {
      toast.error(error.response?.data || "Đã xảy ra lỗi!");
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Đổi mật khẩu</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Xin chào: <b>{fullname}</b>
            </label>
          </div>
          <div className="form-group">
            <label>Mật khẩu hiện tại</label>
            <input
              type="password"
              placeholder="Vui lòng nhập mật khẩu hiện tại"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
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
            <label>Xác nhận mật khẩu mới</label>
            <input
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit">Gửi</button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
