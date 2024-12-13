import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import axios from "../../Localhost/Custumize-axios";
import { Link, Route, Routes } from "react-router-dom";
import Info from "./Info";
import ChangePass from "./ChangePassword/ChangePass";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ShippingList from "../../components/Shipping/ShippingList";
import "./UserInfoStyle.css";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  useTheme,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const UserInfo = () => {
  const [fill, setFill] = useState([]);
  const [password, setPassword] = useState("");
  const [isChangePassClicked, setIsChangePassClicked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const changeLink = useNavigate();
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const id = user.id;
  const [checkPassword, setCheckPsasword] = useState({
    password: "",
  });

  const theme = useTheme();

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await axios.get(`userProFile/${id}`);
        setFill(res.data);

        const resUser = await axios.get(`userProFile/${id}`);
        setCheckPsasword(resUser.data.password);
        // console.log(checkPassword);
      } catch (error) {
        console.log(error);
        toast.error(
          error.response ? error.response.data.message : error.message
        );
      }
    };
    loadData();
  }, [id, checkPassword]);

  const onClickChangePass = async (e) => {
    e.preventDefault();
    if (password === "") {
      toast.error("Vui lòng nhập mật khẩu ");
      return;
    }
    try {
      // Gọi API xác thực mật khẩu (nếu có)
      const res = await axios.post("checkPass", { password, id });
      toast.success("Truy cập thành công");
      setIsChangePassClicked(true);
      changeLink("changePass");
      const modalElement = document.getElementById("exampleModal");
      if (modalElement) {
        const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
      }
    } catch (error) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <Header />
      <div className="container">
        <div className="mx-2">
          <ul
            className="mx-3"
            style={{ listStyleType: "none", paddingLeft: "20px" }}
          >
            <li className="mb-2">
              {isChangePassClicked ? (
                <span className="text-muted">Đổi mật khẩu</span>
              ) : checkPassword === null ? (
                <Link type="button" className="text-primary" to={"changePass"}>
                  Đổi mật khẩu
                </Link>
              ) : (
                <>
                  {/* <span
                          type="button"
                          className="text-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          Đổi mật khẩu
                        </span> */}
                  <div
                    className="modal fade"
                    id="exampleModal"
                    tabIndex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered">
                      <div
                        className={`modal-content ${
                          theme.palette.mode === "light"
                            ? "bg-white"
                            : "bg-dark"
                        }`}
                      >
                        <div className="modal-header">
                          <h1
                            className="modal-title fs-5"
                            id="exampleModalLabel"
                          >
                            Xác minh tài khoản trước khi thực hiện
                          </h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <form onSubmit={onClickChangePass}>
                          <div className="modal-body">
                            <FormControl
                              sx={{ m: 1, width: "100%" }}
                              variant="outlined"
                            >
                              <InputLabel htmlFor="outlined-adornment-password">
                                Nhập mật khẩu của bạn
                              </InputLabel>
                              <OutlinedInput
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="outlined-adornment-password"
                                type={showPassword ? "text" : "password"}
                                endAdornment={
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={handleClickShowPassword}
                                      onMouseDown={handleMouseDownPassword}
                                      onMouseUp={handleMouseUpPassword}
                                      edge="end"
                                    >
                                      {showPassword ? (
                                        <VisibilityOff />
                                      ) : (
                                        <Visibility />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                }
                                label="Nhập mật khẩu của bạn"
                              />
                            </FormControl>
                          </div>
                          <div className="modal-footer">
                            <Button
                              variant="contained"
                              id="btn-checkPass"
                              type="submit"
                              disableElevation
                            >
                              Xác nhận
                            </Button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </li>
          </ul>
        </div>

        <div>
          <Routes>
            <Route path="/" element={<Info />} />
            <Route
              path="changePass"
              element={
                <ChangePass checkStatus={() => setIsChangePassClicked(false)} />
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
