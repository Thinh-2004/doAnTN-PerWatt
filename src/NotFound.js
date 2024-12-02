import React from "react";
import "./NotFoundStyle.css";

const NotFound = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="notfound-title">404</h1>
        <h2 className="notfound-message">Lỗi! Không tìm thấy trang</h2>
        <p className="notfound-description">
        Rất tiếc, nhưng trang bạn đang tìm kiếm không tồn tại. Vui lòng
        kiểm tra URL hoặc quay lại trang chủ.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
