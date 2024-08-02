import React from "react";
import "./CartStyle.css";
import Header from "../UI&UX/Header/Header";
import Footer from "../UI&UX/Footer/Footer";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Body = () => {
  const changeLink = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn chặn hành động gửi form
    const id = toast.loading("Please wait...");
    //do something else
    setTimeout(() => {
      toast.update(id, {
        render: "Good cái đầu buồi",
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
      changeLink("/pay");
    }, 500);
  };
  return (
    <div>
      <Header></Header>
      <div className="col-8 offset-2">
        <div className="row mt-3">
          <div className="col-9">
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
                <hr id="hr" />
                <div className="col-8">
                  <div className="d-flex">
                    <img
                      src="https://imagor.owtg.one/unsafe/fit-in/1000x1000/filters:quality(100)/https://media-api-beta.thinkpro.vn/media/core/products/2022/12/23/lenovo-thinkpad-x1-carbon-gen-11-thinkpro-01.png"
                      id="img"
                    />
                    <div className="col-8 mt-3">
                      <div id="fontSizeTitle">
                        Lenovo ThinkPad X1 Carbon Gen 11
                      </div>
                      <div id="fontSize">
                        i7 1365U, 16GB, 256GB, FHD+ Touch, Black, Outlet, Nhập
                        khẩu
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
          </div>
          {/* rightCard */}
          <div class="col-3">
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
                <Link
                  className="btn btn-danger w-100"
                  id="button"
                  onClick={handleSubmit}
                >
                  Đặt hàng
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Body;
