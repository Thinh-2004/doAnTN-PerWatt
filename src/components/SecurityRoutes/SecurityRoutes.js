import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "../../Localhost/Custumize-axios";

const SecurityRoutes = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("hadfjkdshf"); // Lấy token từ localStorage
  const [role, setRole] = useState(null); // Ban đầu là null để biết trạng thái đang tải
  const [loading, setLoading] = useState(true); // Trạng thái tải

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        if (!token) {
          setLoading(false); // Không có token, dừng xử lý
          return;
        }

        const res = await axios.get(`/userProFile/myInfo`);
        // console.log(res.data);
        setRole(
          res.data.rolePermission.role.namerole +
            "_" +
            res.data.rolePermission.permission.name
        );
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        setRole(null); // Nếu lỗi, đặt role về null
      } finally {
        setLoading(false); // Hoàn tất quá trình tải
      }
    };

    loadUserInfo();
  }, [token]);

  if (!token) {
    // Nếu không có token, điều hướng đến trang đăng nhập
    return <Navigate to="/" replace />;
  }

  if (loading) {
    // Trong khi đang tải role, hiển thị trạng thái chờ
    return <div>Loading...</div>;
  }

  if (!allowedRoles.includes(role)) {
    // Nếu role không hợp lệ, điều hướng đến trang không tìm thấy
    return <Navigate to="/404/NotFound" replace />;
  }

  // Nếu role hợp lệ, cho phép truy cập
  return children;
};

export default SecurityRoutes;
