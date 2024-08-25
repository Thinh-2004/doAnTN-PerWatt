import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../../../Localhost/Custumize-axios";
import {
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);

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

 

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="form-sign">
        <h2 className="title">Đăng nhập</h2>
        <p className="subject">Hãy đăng nhập để có trải nghiệm dịch vụ tốt nhất!!!</p>
        <TextField
          fullWidth
          className="mb-3"
          id="standard-basic"
          label="Nhập email"
          variant="standard"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormControl
          sx={{ m: 1, width: "100%" }}
          variant="standard"
          className="mb-3"
        >
          <InputLabel htmlFor="standard-adornment-password">
            Nhập mật khẩu
          </InputLabel>
          <Input
            id="standard-adornment-password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        {/* <input
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
        /> */}
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
