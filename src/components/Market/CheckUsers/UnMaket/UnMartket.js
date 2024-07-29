import React from "react";
import './UnMarketStyle.css'
import { Link } from "react-router-dom";
const UnMatket = () => {
  return (
    <div className="container mt-4">
      <div className="card rounded-4 bg-white" style={{border : "none"}}>
        <div className="row">
          <div className="col-lg-6">
            <img
              src="https://mediapost.com.vn/upload/tin-tuc/tin-media-post/kenh-ban-hang-online-hieu-qua.png?v=1.0.0"
              alt=""
              className="img-fluid rounded-start-4"
              style={{height : "100%"}}
            />
          </div>
          <div className="col-lg-6">
            <h1 className="text-center mt-3">Tạo kênh bán</h1>
            <p className="text-center">Hãy tạo kênh bán hàng của riêng bạn</p>
            <div className="row">
              <div className="col-lg-12">
                <div className="card-body">
                  <form action="">
                    <div className="mb-3">
                      <input
                        type="text"
                        placeholder="Nhập tên cửa hàng"
                        className="form-control rounded-4"
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        placeholder="Nhập số điện thoại"
                        className="form-control rounded-4"
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="email"
                        placeholder="Nhập email"
                        className="form-control rounded-4"
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        placeholder="Nhập CCCD"
                        className="form-control rounded-4"
                      />
                    </div>
                    <div className="mb-3">
                      <textarea
                        name=""
                        id=""
                        placeholder="Nhập địa chỉ của bạn"
                        className="form-control rounded-4"
                      ></textarea>
                    </div>
                    <button type="submit" className="btn" id="btn-submit">Đăng Ký</button>
                    <button type="submit" className="btn mx-3" id="btn-reset">Làm mới</button>
                    <Link to={"/profileMarket"}>IsMarket</Link>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnMatket;
