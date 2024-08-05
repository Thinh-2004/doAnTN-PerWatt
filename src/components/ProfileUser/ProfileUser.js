import React, { useEffect, useState } from "react";
import Header from "../UI&UX/Header/Header";
import useSession from "../../Session/useSession";
import axios from "../../Localhost/Custumize-axios";
import { Link, Route, Routes } from "react-router-dom";
import Profile from "./Profile/Profile";
import ChangePass from "./ChangePassword/ChangePass";

const ProfileUser = () => {
  const [id] = useSession("id");
  const [fill, setFill] = useState([]);
  const geturlIMG = (filename) => {
    return `${axios.defaults.baseURL}files/userAvt/${filename}`;
  };
  useEffect(() => {
    const loadData = async (id) => {
      try {
        const res = await axios.get(`userProFile/${id}`);
        setFill(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    loadData(id);
  }, [id]);

  return (
    <div>
      <Header></Header>
      <div className="container">
        <div className="row mt-4">
          <div className="col-lg-3">
            <div className="bg-white rounded-4 p-2">
              <div className="d-flex justify-content-center">
                <img
                  src={geturlIMG(fill.avatar)}
                  alt=""
                  style={{width : "20%", height: "50px", borderRadius: "50%"}}
                  className="mt-2"
                />
                <label htmlFor="" className="mt-3 mx-3">
                  {fill.fullname}
                </label>
              </div>
              <span>
                <hr />
              </span>
              <div className="mx-2">
                <i class="bi bi-person-fill fs-3 text-primary me-2"></i>
                <label htmlFor="" className="fs-5">
                  Hồ sơ cá nhân của tôi
                </label>
                <ul className="mx-3" style={{ listStyleType: 'none', paddingLeft: '20px' }}>
                  <li>
                    <Link className="text-decoration-none" to={"/profileUser"}>Hồ sơ</Link>
                  </li>
                  <li>
                    <Link className="text-decoration-none" to={"/profileUser/UserChangePass"}>Đổi mật khẩu</Link>
                  </li>
                  <li>
                    <Link className="text-decoration-none">Quyền riên tư</Link>
                  </li>
                </ul>
              </div>
              <Link className="mx-2 text-decoration-none">
                <i class="bi bi-receipt fs-3 text-primary me-2"></i>
                <span className="text-dark">Đơn mua</span>
              </Link>
              <div className="">
                <Link className="mx-2 text-decoration-none">
                  <i class="bi bi-ticket-perforated fs-3 text-danger me-2"></i>
                  <span className="text-dark">Kho Voucher</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-9">
            <Routes>
              <Route path="/" element={<Profile></Profile>}></Route>
              <Route path="/UserChangePass" element={<ChangePass></ChangePass>}></Route>
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUser;
