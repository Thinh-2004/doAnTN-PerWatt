import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const id = toast.loading("Vui lòng chờ...");
      try {
        const res = await axios.get(`http://localhost:8080/user/${email}`);
        if (res.data.password !== password) {
          toast.update(id, {
            render: "Mật khẩu không đúng",
            type: "error",
            isLoading: false,
            autoClose: 5000,
            closeButton: true,
          });
        } else {
          if (res.data.role.id === 1) {
            setTimeout(() => {
              toast.update(id, {
                render: "Đăng nhập thành công",
                type: "success",
                isLoading: false,
                autoClose: 5000,
                closeButton: true,
              });
              navigate("/admin");
            }, 2000); // Thời gian chờ là 2000ms (2 giây)
          } else {
            setTimeout(() => {
              toast.update(id, {
                render: "Đăng nhập thành công",
                type: "success",
                isLoading: false,
                autoClose: 5000,
                closeButton: true,
              });
              navigate("/");
            }, 2000); // Thời gian chờ là 2000ms (2 giây)
          }
          sessionStorage.setItem("fullname", res.data.fullname);
          sessionStorage.setItem("email", res.data.email);
          console.log("Session stored: ", res.data.fullname);
          console.log("Session stored: ", res.data.email); // Kiểm tra giá trị username
        }
      } catch (error) {
        toast.dismiss(id);
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
        <a href="#" style={{ textDecoration: "none" }}>
          Quên mật khẩu?
        </a>
        <button type="submit" className="button">
          Đăng nhập
        </button>
      </form>
    </>
  );
};

export default Login;
