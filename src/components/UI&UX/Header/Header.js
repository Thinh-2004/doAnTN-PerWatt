import React from "react";
import "./HeaderStyle.css";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import useSession from "../../../Session/useSession";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert"; // Import thư viện confirm-alert
import "react-confirm-alert/src/react-confirm-alert.css"; // Import CSS cho confirm-alert

const Header = () => {
  const [fullName, setFullName, removeFullName] = useSession("fullname");

  const handleLogOut = () => {
    // Hiển thị hộp thoại xác nhận
    confirmAlert({
      title: "Đăng xuất tài khoản",
      message: "Bạn chắc chắn muốn đăng xuất?",
      buttons: [
        {
          label: "Có",
          onClick: () => {
            // Hiển thị thông báo đang tải
            const id = toast.loading("Vui lòng chờ...");
            setTimeout(() => {
              toast.update(id, {
                render: "Đăng xuất thành công",
                type: "success",
                isLoading: false,
                autoClose: 5000,
                closeButton: true,
              });
              removeFullName();
            }, 2000);
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
        <div className="align-content-center">
          <form className="d-flex" role="search">
            <input
              className="form-control rounded-start-4"
              type="search"
              placeholder="Bạn cần tìm gì"
              aria-label="Search"
              style={{ width: "400px" }}
            />
            <button className="btn btn-outline-primary rounded-end-4 mx-2">
              <i className="bi bi-mic"></i>
            </button>
          </form>
        </div>
      </div>
      <div className="align-content-center m-3">
        <div className="d-flex">
          <div className="mx-3">
            <Link
              type="button"
              className="btn btn-icon position-relative rounded-4"
              to={"/cart"}
            >
              <i className="bi bi-cart4 fs-4"></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                99+
              </span>
            </Link>
            <Link
              type="button"
              className="btn btn-icon btn-sm mx-3 rounded-4"
              to={"/market"}
            >
              <i className="bi bi-shop fs-4"></i>
            </Link>
            <Link
              type="button"
              className="btn btn-icon btn-sm rounded-4"
              to={"/login"}
            >
              <i className="bi bi-bell fs-4"></i>
            </Link>
          </div>
          {fullName ? (
            <div className="d-flex justify-content-center align-items-center mt-2">
              <div className="dropdown">
                <button
                  className="p-1 btn btn-lg d-flex p-0 align-items-center dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  id="btn-sessionUser"
                >
                  <img
                    src="https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg"
                    alt=""
                    className="rounded-circle img-fluid"
                    style={{ width: "30px", height: "30px" }}
                  />
                  <span className="ms-2">{fullName}</span>
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" href="#">
                      Hồ sơ của tôi
                    </Link>
                  </li>
                  <li>
                    <hr className="p-0 m-2" />
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to={"/"}
                      onClick={handleLogOut}
                    >
                      Đăng xuất
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="border-start mt-2">
              <Link
                type="button"
                className="btn btn-register btn-sm mx-3"
                to={"/login"}
              >
                Đăng ký
              </Link>
              <Link
                type="button"
                className="btn btn-login btn-sm"
                to={"/login"}
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
