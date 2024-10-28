import React, { useEffect, useState } from "react";
import "./HeaderStyle.css";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import axios from "../../Localhost/Custumize-axios";
import { Button, Menu, MenuItem } from "@mui/material";
import { Divider } from "antd";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const Header = () => {
  const geturlIMG = (idUser, filename) => {
    return `${axios.defaults.baseURL}files/user/${idUser}/${filename}`;
  };
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const [countOrder, setCountOrder] = useState(0);
  const [count, setCount] = useState(0);
  const changeLink = useNavigate();
  const idSotre = sessionStorage.getItem("idStore");

  useEffect(() => {
    const count = async () => {
      try {
        const res = await axios.get(`/countCartIdUser/${user.id}`);
        setCount(res.data.length);
        console.log(res.data.length);
      } catch (error) {
        console.log(error);
      }
    };
    const countOrders = async () => {
      try {
        const res = await axios.get(`checkOrder/${idSotre}`);
        setCountOrder(res.data.length);
        console.log(res.data.length);
      } catch (error) {
        console.log("Error fetching new orders:", error);
      }
    };
    countOrders(idSotre);
    count();
  }, [user.id, idSotre]);

  const handleLogOut = () => {
    confirmAlert({
      title: "Đăng xuất tài khoản",
      message: "Bạn chắc chắn muốn đăng xuất?",
      buttons: [
        {
          label: "Có",
          onClick: () => {
            const toastId = toast.loading("Vui lòng chờ...");
            setTimeout(() => {
              toast.update(toastId, {
                render: "Đăng xuất thành công",
                type: "success",
                isLoading: false,
                autoClose: 5000,
                closeButton: true,
              });
              localStorage.clear();
              sessionStorage.clear();
              changeLink("/");
            }, 500);
          },
        },
        {
          label: "Không",
        },
      ],
    });
  };

  const CallAPICheckUserId = async (id) => {
    try {
      const res = await axios.get(`store/checkIdUser/${id}`);
      return res.data.exists; // Lấy giá trị exists từ phản hồi
    } catch (error) {
      console.log("Error ", error);
      return false;
    }
  };

  const checkUserId = async (e) => {
    e.preventDefault();
    if (user.id === "" || user.id === undefined) {
      confirmAlert({
        title: "Bạn đã đăng nhập chưa?",
        message: "Hãy đăng nhập để có trải nghiệm tuyệt vời hơn",
        buttons: [
          {
            label: "Có",
            onClick: () => {
              const toastId = toast.loading("Vui lòng chờ...");
              setTimeout(() => {
                toast.update(toastId, {
                  render: "Chuyển hướng đến trang đăng nhập",
                  type: "info",
                  isLoading: false,
                  autoClose: 2000,
                  closeButton: true,
                });
                changeLink("/login");
              }, 500);
            },
          },
          {
            label: "Không",
          },
        ],
      });
    } else {
      const check = await CallAPICheckUserId(user.id);
      if (check) {
        changeLink("/profileMarket");
      } else {
        changeLink("/market");
      }
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenuUser = Boolean(anchorEl);
  const handleClickMenuUser = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenuUser = () => {
    setAnchorEl(null);
  };

  return (
    <div className="container-fluid sticky-top" >
      <div className="row align-items-center justify-content-between shadow " id="nav">
        <div className="col-lg-3 col-md-3 col-sm-3 d-flex justify-content-start mb-3">
          <div className="d-flex align-items-center">
            <Link to={"/profileMarket"}>
              <img
                src="/images/logoWeb.png"
                alt=""
                className=""
                id="img-logo"
              />
            </Link>
            <h1
              id="title-web"
              className="fw-bold fst-italic mt-2"
              style={{ marginLeft: "30px" }}
            >
              P E R W A T T
            </h1>
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end">
          <div className="d-flex align-items-center border-end me-3 ">
            <Link
              type="button"
              className="btn btn-icon position-relative rounded-3 me-3"
              to={"/"}
            >
              <i class="bi bi-houses fs-4"></i>
            </Link>
            <Link
              type="button"
              className="btn btn-icon position-relative rounded-3 me-3"
              to={"/cart"}
            >
              <i className="bi bi-cart4 fs-4"></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {count}
              </span>
            </Link>
            <Link
              onClick={checkUserId}
              type="button"
              className="btn btn-icon btn-sm rounded-3 me-3"
              to={""}
            >
              <i class="bi bi-gear fs-4"></i>
            </Link>
            <Link
              type="button"
              className="btn btn-icon btn-sm  position-relative rounded-3 me-3"
              to={"/notifications"}
            >
              <i className="bi bi-bell fs-4"></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {countOrder}
              </span>
            </Link>
          </div>
          {user ? (
            <div
              className="d-flex justify-content-center align-items-center mt-2 rounded-2"
              style={{ border: "1px solid" }}
            >
              <Button
                id="basic-button"
                aria-controls={openMenuUser ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openMenuUser ? "true" : undefined}
                onClick={handleClickMenuUser}
                variant="text"
                sx={{
                  color: "black",
                }}
              >
                <img
                  src={geturlIMG(user.id, user.avatar)}
                  alt=""
                  className="rounded-circle img-fluid"
                  style={{ width: "30px", height: "30px" }}
                />
                <span className="ms-2">
                  {user.fullname}
                  <ArrowDropDownIcon fontSize="small" />
                </span>
              </Button>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={openMenuUser}
                onClose={handleCloseMenuUser}
                onClick={handleCloseMenuUser}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      width: 200,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  },
                }}
                disableScrollLock 
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={handleCloseMenuUser}>
                  <Link className="text-dark " to={"/user"}>
                    <img
                      src={geturlIMG(user.id, user.avatar)}
                      alt=""
                      className="rounded-circle img-fluid"
                      style={{ width: "20px", height: "20px" }}
                    />{" "}
                    <span>Hồ sơ của tôi</span>
                  </Link>
                </MenuItem>
                <Divider className="m-1 p-1" />
                <MenuItem onClick={handleCloseMenuUser}>
                  <Link
                    className="dropdown-item text-danger"
                    onClick={handleLogOut}
                  >
                    Đăng xuất
                  </Link>
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <div className="mt-2">
              <Link
                type="button"
                className="btn btn-register btn-sm me-3"
                to={"/login"}
                style={{ width: "90px", height: "30px" }}
              >
                Đăng ký
              </Link>
              <Link
                type="button"
                className="btn btn-login btn-sm"
                to={"/login"}
                style={{ width: "95px", height: "30px" }}
              >
                Đăng nhập
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Header;
