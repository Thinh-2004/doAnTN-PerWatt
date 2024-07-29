import React from 'react';
import { Link } from 'react-router-dom';

const HeaderMarket = () => {
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
         <h3>Kênh người bán</h3>
        </div>
      </div>
      <div className="align-content-center m-3">
        <div className="d-flex">
          <div className="mx-3">
            <Link
              type="button"
              class="btn btn-icon position-relative rounded-4"
              to={"/"}
            >
              <i class="bi bi-houses fs-4"></i>
            </Link>
            <Link type="button" class="btn btn-icon btn-sm mx-3 rounded-4 " to={""}>
            <i class="bi bi-gear fs-4"></i>
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

export default HeaderMarket;