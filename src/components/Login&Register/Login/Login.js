import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../../../Localhost/Custumize-axios";
import useSession from "../../../Session/useSession";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      const idToast = toast.loading("Vui lòng chờ...");
      try {
        const res = await axios.post("/login", { email, password }); // Thay đổi phương thức từ GET thành POST
        if (res.status === 200) {
          const { user } = res.data;
          // Lưu thông tin vào sessionStorage
          sessionStorage.setItem("fullname", user.fullname);
          sessionStorage.setItem("id", user.id);
          sessionStorage.setItem("avatar", user.avatar);

          setTimeout(() => {
            toast.update(idToast, {
              render: "Đăng nhập thành công",
              type: "success",
              isLoading: false,
              autoClose: 5000,
              closeButton: true,
            });
            if (user.role && user.role.id === 1) {
              navigate("/admin");
            } else {
              navigate("/");
            }
          }, 500);
        } else {
          toast.error(res.data.message || "Đăng nhập thất bại");
        }
      } catch (error) {
        toast.update(idToast, {
          render:
            "Đăng nhập thất bại: " +
            (error.response ? error.response.data.message : error.message),
          type: "error",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });
      }
    }
  };

  const validate = () => {
    if (email === "" || password === "") {
      toast.warning("Hãy nhập đầy đủ thông tin");
      return false;
    }
    return true;
  };

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
      <a href="/formForgetPassword" style={{ textDecoration: "none" }}>
        Quên mật khẩu?
      </a>
      <button type="submit" className="button">
        Đăng nhập
      </button>
    </form>
  );
};

export default Login;
