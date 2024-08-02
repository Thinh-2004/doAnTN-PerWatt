import React from "react";
import Header from "../../UI&UX/Header/Header";
import Footer from "../../UI&UX/Footer/Footer";

const OrderDetail = () => {
  return (
    <div>
      <Header></Header>
      <div className="container">
        <div className="card mt-3">
          <div className="card-body">
            <a className="btn btn-primary" href="/orderSeller">
              Quay lại
            </a>
          </div>
        </div>
        <div className="card mt-3" id="cartItem">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <input
                className="form-check-input mb-1"
                type="checkbox"
                id="checkBox"
              />
              <img
                src="http://localhost:3000/images/logoWeb.png"
                id="imgShop"
                className="mx-2"
                alt="Shop Logo"
                style={{ height: "100%" }}
              />
              <h5 id="nameShop" className="mb-0">
                PerWatt
              </h5>
            </div>
            <hr id="hr" />
            <div className="col-8">
              <div className="d-flex">
                <img
                  src="https://imagor.owtg.one/unsafe/fit-in/1000x1000/filters:quality(100)/https://media-api-beta.thinkpro.vn/media/core/products/2022/12/23/lenovo-thinkpad-x1-carbon-gen-11-thinkpro-01.png"
                  id="img"
                />
                <div className="col-8 mt-3">
                  <div id="fontSizeTitle">Lenovo ThinkPad X1 Carbon Gen 11</div>
                  <div id="fontSize">
                    i7 1365U, 16GB, 256GB, FHD+ Touch, Black, Outlet, Nhập khẩu
                  </div>
                </div>
                <div className="col-8 mx-3"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="card mt-3">
          <div className="card-body text-end">Tổng cộng: 1.000.000VNĐ</div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default OrderDetail;
