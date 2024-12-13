import React, { useEffect, useState } from "react";
import axios from "../../../Localhost/Custumize-axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./ChangePassStyle.css";
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import Header from "../../../components/Header/Header";

const ChangePass = ({ checkStatus }) => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const changeLink = useNavigate();
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [showPasswordConfig, setNewShowPasswordConfig] = useState(false);
  const [formPass, setFormPass] = useState({
    fullname: "",
    password: "",
    email: "",
    birthdate: "",
    role: "",
    address: "",
    phone: "",
    gender: true,
    avatar: "",
  });

  const [newPass, setNewPass] = useState("");
  const [configPass, setConfigPass] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await axios.get(`userProFile/${user.id}`);
        setFormPass(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    loadData();
  }, [user.id]);

  const validate = () => {
    const patternPassword = /^(?=.*[a-zA-Z]).{8,}$/;

    if (!newPass || !configPass) {
      toast.warning("Vui lòng nhập toàn bộ thông tin");
      return false;
    }

    if (newPass === "") {
      toast.warning("Vui lòng nhập mật khẩu mới");
      return false;
    } else if (newPass.length < 8 || !patternPassword.test(newPass)) {
      toast.warning(
        "Mật khẩu phải chứa ít nhất 8 ký tự bao gồm chữ hoa hoặc thường"
      );
      return false;
    }

    if (newPass !== configPass) {
      toast.warning("Xác thực mật khẩu không khớp");
      return false;
    }

    return true;
  };

  const handleChangePass = async (e) => {
    e.preventDefault();
    if (validate()) {
      const formData = new FormData();
      formData.append(
        "user",
        JSON.stringify({
          fullname: formPass.fullname,
          email: formPass.email,
          birthdate: formPass.birthdate,
          phone: formPass.phone,
          gender: formPass.gender,
          password: newPass, // Sử dụng mật khẩu mới
          role: {
            id: formPass.role.id,
          },
          address: formPass.address,
          avatar: formPass.avatar,
        })
      );

      if (formPass.avatar instanceof File) {
        formData.append("avatar", formPass.avatar);
      }
      const idToast = toast.loading("Vui lòng chờ...");
      try {
        const res = await axios.put(`/user/${user.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.update(idToast, {
          render: "Cập nhật thông tin thành công",
          type: "success",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });
        const userInfo = {
          id: res.data.id,
          fullname: res.data.fullname,
          avatar: res.data.avatar,
        };
        localStorage.setItem("user", JSON.stringify(userInfo));
        if (checkStatus) {
          checkStatus();
        }
        changeLink("/admin/info");
      } catch (error) {
        toast.update(idToast, {
          render: "Có lỗi xảy ra khi cập nhật hồ sơ",
          type: "error",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });
        console.error(error.response ? error.response.data : error.message);
      }
    }
  };

  //Mật khẩu mới
  const handleClickShowPasswordNew = () => setShowPasswordNew((show) => !show);

  const handleMouseDownPasswordNew = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPasswordNew = (event) => {
    event.preventDefault();
  };

  //Xác nhận mật khẩu mới
  const handleClickShowPasswordNewConfig = () =>
    setNewShowPasswordConfig((show) => !show);

  const handleMouseDownPasswordNewConfig = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPasswordNewConfig = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Header />
      <Box
        className="rounded-4 container-lg mt-4"
        sx={{ backgroundColor: "backgroundElement.children" }}
      >
        <h3 className="text-center p-2">Đổi mật khẩu</h3>
        <hr />
        <form onSubmit={handleChangePass}>
          <div className="offset-3 col-6">
            <div className="mb-3">
              <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-passwordNew">
                  Nhập mật khẩu mới
                </InputLabel>
                <OutlinedInput
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  id="outlined-adornment-passwordNew"
                  type={showPasswordNew ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPasswordNew}
                        onMouseDown={handleMouseDownPasswordNew}
                        onMouseUp={handleMouseUpPasswordNew}
                        edge="end"
                      >
                        {showPasswordNew ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Nhập mật khẩu mới"
                />
              </FormControl>
              {/* <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="form-control"
              placeholder="Mật khẩu mới"
            /> */}
            </div>
            <div className="mb-3">
              <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-passwordConfig">
                  Xác nhận khẩu mới
                </InputLabel>
                <OutlinedInput
                  value={configPass}
                  onChange={(e) => setConfigPass(e.target.value)}
                  id="outlined-adornment-passwordConfig"
                  type={showPasswordConfig ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPasswordNewConfig}
                        onMouseDown={handleMouseDownPasswordNewConfig}
                        onMouseUp={handleMouseUpPasswordNewConfig}
                        edge="end"
                      >
                        {showPasswordConfig ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Xác nhận khẩu mới"
                />
              </FormControl>
              {/* <input
              type="password"
              value={configPass}
              onChange={(e) => setConfigPass(e.target.value)}
              className="form-control"
              placeholder="Xác nhận khẩu mới"
            /> */}
            </div>
            <button className="btn mb-4 mx-2" id="btn-changePass">
              Xác nhận
            </button>
          </div>
        </form>
      </Box>
    </>
  );
};

export default ChangePass;
