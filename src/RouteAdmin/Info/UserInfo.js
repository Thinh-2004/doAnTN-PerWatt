import React, { useEffect, useState } from "react";
import axios from "axios";

const UserInfo = () => {
  const [user, setUser] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const userId = sessionStorage.getItem("id");

  useEffect(() => {
    const fetchUserInfo = async () => {
      const res = await axios.get(`http://localhost:8080/info/${userId}`);
      setUser(res.data);
    };
    fetchUserInfo();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:8080/info/${userId}`, user);
    alert("Cập nhật thông tin thành công");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} className="border p-4 rounded bg-light">
        <h2 className="mb-4">Thông tin tài khoản</h2>
        <div className="mb-3">
          <label className="form-label">Họ và tên</label>
          <input
            type="text"
            className="form-control"
            name="fullname"
            value={user.fullname || ""}
            onChange={handleChange}
            placeholder="Nhập họ và tên"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={user.email || ""}
            onChange={handleChange}
            placeholder="Nhập email"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mật khẩu</label>
          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            name="password"
            value={user.password || ""}
            onChange={handleChange}
            placeholder="Nhập mật khẩu"
          />
          <div className="form-check mt-2">
            <input
              type="checkbox"
              className="form-check-input"
              checked={showPassword}
              onChange={togglePasswordVisibility}
            />
            <label className="form-check-label">Hiện mật khẩu</label>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Địa chỉ</label>
          <input
            type="text"
            className="form-control"
            name="address"
            value={user.address || ""}
            onChange={handleChange}
            placeholder="Nhập địa chỉ"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Số điện thoại</label>
          <input
            type="tel"
            className="form-control"
            name="phone"
            value={user.phone || ""}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Cập nhật
        </button>
      </form>
    </div>
  );
};

export default UserInfo;
