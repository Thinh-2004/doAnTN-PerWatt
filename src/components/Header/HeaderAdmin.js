import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../Localhost/Custumize-axios";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { Button } from "@mui/material";

const HeaderAdmin = () => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const changeLink = useNavigate();
  const geturlIMG = (idUser, filename) => {
    return `${axios.defaults.baseURL}files/user/${idUser}/${filename}`;
  };
  const handleLogOut = () => {
    confirmAlert({
      title: "Đăng xuất tài khoản",
      message: "Bạn chắc chắn muốn đăng xuất?",
      buttons: [
        {
          label: "Có",
          onClick: async () => {
            const toastId = toast.loading("Vui lòng chờ...");
            try {
              setTimeout(() => {
                toast.update(toastId, {
                  render: "Đăng xuất thành công",
                  type: "success",
                  isLoading: false,
                  autoClose: 5000,
                  closeButton: true,
                });
                localStorage.clear();
                sessionStorage.clear(); // Xóa giá trị idStore từ session
                changeLink("/"); // Chuyển hướng về trang chủ
              }, 500);
            } catch (error) {
              toast.update(toastId, {
                render: "Đăng xuất thất bại",
                type: "error",
                isLoading: false,
                autoClose: 5000,
                closeButton: true,
              });
            }
          },
        },
        {
          label: "Không",
        },
      ],
    });
  };
  return (
    <div
      className="d-flex justify-content-between shadow sticky-top container-fluid"
      id="nav"
    >
      <div className="d-flex align-items-center">
        <Link to={"/profileMarket"}>
          <img src="/images/logoWeb.png" alt="" className="" id="img-logo" />
        </Link>
        <h1
          id="title-web"
          className="fw-bold fst-italic mt-2"
          style={{ marginLeft: "30px" }}
        >
          P E R W A T T
        </h1>
      </div>
      <div className="align-content-center m-3">
        <div className="d-flex align-items-center">
          <div className="mx-4 border-end">
            <Link
              type="button"
              className="btn btn-icon position-relative rounded-4 me-3"
              to={"/admin/info"}
            >
              Hồ sơ của tôi
            </Link>
            <Link
              type="button"
              className="btn btn-icon btn-sm rounded-4 me-3"
              id="btn-logOut"
              onClick={handleLogOut}
            >
              Đăng xuất
            </Link>
          </div>
          <div className="d-flex justify-content-center align-items-center mt-2 ">
            <div className="p-1 rounded-3" style={{border : "1px solid"}}>
              <img
                src={geturlIMG(user.id, user.avatar)}
                alt=""
                className="rounded-circle img-fluid"
                style={{ width: "30px", height: "30px" }}
              />
              <span className="ms-2">{user.fullname}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderAdmin;
