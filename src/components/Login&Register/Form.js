import React, { useState, useEffect, useRef } from "react";
import "./FormStyle.css";
import Register from "./Register/Register";
import Login from "./Login/Login";
import { Box, useTheme } from "@mui/material";

const Form = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isChangeForm, setChangeForm] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (isChangeForm) {
      setIsSignUp(false); // Chuyển sang giao diện đăng nhập
    }
  }, [isChangeForm]);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Box
        id="main"
        className={`container-login ${
          isSignUp ? "right-panel-active" : ""
        } shadow`}
        sx={{backgroundColor : "backgroundElement.children"}}
      >
        <div className="row">
          <div className="col sign-up">
            <Register onRegisterSuccess={() => setChangeForm(true)} />
          </div>
          <div className="col sign-in">
            <Login />
          </div>
        </div>
        <div className="overlay-container">
          <div className="overlay"  style={{
            background:
              theme.palette.mode === "light"
                ? "linear-gradient(to right, #28ffdb, #228dff)"
                : "linear-gradient(to right, #1c4a43, #072748)",
          }}>
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
      </Box>
    </div>
  );
};

export default Form;
