import React, { useState } from "react";
import "./FormStyle.css";
import Register from "./Register/Register";
import Login from "./Login/Login";

const Form = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div
        id="main"
        className={`container-login ${isSignUp ? "right-panel-active" : ""}`}
      >
        <div className="row">
          <div className="col sign-up">
            <Register></Register>
          </div>
          <div className="col sign-in">
            <Login></Login>
          </div>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-left">
              <h2>Bạn chưa có tài khoản?</h2>
              <p>
                Hãy tạo tài khoản của riêng bạn và đăng nhập để sử dụng dịch vụ
                của chúng tôi
              </p>
              <button
                id="signIn"
                className="button"
                onClick={() => setIsSignUp(false)}
              >
                Đăng nhập
              </button>
            </div>
            <div className="overlay-right">
              <h2>Xin chào!</h2>
              <p>
                Nhập thông tin cá nhân của bạn và bắt đầu hành trình với chúng
                tôi
              </p>
              <button
                id="signUp"
                className="button"
                onClick={() => setIsSignUp(true)}
              >
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
