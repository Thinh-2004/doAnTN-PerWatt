import React from "react";

const Register = () => {
  return (
    <form action="#" className="form-sign">
      <h2 className="title">Đăng Ký</h2>
      <p className="subject">
        Hãy điền đầy đủ các thông tin trên để trải nghiệm dịch vụ của chúng tôi
      </p>
      <div className="row">
        <div className="col-lg-12">
          <div className="mb-3">
            <input
              type="text"
              name="hoTen"
              placeholder="Nhập họ và tên"
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="email"
              placeholder="Email"
              className="form-control"
            />
          </div>
          <div className="d-flex justify-content-start">
            <div>
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                id="inlineRadio1"
                value="option1"
              />
              <label className="form-check-label mx-2" for="inlineRadio1">
                Nam
              </label>
            </div>
            <div className="mx-3 mb-3">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                id="inlineRadio1"
                value="option1"
              />
              <label className="form-check-label mx-2" for="inlineRadio1">
                Nữ
              </label>
            </div>
          </div>

          <div className="mb-3">
            <input type="date" name="birthDay" className="form-control" />
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="phone"
              placeholder="Nhập số điện thoại"
              className="form-control"
            />
          </div>
        </div>
        <div className="col-lg-12">
          <div className="row">
            <div className="col-lg-6">
              <div className="mb-3">
                <input
                  type="password"
                  name="passWord"
                  placeholder="********"
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="mb-3">
                <input
                  type="password"
                  name="configPassWord"
                  placeholder="********"
                  className="form-control mb-3"
                />
              </div>
            </div>
          </div>
          <div className="mb-3">
            <textarea
              name="address"
              className="form-control"
              placeholder="Nhập địa chỉ của bạn"
            ></textarea>
          </div>
        </div>
      </div>
      <button type="submit" className="button">
        Đăng ký
      </button>
    </form>
  );
};

export default Register;
