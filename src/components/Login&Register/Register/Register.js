import {
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import axios from "../../../Localhost/Custumize-axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom";

const Register = ({ onRegisterSuccess }) => {
  const [formUser, setFormUser] = useState({
    fullname: "",
    password: "",
    email: "",
    birthdate: "",
    gender: "",
    role: 3, // Vai trò buyer
    address: "",
    phone: "",
    configPassWord: "",
    check: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfig, setShowPasswordConfig] = React.useState(false);
  const [isFocusedPass, setIsFocusedPass] = useState(false);
  const [isFocusedPassCofig, setIsFocusedPassCofig] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const {
      fullname,
      password,
      email,
      birthdate,
      gender,
      address,
      phone,
      configPassWord,
      check,
    } = formUser;

    const pattentEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pattentPhone = /0[0-9]{9}/;
    const patternPassword = /^(?=.*[a-zA-Z]).{8,}$/;

    if (
      !fullname &&
      !password &&
      !email &&
      !birthdate &&
      !gender &&
      !address &&
      !phone &&
      !check
    ) {
      toast.warning("Cần nhập toàn bộ thông tin");
      return false;
    } else {
      if (!fullname) {
        toast.warning("Hãy nhập họ và tên");
        return false;
      }

      if (!email) {
        toast.warning("Hãy nhập email");
        return false;
      } else if (!pattentEmail.test(email)) {
        toast.warning("Email sai định dạng");
        return false;
      }

      if (!gender) {
        toast.warning("Hãy chọn giới tính");
        return false;
      }

      if (!birthdate) {
        toast.warning("Hãy nhập ngày sinh");
        return false;
      } else {
        const today = new Date();
        const birthDate = new Date(birthdate);
        const age = today.getFullYear() - birthDate.getFullYear();
        if (birthDate > today) {
          toast.warning("Ngày sinh không thể lớn hơn hoặc bằng ngày hiện tại");
          return false;
        } else if (age > 100 || age === 100) {
          toast.warning("Tuổi không hợp lệ");
          return false;
        }
      }

      if (!phone) {
        toast.warning("Hãy nhập số điện thoại");
        return false;
      } else if (!pattentPhone.test(phone)) {
        toast.warning("Số điện thoại không hợp lệ");
        return false;
      }

      if (!password) {
        toast.warning("Hãy nhập mật khẩu");
        return false;
      } else if (password.length < 8 || !patternPassword.test(password)) {
        toast.warning(
          "Mật khẩu phải chứa ít nhất 8 ký tự bao gồm chữ hoa hoặc thường"
        );
        return false;
      }

      if (password !== configPassWord) {
        toast.warning("Xác thực mật khẩu không khớp");
        return false;
      }

      if (!address) {
        toast.warning("Hãy nhập địa chỉ");
        return false;
      }

      if (!check) {
        toast.warning("Bạn chưa chấp nhận điều khoản và dịch vụ của chúng tôi");
        return false;
      }
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (validate()) {
      const id = toast.loading("Vui lòng chờ...");
      try {
        const genderBoolean = formUser.gender === "true";
        const userToSend = {
          fullname: formUser.fullname,
          password: formUser.password,
          email: formUser.email,
          birthdate: formUser.birthdate,
          gender: genderBoolean,
          role: {
            id: formUser.role,
          },
          address: formUser.address,
          phone: formUser.phone,
        };
        const res = await axios.post("/user", userToSend);

        setTimeout(() => {
          toast.update(id, {
            render: "Đăng ký thành công, hệ thống sẽ chuyển sang đăng nhập.",
            type: "success",
            isLoading: false,
            autoClose: 5000,
            closeButton: true,
          });
          if (onRegisterSuccess) {
            onRegisterSuccess();
          }
        }, 2000);
      } catch (error) {
        console.error("Error response:", error.response);
        const errorMessage =
          error.response && error.response.data
            ? error.response.data
            : "Đã xảy ra lỗi, vui lòng thử lại";
        setTimeout(() => {
          toast.update(id, {
            render: `${errorMessage}`,
            type: "error",
            isLoading: false,
            autoClose: 5000,
            closeButton: true,
          });
        }, 2000);
      }
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowPasswordConfig = () =>
    setShowPasswordConfig((show) => !show);

  const handleMouseDownPasswordConfig = (event) => {
    event.preventDefault();
  };
  return (
    <form onSubmit={handleRegister} className="form-sign">
      <h2 className="title">Đăng Ký</h2>
      <div className="row">
        <div className="col-lg-12">
          <div className="mb-3">
            <TextField
              fullWidth
              name="fullname"
              value={formUser.fullname}
              onChange={handleChange}
              id="fullname-basic"
              label="Nhập họ tên"
              variant="standard"
            />
            {/* <input
              type="text"
              name="fullname"
              value={formUser.fullname}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
              className="form-control"
            /> */}
          </div>
          <div className="mb-3">
            <TextField
              fullWidth
              name="email"
              value={formUser.email}
              onChange={handleChange}
              id="email-basic"
              label="Nhập email"
              variant="standard"
            />
            {/* <input
              type="text"
              name="email"
              value={formUser.email}
              onChange={handleChange}
              placeholder="Email"
              className="form-control"
            /> */}
          </div>
          <div className="d-flex justify-content-start">
            <div>
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                id="inlineRadio1"
                value="true"
                checked={formUser.gender === "true"}
                onChange={handleChange}
              />
              <label className="form-check-label mx-2" htmlFor="inlineRadio1">
                Nam
              </label>
            </div>
            <div className="mx-3 mb-3">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                id="inlineRadio2"
                value="false"
                checked={formUser.gender === "false"}
                onChange={handleChange}
              />
              <label className="form-check-label mx-2" htmlFor="inlineRadio2">
                Nữ
              </label>
            </div>
          </div>

          <div className="mb-3">
            <input
              type="date"
              name="birthdate"
              value={formUser.birthdate}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <TextField
              fullWidth
              name="phone"
              value={formUser.phone}
              onChange={handleChange}
              label="Nhập số điện thoại"
              id="phone-basic"
              variant="standard"
            />
            {/* <input
              type="text"
              name="phone"
              value={formUser.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              className="form-control"
            /> */}
          </div>
        </div>
        <div className="col-lg-12">
          <div className="row">
            <div className="col-lg-6">
              <div className="mb-3">
                <FormControl sx={{ m: 1 }} variant="standard" fullWidth>
                  <InputLabel htmlFor="enterPass-adornment-password">
                    Nhập mật khẩu
                  </InputLabel>
                  <Input
                    name="password"
                    value={formUser.password}
                    onChange={handleChange}
                    id="enterPass-adornment-password"
                    type={showPassword ? "text" : "password"}
                    onFocus={() => setIsFocusedPass(true)}
                    onBlur={() => setIsFocusedPass(false)}
                    endAdornment={
                      isFocusedPass && (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  />
                </FormControl>
                {/* <input
                  type="password"
                  name="password"
                  value={formUser.password}
                  onChange={handleChange}
                  placeholder="Mật khẩu"
                  className="form-control"
                /> */}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="mb-3">
                <FormControl sx={{ m: 1 }} variant="standard" fullWidth>
                  <InputLabel htmlFor="enterConfig-adornment-password">
                    Xác thực mật khẩu
                  </InputLabel>
                  <Input
                    onChange={handleChange}
                    value={formUser.configPassWord}
                    name="configPassWord"
                    id="enterConfig-adornment-password"
                    type={showPasswordConfig ? "text" : "password"}
                    onFocus={() => setIsFocusedPassCofig(true)}
                    onBlur={() => setIsFocusedPassCofig(false)}
                    endAdornment={
                      isFocusedPassCofig && (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPasswordConfig}
                            onMouseDown={handleMouseDownPasswordConfig}
                          >
                            {showPasswordConfig ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  />
                </FormControl>
                {/* <input
                  type="password"
                  onChange={handleChange}
                  value={formUser.configPassWord}
                  name="configPassWord"
                  placeholder="Nhập lại mk"
                  className="form-control mb-3"
                /> */}
              </div>
            </div>
          </div>
          <div className="mb-3">
            <TextField
              fullWidth
              name="address"
              value={formUser.address}
              onChange={handleChange}
              id="outlined-multiline-static"
              label="Nhập địa chỉ của bạn"
              multiline
              rows={2}
            />
            {/* <textarea
              name="address"
              value={formUser.address}
              onChange={handleChange}
              className="form-control"
              placeholder="Nhập địa chỉ của bạn"
            ></textarea> */}
          </div>
          <div className="p-0 m-0 d-flex">
            <input
              type="checkbox"
              className="form-check me-2"
              name="check"
              checked={formUser.check}
              onChange={handleChange}
            />
            <label>
              Tôi đồng ý với các <Link>điều khoản</Link> và <Link>dịch vụ</Link>
              .
            </label>
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
