import React from "react";
import './StatisticalOrderStyle.css'
import { Link } from "react-router-dom";
const StatisticalOrder = () => {
  return (
    <div className="row">
      <div className="col-lg-6">
        <div className="card mt-4 p-4">
          <h3 className="text-center">Thống kê đơn hàng</h3>
          <div className="row">
            <div className="col-lg-12" id="btn-orders">
              <Link className="btn btn-lg" id="link">
                <p>0</p>
                <label htmlFor="">Chờ xác nhận</label>
              </Link>
              <Link className="btn btn-lg" id="link">
                <p>0</p>
                <label htmlFor="">Chờ lấy hàng</label>
              </Link>
              <Link className="btn btn-lg" id="link">
                <p>0</p>
                <label htmlFor="">Đơn đã giao</label>
              </Link>
              <Link className="btn btn-lg" id="link">
                <p>0</p>
                <label htmlFor="">Đơn hủy</label>
              </Link>
              <Link className="btn btn-lg" id="link">
                <p>0</p>
                <label htmlFor="">Sản phẩm hết hàng</label>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-6">
        <div className="card mt-4 p-4">
            <h3 className="text-center">Biều đồ phân tích</h3>
        </div>
      </div>
    </div>
  );
};

export default StatisticalOrder;
