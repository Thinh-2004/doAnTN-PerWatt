import React, { useCallback, useContext, useState } from "react";
import { Link, useMatch, useNavigate } from "react-router-dom";
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Menu,
  MenuItem,
  styled,
  Switch,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import axios from "../../Localhost/Custumize-axios";
import { useEffect } from "react";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import { ThemeModeContext } from "../ThemeMode/ThemeModeProvider";
import MotionPhotosAutoIcon from "@mui/icons-material/MotionPhotosAuto";

const RightHeader = ({ reloadCartItems }) => {
  const changeLink = useNavigate();
  const getUrlIMG = (idUser, filename) => {
    return `${axios.defaults.baseURL}files/user/${idUser}/${filename}`;
  };

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const idSotre = localStorage.getItem("idStore");

  const [count, setCount] = useState(0);
  const [countOrder, setCountOrder] = useState(0);
  const matchSeller = useMatch("/profileMarket/*"); //Kiểm tra đường dẫn có chứa tham số động
  const matchAdmin = useMatch("/admin/*"); //Kiểm tra đường dẫn có chứa tham số động

  const { mode, checkAutoMode, toggleMode, handleAutoScreenMode } =
    useContext(ThemeModeContext);

  const handleChangeMode = (e) => {
    const newMode = e.target.checked;
    localStorage.setItem("screenMode", newMode ? "dark" : "light");
    // console.log(newMode);
    toggleMode(newMode);
  };

  const handleChangeAutoMode = (e) => {
    const newAutoMode = e.target.checked;
    localStorage.setItem("autoScreenMode", newAutoMode);
    handleAutoScreenMode(newAutoMode);
    // console.log(newAutoMode);
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
                //Xóa session khỏi website
                localStorage.clear();
                sessionStorage.clear();
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

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenuUser = Boolean(anchorEl);
  const handleClickMenuUser = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleCloseMenuUser = useCallback(() => {
    setAnchorEl(null);
  }, []);

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
    if (user === null || user === undefined) {
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
      const check = await CallAPICheckUserId(user.id);
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
    if (user === null || user === undefined) {
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

  useEffect(() => {
    const count = async () => {
      try {
        if (user) {
          const res = await axios.get(`/countCartIdUser/${user.id}`);
          setCount(res.data.length);
          // console.log(res.data.length);
        } else {
          console.log("Chưa có sản phẩm");
          setCount(0);
        }
      } catch (error) {
        console.log(error);
      }
    };
    //Đếm thông báo
    const countOrders = async () => {
      try {
        const res = await axios.get(`checkOrder/${idSotre}`);
        setCountOrder(res.data.length);
        // console.log(res.data.length);
      } catch (error) {
        console.log("Error fetching new orders:", error);
      }
    };
    countOrders(idSotre);
    count();
  }, [user, idSotre]);

  useEffect(() => {
    if (reloadCartItems) {
      const count = async () => {
        try {
          if (user) {
            const res = await axios.get(`/countCartIdUser/${user.id}`);
            setCount(res.data.length);
            // console.log(res.data.length);
          } else {
            console.log("Chưa có sản phẩm");
          }
        } catch (error) {
          console.log(error);
        }
      };
      count();
    }
  }, [reloadCartItems, user]);

  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    "& .MuiSwitch-switchBase": {
      margin: 1,
      padding: 0,
      transform: "translateX(6px)",
      "&.Mui-checked": {
        color: "#fff",
        transform: "translateX(22px)",
        "& .MuiSwitch-thumb:before": {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            "#fff"
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        },
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor: "#aab4be",
          ...theme.applyStyles("dark", {
            backgroundColor: "#8796A5",
          }),
        },
      },
    },
    "& .MuiSwitch-thumb": {
      backgroundColor: "#001e3c",
      width: 32,
      height: 32,
      "&::before": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
      ...theme.applyStyles("dark", {
        backgroundColor: "#003892",
      }),
    },
    "& .MuiSwitch-track": {
      opacity: 1,
      backgroundColor: "#aab4be",
      borderRadius: 20 / 2,
      ...theme.applyStyles("dark", {
        backgroundColor: "#8796A5",
      }),
    },
  }));

  return (
    <>
      <div className="d-flex align-items-center border-end me-3 ">
        {matchSeller ? (
          <>
            <Link
              type="button"
              className="btn btn-icon position-relative rounded-3 me-3"
              to={"/"}
            >
              <Typography sx={{ color: "text.primary" }}>
                <i className="bi bi-houses fs-4"></i>
              </Typography>
            </Link>
            <Link
              type="button"
              className="btn btn-icon position-relative rounded-3 me-3"
              to={"/cart"}
            >
              <Typography sx={{ color: "text.primary" }}>
                <i className="bi bi-cart4 fs-4"></i>
              </Typography>
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
              <Typography sx={{ color: "text.primary" }}>
                <i className="bi bi-gear fs-4"></i>
              </Typography>
            </Link>
            <Link
              type="button"
              className="btn btn-icon btn-sm  position-relative rounded-3 me-3"
              to={"/notifications"}
            >
              <Typography sx={{ color: "text.primary" }}>
                <i className="bi bi-bell fs-4"></i>
              </Typography>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {countOrder}
              </span>
            </Link>
          </>
        ) : matchAdmin ? (
          <>
            {" "}
            <Link
              type="button"
              className="btn btn-icon position-relative rounded-4 me-3"
              to={"/admin/info"}
            >
              Hồ sơ của tôi
            </Link>
            <Link
              type="button"
              className="btn btn-icon position-relative rounded-4 me-3"
              to={"/admin/banner"}
            >
              Quản Lý Banner
            </Link>
            <Link
              type="button"
              className="btn btn-icon btn-sm rounded-4 me-3"
              id="btn-logOut"
              onClick={handleLogOut}
            >
              Đăng xuất
            </Link>
          </>
        ) : (
          <>
            <Link
              type="button"
              className="btn btn-icon position-relative rounded-3 me-3"
              onClick={checkUserIdOnCart}
            >
              <Typography sx={{ color: "text.primary" }}>
                <i className="bi bi-cart4 fs-4"></i>
              </Typography>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {count}
              </span>
            </Link>
            <Link
              onClick={checkUserId}
              type="button"
              className="btn btn-icon btn-sm rounded-3 me-3"
            >
              <Typography sx={{ color: "text.primary" }}>
                {" "}
                <i className="bi bi-shop fs-4"></i>
              </Typography>
            </Link>
            <Link type="button" className="btn btn-icon btn-sm rounded-3 me-3">
              <Typography sx={{ color: "text.primary" }}>
                {" "}
                <i className="bi bi-bell fs-4"></i>
              </Typography>
            </Link>
          </>
        )}
      </div>
      {user ? (
        matchAdmin ? (
          <div className="p-1 rounded-3" style={{ border: "1px solid" }}>
            <img
              src={getUrlIMG(user.id, user.avatar)}
              alt=""
              className="rounded-circle img-fluid"
              style={{ width: "30px", height: "30px" }}
            />
            <span className="ms-2">{user.fullname}</span>
          </div>
        ) : (
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
              size="small"
              sx={{
                color: "text.primary",
                textTransform: "capitalize",
              }}
            >
              <img
                src={getUrlIMG(user.id, user.avatar)}
                alt=""
                className="rounded-circle img-fluid"
                style={{ width: "30px", height: "30px" }}
              />
              &nbsp;
              <Typography variant="span" style={{ fontSize: "15px" }}>
                {user.fullname}
                <ArrowDropDownIcon fontSize="small" />
              </Typography>
            </Button>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={openMenuUser}
              onClose={handleCloseMenuUser}
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
                    src={getUrlIMG(user.id, user.avatar)}
                    alt=""
                    className="rounded-circle img-fluid"
                    style={{ width: "20px", height: "20px" }}
                  />
                  &nbsp;
                  <Typography variant="span" sx={{ color: "text.primary" }}>
                    Hồ sơ của tôi
                  </Typography>
                </Link>
              </MenuItem>

              <MenuItem onClick={handleCloseMenuUser}>
                <Link className="text-dark " to={"/order"}>
                  <ListAltIcon sx={{ color: "text.primary" }} />
                  &nbsp;
                  <Typography variant="span" sx={{ color: "text.primary" }}>
                    Đơn hàng
                  </Typography>
                </Link>
              </MenuItem>
              <Divider />
              <MenuItem>
                <FormControlLabel
                  control={
                    <MaterialUISwitch
                      // sx={{ m: 1 }}
                      defaultChecked={false}
                      onChange={handleChangeMode}
                      checked={mode === "dark"}
                    />
                  }
                  label={mode === "dark" ? "Nền tối" : "Nền sáng"}
                />
              </MenuItem>

              <Tooltip
                title="Website sẽ tự động điều chỉnh màn hình theo cài đặt hệ thống trên thiết bị của bạn."
                className="d-flex align-items-center"
                TransitionComponent={Zoom}
              >
                <MenuItem>
                  <Checkbox
                    // {...label}
                    icon={<MotionPhotosAutoIcon />}
                    checkedIcon={<MotionPhotosAutoIcon />}
                    onChange={handleChangeAutoMode}
                    checked={checkAutoMode}
                  />
                  <Typography>Tự động</Typography>
                </MenuItem>
              </Tooltip>

              <Divider />
              <MenuItem onClick={handleCloseMenuUser}>
                <Link
                  className="dropdown-item text-danger"
                  onClick={handleLogOut}
                >
                  <LogoutIcon /> &nbsp;Đăng xuất
                </Link>
              </MenuItem>
            </Menu>
          </div>
        )
      ) : (
        <div className="d-flex mt-2">
          <Link
            type="button"
            className={`btn btn-register btn-sm me-2 ${
              mode === "light" ? "" : "text-white"
            }`}
            to={"/login"}
            style={{ width: "90px", height: "30px" }}
          >
            Đăng ký
          </Link>
          <Link
            type="button"
            className={`btn btn-login btn-sm me-2 ${
              mode === "light" ? "" : "text-white"
            }`}
            to={"/login"}
            style={{ width: "95px", height: "30px" }}
          >
            Đăng nhập
          </Link>
        </div>
      )}
      {/* <FormControlLabel
        control={
          <MaterialUISwitch
            sx={{ m: 1 }}
            defaultChecked={false}
            onChange={handleChangeMode}
            checked={mode === "dark"}
          />
        }
        label={mode === "dark" ? "Tối" : "Sáng"}
      /> */}
    </>
  );
};

export default RightHeader;
