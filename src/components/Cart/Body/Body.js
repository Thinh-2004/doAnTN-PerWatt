import React from "react";
import "./Body.css";

const InfoBody = () => {
  return (
    <div>
      <div className="col-8 offset-2">
        <div className="row mt-3">
          <div className="col-8">
            <div className="card mb-3" id="cartItem">
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
                <hr />
                <div className="col-6">
                  <div className="d-flex">
                    <img
                      src="https://imagor.owtg.one/unsafe/fit-in/1000x1000/filters:quality(100)/https://media-api-beta.thinkpro.vn/media/core/products/2022/12/23/lenovo-thinkpad-x1-carbon-gen-11-thinkpro-01.png"
                      id="img"
                    />
                    Lenovo ThinkPad X1 Carbon Gen 11
                  </div>
                </div>
              </div>
            </div>
            <div className="card mb-3" id="cartItem">
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
                <hr />
                <div className="col-2">
                  <img
                    src="https://imagor.owtg.one/unsafe/fit-in/1000x1000/filters:quality(100)/https://media-api-beta.thinkpro.vn/media/core/products/2022/12/23/lenovo-thinkpad-x1-carbon-gen-11-thinkpro-01.png"
                    id="img"
                  />
                </div>
                <div className="col-2"></div>
              </div>
            </div>
          </div>
          {/* rightCard */}
          <div class="col-4">
            <div class="card" id="sticky-top">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <h5 className="text-start">Tạm tính:</h5>
                  <h5 className="text-end text-danger">1.000.000VNĐ</h5>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <h5 className="text-start">Tổng cộng:</h5>
                  <h5 className="text-end text-danger">1.000.000VNĐ</h5>
                </div>
                <button className="btn btn-danger w-100" id="button">
                  Đặt hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoBody;
