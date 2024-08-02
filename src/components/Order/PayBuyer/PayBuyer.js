import React from "react";
import Header from "../../UI&UX/Header/Header";
import Footer from "../../UI&UX/Footer/Footer";

const PayBuyer = () => {
  return (
    <div>
      <Header></Header>
      <div className="container">
        <div className="card rounded-3 mt-3">
          <div className="card-body">
            <h5>Địa chỉ nhận hàng</h5>
            <hr />
            <div className="row">
              <div className="col-2">
                <p className="fw-bold">Võ Khánh Toàn</p>
                <div className="fw-bold">0763889837</div>
              </div>
              <div className="col-9">
                <text>
                  Đường 3 Tháng 2, Hẻm 51, Hẻm quán nhậu Số Dzách, gần chị Diễm
                  anh tới rồi gọi em., Phường An Khánh, Quận Ninh Kiều, Cần Thơ
                </text>
              </div>
              <div className="col-1">
                <button
                  type="button"
                  class="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  Thay đổi
                </button>
              </div>
              <div
                class="modal fade"
                id="exampleModal"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id="exampleModalLabel">
                        Địa chỉ của tôi
                      </h1>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div class="modal-body">
                      <select className="form-select" name="" id="">
                        <option value="">Cần thơ</option>
                      </select>
                      <button
                        type="button"
                        class="btn btn-primary mt-3"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal1"
                      >
                        Thêm địa chỉ
                      </button>
                    </div>
                    <div class="modal-footer">
                      <button
                        type="button"
                        class="btn btn-primary"
                        data-bs-dismiss="modal"
                      >
                        Xác nhận
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="modal fade"
                id="exampleModal1"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id="exampleModalLabel">
                        Thêm địa chỉ
                      </h1>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div class="modal-body">
                      <label className="label">Địa chỉ</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div class="modal-footer">
                      <button
                        type="button"
                        class="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                      >
                        Quay lại
                      </button>
                      <button
                        type="button"
                        class="btn btn-primary"
                        data-bs-dismiss="modal"
                      >
                        Xác nhận
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card mt-3">
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
                <div className="col-8 mx-3">
                  <div className="d-flex mt-3" id="spinner">
                    <button
                      className="btn border rounded-0 rounded-start"
                      id="button"
                    >
                      <i class="bi bi-dash-lg"></i>
                    </button>
                    <input
                      type="number"
                      min={0}
                      className="form-control rounded-0 w-50"
                    />
                    <button
                      className="btn border rounded-0 rounded-end"
                      id="button"
                    >
                      <i class="bi bi-plus-lg"></i>
                    </button>
                  </div>
                  <h5 className="mt-2" id="price">
                    Tổng cộng: 1.000.000VNĐ
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card rounded-3 mt-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <h5>PerWatt Voucher</h5>
              <button className="btn btn-primary ml-auto">Thay đổi</button>
            </div>
          </div>
        </div>
        <div className="card rounded-3 mt-3">
          <div className="card-body">
            <div className="d-flex">
              <h5 className="me-3">Phương thức thanh toán</h5>
              <input class="form-check-input me-1" type="checkbox" />
              <label class="form-check-label me-3" for="flexCheckDefault">
                Thanh toán khi nhận hàng
              </label>
              <input class="form-check-input me-1" type="checkbox" />
              <label class="form-check-label" for="flexCheckDefault">
                Thanh toán bằng thẻ
              </label>
            </div>
          </div>
        </div>
        <div className="card rounded-3 mt-3">
          <div className="card-body">
            <div className="d-flex justify-content-end">
              <h5>Tổng thanh toán: 1000đ</h5>
            </div>
            <hr />
            <div className="d-flex justify-content-end">
              <a className="btn btn-danger" href="/order">Đặt hàng</a>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default PayBuyer;
