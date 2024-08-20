import React from "react";

const Login = () => {
  return (
    <form action="#" className="form-sign">
      <h2 className="title">Đăng nhập</h2>
      <p className="subject">Hãy đăng nhập để có trải nghiệm tốt nhất</p>
      <input
        type="text"
        name="email"
        placeholder="Email"
        className="form-control mb-3"
      />
      <input
        type="password"
        name="passWord"
        placeholder="********"
        className="form-control mb-3"
      />
      <a href="#" style={{ textDecoration: "none" }}>
        Quên mật khẩu?
      </a>
      <button type="submit" className="button">
        Đăng nhập
      </button>
    </form>
  );
};

export default Login;
