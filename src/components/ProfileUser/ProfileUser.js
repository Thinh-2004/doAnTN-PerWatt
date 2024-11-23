import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import axios from "../../Localhost/Custumize-axios";
import { Link, Route, Routes } from "react-router-dom";
import Profile from "./Profile/Profile";
import ChangePass from "./ChangePassword/ChangePass";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ShippingList from "../Shipping/ShippingList";
import "./ProfileUserStyle.css";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  useTheme,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import WarehouseVoucherUser from "./WarehouseVoucherUser/WarehouseVoucherUser";

const ProfileUser = () => {
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

  const geturlIMG = (idUser, filename) => {
    return `${axios.defaults.baseURL}files/user/${idUser}/${filename}`;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await axios.get(`/userProFile/myInfo`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("hadfjkdshf")}`,
          },
        });
        setFill(res.data);

        const resUser = await axios.get(`/userProFile/myInfo`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("hadfjkdshf")}`,
          },
        });
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
      const res = await axios.post(
        "checkPass",
        { password, id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("hadfjkdshf")}`,
          },
        }
      );
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
      <div className="container-lg">
        <div className="row">
          <div className="col-lg-3 mt-4">
            <Box
              className="rounded-4 p-2"
              sx={{ backgroundColor: "backgroundElement.children" }}
            >
              <div className="d-flex justify-content-center align-items-center mt-2">
                <img
                  src={geturlIMG(fill.id, fill.avatar)}
                  alt=""
                  style={{ width: "70px", height: "70px", borderRadius: "50%" }}
                />
                <label htmlFor="" className="mt-3 mx-3">
                  {fill.fullname}
                </label>
              </div>
              <span>
                <hr />
              </span>
              <div className="mx-2">
                <i className="bi bi-person-fill fs-3 text-primary me-2"></i>
                <label htmlFor="" className="fs-5">
                  Hồ sơ cá nhân của tôi
                </label>
                <ul
                  className="mx-3"
                  style={{ listStyleType: "none", paddingLeft: "20px" }}
                >
                  <li className="mb-2">
                    <Link className="text-decoration-none" to="/user">
                      Hồ sơ
                    </Link>
                  </li>
                  <li className="mb-2">
                    {isChangePassClicked ? (
                      <span className="text-muted">Đổi mật khẩu</span>
                    ) : checkPassword === null ? (
                      <Link
                        type="button"
                        className="text-primary"
                        to={"changePass"}
                      >
                        Đổi mật khẩu
                      </Link>
                    ) : (
                      <>
                        <span
                          type="button"
                          className="text-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          Đổi mật khẩu
                        </span>
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
                                      onChange={(e) =>
                                        setPassword(e.target.value)
                                      }
                                      id="outlined-adornment-password"
                                      type={showPassword ? "text" : "password"}
                                      endAdornment={
                                        <InputAdornment position="end">
                                          <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={
                                              handleMouseDownPassword
                                            }
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
                  <li className="mb-2">
                    <Link
                      className="text-decoration-none"
                      onClick={() => setIsChangePassClicked(false)}
                    >
                      Quyền riêng tư
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-decoration-none"
                      to={"shippingInfo"}
                      onClick={() => setIsChangePassClicked(false)}
                    >
                      Địa chỉ nhận hàng
                    </Link>
                  </li>
                </ul>
              </div>
              <Link
                className="mx-2 text-decoration-none"
                to={"/order"}
                onClick={() => setIsChangePassClicked(false)}
              >
                <i className="bi bi-receipt fs-3 text-warning me-2"></i>
                <span
                  className={`${
                    theme.palette.mode === "light" ? "text-dark" : "text-white"
                  }`}
                >
                  Đơn mua
                </span>
              </Link>
              <div className="">
                <Link
                  className="mx-2 text-decoration-none"
                  onClick={() => setIsChangePassClicked(false)}
                  to={`warehouse/voucher`}
                >
                  <i className="bi bi-ticket-perforated fs-3 text-danger me-2"></i>
                  <span
                    className={`${
                      theme.palette.mode === "light"
                        ? "text-dark"
                        : "text-white"
                    }`}
                  >
                    Kho Voucher của tôi
                  </span>
                </Link>
              </div>
            </Box>
          </div>
          <div className="col-lg-9 mt-4">
            <Routes>
              <Route path="/" element={<Profile />} />
              <Route
                path="changePass"
                element={
                  <ChangePass
                    checkStatus={() => setIsChangePassClicked(false)}
                  />
                }
              />
              <Route path="/shippingInfo" element={<ShippingList />} />
              <Route
                path="/warehouse/voucher"
                element={<WarehouseVoucherUser />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUser;
