import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../../../Localhost/Custumize-axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit  = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        const res = await axios.get(`user/${email}`);
        if (res.data.email !== email) {
          toast.error("Email không tồn tại");
        } else if (res.data.password !== password) {
          toast.error("Mật khẩu không đúng");
        } else {
          const id = toast.loading("Vui lòng đợi...");
          sessionStorage.setItem("fullname", res.data.fullname);
          sessionStorage.setItem("id", res.data.id);
          sessionStorage.setItem("avatar", res.data.avatar);
          console.log("Session stored: ", res.data.fullname);

          setTimeout(() => {
            toast.update(id, {
              render: "Đăng nhập thành công",
              type: "success",
              isLoading: false,
              autoClose: 5000,
              closeButton: true,
            },500);
            if (res.data.role.id === 1) {
              navigate("/admin");
            } else {
              navigate("/");
            }
          }, 500);
        }
      } catch (error) {
        if (error.response) {
          toast.error("Email không tồn tại: " + error.response.data.message);
        } else if (error.request) {
          toast.error("Không có phản hồi từ máy chủ");
        } else {
          toast.error("Đăng nhập thất bại: " + error.message);
        }
      }
    }
  };

  const validate = () => {
    if (email === "" && password === "") {
      toast.warning("Hãy nhập đầy đủ thông tin");
      return false;
    } else if (email === "") {
      toast.warning("Hãy nhập email");
      return false;
    } else if (password === "") {
      toast.warning("Hãy nhập password");
      return false;
    }
    return true;
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="form-sign">
        <h2 className="title">Đăng nhập</h2>
        <p className="subject">Hãy đăng nhập để có trải nghiệm tốt nhất</p>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="form-control mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="********"
          className="form-control mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Link to={"/forgotPass"} style={{ textDecoration: "none" }}>
          Quên mật khẩu?
        </Link>
        <button type="submit" className="button">
          Đăng nhập
        </button>
      </form>
    </>
  );
};

export default Login;
