import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../Localhost/Custumize-axios";
import useSession from "../../Session/useSession";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";

const HeaderAdmin = () => {
  const [fullName, removeFullName] = useSession("fullname");
  const [avatar, removeAvatar] = useSession("avatar");
  const [id, removeId] = useSession("id");
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
              removeFullName(); // Xóa giá trị fullname từ session
              removeAvatar(); // Xóa giá trị avatar từ session
              removeId(); // Xóa giá trị id từ session
              sessionStorage.removeItem("idStore"); // Xóa giá trị idStore từ session
              setTimeout(() => {
                toast.update(toastId, {
                  render: "Đăng xuất thành công",
                  type: "success",
                  isLoading: false,
                  autoClose: 5000,
                  closeButton: true,
                });

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
      <div className="d-flex">
        <Link to={"/"}>
          <img src="/images/logoWeb.png" alt="" className="" id="img-logo" />
        </Link>
        <div className="d-flex align-items-center"><h2>Giao diện Admin</h2></div>
      </div>
      <div className="align-content-center m-3">
        <div className="d-flex">
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
            <div className="dropdown">
              <button
                className="p-1 btn btn-lg d-flex p-0 align-items-center "
                type="button"
                id="btn-sessionUser"
              >
                <img
                  src={geturlIMG(id, avatar)}
                  alt=""
                  className="rounded-circle img-fluid"
                  style={{ width: "30px", height: "30px" }}
                />
                <span className="ms-2">{fullName}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderAdmin;
