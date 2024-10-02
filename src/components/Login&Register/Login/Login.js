import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../../../Localhost/Custumize-axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // Hàm tìm kiếm cửa hàng theo ID người dùng
  const searchStoreByidUser = async (isUser) => {
    try {
      const searchStoreById = await axios.get(`searchStore/${isUser}`);
      if (searchStoreById.data === null) {
        console.log("chưa có cửa hàng");
      } else {
        // Lưu idStore vào localStorage và sessionStorage
        localStorage.setItem("idStore", searchStoreById.data.id);
        sessionStorage.setItem("idStore", searchStoreById.data.id);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm cửa hàng:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      const idToast = toast.loading("Vui lòng chờ...");
      try {
        const res = await axios.post("/login", { email, password });
        if (res.status === 200) {
          const { user } = res.data;

          // Lọc các thông tin cần lưu
          const userInfo = {
            id: user.id,
            fullname: user.fullname,
            avatar: user.avatar,
          };

          // Lưu thông tin vào sessionStorage
          sessionStorage.setItem("fullname", user.fullname);
          sessionStorage.setItem("id", user.id);
          sessionStorage.setItem("avatar", user.avatar);

          // Lưu thông tin vào localStorage
          localStorage.setItem("user", JSON.stringify(userInfo));

          // Tìm kiếm cửa hàng của người dùng theo ID
          await searchStoreByidUser(user.id);

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
      <ToastContainer />
    </>
  );
};

export default Login;
