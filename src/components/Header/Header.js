import React, { useEffect, useState } from "react";
import "./HeaderStyle.css";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import useSession from "../../Session/useSession";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert"; 
import "react-confirm-alert/src/react-confirm-alert.css"; 
import axios from "../../Localhost/Custumize-axios";

const Header = ({ contextSearch, resetSearch, reloadCartItems }) => {
  const [search, setSearch] = useState("");
  const [fullName, removeFullName] = useSession("fullname");
  const [avatar, removeAvatar] = useSession("avatar");
  const [id, removeId] = useSession("id");
  const [count, setCount] = useState(0);
  const changeLink = useNavigate();
  const geturlIMG = (idUser, filename) => {
    return `${axios.defaults.baseURL}files/user/${idUser}/${filename}`;
  };

  useEffect(() => {
    const count = async () => {
      try {
        const res = await axios.get(`/countCartIdUser/${id}`);
        setCount(res.data.length);
        console.log(res.data.length);
      } catch (error) {
        console.log(error);
      }
    };
    count();
  }, [id]);
  
  useEffect(() => {
    if (resetSearch) {
      setSearch(""); // Xóa nội dung thanh tìm kiếm
    }
  }, [resetSearch]);

  useEffect(() =>{
    if(reloadCartItems){
      const count = async () => {
        try {
          const res = await axios.get(`/countCartIdUser/${id}`);
          setCount(res.data.length);
          console.log(res.data.length);
        } catch (error) {
          console.log(error);
        }
      };
      count();
    }
  }, [reloadCartItems, id])

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

  const handleVoiceSearch = (e) => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();

    recognition.lang = "vi-VN"; // Đặt ngôn ngữ cho nhận diện giọng nói
    recognition.interimResults = true; // Cho phép nhận diện kết quả tạm thời

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setSearch(transcript);
      contextSearch(transcript); // đặt dữ liệu tìm kiếm lên thằng cha
      recognition.stop(); // Dừng ghi âm sau khi nhận diện xong
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
    recognition.start();
  };

  const handleTextSearch = (e) => {
    setSearch(e.target.value);
    contextSearch(e.target.value);
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
    // Ngăn chặn hành động mặc định của liên kết
    e.preventDefault();

    // Kiểm tra nếu id là null hoặc undefined
    if (id === "" || id === undefined) {
      confirmAlert({
        title: "Bạn đã đăng nhập chưa?",
        message: "Hãy đăng nhập để có trải nghiệm tuyệt vời hơn",
        buttons: [
          {
            label: "Có",
            onClick: () => {
              // Hiển thị thông báo đang tải
              const id = toast.loading("Vui lòng chờ...");
              setTimeout(() => {
                toast.update(id, {
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
      // Nếu id tồn tại, kiểm tra với API
      const check = await CallAPICheckUserId(id);
      if (check) {
        // Nếu id tồn tại trong cửa hàng
        changeLink("/profileMarket");
      } else {
        // Chưa tồn tại
        changeLink("/market");
      }
    }
  };
  const checkUserIdOnCart = async (e) => {
    // Ngăn chặn hành động mặc định của liên kết
    e.preventDefault();

    // Kiểm tra nếu id là null hoặc undefined
    if (id === "" || id === undefined) {
      confirmAlert({
        title: "Bạn đã đăng nhập chưa?",
        message: "Bạn cần đăng nhập để vào giỏ hàng của mình",
        buttons: [
          {
            label: "Có",
            onClick: () => {
              // Hiển thị thông báo đang tải
              const id = toast.loading("Vui lòng chờ...");
              setTimeout(() => {
                toast.update(id, {
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
      changeLink("/cart");
    }
  };

  return (
    <div className=" container-fluid sticky-top">
      <div
        className="row align-items-center justify-content-between shadow "
        id="nav"
      >
        <div className="col-auto">
          <Link to={"/"}>
            <img src="/images/logoWeb.png" alt="" className="" id="img-logo" />
          </Link>
        </div>
        <div
          className="col-auto flex-grow-1"
          hidden={window.location.pathname !== "/"}
        >
          <form className="d-flex" role="search">
            <input
              className="form-control rounded-start-4"
              type="search"
              placeholder="Bạn cần tìm gì"
              aria-label="Search"
              style={{width : "auto"}}
              value={search}
              onChange={handleTextSearch}
            />
            <button
              type="button"
              className="btn btn-outline-primary rounded-end-4 mx-2"
              onClick={handleVoiceSearch}
            >
              <i className="bi bi-mic"></i>
            </button>
          </form>
        </div>
        <div className="col-auto">
          <div className="d-flex align-content-center m-3">
            <Link
              type="button"
              className="btn btn-icon position-relative rounded-4"
              onClick={checkUserIdOnCart}
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
              <i className="bi bi-shop fs-4"></i>
            </Link>
            <Link
              type="button"
              className="btn btn-icon btn-sm rounded-4 me-3"
              to={""}
            >
              <i className="bi bi-bell fs-4"></i>
            </Link>
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
                      <Link className="dropdown-item text-danger" onClick={handleLogOut}>
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
    </div>
  );
};
export default Header;
