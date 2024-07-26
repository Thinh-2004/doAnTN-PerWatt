import React from "react";
import "./HeaderStyle.css";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
const Header = () => {
  return (
    <div
      className="d-flex justify-content-between shadow sticky-top container-fluid"
      id="nav"
    >
      <div className="d-flex">
        <Link>
          <img src="/images/logoWeb.png" alt="" className="" id="img-logo" />
        </Link>
        <div className="align-content-center">
          <form class="d-flex" role="search">
            <input
              class="form-control rounded-start-4"
              type="search"
              placeholder="Bạn cần tìm gì"
              aria-label="Search"
              style={{ width: "400px" }}
            />
            <button className="btn btn-outline-primary rounded-end-4 mx-2 ">
            <i class="bi bi-mic"></i>
          </button>
          </form>
          
        </div>
      </div>
      <div className="align-content-center m-3">
        <div className="d-flex">
          <div className="mx-3">
            <Link
              type="button"
              class="btn btn-icon position-relative rounded-4" to={"/cart"}
            >
              <i class="bi bi-cart4 fs-4"></i>
              <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                99+
                <span class="visually-hidden">unread messages</span>
              </span>
            </Link>
            <Link type="button" class="btn btn-icon btn-sm mx-3 rounded-4 ">
              <i class="bi bi-shop fs-4"></i>
            </Link>
            <Link
              type="button"
              class=" btn btn-icon btn-sm rounded-4"
              to={"/login"}
            >
              <i class="bi bi-bell fs-4"></i>
            </Link>
          </div>
          <div className="border-start mt-2">
            <Link type="button" class="btn btn-register btn-sm mx-3 ">
              Đăng ký
            </Link>
            <Link type="button" class=" btn btn-login btn-sm" to={"/login"}>
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
