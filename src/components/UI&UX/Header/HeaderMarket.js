import React, { useEffect, useState } from "react";
import "./HeaderStyle.css";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import useSession from "../../../Session/useSession";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import axios from "../../../Localhost/Custumize-axios";

const Header = () => {
  const geturlIMG = (idUser, filename) => {
    return `${axios.defaults.baseURL}files/user/${idUser}/${filename}`;
  };
  const [fullName, , removeFullName] = useSession("fullname");
  const [avatar, , removeAvatar] = useSession("avatar");
  const [id, , removeId] = useSession("id");
  const [count, setCount] = useState(0);
  const changeLink = useNavigate();

  useEffect(() => {
    const count = async (id) => {
      try {
        const res = await axios.get(`/countCartIdUser/${id}`);
        setCount(res.data.length);
        console.log(res.data.length);
      } catch (error) {
        console.log(error);
      }
    };
    count(id);
  }, [id]);

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
              removeFullName();
              removeAvatar();
              removeId();
              sessionStorage.removeItem("idStore");
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
    if (id === "" || id === undefined) {
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
      const check = await CallAPICheckUserId(id);
      if (check) {
        changeLink("/profileMarket");
      } else {
        changeLink("/market");
      }
    }
  };

  return (
    <div
      className="d-flex justify-content-between shadow sticky-top container-fluid"
      id="nav"
    >
      <div className="d-flex">
        <Link to={"/profileMarket"}>
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
          <div className="mx-4 border-end">
            <Link
              type="button"
              className="btn btn-icon position-relative rounded-4 me-3"
              to={"/"}
            >
              <i class="bi bi-houses fs-4"></i>
            </Link>
            <Link
              type="button"
              className="btn btn-icon position-relative rounded-4"
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
              className="btn btn-icon btn-sm mx-3 rounded-4"
              to={""}
            >
              <i class="bi bi-gear fs-4"></i>
            </Link>
            <Link
              type="button"
              className="btn btn-icon btn-sm rounded-4 me-3"
              to={"/login"}
            >
              <i className="bi bi-bell fs-4"></i>
            </Link>
          </div>
          {fullName ? (
            <div className="d-flex justify-content-center align-items-center mt-2 ">
              <div className="dropdown">
                <button
                  className="p-1 btn btn-lg d-flex p-0 align-items-center dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
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
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to={"/user"}>
                      Hồ sơ của tôi
                    </Link>
                  </li>
                  <li>
                    <hr className="p-0 m-2" />
                  </li>
                  <li>
                    <Link className="dropdown-item" onClick={handleLogOut}>
                      Đăng xuất
                    </Link>
                  </li>
                </ul>
              </div>
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
