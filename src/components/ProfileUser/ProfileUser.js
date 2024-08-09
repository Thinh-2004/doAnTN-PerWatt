import React, { useEffect, useState } from "react";
import Header from "../UI&UX/Header/Header";
import useSession from "../../Session/useSession";
import axios from "../../Localhost/Custumize-axios";
import { Link, Route, Routes } from "react-router-dom";
import Profile from "./Profile/Profile";
import ChangePass from "./ChangePassword/ChangePass";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProfileUser = () => {
  const [id] = useSession("id");
  const [fill, setFill] = useState([]);
  const [password, setPassword] = useState("");
  const [isChangePassClicked, setIsChangePassClicked] = useState(false);
  const changeLink = useNavigate();

  const geturlIMG = (idUser, filename) => {
    return `${axios.defaults.baseURL}files/user/${idUser}/${filename}`;
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

  const onClickChangePass = (e) => {
    e.preventDefault();
    if (password === "") {
      toast.error("Vui lòng nhập mật khẩu ");
    } else if (fill.password !== password) {
      toast.error("Mật khẩu không đúng");
    } else {
      toast.success("Đăng nhập thành công");
      setIsChangePassClicked(true);
      changeLink("changePass");

      const modelCLose = document.getElementById("exampleModal");
      const closeAuto = window.bootstrap.Modal.getInstance(modelCLose);
      closeAuto.hide();
    }
  };

  return (
    <div>
      <Header />
      <div className="container">
        <div className="row mt-4">
          <div className="col-lg-3">
            <div className="bg-white rounded-4 p-2">
              <div className="d-flex justify-content-center">
                <img
                  src={geturlIMG(fill.id, fill.avatar)}
                  alt=""
                  style={{ width: "20%", height: "50px", borderRadius: "50%" }}
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
                    ) : (
                      <span
                        type="button"
                        className="text-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                      >
                        Đổi mật khẩu
                      </span>
                    )}

                    <div
                      className="modal fade"
                      id="exampleModal"
                      tabIndex="-1"
                      aria-labelledby="exampleModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
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
                              <input
                                type="password"
                                className="form-control"
                                placeholder="Nhập mật khẩu của bạn"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                              />
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                              >
                                Hủy
                              </button>
                              <button type="submit" className="btn btn-primary">
                                Xác nhận
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <Link className="text-decoration-none">Quyền riêng tư</Link>
                  </li>
                </ul>
              </div>
              <Link className="mx-2 text-decoration-none">
                <i className="bi bi-receipt fs-3 text-primary me-2"></i>
                <span className="text-dark">Đơn mua</span>
              </Link>
              <div className="">
                <Link className="mx-2 text-decoration-none">
                  <i className="bi bi-ticket-perforated fs-3 text-danger me-2"></i>
                  <span className="text-dark">Kho Voucher</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-9">
            <Routes>
              <Route path="/" element={<Profile />} />
              <Route path="changePass" element={<ChangePass />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUser;
