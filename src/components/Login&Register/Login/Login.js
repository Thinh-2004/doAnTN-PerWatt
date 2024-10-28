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
import { GoogleLogin } from "@react-oauth/google";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const navigate = useNavigate();

  const searchStoreByidUser = async (isUser) => {
    const searchStoreById = await axios.get(`searchStore/${isUser}`);
    if (searchStoreById === null) {
      console.log("chưa có cửa hàng");
    } else {
      localStorage.setItem("idStore", searchStoreById.data.id);
      sessionStorage.setItem("idStore", searchStoreById.data.id);
    }
  };

  const saveTimeNow = () => {
    const loginTime = new Date().getTime(); //Lấy time hiện tại đăng nhập
    localStorage.setItem("loginTime", loginTime); // lưu vào localStorage
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      const idToast = toast.loading("Vui lòng chờ...");
      try {
        const res = await axios.post("/login", { email, password });
        if (res.status === 200) {
          const { user } = res.data;
          //Lọc các thông tin cần lưu
          const userInfo = {
            id: user.id,
            fullname: user.fullname,
            avatar: user.avatar,
          };

          // Lưu thông tin vào sessionStorage
          localStorage.setItem("user", JSON.stringify(userInfo));

          //Tìm id Store
          searchStoreByidUser(user.id);

          //Lưu time khi login
          saveTimeNow();
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

  const handleLoginByGoogle = async (res) => {
    // console.log(res);
    const idToast = toast.loading("Vui lòng chờ...");
    try {
      // Gửi token đến backend xử lý
      const response = await axios.post("/loginByGoogle", {
        token: res.credential,
      });

      // Xử lý phản hồi từ backend
      if (response.status === 200) {
        const user = response.data;
        //Lọc các thông tin cần lưu
        const userInfo = {
          id: user.id,
          fullname: user.fullname,
          avatar: user.avatar,
        };

        // Lưu thông tin vào sessionStorage
        localStorage.setItem("user", JSON.stringify(userInfo));
        //Lưu idStore
        searchStoreByidUser(user.id);
        //Lưu time khi login
        saveTimeNow();
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
        toast.update(idToast, {
          render: "Đăng nhập thất bại, vui lòng thử lại sau",
          type: "error",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });
      }
    } catch (error) {
      console.log(error);
      toast.update(idToast, {
        render: "Đăng nhập thất bại, vui lòng thử lại sau",
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="form-sign">
        <h2 className="title">Đăng nhập</h2>
        <p className="subject">
          Hãy đăng nhập để có trải nghiệm dịch vụ tốt nhất!!!
        </p>
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
        <Link to={"/forgotPass"} className="text-end">
          <span htmlFor="">Quên mật khẩu?</span>
        </Link>
        <button type="submit" className="button w-100">
          Đăng nhập
        </button>
        <div>
          <label htmlFor="">
            &#8212;&#8212;&#8212;&#8212;&#8212;Hoặc&#8212;&#8212;&#8212;&#8212;&#8212;
          </label>
          <div className="mt-2">
            <GoogleLogin
              onSuccess={handleLoginByGoogle}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default Login;
